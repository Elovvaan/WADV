import Link from 'next/link';
import { DirectorReportPanel, ExportCard, GlassPanel, SceneCard, StatCard } from '@wadv/ui';
import { ProjectTabs } from '@/components/project-tabs';
import { getProjectDetail } from '@/lib/projects';
import { requireUser } from '@/lib/auth';

export default async function ProjectOverviewPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const user = await requireUser();
  const project = await getProjectDetail(projectId, user.id);
  const scenes = project.episodes.flatMap((episode) => episode.scenes);
  const latestReport = project.directorReports[0]?.reportJson as any;

  return (
    <div className="space-y-6">
      <ProjectTabs projectId={projectId} active="overview" />
      <section className="grid gap-4 md:grid-cols-4">
        <StatCard label="Episodes" value={String(project.episodes.length)} detail="Scene-based containers for planning and exports." />
        <StatCard label="Scenes" value={String(scenes.length)} detail="Each heavy action is scoped at the scene or shot level." />
        <StatCard label="Characters" value={String(project.characters.length)} detail="Artist-owned character memory with style preservation." />
        <StatCard label="Exports" value={String(project.exports.length)} detail="Draft previews and final render requests." />
      </section>
      {latestReport ? (
        <DirectorReportPanel summary={latestReport.projectSummary} actions={latestReport.nextBestActions} warnings={latestReport.continuityWarnings} />
      ) : null}
      <section className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <GlassPanel className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Scenes</h2>
            <Link href={`/app/projects/${projectId}/scenes`} className="text-sm text-blue-200">Open scenes</Link>
          </div>
          <div className="grid gap-4">
            {scenes.map((scene) => (
              <SceneCard key={scene.id} title={scene.title} excerpt={scene.scriptText} status={scene.status} shotCount={scene.shots.length} duration={scene.durationTargetSeconds} />
            ))}
          </div>
        </GlassPanel>
        <GlassPanel className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Recent exports</h2>
          <div className="space-y-4">
            {project.exports.map((item) => (
              <ExportCard key={item.id} title={item.format.replaceAll('_', ' ')} status={item.status} format={item.format} resolution={item.resolution} />
            ))}
          </div>
        </GlassPanel>
      </section>
    </div>
  );
}
