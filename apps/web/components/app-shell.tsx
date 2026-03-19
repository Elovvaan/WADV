import type { ReactNode } from 'react';
import Link from 'next/link';
import { navigation } from '@wadv/config';
import { BillingCard, GlassPanel, Pill, cn } from '@wadv/ui';
import { appConfig } from '@wadv/config';
import { Clapperboard, Sparkles, WandSparkles } from 'lucide-react';

export function AppShell({
  title,
  subtitle,
  children,
  user,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
  user: { name: string; plan: string; creditsBalance: number };
}) {
  return (
    <div className="min-h-screen bg-hero-grid">
      <div className="mx-auto grid min-h-screen max-w-7xl gap-6 px-6 py-6 lg:grid-cols-[280px_1fr]">
        <aside className="space-y-6">
          <GlassPanel className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-gradient-to-br from-blue-400/20 to-violet-400/20 p-3">
                <Clapperboard className="h-6 w-6 text-blue-100" />
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{appConfig.name}</p>
                <p className="text-sm text-slate-400">{appConfig.positioning}</p>
              </div>
            </div>
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link key={item.href} href={item.href} className="block rounded-2xl px-4 py-3 text-sm text-slate-200 transition hover:bg-white/5 hover:text-white">
                  {item.label}
                </Link>
              ))}
            </div>
          </GlassPanel>

          <BillingCard plan={user.plan} credits={user.creditsBalance} usage={1290} />

          <GlassPanel className="space-y-4">
            <Pill>Director pulse</Pill>
            <div className="flex items-start gap-3 text-sm text-slate-300">
              <WandSparkles className="mt-0.5 h-4 w-4 text-violet-200" />
              <p>Lock character identity before heavy scene renders to improve selective regeneration quality.</p>
            </div>
            <div className="flex items-start gap-3 text-sm text-slate-300">
              <Sparkles className="mt-0.5 h-4 w-4 text-cyan-200" />
              <p>Voice and motion assets are private by default and scoped per creator.</p>
            </div>
          </GlassPanel>
        </aside>

        <main className="space-y-6">
          <GlassPanel className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-blue-200/80">Creator studio</p>
              <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">{title}</h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">{subtitle}</p>
            </div>
            <div className={cn('rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-slate-300')}>
              Signed in as <span className="font-medium text-white">{user.name}</span>
            </div>
          </GlassPanel>
          {children}
        </main>
      </div>
    </div>
  );
}
