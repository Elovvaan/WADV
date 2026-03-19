import { GenerationService, prisma } from '@wadv/lib';
import { ok } from '../../../_utils';

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scene = await prisma.scene.findUniqueOrThrow({
    where: { id },
    include: { episode: true },
  });
  const result = await new GenerationService().generateScenes(scene.episode.projectId, [id]);
  return ok(result);
}
