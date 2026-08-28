import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/stats')({
  component: StatsPage,
});

function StatsPage() {
  return (
    <div className="py-6">
      <h1 className="mb-4 text-2xl font-black uppercase tracking-[0.2em]">Stats</h1>
      {/* StatsPanel + AchievementGrid placeholder */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="h-40 rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-5">
          <div className="mb-3 h-3 w-24 rounded bg-white/15" />
          <div className="mb-2 h-6 w-16 rounded bg-white/25" />
          <div className="h-3 w-3/4 rounded bg-white/10" />
        </div>
        <div className="h-40 rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-5">
          <div className="mb-3 h-3 w-28 rounded bg-white/15" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-14 rounded-xl bg-white/10" />
            <div className="h-14 rounded-xl bg-white/10" />
            <div className="h-14 rounded-xl bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
