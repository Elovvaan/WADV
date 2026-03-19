import { CharacterCard, GlassPanel, Pill } from '@wadv/ui';
import { ProjectTabs } from '@/components/project-tabs';
import { getProjectDetail } from '@/lib/projects';
import { requireUser } from '@/lib/auth';

export default async function CharactersPage({ params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params;
  const user = await requireUser();
  const project = await getProjectDetail(projectId, user.id);

  return (
    <div className="space-y-6">
      <ProjectTabs projectId={projectId} active="characters" />
      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <GlassPanel className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-white">Character roster</h2>
            <button className="rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white">Create character</button>
          </div>
          <div className="grid gap-4">
            {project.characters.map((character) => (
              <CharacterCard key={character.id} name={character.name} role={character.role} mode={character.realismMode} style={character.stylePreset} />
            ))}
          </div>
        </GlassPanel>
        <GlassPanel className="space-y-4">
          <h2 className="text-xl font-semibold text-white">Character Bible</h2>
          <div className="space-y-4">
            {project.characters.map((character) => (
              <div key={character.id} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-300">
                <div className="flex flex-wrap gap-2">
                  <Pill>{character.name}</Pill>
                  <Pill className="border-violet-300/20 bg-violet-300/10">{character.realismMode}</Pill>
                  <Pill className="border-cyan-300/20 bg-cyan-300/10">{character.stylePreset}</Pill>
                </div>
                <pre className="mt-3 whitespace-pre-wrap font-sans text-sm text-slate-300">{JSON.stringify(character.bibleJson, null, 2)}</pre>
              </div>
            ))}
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <select className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white">
              <option>Strict style preservation</option>
              <option>Balanced style preservation</option>
              <option>Adaptive style preservation</option>
            </select>
            <select className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white">
              <option>Stylized</option>
              <option>Hybrid</option>
              <option>Human-like</option>
              <option>Cinematic</option>
            </select>
          </div>
        </GlassPanel>
      </section>
    </div>
  );
}
