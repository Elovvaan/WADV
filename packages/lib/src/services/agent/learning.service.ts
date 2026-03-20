import { prisma } from '../../db';

export class LearningService {
  async recordSuccessfulAttempt(projectId: string, sceneId: string, attemptNumber: number, qualityScore: number) {
    return prisma.agentLearningEvent.create({
      data: {
        projectId,
        sceneId,
        feedbackType: 'successful_attempt',
        signal: 'success',
        metadataJson: { attemptNumber, qualityScore },
      },
    });
  }

  async recordUserApproval(projectId: string, sceneId: string | undefined, metadata: Record<string, unknown> = {}) {
    return prisma.agentLearningEvent.create({
      data: {
        projectId,
        sceneId,
        feedbackType: 'user_approval',
        signal: 'approve',
        metadataJson: metadata,
      },
    });
  }

  async recordUserOverride(projectId: string, sceneId: string | undefined, metadata: Record<string, unknown> = {}) {
    return prisma.agentLearningEvent.create({
      data: {
        projectId,
        sceneId,
        feedbackType: 'user_override',
        signal: 'override',
        metadataJson: metadata,
      },
    });
  }
}
