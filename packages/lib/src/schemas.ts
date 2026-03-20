import { z } from 'zod';

export const projectSchema = z.object({
  title: z.string().min(2),
  description: z.string().min(10),
  formatType: z.enum(['SHORT_CLIP', 'SCENE', 'EPISODE']),
  genre: z.string().min(2),
  targetDuration: z.coerce.number().int().min(15).max(3600),
});

export const ingestScriptSchema = z.object({
  input: z.string().min(40),
  inputType: z.enum(['story', 'scene', 'script', 'chapter', 'idea']).default('story'),
});

export const directorPlanSchema = z.object({
  improveProject: z.boolean().optional().default(false),
});

export const generateSceneSchema = z.object({
  mode: z.enum(['storyboard', 'scene_images', 'video_scene', 'subtitles']).default('storyboard'),
  sceneIds: z.array(z.string()).optional(),
});

export const sceneUpdateSchema = z.object({
  title: z.string().min(2).optional(),
  scriptText: z.string().min(10).optional(),
  directorNotes: z.string().min(4).optional(),
  status: z.enum(['DRAFT', 'PLANNED', 'GENERATING', 'REVIEWING', 'NEEDS_FIX', 'READY', 'APPROVED']).optional(),
});

export const characterSchema = z.object({
  projectId: z.string().cuid(),
  name: z.string().min(2),
  role: z.string().min(2),
  realismMode: z.enum(['STYLIZED', 'HYBRID', 'HUMAN_LIKE', 'CINEMATIC']),
  stylePreset: z.string().min(2),
});

export const assignVoiceSchema = z.object({
  voiceProfileId: z.string().cuid(),
});

export const voiceProfileSchema = z.object({
  name: z.string().min(2),
  sourceType: z.enum(['recording', 'upload', 'clone']),
  audioSampleUrl: z.string().url().or(z.string().startsWith('/uploads/')),
});

export const liveActionSchema = z.object({
  projectId: z.string().cuid(),
  sceneId: z.string().cuid().optional(),
  fileUrl: z.string().url().or(z.string().startsWith('/uploads/')),
});

export const exportSchema = z.object({
  format: z.enum(['draft_preview', 'final_video']),
  resolution: z.enum(['1080p', '1440p', '4k']).default('1080p'),
});

export const policyModeSchema = z.enum(['suggest_only', 'safe_auto_fix', 'studio_autopilot']);
export const triggerTypeSchema = z.enum(['MANUAL', 'EVENT', 'SCHEDULED']);
export const taskPrioritySchema = z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']);

export const toolContextSchema = z.object({
  projectId: z.string().cuid(),
  sceneId: z.string().cuid().optional(),
  actor: z.string().default('WADV Director'),
});

export const analyzeProjectStoryInputSchema = z.object({
  projectId: z.string().cuid(),
});

export const generateSceneBreakdownInputSchema = z.object({
  projectId: z.string().cuid(),
  sceneId: z.string().cuid(),
});

export const createCharacterBibleInputSchema = z.object({
  projectId: z.string().cuid(),
  characterId: z.string().cuid().optional(),
});

export const assignSceneLocationInputSchema = z.object({
  projectId: z.string().cuid(),
  sceneId: z.string().cuid(),
  preferredLocationName: z.string().min(2).optional(),
});

export const assignVoiceToCharacterInputSchema = z.object({
  projectId: z.string().cuid(),
  characterId: z.string().cuid(),
  voiceProfileId: z.string().cuid().optional(),
});

export const generateStoryboardInputSchema = z.object({
  projectId: z.string().cuid(),
  sceneId: z.string().cuid(),
});

export const generateScenePreviewInputSchema = z.object({
  projectId: z.string().cuid(),
  sceneId: z.string().cuid(),
});

export const regenerateSceneInputSchema = z.object({
  projectId: z.string().cuid(),
  sceneId: z.string().cuid(),
  reason: z.string().min(3).optional(),
});

export const regenerateShotInputSchema = z.object({
  shotId: z.string().cuid(),
});

export const detectContinuityIssuesInputSchema = z.object({
  projectId: z.string().cuid(),
  sceneId: z.string().cuid().optional(),
});

export const scoreSceneQualityInputSchema = z.object({
  projectId: z.string().cuid(),
  sceneId: z.string().cuid(),
});

export const queuePreviewExportInputSchema = z.object({
  projectId: z.string().cuid(),
  format: z.enum(['draft_preview', 'final_video']).default('draft_preview'),
  resolution: z.enum(['1080p', '1440p', '4k']).default('1080p'),
});

export const taskInputSchema = z.object({
  projectId: z.string().cuid(),
  sceneId: z.string().cuid().optional(),
  type: z.string().min(2),
  priority: taskPrioritySchema,
  input: z.record(z.string(), z.unknown()).default({}),
});

export const directorLoopInputSchema = z.object({
  projectId: z.string().cuid(),
  triggerType: triggerTypeSchema.default('MANUAL'),
  policyMode: policyModeSchema.default('safe_auto_fix'),
  maxSceneAttempts: z.number().int().min(1).max(10).default(3),
  qualityThreshold: z.number().int().min(0).max(100).default(75),
});
