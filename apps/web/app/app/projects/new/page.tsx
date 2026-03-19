import { AppShell } from '@/components/app-shell';
import { ProjectCreateForm } from '@/components/forms';
import { requireUser } from '@/lib/auth';
import { FeatureCard } from '@wadv/ui';
import { Clapperboard, Mic2, PencilRuler, ScanFace } from 'lucide-react';

export default async function NewProjectPage() {
  const user = await requireUser();

  return (
    <AppShell title="Create a new project" subtitle="Choose your entry path, define the production target, and let WADV converge every creator input into one scene-based pipeline." user={user}>
      <section className="grid gap-4 lg:grid-cols-4">
        <FeatureCard icon={<Clapperboard className="h-6 w-6" />} title="Write it" description="Start from a book scene, chapter, script, or loose idea." />
        <FeatureCard icon={<ScanFace className="h-6 w-6" />} title="Act it" description="Upload live-action performances for motion-aware anime scene planning." />
        <FeatureCard icon={<PencilRuler className="h-6 w-6" />} title="Draw it" description="Bring your own art, sheets, and style constraints into the project memory." />
        <FeatureCard icon={<Mic2 className="h-6 w-6" />} title="Voice it" description="Record or upload voice samples and map them to characters." />
      </section>
      <ProjectCreateForm />
    </AppShell>
  );
}
