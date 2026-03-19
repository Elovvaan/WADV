'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ingestScriptSchema, projectSchema } from '@wadv/lib';
import { toast } from 'sonner';
import { z } from 'zod';
import { GlassPanel } from '@wadv/ui';

const inputStyles = 'w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-400/40 focus:outline-none';

export function ProjectCreateForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: 'Neon Memory Cathedral',
      description: 'A creator-led anime pilot blending rooftop performance capture, hand-drawn character art, and voiceprint drama.',
      formatType: 'EPISODE',
      genre: 'Cyber-fantasy drama',
      targetDuration: 480,
    },
  });

  return (
    <GlassPanel>
      <form
        className="grid gap-4 md:grid-cols-2"
        onSubmit={form.handleSubmit(async (values) => {
          const response = await fetch('/api/projects', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          });
          if (!response.ok) {
            toast.error('Could not create project');
            return;
          }
          const data = await response.json();
          toast.success('Project created');
          router.push(`/app/projects/${data.project.id}`);
          router.refresh();
        })}
      >
        <label className="space-y-2 text-sm text-slate-300">
          <span>Project title</span>
          <input className={inputStyles} {...form.register('title')} />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>Format</span>
          <select className={inputStyles} {...form.register('formatType')}>
            <option value="SHORT_CLIP">Short clip</option>
            <option value="SCENE">Scene</option>
            <option value="EPISODE">Episode</option>
          </select>
        </label>
        <label className="space-y-2 text-sm text-slate-300 md:col-span-2">
          <span>Description</span>
          <textarea rows={5} className={inputStyles} {...form.register('description')} />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>Genre</span>
          <input className={inputStyles} {...form.register('genre')} />
        </label>
        <label className="space-y-2 text-sm text-slate-300">
          <span>Target duration (seconds)</span>
          <input type="number" className={inputStyles} {...form.register('targetDuration', { valueAsNumber: true })} />
        </label>
        <button className="rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white md:col-span-2">
          Create WADV project
        </button>
      </form>
    </GlassPanel>
  );
}

export function StoryIngestForm({ projectId, defaultText }: { projectId: string; defaultText: string }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof ingestScriptSchema>>({
    resolver: zodResolver(ingestScriptSchema),
    defaultValues: { input: defaultText, inputType: 'story' },
  });

  return (
    <GlassPanel>
      <form
        className="space-y-4"
        onSubmit={form.handleSubmit(async (values) => {
          const response = await fetch(`/api/projects/${projectId}/ingest-script`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          });
          if (!response.ok) {
            toast.error('Could not analyze story');
            return;
          }
          toast.success('Story ingested');
          router.refresh();
        })}
      >
        <div className="flex flex-wrap gap-3">
          <select className={inputStyles} {...form.register('inputType')}>
            <option value="story">Story</option>
            <option value="scene">Scene</option>
            <option value="script">Script</option>
            <option value="chapter">Chapter</option>
            <option value="idea">Idea</option>
          </select>
          <button className="rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white">
            Analyze and draft scenes
          </button>
        </div>
        <textarea rows={12} className={inputStyles} {...form.register('input')} />
      </form>
    </GlassPanel>
  );
}
