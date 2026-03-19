import { GlassPanel, Pill, StatusBadge } from '@wadv/ui';
import { ProjectTabs } from '@/components/project-tabs';
import { getProjectDetail } from '@/lib/projects';
import { requireUser } from '@/lib/auth';

export default async function SceneDetailPage({ params }: { params: Promise<{ projectId: string; sceneId: string }> }) {
  const { projectId, sceneId } = await params;
  const user = await requireUser();
  const project = await getProjectDetail(projectId, user.id);
  const scene = project.episodes.flatMap((episode) => episode.scenes).find((entry) => entry.id === sceneId);
  if (!scene) return null;

  return (
    <div className="space-y-6">
      <ProjectTabs projectId={projectId} active="scenes" />
      <GlassPanel className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-slate-400">Scene detail</p>
            <h1 className="text-3xl font-semibold text-white">{scene.title}</h1>
          </div>
          <StatusBadge status={scene.status} />
        </div>
        <p className="text-sm leading-6 text-slate-300">{scene.scriptText}</p>
        <div className="flex flex-wrap gap-3">
          <button className="rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white">Generate scene</button>
          <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">Regenerate scene</button>
          <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">Regenerate selected shot</button>
        </div>
      </GlassPanel>
      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <GlassPanel className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Shot list</h2>
          <div className="space-y-3">
            {scene.shots.map((shot) => (
              <div key={shot.id} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-white">{shot.shotType}</p>
                  <StatusBadge status={shot.status} />
                </div>
                <p className="mt-2">Camera: {shot.cameraDirection}</p>
                <p className="mt-2">Prompt: {shot.promptText}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
        <GlassPanel className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Attachments</h2>
          <div className="flex flex-wrap gap-2">
            {project.characters.map((character) => <Pill key={character.id}>{character.name}</Pill>)}
            {project.artAssets.map((asset) => <Pill key={asset.id}>{asset.stylePreservationMode}</Pill>)}
            {project.liveActionAssets.map((asset) => <Pill key={asset.id}>{asset.status}</Pill>)}
          </div>
          <p className="text-sm text-slate-300">Attach character references, art references, motion references, and voice references to keep selective generation explainable and consistent.</p>
        </GlassPanel>
      </section>
    </div>
  );
}
