import { prisma } from '@wadv/lib';
import { ok } from '../../_utils';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await prisma.project.findUnique({
    where: { id },
    include: { episodes: { include: { scenes: { include: { shots: true } } } }, characters: true, directorReports: true, exports: true },
  });
  return ok({ project });
}
