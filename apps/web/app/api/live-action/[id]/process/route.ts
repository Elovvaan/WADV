import { prisma, providerRegistry } from '@wadv/lib';
import { ok } from '../../../_utils';

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = await prisma.liveActionAsset.findUniqueOrThrow({ where: { id } });
  const transcript = await providerRegistry.transcription.transcribe({ fileUrl: asset.fileUrl });
  const updated = await prisma.liveActionAsset.update({
    where: { id },
    data: {
      status: 'READY',
      metadataJson: {
        ...(asset.metadataJson as object),
        poseAnalysis: 'Mock pose landmarks created.',
        transcript,
      },
    },
  });
  return ok({ asset: updated });
}
