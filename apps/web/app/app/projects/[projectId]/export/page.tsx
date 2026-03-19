import { ExportCard, GlassPanel } from '@wadv/ui';
import { ProjectTabs } from '@/components/project-tabs';
import { getProjectDetail } from '@/lib/projects';
import { requireUser } from '@/lib/auth';

export default async function ExportPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const user = await requireUser();
  const project = await getProjectDetail(projectId, user.id);

  return (
    <div className="space-y-6">
      <ProjectTabs projectId={projectId} active="export" />
      <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <GlassPanel className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Export settings</h2>
          <select className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white">
            <option>Draft preview · 1080p</option>
            <option>Final video · 1440p</option>
            <option>Final video · 4K</option>
          </select>
          <button className="rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white">Request render</button>
        </GlassPanel>
        <GlassPanel className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Past exports</h2>
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
