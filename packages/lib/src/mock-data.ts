import { DirectorPlan } from '@wadv/types';

export const demoUser = {
  email: 'demo@wadv.ai',
  name: 'Aiko Founder',
  password: 'demo1234',
};

export const demoStory = `On a rain-lashed neon night, Ren returns to the rooftop where the city's memory towers hum. Mira arrives with a cracked expression sheet and a warning: the director AI has started improvising endings. Together they descend into the transit cathedral to recover a lost voiceprint before sunrise.`;

export const demoDirectorPlan: DirectorPlan = {
  projectSummary: 'A moody cyber-fantasy pilot driven by performance capture, voice memory, and hand-drawn identity continuity.',
  scenePlans: [
    {
      title: 'Rooftop Recall',
      orderIndex: 1,
      emotionalBeat: 'Longing with restrained urgency',
      cameraNotes: ['Open with a drifting skyline dolly.', 'Hold on Ren before Mira breaks frame.'],
      continuityNotes: ['Maintain rain reflections in wardrobe highlights.'],
      shotSuggestions: [
        {
          type: 'Establishing',
          cameraDirection: 'Slow dolly toward rooftop edge',
          promptText: 'Anime rooftop under neon rainfall with reflective puddles and blue-violet signs',
          durationSeconds: 5,
        },
        {
          type: 'Medium two-shot',
          cameraDirection: 'Counter-rotate around Ren and Mira',
          promptText: 'Stylized emotional confrontation with rain-lit hair silhouettes',
          durationSeconds: 6,
        },
      ],
    },
    {
      title: 'Transit Cathedral Descent',
      orderIndex: 2,
      emotionalBeat: 'Rising tension and fragile trust',
      cameraNotes: ['Use descending vertical compositions.', 'Accentuate scale with low-angle parallax.'],
      continuityNotes: ['Keep Mira’s sketchbook in left hand.', 'Sustain blue LED rim light.'],
      shotSuggestions: [
        {
          type: 'Wide interior',
          cameraDirection: 'Crane down through the cathedral atrium',
          promptText: 'Immense cathedral-like transit station, holographic stained glass, anime rendering',
          durationSeconds: 7,
        },
      ],
    },
  ],
  continuityWarnings: ['Ren’s voiceprint memory is referenced before the sample is introduced.', 'Scene 2 may need a transition card to clarify time compression.'],
  characterRecommendations: ['Preserve Mira’s hand-drawn eye shape across expressions.', 'Give Ren a steadier, underplayed performance cadence.'],
  voiceSuggestions: ['Use the uploaded voice sample as the base for Mira’s urgent whisper.', 'Layer station ambience ducking beneath key emotional beats.'],
  visualStylePlan: {
    palette: ['Neon cobalt', 'electric violet', 'wet graphite', 'soft amber highlights'],
    lighting: 'Backlit rain haze with selective character key lights.',
    renderingApproach: 'Hybrid anime cinematic frames with creator art locked for faces and costumes.',
  },
  cameraStylePlan: {
    approach: 'Measured, emotionally motivated movement over hyperactive cuts.',
    lensLanguage: ['24mm environmental wides', '50mm intimate mediums', '85mm emotional inserts'],
    movementStyle: ['Drifting dolly', 'Vertical reveal', 'Selective handheld for urgency'],
  },
  nextBestActions: ['Approve character bible notes for Mira.', 'Attach the best live-action rooftop take to Scene 1.', 'Generate storyboard passes before video renders.'],
};
