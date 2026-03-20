import type { PolicyMode } from '@wadv/types';
import type { PrioritizedTask } from './types';

const SAFE_AUTO_FIX_TOOLS = new Set(['generate_storyboard', 'assign_scene_location', 'queue_preview_export', 'generate_scene_breakdown', 'generate_scene_preview']);
const SUGGEST_ONLY_TOOLS = new Set(['rewrite_dialogue', 'change_voice', 'change_character_identity']);

export class PolicyService {
  canExecute(task: PrioritizedTask, mode: PolicyMode) {
    if (mode === 'studio_autopilot') {
      return { allowed: true, reason: 'Studio autopilot executes all validated tasks.' };
    }

    if (mode === 'safe_auto_fix') {
      return SAFE_AUTO_FIX_TOOLS.has(task.type)
        ? { allowed: true, reason: 'Safe auto-fix allows this tool.' }
        : { allowed: false, reason: 'Task requires approval outside safe auto-fix policy.' };
    }

    if (SUGGEST_ONLY_TOOLS.has(task.type)) {
      return { allowed: false, reason: 'Suggest-only blocks identity or dialogue changes.' };
    }

    return { allowed: false, reason: 'Suggest-only never auto-executes tasks.' };
  }
}
