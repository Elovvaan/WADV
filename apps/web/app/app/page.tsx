import Link from 'next/link';
import { ProjectService } from '@wadv/lib';
import { AppShell } from '@/components/app-shell';
import { FeatureCard, JobProgressIndicator, ProjectCard, StatCard } from '@wadv/ui';
import { requireUser } from '@/lib/auth';
import { Clapperboard, Mic2, Sparkles } from 'lucide-react';

export default async function DashboardPage() {
  const user = await requireUser();
  const dashboard = await new ProjectService().getDashboard(user.id);

  return (
    <AppShell title="Dashboard" subtitle="Manage creator-first anime productions, monitor async jobs, and jump back into scene-level iteration." user={user}>
      <section className="grid gap-4 md:grid-cols-3">
        <StatCard label="Active projects" value={String(dashboard.stats.activeProjects)} detail="Projects currently in planning, generation, or review." />
        <StatCard label="Scenes planned" value={String(dashboard.stats.scenesPlanned)} detail="Draft scenes extracted from scripts and director plans." />
        <StatCard label="Exports ready" value={String(dashboard.stats.exportReady)} detail="Draft previews or final renders available for delivery." />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Recent projects</h2>
            <Link href="/app/projects/new" className="text-sm text-blue-200">Create project</Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {dashboard.projects.map((project) => (
              <ProjectCard
                key={project.id}
                href={`/app/projects/${project.id}`}
                title={project.title}
                description={project.description}
                meta={[project.genre, project.formatType, `${project.episodes[0]?.scenes.length ?? 0} scenes`]}
              />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <FeatureCard icon={<Clapperboard className="h-6 w-6" />} title="Quick start" description="Create a project and choose whether to lead with story, acting, art, or voice." />
          <FeatureCard icon={<Mic2 className="h-6 w-6" />} title="Voice memory" description="Assign voice profiles to characters and preserve delivery continuity across scenes." />
          <FeatureCard icon={<Sparkles className="h-6 w-6" />} title="Async pipeline" description="Queue-heavy tasks for scene generation, shot regeneration, voice processing, and exports." />
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {dashboard.jobs.map((job, index) => (
          <JobProgressIndicator key={job.id} label={`${index + 1}. ${job.jobType.replaceAll('_', ' ')}`} progress={[22, 58, 74, 91][index] ?? 40} />
        ))}
      </section>
    </AppShell>
  );
}
