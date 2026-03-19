import type { ReactNode } from 'react';
import { AppShell } from '@/components/app-shell';
import { requireUser } from '@/lib/auth';
import { getProjectDetail } from '@/lib/projects';

export default async function ProjectLayout({ children, params }: { children: ReactNode; params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const user = await requireUser();
  const project = await getProjectDetail(projectId, user.id);

  return (
    <AppShell title={project.title} subtitle={project.description} user={user}>
      {children}
    </AppShell>
  );
}
