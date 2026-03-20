export type ProjectFormatType = 'SHORT_CLIP' | 'SCENE' | 'EPISODE';
export type ProjectStatus = 'DRAFT' | 'PLANNING' | 'GENERATING' | 'REVIEW' | 'APPROVED' | 'EXPORTED';
export type SceneStatus = 'DRAFT' | 'PLANNED' | 'GENERATING' | 'REVIEWING' | 'NEEDS_FIX' | 'READY' | 'APPROVED';
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
  | 'EXPORT_PROJECT'
  | 'DIRECTOR_LOOP';
export type GenerationJobStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED';
export type ExportStatus = 'QUEUED' | 'RENDERING' | 'READY' | 'FAILED';
export type AgentTriggerType = 'MANUAL' | 'EVENT' | 'SCHEDULED';
export type AgentRunStatus = 'RUNNING' | 'COMPLETED' | 'FAILED' | 'PARTIAL';
export type AgentTaskPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type AgentTaskStatus = 'PENDING' | 'BLOCKED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
export type AgentActionStatus = 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
export type PolicyMode = 'suggest_only' | 'safe_auto_fix' | 'studio_autopilot';

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

export interface AgentObservationRecord {
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  projectId: string;
  sceneId?: string;
  data?: Record<string, unknown>;
}

export interface SceneTestResult {
  name:
    | 'has_storyboard'
    | 'has_shot_plan'
    | 'has_character_assignment'
    | 'has_location_assignment'
    | 'has_voice_assignment'
    | 'has_preview_render'
    | 'quality_score';
  pass: boolean;
  reason: string;
}

export interface SceneTestAggregate {
  sceneId: string;
  passed: boolean;
  qualityScore: number;
  threshold: number;
  results: SceneTestResult[];
}

export interface StructuredDirectorOutput {
  projectSummary: string;
  observations: AgentObservationRecord[];
  recommendedTasks: Array<{
    type: string;
    priority: AgentTaskPriority;
    sceneId?: string;
    reason: string;
    input: Record<string, unknown>;
  }>;
  nextBestActions: string[];
}
