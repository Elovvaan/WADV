import { demoDirectorPlan } from '../mock-data';
import { DirectorProvider, ImageProvider, StoryProvider, TranscriptionProvider, VideoProvider, VoiceProvider } from './interfaces';

export class MockStoryProvider implements StoryProvider {
  async parse(input: string) {
    const segments = input.split(/[.!?]/).map((segment) => segment.trim()).filter(Boolean);
    const scenes = segments.slice(0, 4).map((segment, index) => ({
      title: ['Opening Hook', 'Confrontation Beat', 'Descent Sequence', 'Emotional Resolve'][index] ?? `Scene ${index + 1}`,
      scriptText: `${segment}.`,
      emotionalBeat: ['Wonder', 'Conflict', 'Escalation', 'Resolve'][index] ?? 'Momentum',
      durationTargetSeconds: 25 + index * 10,
    }));

    return {
      summary: 'Mock analysis identified character-led cyber-fantasy beats suitable for scene-based production.',
      scenes,
      characters: [
        { name: 'Ren', role: 'Lead', stylePreset: 'Neo-noir protagonist' },
        { name: 'Mira', role: 'Co-lead', stylePreset: 'Expressive sketchbook tactician' },
      ],
    };
  }
}

export class MockDirectorProvider implements DirectorProvider {
  async createPlan() {
    return demoDirectorPlan;
  }
}

export class MockImageProvider implements ImageProvider {
  async generateSceneBoards(scenePlans) {
    return scenePlans.map((plan, index) => ({
      sceneTitle: plan.title,
      previewUrl: `https://placehold.co/1280x720/080b18/a8c8ff?text=${encodeURIComponent(`WADV+Storyboard+${index + 1}`)}`,
      metadata: {
        styleLock: 'balanced',
        frames: plan.shotSuggestions.length,
      },
    }));
  }
}

export class MockVideoProvider implements VideoProvider {
  async generateSceneVideo(input) {
    return {
      previewUrl: `https://placehold.co/1280x720/0b1020/ffffff?text=${encodeURIComponent(`Anime+Scene+${input.sceneTitle}`)}`,
      thumbnailUrl: `https://placehold.co/640x360/101935/bfe1ff?text=${encodeURIComponent(input.sceneTitle)}`,
      metadata: { fps: 24, duration: 12 },
    };
  }
}

export class MockVoiceProvider implements VoiceProvider {
  async processVoice(input) {
    return {
      provider: 'mock-voice-lab',
      metadata: {
        clarity: 0.94,
        energyCurve: 'controlled-dynamic',
        sampleName: input.name,
      },
    };
  }
}

export class MockTranscriptionProvider implements TranscriptionProvider {
  async transcribe(input) {
    return {
      transcript: `Mock transcript for ${input.fileUrl}`,
      segments: [
        { start: 0, end: 1.8, text: 'I found the rooftop memory cache.' },
        { start: 1.8, end: 3.4, text: 'Then let’s retrieve the voice before dawn.' },
      ],
    };
  }
}
