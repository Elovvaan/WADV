import { assignVoiceSchema, prisma } from '@wadv/lib';
import { parseJson, ok } from '../../../_utils';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const input = await parseJson(request, assignVoiceSchema);
  const assignment = await prisma.characterVoiceAssignment.create({
    data: {
      characterId: id,
      voiceProfileId: input.voiceProfileId,
    },
  });
  return ok({ assignment }, { status: 201 });
}
