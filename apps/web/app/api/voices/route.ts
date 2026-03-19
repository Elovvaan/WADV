import { prisma, voiceProfileSchema, providerRegistry } from '@wadv/lib';
import { parseJson, ok } from '../_utils';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const voices = await prisma.voiceProfile.findMany({ where: { userId: user.id } });
  return ok({ voices });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const input = await parseJson(request, voiceProfileSchema);
  const processed = await providerRegistry.voice.processVoice({ name: input.name, audioSampleUrl: input.audioSampleUrl });
  const voice = await prisma.voiceProfile.create({
    data: {
      userId: user.id,
      name: input.name,
      sourceType: input.sourceType,
      provider: processed.provider,
      metadataJson: processed.metadata,
      audioSampleUrl: input.audioSampleUrl,
    },
  });
  return ok({ voice }, { status: 201 });
}
