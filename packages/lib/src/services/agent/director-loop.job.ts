import type { PolicyMode, StructuredDirectorOutput } from '@wadv/types';
import { prisma } from '../../db';
import { directorLoopInputSchema } from '../../schemas';
import { ExecutorService } from './executor.service';
import { InspectorService } from './inspector.service';
import { PrioritizerService } from './prioritizer.service';
import { QualityService } from './quality.service';
import { SceneTestsService } from './scene-tests.service';
import type { DirectorLoopResult, SceneLoopResult } from './types';

export class DirectorLoopJob {
  constructor(
    private readonly inspectorService = new InspectorService(),
    private readonly sceneTestsService = new SceneTestsService(),
    private readonly qualityService = new QualityService(),
    private readonly prioritizerService = new PrioritizerService(),
    private readonly executorService = new ExecutorService(),
  ) {}

  async run(input: { projectId: string; triggerType?: 'MANUAL' | 'EVENT' | 'SCHEDULED'; policyMode?: PolicyMode; maxSceneAttempts?: number; qualityThreshold?: number }): Promise<DirectorLoopResult> {
    const parsed = directorLoopInputSchema.parse(input);
    const run = await prisma.agentRun.create({
      data: {
        projectId: parsed.projectId,
        agentName: 'WADV Director',
        triggerType: parsed.triggerType,
        status: 'RUNNING',
        summary: 'Director loop started.',
      },
    });

    try {
      const project = await prisma.project.findUniqueOrThrow({
        where: { id: parsed.projectId },
        include: {
          user: true,
          episodes: { include: { scenes: { orderBy: { orderIndex: 'asc' } } }, orderBy: { orderIndex: 'asc' } },
        },
      });

      const observations = await this.inspectorService.inspectProject(parsed.projectId);
      if (observations.length > 0) {
        await prisma.agentObservation.createMany({
          data: observations.map((observation) => ({
            projectId: observation.projectId,
            sceneId: observation.sceneId,
            category: observation.category,
            severity: observation.severity.toUpperCase(),
            message: observation.message,
            dataJson: observation.data ?? undefined,
          })),
        });
      }

      const sceneLoops: SceneLoopResult[] = [];
      for (const scene of project.episodes.flatMap((episode) => episode.scenes)) {
        sceneLoops.push(await this.runSceneLoop(scene.id, parsed.policyMode, parsed.maxSceneAttempts, parsed.qualityThreshold));
      }

      const refreshedObservations = await this.inspectorService.inspectProject(parsed.projectId);
      const recommendedTasks = this.prioritizerService.prioritize(parsed.projectId, refreshedObservations);
      const executedTasks = await this.executorService.executeTasks(recommendedTasks, parsed.policyMode);

      const projectSummary = this.buildProjectSummary(project.title, sceneLoops, executedTasks);
      const output: StructuredDirectorOutput = {
        projectSummary,
        observations: refreshedObservations,
        recommendedTasks: recommendedTasks.map((task) => ({
          type: task.type,
          priority: task.priority,
          sceneId: task.sceneId,
          reason: task.reason,
          input: task.input,
        })),
        nextBestActions: recommendedTasks.slice(0, 5).map((task) => `${task.type} (${task.priority.toLowerCase()})`),
      };

      await prisma.notification.create({
        data: {
          userId: project.userId,
          projectId: parsed.projectId,
          type: 'director_cycle_completed',
          title: `Director loop completed for ${project.title}`,
          body: `${executedTasks.filter((task) => task.status === 'COMPLETED').length} tasks executed across ${sceneLoops.length} scene loops.`,
        },
      });

      await prisma.agentRun.update({
        where: { id: run.id },
        data: {
          status: executedTasks.some((task) => task.status === 'FAILED') ? 'PARTIAL' : 'COMPLETED',
          summary: projectSummary,
          finishedAt: new Date(),
        },
      });

      return {
        runId: run.id,
        policyMode: parsed.policyMode,
        executedTasks,
        sceneLoops,
        ...output,
      };
    } catch (error) {
      await prisma.agentRun.update({
        where: { id: run.id },
        data: {
          status: 'FAILED',
          summary: error instanceof Error ? error.message : 'Unknown error',
          finishedAt: new Date(),
        },
      });
      throw error;
    }
  }

  private async runSceneLoop(sceneId: string, policyMode: PolicyMode, maxAttempts: number, qualityThreshold: number): Promise<SceneLoopResult> {
    const attempts: SceneLoopResult['attempts'] = [];

    for (let attemptNumber = 1; attemptNumber <= maxAttempts; attemptNumber += 1) {
      const quality = await this.qualityService.scoreSceneQuality(sceneId);
      await prisma.scene.update({ where: { id: sceneId }, data: { qualityScore: quality.score } });
      const tests = await this.sceneTestsService.runSceneTests(sceneId, qualityThreshold);

      await prisma.sceneAttempt.upsert({
        where: { sceneId_attemptNumber: { sceneId, attemptNumber } },
        update: { qualityScore: tests.qualityScore, testResultsJson: tests },
        create: { sceneId, attemptNumber, qualityScore: tests.qualityScore, testResultsJson: tests },
      });
      await prisma.scene.update({
        where: { id: sceneId },
        data: {
          latestTestResultsJson: tests,
          qualityScore: tests.qualityScore,
          status: tests.passed ? 'READY' : attemptNumber >= maxAttempts ? 'NEEDS_FIX' : 'GENERATING',
        },
      });

      attempts.push({ attemptNumber, qualityScore: tests.qualityScore, tests });
      if (tests.passed) {
        break;
      }

      const failureObservations = tests.results
        .filter((result) => !result.pass)
        .map((result) => ({
          projectId: '',
          sceneId,
          category: result.name,
          severity: result.name === 'quality_score' ? 'medium' : 'high',
          message: result.reason,
          data: { sceneId },
        }));

      const scene = await prisma.scene.findUniqueOrThrow({ where: { id: sceneId }, include: { episode: true } });
      const tasks = this.prioritizerService
        .prioritize(scene.episode.projectId, failureObservations.map((observation) => ({ ...observation, projectId: scene.episode.projectId }) as any))
        .filter((task) => task.sceneId === sceneId || !task.sceneId);
      await this.executorService.executeTasks(tasks, policyMode);
    }

    const finalScene = await prisma.scene.findUniqueOrThrow({ where: { id: sceneId } });
    return {
      sceneId,
      attempts,
      finalStatus: finalScene.status,
    };
  }

  private buildProjectSummary(projectTitle: string, sceneLoops: SceneLoopResult[], executedTasks: Array<{ status: string }>) {
    const readyScenes = sceneLoops.filter((sceneLoop) => sceneLoop.finalStatus === 'READY' || sceneLoop.finalStatus === 'APPROVED').length;
    const totalAttempts = sceneLoops.reduce((total, sceneLoop) => total + sceneLoop.attempts.length, 0);
    const completedTasks = executedTasks.filter((task) => task.status === 'COMPLETED').length;

    return `${projectTitle}: ${readyScenes}/${sceneLoops.length} scenes are ready after ${totalAttempts} attempts and ${completedTasks} completed tasks.`;
  }
}
