import { prisma } from '../db';
import { providerRegistry } from '../providers';

export class WadvDirectorService {
  async buildProjectPlan(projectId: string) {
    const project = await prisma.project.findUniqueOrThrow({
      where: { id: projectId },
      include: {
        episodes: { include: { scenes: { orderBy: { orderIndex: 'asc' } } } },
        characters: true,
      },
    });

    const scenes = project.episodes.flatMap((episode) => episode.scenes.map((scene) => ({
      title: scene.title,
      scriptText: scene.scriptText,
      orderIndex: scene.orderIndex,
    })));

    const plan = await providerRegistry.director.createPlan({
      title: project.title,
      description: project.description,
      genre: project.genre,
      scenes,
      characters: project.characters.map((character) => ({ name: character.name, role: character.role })),
    });

    const report = await prisma.directorReport.upsert({
      where: { projectId },
      update: { reportJson: plan },
      create: { projectId, reportJson: plan },
    });

    await prisma.project.update({ where: { id: projectId }, data: { status: 'PLANNING' } });

    return report;
  }
}
