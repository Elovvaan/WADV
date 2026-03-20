import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { env } from '../env';

export type QueueJobName =
  | 'parse-script'
  | 'process-voice'
  | 'process-art'
  | 'process-live-action'
  | 'generate-scene'
  | 'regenerate-shot'
  | 'export-project'
  | 'director-loop';

let queue: Queue | null = null;

export function getQueue() {
  if (!env.redisUrl) {
    return null;
  }

  if (!queue) {
    const connection = new IORedis(env.redisUrl, { maxRetriesPerRequest: null });
    queue = new Queue('wadv-jobs', { connection });
  }

  return queue;
}

export async function enqueueJob(name: QueueJobName, data: Record<string, unknown>) {
  const currentQueue = getQueue();
  if (!currentQueue) {
    return { id: `mock-${name}-${Date.now()}`, status: 'QUEUED', mock: true };
  }

  const job = await currentQueue.add(name, data, {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1_000 },
    removeOnComplete: 50,
    removeOnFail: 100,
  });

  return { id: String(job.id), status: 'QUEUED', mock: false };
}
