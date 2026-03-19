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
            include: { shots: { orderBy: { orderIndex: 'asc' } }, liveActionAssets: true },
          },
        },
      },
      characters: {
        include: {
          assets: true,
          assignments: { include: { voiceProfile: true } },
          artAssets: true,
        },
      },
      liveActionAssets: true,
      artAssets: true,
      directorReports: { orderBy: { updatedAt: 'desc' }, take: 1 },
      generationJobs: { orderBy: { createdAt: 'desc' }, take: 10 },
      exports: { orderBy: { createdAt: 'desc' } },
    },
  });
}
