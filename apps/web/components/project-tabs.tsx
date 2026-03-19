import Link from 'next/link';
import { projectTabs } from '@wadv/config';
import { cn } from '@wadv/ui';

export function ProjectTabs({ projectId, active }: { projectId: string; active: string }) {
  return (
    <div className="flex flex-wrap gap-2">
      {projectTabs.map((tab) => (
        <Link
          key={tab.slug}
          href={tab.slug === 'overview' ? `/app/projects/${projectId}` : `/app/projects/${projectId}/${tab.slug}`}
          className={cn(
            'rounded-full border px-4 py-2 text-sm transition',
            active === tab.slug
              ? 'border-blue-300/40 bg-blue-400/10 text-white'
              : 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white',
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
