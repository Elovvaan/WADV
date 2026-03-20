import { z } from 'zod';
import { prisma } from '../../db';
import {
  analyzeProjectStoryInputSchema,
  assignSceneLocationInputSchema,
  assignVoiceToCharacterInputSchema,
  createCharacterBibleInputSchema,
  detectContinuityIssuesInputSchema,
  generateSceneBreakdownInputSchema,
  generateScenePreviewInputSchema,
  generateStoryboardInputSchema,
  queuePreviewExportInputSchema,
  regenerateSceneInputSchema,
  regenerateShotInputSchema,
  scoreSceneQualityInputSchema,
} from '../../schemas';
import { providerRegistry } from '../../providers';
import { GenerationService } from '../generation-service';
import { QualityService } from './quality.service';
import type { AgentToolContext, AgentToolDefinition } from './types';

class AgentToolRegistry {
  private readonly tools = new Map<string, AgentToolDefinition<any, any>>();

  constructor() {
    this.register(this.analyzeProjectStoryTool());
    this.register(this.generateSceneBreakdownTool());
    this.register(this.createCharacterBibleTool());
    this.register(this.assignSceneLocationTool());
    this.register(this.assignVoiceToCharacterTool());
    this.register(this.generateStoryboardTool());
    this.register(this.generateScenePreviewTool());
    this.register(this.regenerateSceneTool());
    this.register(this.regenerateShotTool());
    this.register(this.detectContinuityIssuesTool());
    this.register(this.scoreSceneQualityTool());
    this.register(this.queuePreviewExportTool());
  }

  register<TInput, TResult>(tool: AgentToolDefinition<TInput, TResult>) {
    this.tools.set(tool.name, tool);
  }

  list() {
    return [...this.tools.values()].map(({ name, description }) => ({ name, description }));
  }

  async execute(name: string, input: Record<string, unknown>, context: AgentToolContext) {
    const tool = this.tools.get(name);
    if (!tool) {
      throw new Error(`Unknown tool: ${name}`);
    }

    const action = await prisma.agentAction.create({
      data: {
        projectId: context.projectId,
        sceneId: context.sceneId,
        toolName: name,
        status: 'RUNNING',
        inputJson: input,
      },
    });

    try {
      const result = await tool.run(input, context);
      await prisma.agentAction.update({
        where: { id: action.id },
        data: { status: 'COMPLETED', outputJson: result },
      });
      return result;
    } catch (error) {
      await prisma.agentAction.update({
        where: { id: action.id },
        data: {
          status: 'FAILED',
          outputJson: { message: error instanceof Error ? error.message : 'Unknown error' },
        },
      });
      throw error;
    }
  }

  private analyzeProjectStoryTool(): AgentToolDefinition<Record<string, unknown>, Record<string, unknown>> {
    return {
      name: 'analyze_project_story',
      description: 'Create a structured project summary and refresh the director report.',
      run: async (input) => {
        const parsed = analyzeProjectStoryInputSchema.parse(input);
        const project = await prisma.project.findUniqueOrThrow({
          where: { id: parsed.projectId },
          include: {
            episodes: { include: { scenes: { orderBy: { orderIndex: 'asc' } } } },
            characters: true,
          },
        });

        const plan = await providerRegistry.director.createPlan({
          title: project.title,
          description: project.description,
          genre: project.genre,
          scenes: project.episodes.flatMap((episode) => episode.scenes.map((scene) => ({ title: scene.title, scriptText: scene.scriptText, orderIndex: scene.orderIndex }))),
          characters: project.characters.map((character) => ({ name: character.name, role: character.role })),
        });

        await prisma.directorReport.upsert({
          where: { projectId: parsed.projectId },
          update: { reportJson: plan },
          create: { projectId: parsed.projectId, reportJson: plan },
        });

        return {
          projectSummary: plan.projectSummary,
          observations: plan.continuityWarnings,
          recommendedTasks: plan.nextBestActions,
          nextBestActions: plan.nextBestActions,
        };
      },
    };
  }

  private generateSceneBreakdownTool(): AgentToolDefinition<Record<string, unknown>, Record<string, unknown>> {
    return {
      name: 'generate_scene_breakdown',
      description: 'Generate a structured shot plan for a scene.',
      run: async (input) => {
        const parsed = generateSceneBreakdownInputSchema.parse(input);
        const scene = await prisma.scene.findUniqueOrThrow({ where: { id: parsed.sceneId } });
        const plan = {
          beats: [
            { label: 'Opening beat', goal: 'Establish the mood and stakes.' },
            { label: 'Conflict beat', goal: 'Show the turning point that escalates the scene.' },
            { label: 'Resolve beat', goal: 'Land the emotion and prepare the next scene.' },
          ],
          shots: [
            { type: 'Establishing', cameraDirection: 'Slow dolly', promptText: `${scene.title} establishing shot`, durationSeconds: 4 },
            { type: 'Performance close-up', cameraDirection: 'Push in', promptText: `${scene.title} emotional close-up`, durationSeconds: 5 },
          ],
        };

        await prisma.scene.update({
          where: { id: parsed.sceneId },
          data: { shotPlanJson: plan },
        });

        return plan;
      },
    };
  }

