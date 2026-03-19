import { GlassPanel } from '@wadv/ui';
import { TimelineEditor } from '@/components/timeline-editor';
import { ProjectTabs } from '@/components/project-tabs';
import { getProjectDetail } from '@/lib/projects';
import { requireUser } from '@/lib/auth';

export default async function EditorPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const user = await requireUser();
  const project = await getProjectDetail(projectId, user.id);
  const scenes = project.episodes.flatMap((episode) => episode.scenes).map((scene) => ({
    id: scene.id,
    title: scene.title,
    status: scene.status,
    directorNotes: scene.directorNotes,
    scriptText: scene.scriptText,
    shots: scene.shots.map((shot) => ({ id: shot.id, title: shot.shotType, duration: shot.durationSeconds, promptText: shot.promptText })),
  }));

  return (
    <div className="space-y-6">
      <ProjectTabs projectId={projectId} active="editor" />
      <GlassPanel className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Timeline editor</h2>
        <p className="text-sm text-slate-300">Inspect scenes in order, review shots, swap voice assignments, and selectively regenerate only what needs improvement.</p>
      </GlassPanel>
      <TimelineEditor scenes={scenes} />
    </div>
  );
}
