import { demoStory } from '@wadv/lib';
import { CharacterCard, GlassPanel, SceneCard } from '@wadv/ui';
import { StoryIngestForm } from '@/components/forms';
import { ProjectTabs } from '@/components/project-tabs';
import { getProjectDetail } from '@/lib/projects';
import { requireUser } from '@/lib/auth';

export default async function StoryPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const user = await requireUser();
  const project = await getProjectDetail(projectId, user.id);
  const scenes = project.episodes.flatMap((episode) => episode.scenes);

  return (
    <div className="space-y-6">
      <ProjectTabs projectId={projectId} active="story" />
      <StoryIngestForm projectId={projectId} defaultText={demoStory} />
      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <GlassPanel className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Extracted scenes</h2>
          <div className="grid gap-4">
            {scenes.map((scene) => (
              <SceneCard key={scene.id} title={scene.title} excerpt={scene.directorNotes ?? scene.scriptText} status={scene.status} shotCount={scene.shots.length} duration={scene.durationTargetSeconds} />
            ))}
          </div>
        </GlassPanel>
        <GlassPanel className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Extracted characters</h2>
          <div className="grid gap-4">
            {project.characters.map((character) => (
              <CharacterCard key={character.id} name={character.name} role={character.role} mode={character.realismMode} style={character.stylePreset} />
            ))}
          </div>
        </GlassPanel>
      </section>
    </div>
  );
}
