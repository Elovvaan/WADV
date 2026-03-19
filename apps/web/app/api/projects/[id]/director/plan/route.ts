import { directorPlanSchema, WadvDirectorService } from '@wadv/lib';
import { parseJson, ok } from '../../../../_utils';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await parseJson(request, directorPlanSchema);
  const { id } = await params;
  const report = await new WadvDirectorService().buildProjectPlan(id);
  return ok({ report });
}
