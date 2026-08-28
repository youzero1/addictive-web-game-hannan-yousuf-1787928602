import type { BoardSize, Difficulty, GameConfig, GameMode } from '@/types/game';

const MODES: Array<{ id: GameMode; label: string; hint: string }> = [
  { id: 'classic', label: 'Classic', hint: 'Play until no moves are left.' },
  { id: 'blitz', label: 'Blitz', hint: 'Three minutes. Score as much as you can.' },
  { id: 'daily', label: 'Daily', hint: 'Same puzzle for everyone, resets at midnight.' },
];

const SIZES: BoardSize[] = [4, 5, 6];
const DIFFS: Array<{ id: Difficulty; label: string }> = [
  { id: 'chill', label: 'Chill' },
  { id: 'normal', label: 'Normal' },
  { id: 'brutal', label: 'Brutal' },
];

interface Props {
  config: GameConfig;
  inProgress: boolean;
  dailyDoneToday: boolean;
  onChange: (next: Partial<GameConfig>) => void;
}

function Segment({
  active,
  onClick,
  children,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className="rounded-lg px-3 py-1.5 text-[0.65rem] font-black uppercase tracking-[0.15em] transition disabled:opacity-40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
      style={
        active
          ? {
              background: 'linear-gradient(135deg, var(--accent), var(--accent-3))',
              color: '#04060f',
              boxShadow: '0 0 18px color-mix(in srgb, var(--accent) 35%, transparent)',
            }
          : { color: 'var(--muted)' }
      }
    >
      {children}
    </button>
  );
}

export default function ModeSelect({ config, inProgress, dailyDoneToday, onChange }: Props) {
  const confirmSwitch = (next: Partial<GameConfig>) => {
    if (inProgress) {
      const ok = window.confirm('Start a new run? Your current game will be lost.');
      if (!ok) return;
    }
    onChange(next);
  };

  const active = MODES.find((m) => m.id === config.mode);

  return (
    <div
      className="rounded-2xl border p-3"
      style={{ borderColor: 'var(--panel-border)', background: 'var(--panel)' }}
    >
      <div className="flex flex-wrap items-center gap-1.5">
        {MODES.map((m) => (
          <Segment
            key={m.id}
            active={config.mode === m.id}
            onClick={() => confirmSwitch({ mode: m.id })}
          >
            {m.label}
          </Segment>
        ))}
      </div>

      <p className="mt-2 text-[0.7rem] text-[var(--muted)]">
        {active?.hint}
        {config.mode === 'daily' && dailyDoneToday && ' You have already finished today\u2019s run.'}
      </p>

      {config.mode !== 'daily' && (
        <div className="mt-3 flex flex-wrap gap-4 border-t pt-3" style={{ borderColor: 'var(--panel-border)' }}>
          <div>
            <p className="mb-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
              Board
            </p>
            <div className="flex gap-1">
              {SIZES.map((s) => (
                <Segment
                  key={s}
                  active={config.size === s}
                  onClick={() => confirmSwitch({ size: s })}
                >
                  {s}×{s}
                </Segment>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-1 text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
              Difficulty
            </p>
            <div className="flex gap-1">
              {DIFFS.map((d) => (
                <Segment
                  key={d.id}
                  active={config.difficulty === d.id}
                  onClick={() => confirmSwitch({ difficulty: d.id })}
                >
                  {d.label}
                </Segment>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
