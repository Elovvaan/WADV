import { SceneStatus } from '@prisma/client';
import { prisma } from '../db';
import { providerRegistry } from '../providers';

export class ProjectService {
  async createProject(input: {
    userId: string;
    title: string;
    description: string;
    formatType: 'SHORT_CLIP' | 'SCENE' | 'EPISODE';
    genre: string;
    targetDuration: number;
  }) {
    return prisma.project.create({
      data: {
        userId: input.userId,
        title: input.title,
        description: input.description,
        formatType: input.formatType,
        genre: input.genre,
        targetDuration: input.targetDuration,
        episodes: {
          create: {
            title: 'Episode 1',
            orderIndex: 1,
            status: 'DRAFT',
          },
        },
      },
      include: { episodes: true },
    });
  }

  async ingestScript(projectId: string, input: string) {
    const analysis = await providerRegistry.story.parse(input);
    const project = await prisma.project.findUniqueOrThrow({ where: { id: projectId }, include: { episodes: true } });
    const episode = project.episodes[0] ?? await prisma.episode.create({
      data: { projectId, title: 'Episode 1', orderIndex: 1, status: 'DRAFT' },
    });

    await prisma.scene.deleteMany({ where: { episodeId: episode.id } });

    await prisma.scene.createMany({
      data: analysis.scenes.map((scene, index) => ({
        episodeId: episode.id,
        title: scene.title,
        scriptText: scene.scriptText,
        orderIndex: index + 1,
        durationTargetSeconds: scene.durationTargetSeconds,
        status: SceneStatus.PLANNED,
        directorNotes: scene.emotionalBeat,
      })),
    });

    for (const character of analysis.characters) {
      await prisma.character.upsert({
        where: {
          projectId_name: {
            projectId,
            name: character.name,
          },
        } as never,
        update: { role: character.role, stylePreset: character.stylePreset },
        create: {
          projectId,
          name: character.name,
          role: character.role,
          stylePreset: character.stylePreset,
          realismMode: 'STYLIZED',
          bibleJson: {
            summary: `${character.name} is introduced through the story ingest flow.`,
            source: 'mock-story-provider',
          },
        },
      }).catch(async () => prisma.character.create({
        data: {
          projectId,
          name: character.name,
          role: character.role,
          stylePreset: character.stylePreset,
          realismMode: 'STYLIZED',
          bibleJson: {
            summary: `${character.name} is introduced through the story ingest flow.`,
            source: 'mock-story-provider',
          },
        },
      }));
    }

    await prisma.project.update({ where: { id: projectId }, data: { status: 'PLANNING' } });

    return analysis;
  }

  async getDashboard(userId: string) {
    const [projects, user, exports, jobs] = await Promise.all([
      prisma.project.findMany({ where: { userId }, orderBy: { updatedAt: 'desc' }, take: 6, include: { episodes: { include: { scenes: true } } } }),
      prisma.user.findUniqueOrThrow({ where: { id: userId } }),
      prisma.export.findMany({ where: { project: { is: { userId } } }, orderBy: { createdAt: 'desc' }, take: 3 }),
      prisma.generationJob.findMany({ where: { project: { is: { userId } } }, orderBy: { createdAt: 'desc' }, take: 4 }),
    ]);

    return {
      user,
      projects,
      exports,
      jobs,
      stats: {
        activeProjects: projects.length,
        scenesPlanned: projects.reduce((total, project) => total + project.episodes.reduce((sceneTotal, episode) => sceneTotal + episode.scenes.length, 0), 0),
        exportReady: exports.filter((item) => item.status === 'READY').length,
      },
    };
  }
}
