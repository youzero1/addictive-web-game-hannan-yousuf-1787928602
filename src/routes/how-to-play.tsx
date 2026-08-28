import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/how-to-play')({
  component: HowToPlayPage,
});

function HowToPlayPage() {
  return (
    <div className="py-6">
      <h1 className="mb-4 text-2xl font-black uppercase tracking-[0.2em]">How to play</h1>
      {/* Full rules placeholder */}
      <div className="space-y-3">
        <div className="h-24 rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-5">
          <div className="mb-3 h-3 w-32 rounded bg-white/15" />
          <div className="h-3 w-2/3 rounded bg-white/10" />
        </div>
        <div className="h-24 rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-5">
          <div className="mb-3 h-3 w-28 rounded bg-white/15" />
          <div className="h-3 w-1/2 rounded bg-white/10" />
        </div>
      </div>
    </div>
  );
}
