import { prisma } from '@wadv/lib';
import { ok } from '../../../_utils';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await request.json();
  const asset = await prisma.characterAsset.create({
    data: {
      characterId: id,
      type: body.type ?? 'portrait',
      fileUrl: body.fileUrl ?? 'https://placehold.co/512x512/090d18/cad4ff?text=WADV+Art',
      metadataJson: {
        stylePreservationMode: body.stylePreservationMode ?? 'BALANCED',
        notes: 'Mock art upload successful.',
      },
    },
  });
  return ok({ asset }, { status: 201 });
}