  private createCharacterBibleTool(): AgentToolDefinition<Record<string, unknown>, Record<string, unknown>> {
    return {
      name: 'create_character_bible',
      description: 'Create or refresh a character bible.',
      run: async (input) => {
        const parsed = createCharacterBibleInputSchema.parse(input);
        const characters = await prisma.character.findMany({
          where: { projectId: parsed.projectId, ...(parsed.characterId ? { id: parsed.characterId } : {}) },
        });

        const updated = [];
        for (const character of characters) {
          const bible = {
            summary: `${character.name} is tuned for consistent anime production in WADV.`,
            appearance: `${character.stylePreset} with locked silhouette continuity.`,
            performance: `${character.role} should preserve emotional clarity across scenes.`,
          };
          updated.push(await prisma.character.update({ where: { id: character.id }, data: { bibleJson: bible } }));
        }

        return { updatedCount: updated.length };
      },
    };
  }

  private assignSceneLocationTool(): AgentToolDefinition<Record<string, unknown>, Record<string, unknown>> {
    return {
      name: 'assign_scene_location',
      description: 'Assign or create a scene location.',
      run: async (input) => {
        const parsed = assignSceneLocationInputSchema.parse(input);
        const scene = await prisma.scene.findUniqueOrThrow({ where: { id: parsed.sceneId }, include: { episode: true } });
        const locationName = parsed.preferredLocationName ?? `${scene.title} Set`;
        const location = await prisma.location.upsert({
          where: { projectId_name: { projectId: parsed.projectId, name: locationName } },
          update: { description: `Assigned automatically for ${scene.title}.` },
          create: { projectId: parsed.projectId, name: locationName, description: `Assigned automatically for ${scene.title}.`, metadataJson: { source: 'agent' } },
        });
        await prisma.scene.update({ where: { id: parsed.sceneId }, data: { locationId: location.id } });
        return { locationId: location.id, locationName: location.name };
      },
    };
  }

  private assignVoiceToCharacterTool(): AgentToolDefinition<Record<string, unknown>, Record<string, unknown>> {
    return {
      name: 'assign_voice_to_character',
      description: 'Assign a default voice profile to a character.',
      run: async (input) => {
        const parsed = assignVoiceToCharacterInputSchema.parse(input);
        const character = await prisma.character.findUniqueOrThrow({ where: { id: parsed.characterId }, include: { project: { include: { user: true } } } });
        const voiceProfile = parsed.voiceProfileId
          ? await prisma.voiceProfile.findUniqueOrThrow({ where: { id: parsed.voiceProfileId } })
          : await prisma.voiceProfile.findFirst({ where: { userId: character.project.userId }, orderBy: { createdAt: 'asc' } });

        if (!voiceProfile) {
          throw new Error(`No voice profile available for ${character.name}.`);
        }

        await prisma.character.update({ where: { id: character.id }, data: { defaultVoiceId: voiceProfile.id } });
        await prisma.characterVoiceAssignment.upsert({
          where: { characterId_voiceProfileId: { characterId: character.id, voiceProfileId: voiceProfile.id } },
          update: {},
          create: { characterId: character.id, voiceProfileId: voiceProfile.id },
        });

        return { characterId: character.id, voiceProfileId: voiceProfile.id, voiceName: voiceProfile.name };
      },
    };
  }

  private generateStoryboardTool(): AgentToolDefinition<Record<string, unknown>, Record<string, unknown>> {
    return {
      name: 'generate_storyboard',
      description: 'Generate a storyboard and store structured metadata.',
      run: async (input) => {
        const parsed = generateStoryboardInputSchema.parse(input);
        const scene = await prisma.scene.findUniqueOrThrow({ where: { id: parsed.sceneId } });
        const boards = await providerRegistry.image.generateSceneBoards([{
          sceneId: scene.id,
          title: scene.title,
          orderIndex: scene.orderIndex,
          emotionalBeat: scene.directorNotes ?? 'Momentum',
          cameraNotes: [scene.directorNotes ?? 'Keep the scene cinematic.'],
          continuityNotes: [],
          shotSuggestions: [{ type: 'Wide', cameraDirection: 'Dolly', promptText: scene.scriptText.slice(0, 80), durationSeconds: 4 }],
        }]);
        const storyboard = {
          previewUrl: boards[0]?.previewUrl,
          frames: boards[0]?.metadata.frames ?? 1,
          generatedAt: new Date().toISOString(),
        };
        await prisma.scene.update({
          where: { id: parsed.sceneId },
          data: { storyboardJson: storyboard },
        });
        return storyboard;
      },
    };
  }

