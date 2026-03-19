import Link from 'next/link';
import { appConfig } from '@wadv/config';
import { DirectorReportPanel, FeatureCard, GlassPanel, Pill, ProjectCard, SectionHeading } from '@wadv/ui';
import { Clapperboard, Mic2, PencilRuler, ScanFace, WandSparkles } from 'lucide-react';

const pillars = [
  {
    title: 'Write it',
    description: 'Turn ideas, chapters, or scripts into draft scenes, emotional beats, shot language, and editable production plans.',
    icon: <Clapperboard className="h-6 w-6" />,
  },
  {
    title: 'Act it',
    description: 'Upload performance takes and convert creator motion into anime-ready scene references instead of generic AI guesses.',
    icon: <ScanFace className="h-6 w-6" />,
  },
  {
    title: 'Draw it',
    description: 'Preserve your character sheets, expression boards, and art direction with adjustable style-locking controls.',
    icon: <PencilRuler className="h-6 w-6" />,
  },
  {
    title: 'Voice it',
    description: 'Record or upload voice, build profiles, assign them per character, and keep performance continuity scene by scene.',
    icon: <Mic2 className="h-6 w-6" />,
  },
];

export default function LandingPage() {
  return (
    <div className="overflow-hidden bg-hero-grid">
      <div className="mx-auto max-w-7xl px-6 py-8 sm:px-8 lg:px-10">
        <header className="flex items-center justify-between py-4">
          <div>
            <p className="text-lg font-semibold text-white">{appConfig.name}</p>
            <p className="text-sm text-slate-400">{appConfig.tagline}</p>
          </div>
          <div className="flex gap-3">
            <Link href="/auth/sign-in" className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-200">Sign in</Link>
            <Link href="/auth/sign-up" className="rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white">Get started</Link>
          </div>
        </header>

        <section className="grid gap-12 py-20 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-8">
            <Pill>Hybrid anime creation studio</Pill>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl">
                {appConfig.name}
                <span className="mt-3 block bg-gradient-to-r from-blue-200 via-violet-200 to-cyan-200 bg-clip-text text-3xl text-transparent sm:text-4xl">
                  {appConfig.tagline}
                </span>
              </h1>
              <p className="max-w-2xl text-lg text-slate-300">{appConfig.positioning}. WADV gives creators scene-by-scene control across story, live-action performance, artwork, and voice while the Director orchestrates continuity, shots, and selective regeneration.</p>
            </div>
            <div className="flex flex-wrap gap-4">
              <Link href="/auth/sign-up" className="rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-glow">Launch the studio</Link>
              <Link href="/auth/sign-in" className="rounded-full border border-white/10 px-6 py-3 text-sm text-slate-200">Open demo workspace</Link>
            </div>
          </div>

          <GlassPanel className="space-y-6">
            <DirectorReportPanel
              summary="Your cinematic AI production assistant that explains its recommendations instead of hiding behind one-click magic."
              actions={[
                'Extract characters and scenes from a chapter.',
                'Attach creator art and lock character identity.',
                'Generate storyboard passes before full scene video.',
              ]}
              warnings={[
                'Voice sample intensity mismatches the current script beat.',
                'Scene 3 needs a transition shot to preserve continuity.',
              ]}
            />
          </GlassPanel>
        </section>

        <section className="space-y-8 py-14">
          <SectionHeading eyebrow="Four pillars" title="Every input mode feeds one cinematic project system" description="WADV is built around creator participation. Story, art, acting, and voice all converge into a scene-based pipeline with identity consistency and selective regeneration at the scene or shot level." />
          <div className="grid gap-6 lg:grid-cols-4">
            {pillars.map((pillar) => (
              <FeatureCard key={pillar.title} {...pillar} />
            ))}
          </div>
        </section>

        <section className="grid gap-8 py-14 lg:grid-cols-[1fr_1.1fr]">
          <SectionHeading eyebrow="WADV Director" title="A cinematic planning layer, not a black box" description="The WADV Director reads your inputs and responds with project summaries, scene plans, continuity warnings, camera language, visual style plans, voice suggestions, and next-best actions." />
          <GlassPanel className="grid gap-4 md:grid-cols-2">
            {['Story analysis', 'Continuity suggestions', 'Shot recommendations', 'Performance notes', 'Visual style plan', 'Voice guidance'].map((item) => (
              <div key={item} className="rounded-2xl border border-white/10 bg-black/20 p-4 text-sm text-slate-200">{item}</div>
            ))}
          </GlassPanel>
        </section>

        <section className="space-y-8 py-14">
          <SectionHeading eyebrow="Creator workflow" title="Input -> Ingest -> Memory -> Director Plan -> Scene Generation -> Review -> Edit -> Export" description="Heavy operations happen at the scene and shot level so creators can iterate where they need to rather than regenerate an entire episode." />
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-7">
            {['Input', 'Ingest', 'Memory', 'Director Plan', 'Generation', 'Review / Edit', 'Export'].map((step, index) => (
              <GlassPanel key={step} className="space-y-2 p-4 text-center">
                <p className="text-xs uppercase tracking-[0.24em] text-blue-200/80">Step {index + 1}</p>
                <p className="text-sm font-medium text-white">{step}</p>
              </GlassPanel>
            ))}
          </div>
        </section>

        <section className="space-y-8 py-14">
          <SectionHeading eyebrow="Sample projects" title="Founder-ready demos out of the box" description="The seeded workspace includes cinematic demo projects with characters, voices, scenes, exports, and a Director report so the product feels alive immediately." />
          <div className="grid gap-6 lg:grid-cols-3">
            <ProjectCard title="Neon Memory Cathedral" description="Cyber-fantasy pilot with creator performance capture and a locked art bible." meta={['Episode', '4 scenes', 'Director plan ready']} />
            <ProjectCard title="Glass Tempest Duel" description="Action-forward short clip testing hybrid live-action motion transfer into anime shots." meta={['Short clip', 'Motion asset attached', '3 voice profiles']} />
            <ProjectCard title="Afterimage Letters" description="Quiet dramatic scene using hand-drawn character sheets and browser-recorded voice performances." meta={['Scene', 'Selective regenerate', 'Export preview']} />
          </div>
        </section>

        <section className="space-y-8 py-14">
          <SectionHeading eyebrow="Pricing" title="Premium enough for creators, clear enough for investors" description="Billing is scaffolded for Stripe integration with credits, creator plans, and studio expansion paths." />
          <div className="grid gap-6 lg:grid-cols-3">
            {[
              ['Starter', '$0', 'Explore the studio with mock generation and a limited credit wallet.'],
              ['Creator', '$39', 'Build scene-based anime projects with art, motion, and voice memory.'],
              ['Studio', '$149', 'Collaborate on episodes, exports, and higher-throughput production workflows.'],
            ].map(([title, price, description]) => (
              <GlassPanel key={title} className="space-y-4">
                <p className="text-xl font-semibold text-white">{title}</p>
                <p className="text-4xl font-semibold text-white">{price}<span className="text-sm text-slate-400">/mo</span></p>
                <p className="text-sm text-slate-300">{description}</p>
                <button className="w-full rounded-2xl bg-white/5 px-4 py-3 text-sm font-medium text-white">Choose {title}</button>
              </GlassPanel>
            ))}
          </div>
        </section>

        <section className="py-14">
          <GlassPanel className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
            <div className="space-y-2">
              <Pill>Ready to build</Pill>
              <h2 className="text-3xl font-semibold text-white">Write it. Act it. Draw it. Voice it.</h2>
              <p className="text-sm text-slate-300">Turn creator input into scene-by-scene anime production with a Director that shows its work.</p>
            </div>
            <Link href="/auth/sign-up" className="rounded-full bg-gradient-to-r from-blue-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white">Start WADV</Link>
          </GlassPanel>
        </section>
      </div>
    </div>
  );
}
