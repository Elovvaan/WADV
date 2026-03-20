import { prisma } from '../../db';

export class QualityService {
  async scoreSceneQuality(sceneId: string) {
    const scene = await prisma.scene.findUniqueOrThrow({
      where: { id: sceneId },
      include: {
        episode: true,
        shots: true,
        location: true,
        liveActionAssets: true,
      },
    });

    const projectCharacters = await prisma.character.findMany({
      where: { projectId: scene.episode.projectId },
      include: { assignments: true },
    });

    const completeness = [
      scene.storyboardJson ? 25 : 0,
      scene.shotPlanJson ? 20 : 0,
      scene.locationId ? 10 : 0,
      scene.generatedPreviewUrl ? 10 : 0,
    ].reduce((total, value) => total + value, 0);

    const continuity = Math.max(0, 25 - Math.max(scene.orderIndex - scene.shots.length, 0) * 5 - (scene.location ? 0 : 10));
    const assetPresence = Math.min(20, scene.shots.filter((shot) => Boolean(shot.previewUrl)).length * 6 + scene.liveActionAssets.length * 4);
    const characterCoverage = Math.min(20, projectCharacters.filter((character) => character.assignments.length > 0).length * 10);

    const score = Math.max(0, Math.min(100, completeness + continuity + assetPresence + Math.min(10, characterCoverage / 2)));

    return {
      sceneId,
      score,
      breakdown: {
        completeness,
        continuity,
        assetPresence,
        structure: Math.min(10, characterCoverage / 2),
      },
    };
  }
}
