import type { PlayerProfile } from '@/types/game';

interface Props {
  profile: PlayerProfile;
  best: number;
  onReset: () => void;
}

function Cell({ label, value }: { label: string; value: string | number }) {
  return (
    <div
      className="rounded-xl border px-3 py-2.5"
      style={{ borderColor: 'var(--panel-border)', background: 'rgba(255,255,255,0.03)' }}
    >
      <p className="text-[0.55rem] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
        {label}
      </p>
      <p className="text-lg font-black tabular-nums">{value}</p>
    </div>
  );
}

export default function StatsPanel({ profile, best, onReset }: Props) {
  const winRate =
    profile.gamesPlayed > 0 ? Math.round((profile.wins / profile.gamesPlayed) * 100) : 0;

  return (
    <div
      className="rounded-2xl border p-4"
      style={{ borderColor: 'var(--panel-border)', background: 'var(--panel)' }}
    >
      <h2 className="mb-3 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[var(--muted)]">
        Career
      </h2>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <Cell label="Best score" value={best.toLocaleString()} />
        <Cell label="Games played" value={profile.gamesPlayed} />
        <Cell label="Wins" value={`${profile.wins} (${winRate}%)`} />
        <Cell label="Highest tile" value={profile.highestTileEver || '—'} />
        <Cell label="Total merges" value={profile.totalMerges.toLocaleString()} />
        <Cell label="Daily streak" value={`${profile.currentStreak} / ${profile.longestStreak}`} />
        <Cell label="Best classic" value={profile.bestScore.classic.toLocaleString()} />
        <Cell label="Best blitz" value={profile.bestScore.blitz.toLocaleString()} />
        <Cell label="Best daily" value={profile.bestScore.daily.toLocaleString()} />
      </div>

      <button
        type="button"
        onClick={() => {
          if (window.confirm('Erase all scores, badges and streaks? This cannot be undone.')) {
            onReset();
          }
        }}
        className="mt-4 rounded-xl border px-3 py-2 text-[0.6rem] font-bold uppercase tracking-[0.15em] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        style={{ borderColor: 'var(--panel-border)', color: 'var(--accent-2)' }}
      >
        Reset all data
      </button>
    </div>
  );
}
