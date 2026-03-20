import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { getFirstProjectForDirector } from '@/lib/projects';
import { GlassPanel, SectionHeading, StatusBadge } from '@wadv/ui';

export const dynamic = 'force-dynamic';

export default async function ScenesIndexPage() {
  const project = await getFirstProjectForDirector().catch(() => null);
  const user = project?.user ?? { name: 'Demo Director', plan: 'STUDIO', creditsBalance: 4200 };
  const scenes = project?.episodes.flatMap((episode) => episode.scenes) ?? [];

  return (
    <AppShell title="Scene Completion Loop" subtitle="Inspect each scene, run tests, execute safe fixes, and iterate until the scene is ready or needs human review." user={user}>
      <GlassPanel className="space-y-4">
        <SectionHeading eyebrow="Scene loops" title="All tracked scenes" description="Each scene now owns attempt history, quality tracking, test results, and a run-loop entry point." />
        <div className="grid gap-4 lg:grid-cols-2">
          {scenes.map((scene) => (
            <Link key={scene.id} href={`/scenes/${scene.id}`} className="rounded-3xl border border-white/10 bg-black/20 p-5 transition hover:border-blue-300/40 hover:bg-black/30">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-white">{scene.title}</p>
                  <p className="mt-1 text-sm text-slate-300">Quality {scene.qualityScore ?? 0} · Preview {scene.generatedPreviewUrl ? 'ready' : 'missing'}</p>
                </div>
                <StatusBadge status={scene.status} />
              </div>
            </Link>
          ))}
        </div>
      </GlassPanel>
    </AppShell>
  );
}
