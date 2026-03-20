import type { SceneTestAggregate, SceneTestResult } from '@wadv/types';
import { prisma } from '../../db';
import { QualityService } from './quality.service';

export class SceneTestsService {
  constructor(private readonly qualityService = new QualityService()) {}

  async runSceneTests(sceneId: string, threshold = 75): Promise<SceneTestAggregate> {
    const scene = await prisma.scene.findUniqueOrThrow({
      where: { id: sceneId },
      include: {
        episode: true,
        location: true,
        shots: true,
      },
    });

    const characters = await prisma.character.findMany({
      where: { projectId: scene.episode.projectId },
      include: { assignments: true },
    });

    const quality = await this.qualityService.scoreSceneQuality(sceneId);
    const characterAssigned = characters.length > 0;
    const voiceAssigned = characters.some((character) => character.assignments.length > 0 || Boolean(character.defaultVoiceId));

    const results: SceneTestResult[] = [
      {
        name: 'has_storyboard',
        pass: Boolean(scene.storyboardJson),
        reason: scene.storyboardJson ? 'Storyboard is available.' : 'Storyboard is missing.',
      },
      {
        name: 'has_shot_plan',
        pass: Boolean(scene.shotPlanJson) || scene.shots.length > 0,
        reason: scene.shotPlanJson || scene.shots.length > 0 ? 'Shot plan exists.' : 'Shot plan is missing.',
      },
      {
        name: 'has_character_assignment',
        pass: characterAssigned,
        reason: characterAssigned ? 'Project has character assignments.' : 'No characters are assigned to the project yet.',
      },
      {
        name: 'has_location_assignment',
        pass: Boolean(scene.locationId),
        reason: scene.locationId ? 'Scene location is assigned.' : 'Scene location is missing.',
      },
      {
        name: 'has_voice_assignment',
        pass: voiceAssigned,
        reason: voiceAssigned ? 'At least one character voice is assigned.' : 'No voice assignments found for the scene project.',
      },
      {
        name: 'has_preview_render',
        pass: Boolean(scene.generatedPreviewUrl),
        reason: scene.generatedPreviewUrl ? 'Preview render is available.' : 'Scene preview render has not been generated.',
      },
      {
        name: 'quality_score',
        pass: quality.score >= threshold,
        reason: quality.score >= threshold ? `Quality score ${quality.score} meets threshold ${threshold}.` : `Quality score ${quality.score} is below threshold ${threshold}.`,
      },
    ];

    return {
      sceneId,
      passed: results.every((result) => result.pass),
      qualityScore: quality.score,
      threshold,
      results,
    };
  }
}
