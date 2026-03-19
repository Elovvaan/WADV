import Link from 'next/link';
import { GlassPanel, Pill } from '@wadv/ui';

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-hero-grid px-6 py-12">
      <GlassPanel className="w-full max-w-lg space-y-6">
        <div className="space-y-3">
          <Pill>Welcome back</Pill>
          <h1 className="text-3xl font-semibold text-white">Sign in to WADV</h1>
          <p className="text-sm text-slate-300">Use the seeded demo account or create a new creator workspace.</p>
        </div>
        <form action="/api/auth/sign-in" method="post" className="space-y-4">
          <input name="email" type="email" required defaultValue="demo@wadv.ai" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" placeholder="Email" />
          <input name="password" type="password" required defaultValue="demo1234" className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white" placeholder="Password" />
          <button className="w-full rounded-2xl bg-gradient-to-r from-blue-500 to-violet-500 px-5 py-3 text-sm font-semibold text-white">Sign in</button>
        </form>
        <p className="text-sm text-slate-400">New creator? <Link href="/auth/sign-up" className="text-blue-200">Create an account</Link></p>
      </GlassPanel>
    </div>
  );
}
