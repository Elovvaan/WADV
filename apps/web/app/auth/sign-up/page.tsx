import Link from 'next/link';
import { GlassPanel, Pill } from '@wadv/ui';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-grid px-6 py-12">
      <GlassPanel className="w-full max-w-lg space-y-6">
        <div className="space-y-3">
          <Pill>Create your studio</Pill>
          <h1 className="text-3xl font-semibold text-white">Sign up for WADV</h1>
          <p className="text-sm text-slate-300">Create a creator-first anime workspace with mock providers and a seeded production architecture.</p>
        </div>
        <form action="/api/auth/sign-up" method="post" className="space-y-4">
          <input name="name" required defaultValue="New Creator" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" placeholder="Name" />
          <input name="email" type="email" required className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" placeholder="Email" />
          <input name="password" type="password" required className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" placeholder="Password" />
          <button className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white">Create account</button>
        </form>
        <p className="text-sm text-slate-400">Already have an account? <Link href="/auth/sign-in" className="text-blue-200">Sign in</Link></p>
      </GlassPanel>
    </div>
  );
}
