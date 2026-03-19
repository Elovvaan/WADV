import { Film, LoaderCircle, Mic2, Sparkles, WandSparkles } from 'lucide-react';
import { PropsWithChildren, ReactNode } from 'react';
import clsx from 'clsx';

export function cn(...values: Array<string | false | null | undefined>) {
  return clsx(values);
}

export function GlassPanel({ className, children }: PropsWithChildren<{ className?: string }>) {
  return (
    <div
      className={cn(
        'rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_80px_-40px_rgba(67,97,238,0.65)] backdrop-blur-xl',
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Pill({ children, className }: PropsWithChildren<{ className?: string }>) {
  return (
    <span className={cn('inline-flex items-center rounded-full border border-blue-400/30 bg-blue-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-blue-100', className)}>
      {children}
    </span>
  );
}

export function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="space-y-3">
      <Pill>{eyebrow}</Pill>
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
        <p className="max-w-3xl text-sm text-slate-300 sm:text-base">{description}</p>
      </div>
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const palette = status.toLowerCase().includes('ready') || status.toLowerCase().includes('approved')
    ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200'
    : status.toLowerCase().includes('fail')
      ? 'border-rose-400/30 bg-rose-400/10 text-rose-200'
      : 'border-blue-400/30 bg-blue-400/10 text-blue-100';

  return <span className={cn('inline-flex rounded-full border px-3 py-1 text-xs font-medium', palette)}>{status}</span>;
}

export function StatCard({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <GlassPanel className="space-y-2">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-3xl font-semibold text-white">{value}</p>
      <p className="text-sm text-slate-300">{detail}</p>
    </GlassPanel>
  );
}

export function ProjectCard({ title, description, meta, href }: { title: string; description: string; meta: string[]; href?: string }) {
  return (
    <a href={href ?? '#'} className="block transition duration-300 hover:-translate-y-1">
      <GlassPanel className="h-full space-y-4 transition duration-300 hover:border-violet-300/40">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <p className="mt-1 text-sm text-slate-300">{description}</p>
          </div>
          <Film className="h-6 w-6 text-blue-200" />
        </div>
        <div className="flex flex-wrap gap-2">
          {meta.map((item) => (
            <Pill key={item} className="border-white/10 bg-white/5 text-slate-200">
              {item}
            </Pill>
          ))}
        </div>
      </GlassPanel>
    </a>
  );
}

export function FeatureCard({ icon, title, description }: { icon: ReactNode; title: string; description: string }) {
  return (
    <GlassPanel className="space-y-4">
      <div className="inline-flex rounded-2xl bg-gradient-to-br from-blue-400/20 to-violet-400/20 p-3 text-blue-100">{icon}</div>
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-sm leading-6 text-slate-300">{description}</p>
      </div>
    </GlassPanel>
  );
}

export function SceneCard({ title, excerpt, status, shotCount, duration }: { title: string; excerpt: string; status: string; shotCount: number; duration: number }) {
  return (
    <GlassPanel className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-300">{excerpt}</p>
        </div>
        <StatusBadge status={status} />
      </div>
      <div className="flex gap-3 text-sm text-slate-400">
        <span>{shotCount} shots</span>
        <span>{duration}s target</span>
      </div>
    </GlassPanel>
  );
}

export function CharacterCard({ name, role, mode, style }: { name: string; role: string; mode: string; style: string }) {
  return (
    <GlassPanel className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{name}</h3>
          <p className="text-sm text-slate-400">{role}</p>
        </div>
        <Sparkles className="h-5 w-5 text-violet-200" />
      </div>
      <div className="flex gap-2 text-xs text-slate-300">
        <Pill className="border-violet-300/20 bg-violet-300/10">{mode}</Pill>
        <Pill className="border-cyan-300/20 bg-cyan-300/10">{style}</Pill>
      </div>
    </GlassPanel>
  );
}

export function VoiceProfileCard({ title, type, provider, assignedTo }: { title: string; type: string; provider: string; assignedTo?: string }) {
  return (
    <GlassPanel className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className="text-sm text-slate-400">{type}</p>
        </div>
        <Mic2 className="h-5 w-5 text-cyan-200" />
      </div>
      <div className="space-y-1 text-sm text-slate-300">
        <p>Provider: {provider}</p>
        <p>Assigned: {assignedTo ?? 'Unassigned'}</p>
      </div>
    </GlassPanel>
  );
}

export function AssetUploader({ title, description, accept }: { title: string; description: string; accept: string }) {
  return (
    <GlassPanel className="space-y-3">
      <h3 className="text-lg font-semibold text-white">{title}</h3>
      <p className="text-sm text-slate-300">{description}</p>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-black/20 p-8 text-center text-sm text-slate-400">
        <span>Drop or browse files</span>
        <span className="mt-2 text-xs uppercase tracking-[0.24em] text-blue-200/80">{accept}</span>
        <input className="hidden" type="file" accept={accept} />
      </label>
    </GlassPanel>
  );
}

export function AudioRecorderWidget() {
  return (
    <GlassPanel className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Audio recorder</h3>
      <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
        <div className="grid grid-cols-12 gap-2">
          {Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="rounded-full bg-gradient-to-t from-blue-500/70 to-violet-400/80"
              style={{ height: `${18 + (index % 6) * 10}px` }}
            />
          ))}
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">Start recording</button>
        <button className="rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white">Save take</button>
      </div>
    </GlassPanel>
  );
}

export function DirectorReportPanel({ summary, actions, warnings }: { summary: string; actions: string[]; warnings: string[] }) {
  return (
    <GlassPanel className="space-y-5">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 p-3">
          <WandSparkles className="h-6 w-6 text-blue-100" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">WADV Director</h3>
          <p className="text-sm text-slate-300">{summary}</p>
        </div>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="mb-2 text-sm font-medium text-white">Next best actions</p>
          <ul className="space-y-2 text-sm text-slate-300">
            {actions.map((action) => (
              <li key={action}>• {action}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="mb-2 text-sm font-medium text-white">Continuity warnings</p>
          <ul className="space-y-2 text-sm text-slate-300">
            {warnings.map((warning) => (
              <li key={warning}>• {warning}</li>
            ))}
          </ul>
        </div>
      </div>
    </GlassPanel>
  );
}

export function TimelineBlockRow({ sceneTitle, shots, active }: { sceneTitle: string; shots: Array<{ title: string; duration: number }>; active?: boolean }) {
  return (
    <GlassPanel className={cn('space-y-4', active && 'border-violet-300/40')}>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{sceneTitle}</h3>
        <StatusBadge status={active ? 'Selected' : 'Queued'} />
      </div>
      <div className="grid gap-2 md:grid-cols-4">
        {shots.map((shot) => (
          <div key={shot.title} className="rounded-2xl border border-white/10 bg-black/20 p-3 text-sm text-slate-200">
            <p className="font-medium text-white">{shot.title}</p>
            <p>{shot.duration}s</p>
          </div>
        ))}
      </div>
    </GlassPanel>
  );
}

export function ExportCard({ title, status, format, resolution }: { title: string; status: string; format: string; resolution: string }) {
  return (
    <GlassPanel className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <StatusBadge status={status} />
      </div>
      <p className="text-sm text-slate-300">{format} · {resolution}</p>
    </GlassPanel>
  );
}

export function BillingCard({ plan, credits, usage }: { plan: string; credits: number; usage: number }) {
  return (
    <GlassPanel className="space-y-3">
      <p className="text-sm text-slate-400">Billing & credits</p>
      <p className="text-2xl font-semibold text-white">{credits.toLocaleString()} credits</p>
      <p className="text-sm text-slate-300">{plan} plan · {usage.toLocaleString()} used this month</p>
    </GlassPanel>
  );
}

export function JobProgressIndicator({ label, progress }: { label: string; progress: number }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-slate-300">
        <span>{label}</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 rounded-full bg-white/10">
        <div className="h-2 rounded-full bg-gradient-to-r from-blue-400 to-violet-400" style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
}

export function LoadingCard({ label }: { label: string }) {
  return (
    <GlassPanel className="flex items-center gap-3 text-slate-200">
      <LoaderCircle className="h-5 w-5 animate-spin" />
      <span>{label}</span>
    </GlassPanel>
  );
}
