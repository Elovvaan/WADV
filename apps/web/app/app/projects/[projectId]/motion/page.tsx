import { AssetUploader, GlassPanel, JobProgressIndicator, StatusBadge } from '@wadv/ui';
import { ProjectTabs } from '@/components/project-tabs';
import { getProjectDetail } from '@/lib/projects';
import { requireUser } from '@/lib/auth';

export default async function MotionPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const user = await requireUser();
  const project = await getProjectDetail(projectId, user.id);

  return (
    <div className="space-y-6">
      <ProjectTabs projectId={projectId} active="motion" />
      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <GlassPanel className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Act it</h2>
          <p className="text-sm text-slate-300">Upload a live-action clip and turn creator performance into reusable motion metadata.</p>
          <AssetUploader title="Live-action uploader" description="Attach creator performance takes and reuse them across scene plans." accept="video/*" />
          <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">Process selected asset</button>
        </GlassPanel>
        <div className="space-y-4">
          {project.liveActionAssets.map((asset, index) => (
            <GlassPanel key={asset.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">Motion asset {index + 1}</h3>
                  <p className="text-sm text-slate-400">{asset.fileUrl}</p>
                </div>
                <StatusBadge status={asset.status} />
              </div>
              <JobProgressIndicator label="Pose and motion analysis" progress={[35, 88, 62][index] ?? 45} />
            </GlassPanel>
          ))}
        </div>
      </section>
    </div>
  );
}
