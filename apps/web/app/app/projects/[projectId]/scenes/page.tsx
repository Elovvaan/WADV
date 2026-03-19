import Link from 'next/link';
import { GlassPanel, SceneCard } from '@wadv/ui';
import { ProjectTabs } from '@/components/project-tabs';
import { getProjectDetail } from '@/lib/projects';
import { requireUser } from '@/lib/auth';

export default async function ScenesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const user = await requireUser();
  const project = await getProjectDetail(projectId, user.id);
  const scenes = project.episodes.flatMap((episode) => episode.scenes);

  return (
    <div className="space-y-6">
      <ProjectTabs projectId={projectId} active="scenes" />
      <GlassPanel className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">Scene cards</h2>
          <button className="rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white">Generate scenes</button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {scenes.map((scene) => (
            <Link key={scene.id} href={`/app/projects/${projectId}/scenes/${scene.id}`}>
              <SceneCard title={scene.title} excerpt={scene.scriptText} status={scene.status} shotCount={scene.shots.length} duration={scene.durationTargetSeconds} />
            </Link>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
