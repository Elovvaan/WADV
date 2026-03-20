import type { PolicyMode } from '@wadv/types';
import { prisma } from '../../db';
import { policyModeSchema } from '../../schemas';
import { agentToolRegistry } from './tool-registry';
import type { PrioritizedTask } from './types';
import { PolicyService } from './policy.service';

export class ExecutorService {
  constructor(private readonly policyService = new PolicyService()) {}

  async executeTasks(tasks: PrioritizedTask[], policyMode: PolicyMode) {
    policyModeSchema.parse(policyMode);
    const results: Array<{ taskId: string; type: string; status: string }> = [];

    for (const task of tasks) {
      const createdTask = await prisma.agentTask.create({
        data: {
          projectId: task.projectId,
          sceneId: task.sceneId,
          type: task.type,
          priority: task.priority,
          status: 'PENDING',
          inputJson: { ...task.input, reason: task.reason },
        },
      });

      const policyDecision = this.policyService.canExecute(task, policyMode);
      if (!policyDecision.allowed) {
        await prisma.agentTask.update({
          where: { id: createdTask.id },
          data: { status: 'BLOCKED', outputJson: { reason: policyDecision.reason } },
        });
        results.push({ taskId: createdTask.id, type: task.type, status: 'BLOCKED' });
        continue;
      }

      try {
        await prisma.agentTask.update({ where: { id: createdTask.id }, data: { status: 'RUNNING' } });
        const output = await agentToolRegistry.execute(task.type, task.input, {
          projectId: task.projectId,
          sceneId: task.sceneId,
          actor: 'WADV Director',
        });
        await prisma.agentTask.update({ where: { id: createdTask.id }, data: { status: 'COMPLETED', outputJson: output } });
        results.push({ taskId: createdTask.id, type: task.type, status: 'COMPLETED' });
      } catch (error) {
        await prisma.agentTask.update({
          where: { id: createdTask.id },
          data: {
            status: 'FAILED',
            outputJson: { message: error instanceof Error ? error.message : 'Unknown error' },
          },
        });
        results.push({ taskId: createdTask.id, type: task.type, status: 'FAILED' });
      }
    }

    return results;
  }
}
