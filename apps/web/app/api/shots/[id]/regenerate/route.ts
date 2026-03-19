import { GenerationService } from '@wadv/lib';
import { ok } from '../../../_utils';

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await new GenerationService().regenerateShot(id);
  return ok(result);
}
