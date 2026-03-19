import { prisma, sceneUpdateSchema } from '@wadv/lib';
import { parseJson, ok } from '../../_utils';

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scene = await prisma.scene.findUnique({ where: { id }, include: { shots: true } });
  return ok({ scene });
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const input = await parseJson(request, sceneUpdateSchema);
  const { id } = await params;
  const scene = await prisma.scene.update({ where: { id }, data: input });
  return ok({ scene });
}
