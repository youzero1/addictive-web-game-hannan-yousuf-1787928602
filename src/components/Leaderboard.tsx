import { useState } from 'react';
import type { GameMode, LeaderboardEntry } from '@/types/game';

const FILTERS: Array<{ id: GameMode | 'all'; label: string }> = [
  { id: 'all', label: 'All' },
  { id: 'classic', label: 'Classic' },
  { id: 'blitz', label: 'Blitz' },
  { id: 'daily', label: 'Daily' },
];

interface Props {
  entries: LeaderboardEntry[];
  currentScore: number;
  newBest: boolean;
}

function formatDate(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export default function Leaderboard({ entries, currentScore, newBest }: Props) {
  const [filter, setFilter] = useState<GameMode | 'all'>('all');
  const list = (filter === 'all' ? entries : entries.filter((e) => e.mode === filter))
    .slice()
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  return (
    <div
      className="rounded-2xl border p-4"
      style={{ borderColor: 'var(--panel-border)', background: 'var(--panel)' }}
    >
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-[0.65rem] font-black uppercase tracking-[0.2em] text-[var(--muted)]">
          Your top runs
        </h2>
      </div>

      <div className="mb-3 flex flex-wrap gap-1">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className="rounded-md px-2 py-1 text-[0.6rem] font-bold uppercase tracking-[0.12em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            style={
              filter === f.id
                ? { background: 'var(--accent)', color: '#04060f' }
                : { color: 'var(--muted)' }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <p className="py-6 text-center text-xs text-[var(--muted)]">
          No runs saved yet. Finish a game to land on the board.
        </p>
      ) : (
        <ol className="space-y-1.5">
          {list.map((e, i) => {
            const isCurrent = newBest && e.score === currentScore && i === 0;
            return (
              <li
                key={`${e.date}-${i}`}
                className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-xs"
                style={{
                  background: isCurrent
                    ? 'color-mix(in srgb, var(--accent) 18%, transparent)'
                    : 'rgba(255,255,255,0.03)',
                  boxShadow: isCurrent
                    ? '0 0 18px color-mix(in srgb, var(--accent) 25%, transparent)'
                    : undefined,
                }}
              >
                <span
                  className="w-4 text-center font-black"
                  style={{ color: i === 0 ? 'var(--accent)' : 'var(--muted)' }}
                >
                  {i + 1}
                </span>
                <span className="flex-1 font-black tabular-nums">{e.score.toLocaleString()}</span>
                <span className="text-[var(--muted)]">
                  {e.highestTile} · {e.size}×{e.size}
                </span>
                <span className="w-12 text-right text-[0.65rem] text-[var(--muted)]">
                  {formatDate(e.date)}
                </span>
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
