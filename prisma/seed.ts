import { prisma, demoDirectorPlan, demoStory, demoUser } from '@wadv/lib';

async function main() {
  await prisma.agentLearningEvent.deleteMany();
  await prisma.sceneAttempt.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.agentAction.deleteMany();
  await prisma.agentObservation.deleteMany();
  await prisma.agentTask.deleteMany();
  await prisma.agentRun.deleteMany();
  await prisma.characterVoiceAssignment.deleteMany();
  await prisma.characterAsset.deleteMany();
  await prisma.artAsset.deleteMany();
  await prisma.liveActionAsset.deleteMany();
  await prisma.generationJob.deleteMany();
  await prisma.shot.deleteMany();
  await prisma.scene.deleteMany();
  await prisma.location.deleteMany();
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

  const [rooftopLocation, cathedralLocation] = await Promise.all([
    prisma.location.create({
      data: {
        projectId: project.id,
        name: 'Rooftop Memory Tower',
        description: 'Neon rooftop with rain reflections and skyline memory towers.',
        metadataJson: { lighting: 'rain haze', palette: ['cobalt', 'violet'] },
      },
    }),
    prisma.location.create({
      data: {
        projectId: project.id,
        name: 'Transit Cathedral',
        description: 'Massive transit atrium with holographic stained glass.',
        metadataJson: { scale: 'grand', palette: ['amber', 'graphite'] },
      },
    }),
  ]);

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
        locationId: rooftopLocation.id,
        title: 'Rooftop Recall',
        scriptText: demoStory,
        orderIndex: 1,
        durationTargetSeconds: 44,
        status: 'READY',
        directorNotes: 'Play longing first, then let urgency cut through when Mira arrives.',
        storyboardJson: { frameCount: 6, source: 'seed' },
        shotPlanJson: { beats: ['arrival', 'warning', 'decision'], source: 'seed' },
        generatedPreviewUrl: 'https://placehold.co/1280x720/060b18/c6d8ff?text=Rooftop+Recall',
        qualityScore: 82,
        latestTestResultsJson: {
          passed: true,
          threshold: 75,
          qualityScore: 82,
          results: [
            { name: 'has_storyboard', pass: true, reason: 'Storyboard is available.' },
            { name: 'has_shot_plan', pass: true, reason: 'Shot plan exists.' },
            { name: 'has_character_assignment', pass: true, reason: 'Characters are assigned.' },
            { name: 'has_location_assignment', pass: true, reason: 'Location is assigned.' },
            { name: 'has_voice_assignment', pass: true, reason: 'Voice is assigned.' },
            { name: 'has_preview_render', pass: true, reason: 'Preview exists.' },
            { name: 'quality_score', pass: true, reason: 'Score meets threshold.' },
          ],
        },
      },
    }),
    prisma.scene.create({
      data: {
        episodeId: episode.id,
        title: 'Transit Cathedral Descent',
        scriptText: 'Ren and Mira descend through the vast station atrium to recover the lost voiceprint before sunrise.',
        orderIndex: 2,
        durationTargetSeconds: 58,
        status: 'NEEDS_FIX',
        directorNotes: 'Scale and atmosphere should amplify the growing trust between them.',
        shotPlanJson: { beats: ['descent', 'reveal'], source: 'seed' },
        qualityScore: 61,
        latestTestResultsJson: {
          passed: false,
          threshold: 75,
          qualityScore: 61,
          results: [
            { name: 'has_storyboard', pass: false, reason: 'Storyboard is missing.' },
            { name: 'has_shot_plan', pass: true, reason: 'Shot plan exists.' },
            { name: 'has_character_assignment', pass: true, reason: 'Characters are assigned.' },
            { name: 'has_location_assignment', pass: false, reason: 'Location assignment is missing.' },
            { name: 'has_voice_assignment', pass: true, reason: 'Voice is assigned.' },
            { name: 'has_preview_render', pass: false, reason: 'Preview render is missing.' },
            { name: 'quality_score', pass: false, reason: 'Quality is below threshold.' },
          ],
        },
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

  await prisma.character.update({ where: { id: mira.id }, data: { defaultVoiceId: voice.id } });
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
        jobType: 'DIRECTOR_LOOP',
        provider: 'wadv-director-loop',
        status: 'RUNNING',
        inputJson: { mode: 'safe_auto_fix' },
      },
    ],
  });

  await prisma.sceneAttempt.createMany({
    data: [
      {
        sceneId: sceneOne.id,
        attemptNumber: 1,
        qualityScore: 82,
        testResultsJson: sceneOne.latestTestResultsJson ?? {},
      },
      {
        sceneId: sceneTwo.id,
        attemptNumber: 1,
        qualityScore: 61,
        testResultsJson: sceneTwo.latestTestResultsJson ?? {},
      },
    ],
  });

  await prisma.agentRun.create({
    data: {
      projectId: project.id,
      agentName: 'WADV Director',
      triggerType: 'MANUAL',
      status: 'PARTIAL',
      summary: 'Scene 1 is ready. Scene 2 requires storyboard, location, and preview remediation.',
      finishedAt: new Date(),
    },
  });

  await prisma.agentObservation.createMany({
    data: [
      {
        projectId: project.id,
        sceneId: sceneTwo.id,
        category: 'missing_storyboard',
        severity: 'HIGH',
        message: 'Transit Cathedral Descent is missing a storyboard.',
      },
      {
        projectId: project.id,
        sceneId: sceneTwo.id,
        category: 'missing_location',
        severity: 'HIGH',
        message: 'Transit Cathedral Descent has no location assignment.',
      },
      {
        projectId: project.id,
        sceneId: sceneTwo.id,
        category: 'low_quality_score',
        severity: 'MEDIUM',
        message: 'Transit Cathedral Descent is below the quality threshold.',
        dataJson: { qualityScore: 61 },
      },
    ],
  });

  await prisma.agentTask.createMany({
    data: [
      {
        projectId: project.id,
        sceneId: sceneTwo.id,
        type: 'generate_storyboard',
        priority: 'HIGH',
        status: 'PENDING',
        inputJson: { projectId: project.id, sceneId: sceneTwo.id },
      },
      {
        projectId: project.id,
        sceneId: sceneTwo.id,
        type: 'assign_scene_location',
        priority: 'HIGH',
        status: 'PENDING',
        inputJson: { projectId: project.id, sceneId: sceneTwo.id },
      },
    ],
  });

  await prisma.agentAction.create({
    data: {
      projectId: project.id,
      sceneId: sceneOne.id,
      toolName: 'score_scene_quality',
      status: 'COMPLETED',
      inputJson: { projectId: project.id, sceneId: sceneOne.id },
      outputJson: { score: 82 },
    },
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: user.id,
        projectId: project.id,
        type: 'storyboard_generated',
        title: 'Storyboard generated for Scene 1',
        body: 'Rooftop Recall has an approved storyboard and preview stack.',
      },
      {
        userId: user.id,
        projectId: project.id,
        type: 'scene_quality_improved',
        title: 'Scene 1 improved to quality 82',
        body: 'The Director loop marked Rooftop Recall as ready.',
      },
    ],
  });

  await prisma.agentLearningEvent.createMany({
    data: [
      {
        projectId: project.id,
        sceneId: sceneOne.id,
        feedbackType: 'successful_attempt',
        signal: 'success',
        metadataJson: { attemptNumber: 1, qualityScore: 82 },
      },
      {
        projectId: project.id,
        sceneId: sceneTwo.id,
        feedbackType: 'user_override',
        signal: 'override',
        metadataJson: { note: 'Hold on dialogue rewrite until director review.' },
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
