import type { AgentObservationRecord, AgentTaskPriority } from '@wadv/types';
import type { PrioritizedTask } from './types';

const taskMapping: Record<string, { type: string; priority: AgentTaskPriority }> = {
  missing_scenes: { type: 'analyze_project_story', priority: 'CRITICAL' },
  no_exportable_preview: { type: 'queue_preview_export', priority: 'HIGH' },
  missing_storyboard: { type: 'generate_storyboard', priority: 'HIGH' },
  missing_shot_plan: { type: 'generate_scene_breakdown', priority: 'HIGH' },
  missing_location: { type: 'assign_scene_location', priority: 'HIGH' },
  missing_voice: { type: 'assign_voice_to_character', priority: 'HIGH' },
  missing_preview_render: { type: 'generate_scene_preview', priority: 'HIGH' },
  low_quality_score: { type: 'regenerate_scene', priority: 'MEDIUM' },
  continuity_mismatch: { type: 'detect_continuity_issues', priority: 'MEDIUM' },
  missing_bible: { type: 'create_character_bible', priority: 'HIGH' },
  inconsistent_tone: { type: 'analyze_project_story', priority: 'MEDIUM' },
};

export class PrioritizerService {
  prioritize(projectId: string, observations: AgentObservationRecord[]): PrioritizedTask[] {
    return observations.map((observation) => {
      const mapped = taskMapping[observation.category] ?? { type: 'analyze_project_story', priority: 'LOW' as const };

      return {
        projectId,
        sceneId: observation.sceneId,
        type: mapped.type,
        priority: mapped.priority,
        reason: observation.message,
        input: {
          projectId,
          ...(observation.sceneId ? { sceneId: observation.sceneId } : {}),
          ...observation.data,
        },
      };
    });
  }
}
