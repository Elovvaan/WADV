import { ProjectService, ingestScriptSchema, prisma } from '@wadv/lib';
import { parseJson, ok } from '../../../_utils';

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const input = await parseJson(request, ingestScriptSchema);
  const analysis = await new ProjectService().ingestScript(id, input.input);
  const project = await prisma.project.findUnique({ where: { id }, include: { episodes: { include: { scenes: true } }, characters: true } });
  return ok({ analysis, project });
}
