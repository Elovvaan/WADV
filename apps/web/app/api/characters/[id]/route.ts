import { prisma } from '@wadv/lib';
import { ok } from '../../_utils';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const character = await prisma.character.findUnique({ where: { id }, include: { assets: true, assignments: { include: { voiceProfile: true } } } });
  return ok({ character });
}
