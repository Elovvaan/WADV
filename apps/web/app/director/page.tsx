import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { getFirstProjectForDirector } from '@/lib/projects';
import { GlassPanel, Pill, SectionHeading, StatusBadge } from '@wadv/ui';

export const dynamic = 'force-dynamic';

async function loadDirectorData() {
  try {
    return await getFirstProjectForDirector();
  } catch {
    return null;
  }
}

export default async function DirectorPage() {
  const project = await loadDirectorData();
  const scenes = project?.episodes.flatMap((episode) => episode.scenes) ?? [];
  const readyScenes = scenes.filter((scene) => scene.status === 'READY' || scene.status === 'APPROVED').length;
  const user = project?.user ?? { name: 'Demo Director', plan: 'STUDIO', creditsBalance: 4200 };

  return (
    <AppShell
      title="WADV Director"
      subtitle="Persistent agent operations for inspection, remediation, testing, scene completion loops, and autopilot-aware execution."
      user={user}
    >
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <GlassPanel className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <Pill>Studio Status</Pill>
              <h2 className="mt-3 text-2xl font-semibold text-white">{project?.title ?? 'No seeded project available'}</h2>
              <p className="mt-2 text-sm text-slate-300">The Director wakes up, inspects project memory, prioritizes tasks, validates policy, executes approved tools, runs tests, and loops scenes until they are ready or hit the attempt cap.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-black/20 px-5 py-4 text-right">
              <p className="text-xs uppercase tracking-[0.24em] text-blue-200/80">Autopilot Mode</p>
              <p className="mt-2 text-lg font-semibold text-white">safe_auto_fix</p>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {[
              ['Scenes Ready', `${readyScenes}/${Math.max(scenes.length, 1)}`],
              ['Observations', `${project?.agentObservations.length ?? 0}`],
              ['Queued Tasks', `${project?.agentTasks.filter((task) => task.status === 'PENDING' || task.status === 'RUNNING').length ?? 0}`],
              ['Exports Ready', `${project?.exports.filter((item) => item.status === 'READY').length ?? 0}`],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="space-y-4">
          <SectionHeading eyebrow="Policy" title="Autopilot mode selector" description="Modes govern whether the Director only suggests tasks, safely auto-fixes known-safe operations, or runs end-to-end studio autopilot." />
          <div className="grid gap-3">
            {[
              ['suggest_only', 'Creates recommendations only for human review.'],
              ['safe_auto_fix', 'Auto-runs storyboard, location, preview, and export-safe tasks.'],
              ['studio_autopilot', 'Executes the full validated task queue with loop retries.'],
            ].map(([mode, description]) => (
              <div key={mode} className={`rounded-2xl border px-4 py-4 ${mode === 'safe_auto_fix' ? 'border-blue-300/40 bg-blue-500/10' : 'border-white/10 bg-black/20'}`}>
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{mode}</p>
                  <StatusBadge status={mode === 'safe_auto_fix' ? 'Active' : 'Available'} />
                </div>
                <p className="mt-2 text-sm text-slate-300">{description}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <GlassPanel className="space-y-4">
          <SectionHeading eyebrow="Observations" title="Inspection feed" description="Structured observations are created at the project, scene, character, and location levels before prioritization runs." />
          <div className="space-y-3">
            {(project?.agentObservations ?? []).slice(0, 8).map((observation) => (
              <div key={observation.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{observation.message}</p>
                  <StatusBadge status={observation.severity} />
                </div>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-400">{observation.category}</p>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="space-y-4">
          <SectionHeading eyebrow="Actions taken" title="Tool execution ledger" description="Every tool invocation logs an AgentAction record with validated input and structured output." />
          <div className="space-y-3">
            {(project?.agentActions ?? []).slice(0, 8).map((action) => (
              <div key={action.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{action.toolName}</p>
                  <StatusBadge status={action.status} />
                </div>
                <p className="mt-2 text-sm text-slate-300">{action.sceneId ? `Scene-scoped action on ${action.sceneId}.` : 'Project-scoped action.'}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <GlassPanel className="space-y-4">
          <SectionHeading eyebrow="Recommended actions" title="Priority queue" description="Observation-to-task prioritization converts failures and gaps into executable work with criticality levels." />
          <div className="space-y-3">
            {(project?.agentTasks ?? []).slice(0, 10).map((task) => (
              <div key={task.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-white">{task.type}</p>
                    <p className="text-sm text-slate-300">Priority: {task.priority.toLowerCase()}</p>
                  </div>
                  <StatusBadge status={task.status} />
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>

        <GlassPanel className="space-y-4">
          <SectionHeading eyebrow="Activity" title="Agent activity feed" description="Runs, notifications, and improvement signals remain visible so creators can trust the automation loop." />
          <div className="space-y-3">
            {(project?.agentRuns ?? []).slice(0, 5).map((run) => (
              <div key={run.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{run.agentName}</p>
                  <StatusBadge status={run.status} />
                </div>
                <p className="mt-2 text-sm text-slate-300">Trigger: {run.triggerType.toLowerCase()} · {run.summary ?? 'Cycle started.'}</p>
              </div>
            ))}
            {(project?.notifications ?? []).slice(0, 5).map((notification) => (
              <div key={notification.id} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                <p className="font-medium text-white">{notification.title}</p>
                <p className="mt-2 text-sm text-slate-300">{notification.body}</p>
              </div>
            ))}
          </div>
        </GlassPanel>
      </section>

      <section className="space-y-4">
        <SectionHeading eyebrow="Scene loops" title="Loop into a scene" description="Each scene now exposes test results, quality score, attempt history, and a direct loop entry point." />
        <div className="grid gap-4 lg:grid-cols-2">
          {scenes.map((scene) => (
            <Link key={scene.id} href={`/scenes/${scene.id}`} className="block rounded-3xl border border-white/10 bg-white/5 p-5 transition hover:border-blue-300/40 hover:bg-white/[0.07]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-white">{scene.title}</p>
                  <p className="mt-1 text-sm text-slate-300">Quality {scene.qualityScore ?? 0} · Attempts {scene.attempts.length}</p>
                </div>
                <StatusBadge status={scene.status} />
              </div>
            </Link>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
