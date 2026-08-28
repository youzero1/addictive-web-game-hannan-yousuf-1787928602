import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: HomePage,
});

function HomePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
      <div className="rounded-2xl border border-cyan-400/30 px-8 py-6 text-center">
        <p className="text-sm tracking-[0.3em] text-cyan-300">NEON 2048</p>
      </div>
    </div>
  );
}
