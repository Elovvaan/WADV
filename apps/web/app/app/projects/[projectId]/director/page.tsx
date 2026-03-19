import { DirectorReportPanel, GlassPanel, Pill } from '@wadv/ui';
import { ProjectTabs } from '@/components/project-tabs';
import { getProjectDetail } from '@/lib/projects';
import { requireUser } from '@/lib/auth';

export default async function DirectorPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const user = await requireUser();
  const project = await getProjectDetail(projectId, user.id);
  const report = project.directorReports[0]?.reportJson as any;

  return (
    <div className="space-y-6">
      <ProjectTabs projectId={projectId} active="director" />
      {report ? <DirectorReportPanel summary={report.projectSummary} actions={report.nextBestActions} warnings={report.continuityWarnings} /> : null}
      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <GlassPanel className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <button className="rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white">Improve project</button>
            <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">Generate scene plan</button>
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-semibold text-white">Tone & style recommendations</h2>
            <p className="text-sm text-slate-300">{report?.visualStylePlan?.lighting}</p>
            <div className="flex flex-wrap gap-2">
              {report?.visualStylePlan?.palette?.map((color: string) => <Pill key={color}>{color}</Pill>)}
            </div>
          </div>
        </GlassPanel>
        <GlassPanel className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Camera & performance notes</h2>
          <ul className="space-y-2 text-sm text-slate-300">
            {report?.cameraStylePlan?.movementStyle?.map((note: string) => <li key={note}>• {note}</li>)}
          </ul>
          <ul className="space-y-2 text-sm text-slate-300">
            {report?.voiceSuggestions?.map((note: string) => <li key={note}>• {note}</li>)}
          </ul>
        </GlassPanel>
      </section>
      <GlassPanel className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Scene-by-scene notes</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {report?.scenePlans?.map((scene: any) => (
            <div key={scene.title} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
              <p className="text-lg font-semibold text-white">{scene.title}</p>
              <p className="mt-2">Emotional beat: {scene.emotionalBeat}</p>
              <p className="mt-2">Camera: {scene.cameraNotes.join(' · ')}</p>
              <p className="mt-2">Continuity: {scene.continuityNotes.join(' · ')}</p>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}
