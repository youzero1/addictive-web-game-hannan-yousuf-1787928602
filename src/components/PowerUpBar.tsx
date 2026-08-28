import type { PowerUpKind } from '@/types/game';

const POWERUPS: Array<{ id: PowerUpKind; icon: string; label: string; hint: string }> = [
  { id: 'delete', icon: '✕', label: 'Zap', hint: 'Tap a tile to remove it.' },
  { id: 'shuffle', icon: '⇄', label: 'Shuffle', hint: 'All tiles jump to new cells.' },
  { id: 'swap', icon: '⇅', label: 'Swap', hint: 'Tap two neighbouring tiles to swap them.' },
];

interface Props {
  charges: Record<PowerUpKind, number>;
  armed: PowerUpKind | null;
  swapFirst: number | null;
  onArm: (kind: PowerUpKind) => void;
  onCancel: () => void;
}

export default function PowerUpBar({ charges, armed, swapFirst, onArm, onCancel }: Props) {
  const armedInfo = POWERUPS.find((p) => p.id === armed);

  return (
    <div
      className="rounded-2xl border p-3"
      style={{ borderColor: 'var(--panel-border)', background: 'var(--panel)' }}
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
          Power-ups
        </p>
        {armed && (
          <button
            type="button"
            onClick={onCancel}
            className="text-[0.6rem] font-bold uppercase tracking-[0.15em] underline underline-offset-4"
            style={{ color: 'var(--accent-2)' }}
          >
            Cancel (Esc)
          </button>
        )}
      </div>

      <div className="mt-2 flex gap-2">
        {POWERUPS.map((p, i) => {
          const count = charges[p.id];
          const isArmed = armed === p.id;
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => onArm(p.id)}
              disabled={count <= 0}
              aria-label={`${p.label} power-up, ${count} left`}
              className="relative flex flex-1 flex-col items-center gap-1 rounded-xl border px-2 py-2 transition disabled:opacity-35 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
              style={{
                borderColor: isArmed ? 'var(--accent)' : 'var(--panel-border)',
                background: isArmed
                  ? 'color-mix(in srgb, var(--accent) 18%, transparent)'
                  : 'rgba(255,255,255,0.03)',
                boxShadow: isArmed
                  ? '0 0 22px color-mix(in srgb, var(--accent) 40%, transparent)'
                  : undefined,
              }}
            >
              <span className="text-lg leading-none" style={{ color: 'var(--accent)' }}>
                {p.icon}
              </span>
              <span className="text-[0.6rem] font-bold uppercase tracking-[0.12em]">{p.label}</span>
              <span
                className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full text-[0.6rem] font-black"
                style={{ background: 'var(--accent-3)', color: '#04060f' }}
              >
                {count}
              </span>
              <span className="text-[0.55rem] text-[var(--muted)]">{i + 1}</span>
            </button>
          );
        })}
      </div>

      <p className="mt-2 min-h-[1rem] text-[0.7rem]" style={{ color: 'var(--accent)' }}>
        {armedInfo
          ? armed === 'swap' && swapFirst !== null
            ? 'Now tap a neighbouring tile to complete the swap.'
            : armedInfo.hint
          : ''}
      </p>
    </div>
  );
}
