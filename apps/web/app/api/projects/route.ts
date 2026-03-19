import { ProjectService, projectSchema, prisma } from '@wadv/lib';
import { parseJson, ok } from '../_utils';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const projects = await prisma.project.findMany({ where: { userId: user.id }, orderBy: { updatedAt: 'desc' } });
  return ok({ projects });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const input = await parseJson(request, projectSchema);
  const project = await new ProjectService().createProject({ ...input, userId: user.id });
  return ok({ project }, { status: 201 });
}
