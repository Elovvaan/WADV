import { liveActionSchema, prisma } from '@wadv/lib';
import { parseJson, ok } from '../../_utils';

export async function POST(request: Request) {
  const input = await parseJson(request, liveActionSchema);
  const asset = await prisma.liveActionAsset.create({
    data: {
      projectId: input.projectId,
      sceneId: input.sceneId,
      fileUrl: input.fileUrl,
      status: 'UPLOADED',
      metadataJson: { mode: 'mock-live-action-upload', fps: 24 },
    },
  });
  return ok({ asset }, { status: 201 });
}