  private generateScenePreviewTool(): AgentToolDefinition<Record<string, unknown>, Record<string, unknown>> {
    return {
      name: 'generate_scene_preview',
      description: 'Generate a preview render for a scene.',
      run: async (input) => {
        const parsed = generateScenePreviewInputSchema.parse(input);
        const scene = await prisma.scene.findUniqueOrThrow({ where: { id: parsed.sceneId } });
        const preview = await providerRegistry.video.generateSceneVideo({ sceneTitle: scene.title, promptText: scene.scriptText });
        await prisma.scene.update({ where: { id: parsed.sceneId }, data: { generatedPreviewUrl: preview.previewUrl, status: 'REVIEWING' } });
        return preview;
      },
    };
  }

  private regenerateSceneTool(): AgentToolDefinition<Record<string, unknown>, Record<string, unknown>> {
    return {
      name: 'regenerate_scene',
      description: 'Refresh both storyboard and preview render for a scene.',
      run: async (input, context) => {
        const parsed = regenerateSceneInputSchema.parse(input);
        const breakdown = await this.execute('generate_scene_breakdown', { projectId: parsed.projectId, sceneId: parsed.sceneId }, context);
        const storyboard = await this.execute('generate_storyboard', { projectId: parsed.projectId, sceneId: parsed.sceneId }, context);
        const preview = await this.execute('generate_scene_preview', { projectId: parsed.projectId, sceneId: parsed.sceneId }, context);
        return { reason: parsed.reason ?? 'quality refresh', breakdown, storyboard, preview };
      },
    };
  }

  private regenerateShotTool(): AgentToolDefinition<Record<string, unknown>, Record<string, unknown>> {
    const generationService = new GenerationService();
    return {
      name: 'regenerate_shot',
      description: 'Regenerate a single shot preview.',
      run: async (input) => {
        const parsed = regenerateShotInputSchema.parse(input);
        const result = await generationService.regenerateShot(parsed.shotId);
        return {
          shotId: parsed.shotId,
          previewUrl: result.preview.previewUrl,
          thumbnailUrl: result.preview.thumbnailUrl,
        };
      },
    };
  }

  private detectContinuityIssuesTool(): AgentToolDefinition<Record<string, unknown>, Record<string, unknown>> {
    return {
      name: 'detect_continuity_issues',
      description: 'Inspect potential continuity issues across the project or scene.',
      run: async (input) => {
        const parsed = detectContinuityIssuesInputSchema.parse(input);
        const scenes = await prisma.scene.findMany({
          where: { episode: { is: { projectId: parsed.projectId } }, ...(parsed.sceneId ? { id: parsed.sceneId } : {}) },
          include: { location: true },
          orderBy: { orderIndex: 'asc' },
        });

        const issues = scenes.flatMap((scene, index) => {
          const previous = scenes[index - 1];
          const result: Array<{ sceneId: string; issue: string }> = [];
          if (previous && previous.locationId === scene.locationId && previous.title !== scene.title) {
            result.push({ sceneId: scene.id, issue: `Location ${scene.location?.name ?? 'unknown'} repeats consecutively; verify continuity.` });
          }
          if (!scene.directorNotes) {
            result.push({ sceneId: scene.id, issue: 'Scene lacks director notes for tone continuity.' });
          }
          return result;
        });

        return { issues };
      },
    };
  }

  private scoreSceneQualityTool(): AgentToolDefinition<Record<string, unknown>, Record<string, unknown>> {
    const qualityService = new QualityService();
    return {
      name: 'score_scene_quality',
      description: 'Calculate and store a scene quality score.',
      run: async (input) => {
        const parsed = scoreSceneQualityInputSchema.parse(input);
        const quality = await qualityService.scoreSceneQuality(parsed.sceneId);
        await prisma.scene.update({ where: { id: parsed.sceneId }, data: { qualityScore: quality.score } });
        return quality;
      },
    };
  }

  private queuePreviewExportTool(): AgentToolDefinition<Record<string, unknown>, Record<string, unknown>> {
    const generationService = new GenerationService();
    return {
      name: 'queue_preview_export',
      description: 'Queue a preview export for the project.',
      run: async (input) => {
        const parsed = queuePreviewExportInputSchema.parse(input);
        const created = await generationService.requestExport(parsed.projectId, parsed.format, parsed.resolution);
        return { exportId: created.id, status: created.status };
      },
    };
  }
}

export const agentToolRegistry = new AgentToolRegistry();
export type AgentToolName = keyof typeof agentToolRegistry;

export function validateWithSchema<T>(schema: z.ZodSchema<T>, input: unknown) {
  return schema.parse(input);
}
