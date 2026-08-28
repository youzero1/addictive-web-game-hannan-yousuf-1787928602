import { useEffect } from 'react';
import { achievementById } from '@/lib/achievements';

interface Props {
  ids: string[];
  onDismiss: (id: string) => void;
}

export default function AchievementToast({ ids, onDismiss }: Props) {
  useEffect(() => {
    if (ids.length === 0) return;
    const timers = ids.map((id) => window.setTimeout(() => onDismiss(id), 4200));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [ids, onDismiss]);

  if (ids.length === 0) return null;

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {ids.slice(-3).map((id) => {
        const a = achievementById(id);
        if (!a) return null;
        return (
          <div
            key={id}
            className="anim-toast pointer-events-auto flex items-center gap-3 rounded-2xl border px-4 py-3 shadow-xl"
            style={{
              borderColor: 'var(--accent)',
              background: 'color-mix(in srgb, var(--bg-1) 92%, var(--accent) 8%)',
              boxShadow: '0 0 28px color-mix(in srgb, var(--accent) 35%, transparent)',
            }}
          >
            <span className="text-xl" style={{ color: 'var(--accent)' }}>
              {a.icon}
            </span>
            <div>
              <p className="text-[0.6rem] font-bold uppercase tracking-[0.2em] text-[var(--muted)]">
                Badge unlocked
              </p>
              <p className="text-sm font-black">{a.name}</p>
              <p className="text-[0.7rem] text-[var(--muted)]">{a.description}</p>
            </div>
            <button
              type="button"
              onClick={() => onDismiss(id)}
              aria-label="Dismiss"
              className="ml-1 self-start text-xs text-[var(--muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}
