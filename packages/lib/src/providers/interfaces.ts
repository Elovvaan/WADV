import { DirectorPlan, ScenePlan } from '@wadv/types';

export interface StoryAnalysisResult {
  summary: string;
  scenes: Array<{ title: string; scriptText: string; emotionalBeat: string; durationTargetSeconds: number }>;
  characters: Array<{ name: string; role: string; stylePreset: string }>;
}

export interface StoryProvider {
  parse(input: string): Promise<StoryAnalysisResult>;
}

export interface DirectorProvider {
  createPlan(input: {
    title: string;
    description: string;
    genre: string;
    scenes: Array<{ title: string; scriptText: string; orderIndex: number }>;
    characters: Array<{ name: string; role: string }>;
  }): Promise<DirectorPlan>;
}

export interface ImageProvider {
  generateSceneBoards(scenePlans: ScenePlan[]): Promise<Array<{ sceneTitle: string; previewUrl: string; metadata: Record<string, unknown> }>>;
}

export interface VideoProvider {
  generateSceneVideo(input: { sceneTitle: string; promptText: string }): Promise<{ previewUrl: string; thumbnailUrl: string; metadata: Record<string, unknown> }>;
}

export interface VoiceProvider {
  processVoice(input: { name: string; audioSampleUrl: string }): Promise<{ provider: string; metadata: Record<string, unknown> }>;
}

export interface TranscriptionProvider {
  transcribe(input: { fileUrl: string }): Promise<{ transcript: string; segments: Array<{ start: number; end: number; text: string }> }>;
}
