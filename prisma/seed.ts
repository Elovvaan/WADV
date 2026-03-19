import { prisma, demoDirectorPlan, demoStory, demoUser } from '@wadv/lib';

async function main() {
  await prisma.characterVoiceAssignment.deleteMany();
  await prisma.characterAsset.deleteMany();
  await prisma.artAsset.deleteMany();
  await prisma.liveActionAsset.deleteMany();
  await prisma.generationJob.deleteMany();
  await prisma.shot.deleteMany();
  await prisma.scene.deleteMany();
  await prisma.episode.deleteMany();
  await prisma.directorReport.deleteMany();
  await prisma.export.deleteMany();
  await prisma.voiceProfile.deleteMany();
  await prisma.character.deleteMany();
  await prisma.billingEvent.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  const user = await prisma.user.create({
    data: {
      email: demoUser.email,
      name: demoUser.name,
      passwordHash: demoUser.password,
      plan: 'CREATOR',
      creditsBalance: 4200,
    },
  });

  const project = await prisma.project.create({
    data: {
      userId: user.id,
      title: 'Neon Memory Cathedral',
      description: 'A creator-first anime pilot that blends script analysis, live-action rooftop performances, custom sketch sheets, and voiceprint drama.',
      formatType: 'EPISODE',
      genre: 'Cyber-fantasy drama',
      targetDuration: 480,
      status: 'PLANNING',
    },
  });

  const episode = await prisma.episode.create({
    data: {
      projectId: project.id,
      title: 'Episode 1 · Memory Tower',
      orderIndex: 1,
      status: 'PLANNING',
    },
  });

  const [sceneOne, sceneTwo] = await Promise.all([
    prisma.scene.create({
      data: {
        episodeId: episode.id,
        title: 'Rooftop Recall',
        scriptText: demoStory,
        orderIndex: 1,
        durationTargetSeconds: 44,
        status: 'PLANNED',
        directorNotes: 'Play longing first, then let urgency cut through when Mira arrives.',
        generatedPreviewUrl: 'https://placehold.co/1280x720/060b18/c6d8ff?text=Rooftop+Recall',
      },
    }),
    prisma.scene.create({
      data: {
        episodeId: episode.id,
        title: 'Transit Cathedral Descent',
        scriptText: 'Ren and Mira descend through the vast station atrium to recover the lost voiceprint before sunrise.',
        orderIndex: 2,
        durationTargetSeconds: 58,
        status: 'REVIEW',
        directorNotes: 'Scale and atmosphere should amplify the growing trust between them.',
        generatedPreviewUrl: 'https://placehold.co/1280x720/09101f/f2f7ff?text=Transit+Cathedral',
      },
    }),
  ]);

  await prisma.shot.createMany({
    data: [
      {
        sceneId: sceneOne.id,
        orderIndex: 1,
        shotType: 'Establishing wide',
        cameraDirection: 'Slow dolly toward rooftop edge',
        promptText: 'Anime rooftop in neon rain, reflective puddles, wistful lead character silhouette',
        durationSeconds: 5,
        status: 'READY',
        previewUrl: 'https://placehold.co/640x360/0b1326/dce8ff?text=Shot+1',
      },
      {
        sceneId: sceneOne.id,
        orderIndex: 2,
        shotType: 'Medium two-shot',
        cameraDirection: 'Counter-rotate around Ren and Mira',
        promptText: 'Two characters framed by rain-lit skyline and emotional tension',
        durationSeconds: 6,
        status: 'READY',
        previewUrl: 'https://placehold.co/640x360/111936/dce8ff?text=Shot+2',
      },
      {
        sceneId: sceneTwo.id,
        orderIndex: 1,
        shotType: 'Atrium descent',
        cameraDirection: 'Crane down through the transit cathedral',
        promptText: 'Cathedral-like transit station with holographic stained glass and deep scale',
        durationSeconds: 8,
        status: 'GENERATING',
        previewUrl: 'https://placehold.co/640x360/090f20/e9efff?text=Shot+3',
      },
    ],
  });

  const [ren, mira] = await Promise.all([
    prisma.character.create({
      data: {
        projectId: project.id,
        name: 'Ren',
        role: 'Lead',
        realismMode: 'HYBRID',
        stylePreset: 'Noir protagonist',
        bibleJson: {
          silhouette: 'Long coat, rain-slick dark hair, calm expression until emotional rupture.',
          continuity: ['Blue edge light on coat seams.', 'Measured delivery with interiority.'],
        },
      },
    }),
    prisma.character.create({
      data: {
        projectId: project.id,
        name: 'Mira',
        role: 'Co-lead',
        realismMode: 'STYLIZED',
        stylePreset: 'Sketchbook tactician',
        bibleJson: {
          silhouette: 'Short asymmetric cut, sketchbook, expressive eyes retained from creator art.',
          continuity: ['Left-hand sketchbook carry.', 'Urgent but precise cadence.'],
        },
      },
    }),
  ]);

  await prisma.characterAsset.createMany({
    data: [
      {
        characterId: ren.id,
        type: 'portrait',
        fileUrl: 'https://placehold.co/512x512/0d1326/dce8ff?text=Ren',
        metadataJson: { angle: 'front', source: 'seed' },
      },
      {
        characterId: mira.id,
        type: 'expression-sheet',
        fileUrl: 'https://placehold.co/512x512/111a34/f4f7ff?text=Mira',
        metadataJson: { expressions: 6, source: 'seed' },
      },
    ],
  });

  await prisma.artAsset.createMany({
    data: [
      {
        projectId: project.id,
        characterId: ren.id,
        fileUrl: 'https://placehold.co/768x1024/071122/c8dbff?text=Ren+Sheet',
        stylePreservationMode: 'STRICT',
        metadataJson: { source: 'upload', type: 'character_sheet' },
      },
      {
        projectId: project.id,
        characterId: mira.id,
        fileUrl: 'https://placehold.co/768x1024/0b1733/f4f7ff?text=Mira+Expressions',
        stylePreservationMode: 'BALANCED',
        metadataJson: { source: 'upload', type: 'expression_sheet' },
      },
    ],
  });

  const voice = await prisma.voiceProfile.create({
    data: {
      userId: user.id,
      name: 'Mira Original VO',
      sourceType: 'upload',
      provider: 'mock-voice-lab',
      metadataJson: { clarity: 0.94, emotionalRange: 'urgent-soft' },
      audioSampleUrl: 'https://placehold.co/400x100/071122/e8f1ff?text=Voice+Sample',
    },
  });

  await prisma.characterVoiceAssignment.create({
    data: {
      characterId: mira.id,
      voiceProfileId: voice.id,
    },
  });

  await prisma.liveActionAsset.create({
    data: {
      projectId: project.id,
      sceneId: sceneOne.id,
      fileUrl: 'https://placehold.co/1280x720/0a1020/f4f7ff?text=Live+Action+Take',
      status: 'READY',
      metadataJson: {
        poseAnalysis: 'Mock rooftop pose track complete',
        transcript: 'We recover the voiceprint before sunrise.',
      },
    },
  });

  await prisma.directorReport.create({
    data: {
      projectId: project.id,
      reportJson: demoDirectorPlan,
    },
  });

  await prisma.generationJob.createMany({
    data: [
      {
        projectId: project.id,
        sceneId: sceneOne.id,
        jobType: 'GENERATE_SCENE',
        provider: 'mock-image-video-stack',
        status: 'COMPLETED',
        inputJson: { mode: 'storyboard' },
        outputJson: { previewUrl: sceneOne.generatedPreviewUrl },
      },
      {
        projectId: project.id,
        sceneId: sceneTwo.id,
        jobType: 'GENERATE_SCENE',
        provider: 'mock-image-video-stack',
        status: 'RUNNING',
        inputJson: { mode: 'video_scene' },
      },
    ],
  });

  await prisma.export.create({
    data: {
      projectId: project.id,
      format: 'draft_preview',
      resolution: '1080p',
      status: 'READY',
      fileUrl: 'https://placehold.co/1920x1080/0a1020/ffffff?text=WADV+Draft+Preview',
      metadataJson: { durationSeconds: 102, createdBy: 'seed' },
    },
  });

  await prisma.billingEvent.create({
    data: {
      userId: user.id,
      type: 'director_plan_generation',
      creditsUsed: 120,
      metadataJson: { projectId: project.id },
    },
  });

  console.log('Seed complete:', { userId: user.id, projectId: project.id });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
