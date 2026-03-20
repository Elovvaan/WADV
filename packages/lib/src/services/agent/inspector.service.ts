import type { AgentObservationRecord } from '@wadv/types';
import { prisma } from '../../db';

export class InspectorService {
  async inspectProject(projectId: string): Promise<AgentObservationRecord[]> {
    const project = await prisma.project.findUniqueOrThrow({
      where: { id: projectId },
      include: {
        user: true,
        exports: true,
        episodes: {
          include: {
            scenes: {
              include: {
                location: true,
                shots: true,
                attempts: { orderBy: { attemptNumber: 'desc' }, take: 1 },
              },
              orderBy: { orderIndex: 'asc' },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
        characters: { include: { assignments: true, assets: true } },
        locations: true,
      },
    });

    const observations: AgentObservationRecord[] = [];
    const scenes = project.episodes.flatMap((episode) => episode.scenes);

    if (scenes.length === 0) {
      observations.push(this.obs(projectId, 'missing_scenes', 'critical', 'Project has no scenes.'));
    }

    if (!project.exports.some((item) => item.status === 'READY')) {
      observations.push(this.obs(projectId, 'no_exportable_preview', 'high', 'Project has no exportable preview ready.'));
    }

    const toneSet = new Set(scenes.map((scene) => (scene.directorNotes ?? '').split(' ').slice(0, 2).join(' ')).filter(Boolean));
    if (toneSet.size > 2) {
      observations.push(this.obs(projectId, 'inconsistent_tone', 'medium', 'Director notes imply inconsistent tone across scenes.', { toneFragments: [...toneSet] }));
    }

    if (project.characters.length === 0) {
      observations.push(this.obs(projectId, 'missing_characters', 'critical', 'Project has no characters defined.'));
    }

    for (const scene of scenes) {
      if (!scene.storyboardJson) {
        observations.push(this.obs(projectId, 'missing_storyboard', 'high', `${scene.title} is missing a storyboard.`, { sceneId: scene.id }, scene.id));
      }
      if (!scene.shotPlanJson && scene.shots.length === 0) {
        observations.push(this.obs(projectId, 'missing_shot_plan', 'high', `${scene.title} is missing a shot plan.`, { sceneId: scene.id }, scene.id));
      }
      if (!scene.locationId) {
        observations.push(this.obs(projectId, 'missing_location', 'high', `${scene.title} has no location assignment.`, { sceneId: scene.id }, scene.id));
      }
      if (!scene.generatedPreviewUrl) {
        observations.push(this.obs(projectId, 'missing_preview_render', 'high', `${scene.title} has no preview render.`, { sceneId: scene.id }, scene.id));
      }
      if ((scene.qualityScore ?? 0) < 75) {
        observations.push(this.obs(projectId, 'low_quality_score', 'medium', `${scene.title} is below the quality threshold.`, { sceneId: scene.id, qualityScore: scene.qualityScore ?? 0 }, scene.id));
      }
      if (scene.location && scenes.some((other) => other.id !== scene.id && other.locationId === scene.locationId && other.orderIndex !== scene.orderIndex + 1)) {
        observations.push(this.obs(projectId, 'continuity_mismatch', 'medium', `${scene.title} reuses ${scene.location.name} in a way that may need continuity validation.`, { sceneId: scene.id, locationId: scene.locationId }, scene.id));
      }
    }

    for (const character of project.characters) {
      if (!character.bibleJson || Object.keys((character.bibleJson as Record<string, unknown>) ?? {}).length === 0) {
        observations.push(this.obs(projectId, 'missing_bible', 'high', `${character.name} is missing a character bible.`));
      }
      if (character.assets.length === 0) {
        observations.push(this.obs(projectId, 'inconsistent_appearance', 'medium', `${character.name} has no reference assets for appearance continuity.`));
      }
      if (character.assignments.length === 0 && !character.defaultVoiceId) {
        observations.push(this.obs(projectId, 'missing_voice', 'high', `${character.name} is missing a voice assignment.`));
      }
    }

    for (const location of project.locations) {
      if (!scenes.some((scene) => scene.locationId === location.id)) {
        observations.push(this.obs(projectId, 'missing_assignment', 'medium', `${location.name} exists but is not assigned to any scene.`, { locationId: location.id }));
      }
    }

    return observations;
  }

  private obs(projectId: string, category: string, severity: AgentObservationRecord['severity'], message: string, data?: Record<string, unknown>, sceneId?: string): AgentObservationRecord {
    return { projectId, sceneId, category, severity, message, data };
  }
}
