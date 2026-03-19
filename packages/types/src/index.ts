export type ProjectFormatType = 'SHORT_CLIP' | 'SCENE' | 'EPISODE';
export type ProjectStatus = 'DRAFT' | 'PLANNING' | 'GENERATING' | 'REVIEW' | 'APPROVED' | 'EXPORTED';
export type SceneStatus = 'DRAFT' | 'PLANNED' | 'GENERATING' | 'REVIEW' | 'APPROVED';
export type ShotStatus = 'DRAFT' | 'QUEUED' | 'GENERATING' | 'READY' | 'FAILED';
export type AssetProcessingStatus = 'UPLOADED' | 'PROCESSING' | 'READY' | 'FAILED';
export type StylePreservationMode = 'STRICT' | 'BALANCED' | 'ADAPTIVE';
export type RealismMode = 'STYLIZED' | 'HYBRID' | 'HUMAN_LIKE' | 'CINEMATIC';
export type GenerationJobType =
  | 'PARSE_SCRIPT'
  | 'PROCESS_VOICE'
  | 'PROCESS_ART'
  | 'PROCESS_LIVE_ACTION'
  | 'GENERATE_SCENE'
  | 'REGENERATE_SHOT'
  | 'EXPORT_PROJECT';
export type GenerationJobStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
export type ExportStatus = 'QUEUED' | 'RENDERING' | 'READY' | 'FAILED';

export interface ScenePlan {
  sceneId?: string;
  title: string;
  orderIndex: number;
  emotionalBeat: string;
  cameraNotes: string[];
  continuityNotes: string[];
  shotSuggestions: Array<{
    type: string;
    cameraDirection: string;
    promptText: string;
    durationSeconds: number;
  }>;
}

export interface DirectorPlan {
  projectSummary: string;
  scenePlans: ScenePlan[];
  continuityWarnings: string[];
  characterRecommendations: string[];
  voiceSuggestions: string[];
  visualStylePlan: {
    palette: string[];
    lighting: string;
    renderingApproach: string;
  };
  cameraStylePlan: {
    approach: string;
    lensLanguage: string[];
    movementStyle: string[];
  };
  nextBestActions: string[];
}

export interface BillingSummary {
  plan: string;
  creditsBalance: number;
  usedThisMonth: number;
}
