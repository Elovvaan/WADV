import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { DirectorLoopJob, env, prisma, providerRegistry } from '@wadv/lib';

if (!env.redisUrl) {
  console.log('[wadv-worker] REDIS_URL not configured. Worker is idle in mock mode.');
  process.exit(0);
}

const connection = new IORedis(env.redisUrl, { maxRetriesPerRequest: null });
const directorLoopJob = new DirectorLoopJob();

const worker = new Worker('wadv-jobs', async (job) => {
  console.log(`[wadv-worker] processing ${job.name}`);

  switch (job.name) {
    case 'generate-scene': {
      const sceneId = String(job.data.sceneId);
      const scene = await prisma.scene.findUniqueOrThrow({ where: { id: sceneId } });
      const preview = await providerRegistry.video.generateSceneVideo({
        sceneTitle: scene.title,
        promptText: scene.scriptText,
      });
      await prisma.scene.update({ where: { id: sceneId }, data: { status: 'REVIEWING', generatedPreviewUrl: preview.previewUrl } });
      break;
    }
    case 'export-project': {
      const exportId = String(job.data.exportId);
      await prisma.export.update({
        where: { id: exportId },
        data: {
          status: 'READY',
          fileUrl: 'https://placehold.co/1920x1080/0d1326/ffffff?text=WADV+Export',
          metadataJson: { completedBy: 'worker', completedAt: new Date().toISOString() },
        },
      });
      break;
    }
    case 'director-loop': {
      await directorLoopJob.run({
        projectId: String(job.data.projectId),
        triggerType: (job.data.triggerType as 'MANUAL' | 'EVENT' | 'SCHEDULED' | undefined) ?? 'MANUAL',
        policyMode: (job.data.policyMode as 'suggest_only' | 'safe_auto_fix' | 'studio_autopilot' | undefined) ?? 'safe_auto_fix',
      });
      break;
    }
    default:
      console.log(`[wadv-worker] no-op for ${job.name}`);
  }
}, { connection });

worker.on('completed', (job) => console.log(`[wadv-worker] completed ${job.id}`));
worker.on('failed', (job, error) => console.error(`[wadv-worker] failed ${job?.id}`, error));
