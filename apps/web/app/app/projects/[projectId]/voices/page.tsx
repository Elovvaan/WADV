import { AudioRecorderWidget, GlassPanel, VoiceProfileCard } from '@wadv/ui';
import { ProjectTabs } from '@/components/project-tabs';
import { getProjectDetail } from '@/lib/projects';
import { requireUser } from '@/lib/auth';

export default async function VoicesPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const user = await requireUser();
  const project = await getProjectDetail(projectId, user.id);
  const voices = project.characters.flatMap((character) => character.assignments.map((assignment) => ({
    id: assignment.id,
    title: assignment.voiceProfile.name,
    type: assignment.voiceProfile.sourceType,
    provider: assignment.voiceProfile.provider,
    assignedTo: character.name,
  })));

  return (
    <div className="space-y-6">
      <ProjectTabs projectId={projectId} active="voices" />
      <section className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <GlassPanel className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Voice capture</h2>
          <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white">Record in browser</button>
          <button className="rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-3 text-sm font-semibold text-white">Upload audio sample</button>
          <AudioRecorderWidget />
        </GlassPanel>
        <GlassPanel className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Voice profiles</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {voices.map((voice) => (
              <VoiceProfileCard key={voice.id} title={voice.title} type={voice.type} provider={voice.provider} assignedTo={voice.assignedTo} />
            ))}
          </div>
        </GlassPanel>
      </section>
    </div>
  );
}
