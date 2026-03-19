import { exportSchema, GenerationService } from '@wadv/lib';
import { parseJson, ok } from '../../../_utils';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const input = await parseJson(request, exportSchema);
  const { id } = await params;
  const exportRecord = await new GenerationService().requestExport(id, input.format, input.resolution);
  return ok({ export: exportRecord }, { status: 201 });
}
