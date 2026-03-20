import type { AgentTaskPriority, PolicyMode, SceneTestAggregate, StructuredDirectorOutput } from '@wadv/types';

export interface AgentToolContext {
  projectId: string;
  sceneId?: string;
  actor: string;
}

export interface AgentToolDefinition<TInput = Record<string, unknown>, TResult = Record<string, unknown>> {
  name: string;
  description: string;
  run: (input: TInput, context: AgentToolContext) => Promise<TResult>;
}

export interface PrioritizedTask {
  projectId: string;
  sceneId?: string;
  type: string;
  priority: AgentTaskPriority;
  reason: string;
  input: Record<string, unknown>;
}

export interface SceneLoopResult {
  sceneId: string;
  attempts: Array<{
    attemptNumber: number;
    qualityScore: number;
    tests: SceneTestAggregate;
  }>;
  finalStatus: string;
}

export interface DirectorLoopResult extends StructuredDirectorOutput {
  runId: string;
  executedTasks: Array<{ taskId: string; type: string; status: string }>;
  sceneLoops: SceneLoopResult[];
  policyMode: PolicyMode;
}
