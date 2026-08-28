import { ACHIEVEMENTS } from '@/lib/achievements';

interface Props {
  unlocked: string[];
}

export default function AchievementGrid({ unlocked }: Props) {
  const owned = new Set(unlocked);

  return (
    <div
      className="rounded-2xl border p-4"
      style={{ borderColor: 'var(--panel-border)', background: 'var(--panel)' }}
    >
      <h2 className="mb-3 text-[0.65rem] font-black uppercase tracking-[0.2em] text-[var(--muted)]">
        Badges · {owned.size}/{ACHIEVEMENTS.length}
      </h2>
      <ul className="grid gap-2 sm:grid-cols-2">
        {ACHIEVEMENTS.map((a) => {
          const has = owned.has(a.id);
          return (
            <li
              key={a.id}
              className="flex items-center gap-3 rounded-xl border px-3 py-2.5"
              style={{
                borderColor: has ? 'var(--accent)' : 'var(--panel-border)',
                background: has
                  ? 'color-mix(in srgb, var(--accent) 12%, transparent)'
                  : 'rgba(255,255,255,0.02)',
                opacity: has ? 1 : 0.55,
              }}
            >
              <span
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-base"
                style={{
                  background: has ? 'var(--accent)' : 'rgba(255,255,255,0.06)',
                  color: has ? '#04060f' : 'var(--muted)',
                }}
              >
                {has ? a.icon : '🔒'}
              </span>
              <div>
                <p className="text-xs font-black">{a.name}</p>
                <p className="text-[0.7rem] text-[var(--muted)]">{a.description}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
