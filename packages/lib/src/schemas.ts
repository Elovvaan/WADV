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
  status: z.enum(['DRAFT', 'PLANNED', 'GENERATING', 'REVIEW', 'APPROVED']).optional(),
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
