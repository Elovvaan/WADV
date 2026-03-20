import { prisma } from '@wadv/lib';

export async function getProjectDetail(projectId: string, userId?: string) {
  return prisma.project.findFirstOrThrow({
    where: userId ? { id: projectId, userId } : { id: projectId },
    include: {
      user: true,
      episodes: {
        orderBy: { orderIndex: 'asc' },
        include: {
          scenes: {
            orderBy: { orderIndex: 'asc' },
            include: {
              shots: { orderBy: { orderIndex: 'asc' } },
              liveActionAssets: true,
              location: true,
              attempts: { orderBy: { attemptNumber: 'desc' } },
              agentObservations: { orderBy: { createdAt: 'desc' }, take: 10 },
              agentTasks: { orderBy: { updatedAt: 'desc' }, take: 10 },
            },
          },
        },
      },
      locations: true,
      characters: {
        include: {
          assets: true,
          assignments: { include: { voiceProfile: true } },
          artAssets: true,
          defaultVoice: true,
        },
      },
      liveActionAssets: true,
      artAssets: true,
      directorReports: { orderBy: { updatedAt: 'desc' }, take: 1 },
      generationJobs: { orderBy: { createdAt: 'desc' }, take: 10 },
      exports: { orderBy: { createdAt: 'desc' } },
      agentRuns: { orderBy: { startedAt: 'desc' }, take: 10 },
      agentTasks: { orderBy: { updatedAt: 'desc' }, take: 20 },
      agentObservations: { orderBy: { createdAt: 'desc' }, take: 20 },
      agentActions: { orderBy: { createdAt: 'desc' }, take: 20 },
      notifications: { orderBy: { createdAt: 'desc' }, take: 20 },
    },
  });
}

export async function getFirstProjectForDirector() {
  return prisma.project.findFirst({
    orderBy: { updatedAt: 'desc' },
    include: {
      user: true,
      episodes: {
        orderBy: { orderIndex: 'asc' },
        include: {
          scenes: {
            orderBy: { orderIndex: 'asc' },
            include: {
              shots: { orderBy: { orderIndex: 'asc' } },
              attempts: { orderBy: { attemptNumber: 'desc' } },
              location: true,
            },
          },
        },
      },
      characters: { include: { assignments: { include: { voiceProfile: true } }, defaultVoice: true } },
      agentRuns: { orderBy: { startedAt: 'desc' }, take: 10 },
      agentTasks: { orderBy: { updatedAt: 'desc' }, take: 20 },
      agentObservations: { orderBy: { createdAt: 'desc' }, take: 20 },
      agentActions: { orderBy: { createdAt: 'desc' }, take: 20 },
      notifications: { orderBy: { createdAt: 'desc' }, take: 20 },
      exports: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  });
}

export async function getSceneLoopDetail(sceneId: string) {
  return prisma.scene.findFirstOrThrow({
    where: { id: sceneId },
    include: {
      episode: { include: { project: true } },
      shots: { orderBy: { orderIndex: 'asc' } },
      location: true,
      attempts: { orderBy: { attemptNumber: 'desc' } },
      agentObservations: { orderBy: { createdAt: 'desc' }, take: 10 },
      agentTasks: { orderBy: { updatedAt: 'desc' }, take: 10 },
      agentActions: { orderBy: { createdAt: 'desc' }, take: 10 },
    },
  });
}
