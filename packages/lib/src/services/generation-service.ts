import { prisma } from '../db';
import { providerRegistry } from '../providers';
import { enqueueJob } from './queue-service';

export class GenerationService {
  async generateScenes(projectId: string, sceneIds?: string[]) {
    const scenes = await prisma.scene.findMany({
      where: {
        episode: { is: { projectId } },
        ...(sceneIds?.length ? { id: { in: sceneIds } } : {}),
      },
      orderBy: { orderIndex: 'asc' },
    });

    const report = await prisma.directorReport.findFirst({ where: { projectId }, orderBy: { updatedAt: 'desc' } });
    const parsedReport = report?.reportJson as any;
    const storyboards = await providerRegistry.image.generateSceneBoards(parsedReport?.scenePlans ?? scenes.map((scene) => ({
      title: scene.title,
      orderIndex: scene.orderIndex,
      emotionalBeat: scene.directorNotes ?? 'Momentum',
      cameraNotes: [scene.directorNotes ?? 'Play the scene with intent.'],
      continuityNotes: [],
      shotSuggestions: [],
    })));

    const createdJobs = [];
    for (const scene of scenes) {
      const storyboard = storyboards.find((item) => item.sceneTitle === scene.title);
      await prisma.scene.update({
        where: { id: scene.id },
        data: {
          status: 'GENERATING',
          generatedPreviewUrl: storyboard?.previewUrl,
          storyboardJson: storyboard ? { previewUrl: storyboard.previewUrl, metadata: storyboard.metadata } : undefined,
        },
      });

      const queueJob = await enqueueJob('generate-scene', { projectId, sceneId: scene.id });
      const dbJob = await prisma.generationJob.create({
        data: {
          projectId,
          sceneId: scene.id,
          jobType: 'GENERATE_SCENE',
          provider: 'mock-image-video-stack',
          status: 'QUEUED',
          inputJson: { storyboard },
        },
      });
      createdJobs.push({ queueJob, dbJob });
    }

    return { scenes: storyboards, createdJobs };
  }

  async regenerateShot(shotId: string) {
    const shot = await prisma.shot.findUniqueOrThrow({
      where: { id: shotId },
      include: { scene: { include: { episode: true } } },
    });
    const preview = await providerRegistry.video.generateSceneVideo({
      sceneTitle: shot.scene.title,
      promptText: shot.promptText,
    });
    await prisma.shot.update({ where: { id: shotId }, data: { previewUrl: preview.thumbnailUrl, status: 'READY' } });
    const dbJob = await prisma.generationJob.create({
      data: {
        projectId: shot.scene.episode.projectId,
        sceneId: shot.sceneId,
        shotId,
        jobType: 'REGENERATE_SHOT',
        provider: 'mock-video-lab',
        status: 'COMPLETED',
        inputJson: { promptText: shot.promptText },
        outputJson: preview,
      },
    });
    return { shot, preview, dbJob };
  }

  async requestExport(projectId: string, format: string, resolution: string) {
    const created = await prisma.export.create({
      data: {
        projectId,
        format,
        resolution,
        status: 'QUEUED',
        metadataJson: { requestedAt: new Date().toISOString() },
      },
    });

    await prisma.generationJob.create({
      data: {
        projectId,
        jobType: 'EXPORT_PROJECT',
        provider: 'mock-render-queue',
        status: 'QUEUED',
        inputJson: { exportId: created.id, format, resolution },
      },
    });

    await enqueueJob('export-project', { exportId: created.id, projectId });
    return created;
  }

  async queueDirectorLoop(projectId: string, triggerType: 'MANUAL' | 'EVENT' | 'SCHEDULED' = 'MANUAL', policyMode: 'suggest_only' | 'safe_auto_fix' | 'studio_autopilot' = 'safe_auto_fix') {
    const queueJob = await enqueueJob('director-loop', { projectId, triggerType, policyMode });
    const dbJob = await prisma.generationJob.create({
      data: {
        projectId,
        jobType: 'DIRECTOR_LOOP',
        provider: 'wadv-director-loop',
        status: 'QUEUED',
        inputJson: { projectId, triggerType, policyMode },
      },
    });

    return { queueJob, dbJob };
  }
}
