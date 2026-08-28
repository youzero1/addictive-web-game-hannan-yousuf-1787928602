import type { FloatingScore } from '@/hooks/useGame';

interface Props {
  score: number;
  best: number;
  combo: number;
  floats: FloatingScore[];
  timeLeft: number | null;
  canUndo: boolean;
  newBest: boolean;
  onNewGame: () => void;
  onUndo: () => void;
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function Stat({
  label,
  children,
  glow,
}: {
  label: string;
  children: React.ReactNode;
  glow?: boolean;
}) {
  return (
    <div
      className="relative flex-1 overflow-visible rounded-2xl border px-4 py-3"
      style={{
        borderColor: glow ? 'var(--accent)' : 'var(--panel-border)',
        background: 'var(--panel)',
        boxShadow: glow ? '0 0 24px color-mix(in srgb, var(--accent) 30%, transparent)' : undefined,
      }}
    >
      <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
        {label}
      </p>
      <p className="text-xl font-black tabular-nums sm:text-2xl">{children}</p>
    </div>
  );
}

export default function ScorePanel({
  score,
  best,
  combo,
  floats,
  timeLeft,
  canUndo,
  newBest,
  onNewGame,
  onUndo,
}: Props) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-stretch gap-2 sm:gap-3">
        <div className="relative flex-1">
          <Stat label="Score">
            {score.toLocaleString()}
            {combo > 1 && (
              <span
                className="ml-2 align-middle text-xs font-bold uppercase tracking-widest"
                style={{ color: 'var(--accent-2)' }}
              >
                x{combo} combo
              </span>
            )}
          </Stat>
          <div className="pointer-events-none absolute inset-x-0 top-0 flex justify-center">
            {floats.map((f) => (
              <span
                key={f.id}
                className="anim-score absolute text-lg font-black"
                style={{ color: 'var(--accent)' }}
              >
                +{f.amount}
              </span>
            ))}
          </div>
        </div>

        <Stat label="Best" glow={newBest}>
          {best.toLocaleString()}
        </Stat>

        {timeLeft !== null && (
          <Stat label="Time" glow={timeLeft <= 20}>
            <span style={{ color: timeLeft <= 20 ? 'var(--accent-2)' : undefined }}>
              {formatTime(timeLeft)}
            </span>
          </Stat>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onNewGame}
          className="flex-1 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-[0.2em] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          style={{
            background: 'linear-gradient(135deg, var(--accent), var(--accent-3))',
            color: '#04060f',
            boxShadow: '0 0 22px color-mix(in srgb, var(--accent) 35%, transparent)',
          }}
        >
          New game
        </button>
        <button
          type="button"
          onClick={onUndo}
          disabled={!canUndo}
          className="flex-1 rounded-xl border px-4 py-2.5 text-xs font-black uppercase tracking-[0.2em] transition disabled:opacity-35 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          style={{ borderColor: 'var(--panel-border)', background: 'var(--panel)' }}
        >
          Undo
        </button>
      </div>
    </div>
  );
}
