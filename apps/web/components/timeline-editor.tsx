'use client';

import { TimelineBlockRow, GlassPanel, JobProgressIndicator, StatusBadge } from '@wadv/ui';
import { useState } from 'react';

type EditorScene = {
  id: string;
  title: string;
  status: string;
  directorNotes?: string | null;
  scriptText: string;
  shots: Array<{ id: string; title: string; duration: number; promptText: string }>;
};

export function TimelineEditor({ scenes }: { scenes: EditorScene[] }) {
  const [activeSceneId, setActiveSceneId] = useState(scenes[0]?.id);
  const activeScene = scenes.find((scene) => scene.id === activeSceneId) ?? scenes[0];

  return (
    <div className="grid gap-6 xl:grid-cols-[1.5fr_0.9fr]">
      <div className="space-y-4">
        {scenes.map((scene, index) => (
          <button key={scene.id} className="w-full text-left" onClick={() => setActiveSceneId(scene.id)}>
            <TimelineBlockRow
              sceneTitle={`${index + 1}. ${scene.title}`}
              active={scene.id === activeSceneId}
              shots={scene.shots.map((shot, shotIndex) => ({ title: `Shot ${shotIndex + 1}`, duration: shot.duration }))}
            />
          </button>
        ))}
      </div>
      <GlassPanel className="space-y-5">
        {activeScene ? (
          <>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400">Inspector</p>
                <h3 className="text-2xl font-semibold text-white">{activeScene.title}</h3>
              </div>
              <StatusBadge status={activeScene.status} />
            </div>
            <JobProgressIndicator label="Scene generation readiness" progress={78} />
            <div>
              <p className="mb-2 text-sm font-medium text-white">Script excerpt</p>
              <p className="text-sm leading-6 text-slate-300">{activeScene.scriptText}</p>
            </div>
            <div>
              <p className="mb-2 text-sm font-medium text-white">Director notes</p>
              <p className="text-sm text-slate-300">{activeScene.directorNotes ?? 'Awaiting notes'}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">Regenerate scene</button>
              <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">Swap voice assignment</button>
              <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">Edit subtitles</button>
              <button className="rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white">Mark approved</button>
            </div>
          </>
        ) : (
          <p className="text-sm text-slate-400">Select a scene to inspect the timeline.</p>
        )}
      </GlassPanel>
    </div>
  );
}
