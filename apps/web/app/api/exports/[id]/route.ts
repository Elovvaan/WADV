import { prisma } from '@wadv/lib';
import { ok } from '../../_utils';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exportRecord = await prisma.export.findUnique({ where: { id } });
  return ok({ export: exportRecord });
}
