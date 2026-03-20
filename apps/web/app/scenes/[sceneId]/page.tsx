import { AppShell } from '@/components/app-shell';
import { getSceneLoopDetail } from '@/lib/projects';
import { GlassPanel, Pill, SectionHeading, StatusBadge } from '@wadv/ui';

export const dynamic = 'force-dynamic';

export default async function SceneLoopPage({ params }: { params: Promise<{ sceneId: string }> }) {
  const { sceneId } = await params;
  const scene = await getSceneLoopDetail(sceneId).catch(() => null);
  const user = scene?.episode.project ? { name: 'Studio Operator', plan: 'STUDIO', creditsBalance: 4200 } : { name: 'Studio Operator', plan: 'STUDIO', creditsBalance: 4200 };
  const testResults = ((scene?.latestTestResultsJson as {
    results?: Array<{ name: string; pass: boolean; reason: string }>;
    threshold?: number;
  } | null) ?? { results: [] }).results ?? [];

  return (
    <AppShell title={scene?.title ?? 'Scene loop'} subtitle="Persistent scene-level evaluation with tests, quality scoring, attempt history, and remediation workflow." user={user}>
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <GlassPanel className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Pill>Scene Status</Pill>
              <h2 className="mt-3 text-2xl font-semibold text-white">{scene?.title ?? 'Unknown scene'}</h2>
              <p className="mt-2 text-sm text-slate-300">Run Scene Loop re-inspects the scene, executes safe tasks, increments attempts, re-tests, and stops when all checks pass or the max attempt threshold is reached.</p>
            </div>
            <StatusBadge status={scene?.status ?? 'Unavailable'} />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              ['Quality Score', String(scene?.qualityScore ?? 0)],
              ['Attempt Count', String(scene?.attempts.length ?? 0)],
              ['Preview', scene?.generatedPreviewUrl ? 'Ready' : 'Missing'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
          <button className="inline-flex rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white">Run Scene Loop</button>
        </GlassPanel>

        <GlassPanel className="space-y-4">
          <SectionHeading eyebrow="Assignments" title="Readiness checklist" description="Scene readiness requires location, storyboard, shot plan, voice, character coverage, preview output, and acceptable quality." />
          <div className="space-y-3 text-sm text-slate-300">
            <p>Location: <span className="text-white">{scene?.location?.name ?? 'Missing'}</span></p>
            <p>Storyboard: <span className="text-white">{scene?.storyboardJson ? 'Present' : 'Missing'}</span></p>
            <p>Shot plan: <span className="text-white">{scene?.shotPlanJson ? 'Present' : 'Missing'}</span></p>
            <p>Preview render: <span className="text-white">{scene?.generatedPreviewUrl ? 'Present' : 'Missing'}</span></p>
          </div>
        </GlassPanel>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <GlassPanel className="space-y-4">
          <SectionHeading eyebrow="Test Results" title="Scene test panel" description="Every test returns pass/fail and an explanatory reason before the loop advances or stops." />
          <div className="space-y-3">
            {testResults.map((result) => (
              <div key={result.name} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{result.name}</p>
                  <StatusBadge status={result.pass ? 'PASS' : 'FAIL'} />
                </div>
                <p className="mt-2 text-sm text-slate-300">{result.reason}</p>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="space-y-4">
          <SectionHeading eyebrow="Attempt history" title="Improvement timeline" description="Quality scores and test payloads are persisted to SceneAttempt memory for longitudinal improvement tracking." />
          <div className="space-y-3">
            {(scene?.attempts ?? []).map((attempt) => (
              <div key={attempt.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">Attempt {attempt.attemptNumber}</p>
                  <StatusBadge status={`Score ${attempt.qualityScore}`} />
                </div>
                <p className="mt-2 text-sm text-slate-300">Captured at {new Date(attempt.createdAt).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <GlassPanel className="space-y-4">
          <SectionHeading eyebrow="Observations" title="Scene-level findings" description="Inspector output is stored separately from executor actions so reasoning and execution stay cleanly separated." />
          <div className="space-y-3">
            {(scene?.agentObservations ?? []).map((observation) => (
              <div key={observation.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{observation.category}</p>
                  <StatusBadge status={observation.severity} />
                </div>
                <p className="mt-2 text-sm text-slate-300">{observation.message}</p>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="space-y-4">
          <SectionHeading eyebrow="Task execution" title="Loop work queue" description="Remediation tasks are policy checked, executed with tools, and logged before the next test pass." />
          <div className="space-y-3">
            {(scene?.agentTasks ?? []).map((task) => (
              <div key={task.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{task.type}</p>
                    <p className="text-sm text-slate-300">Priority {task.priority.toLowerCase()}</p>
                  </div>
                  <StatusBadge status={task.status} />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      </section>
    </AppShell>
  );
}
