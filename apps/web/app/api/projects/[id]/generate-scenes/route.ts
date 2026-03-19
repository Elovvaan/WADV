import { generateSceneSchema, GenerationService } from '@wadv/lib';
import { parseJson, ok } from '../../../_utils';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const input = await parseJson(request, generateSceneSchema);
  const { id } = await params;
  const result = await new GenerationService().generateScenes(id, input.sceneIds);
  return ok(result);
}
