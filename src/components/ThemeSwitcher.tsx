import { THEMES, useTheme } from '@/hooks/useTheme';

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className="flex items-center gap-1 rounded-xl border p-1"
      style={{ borderColor: 'var(--panel-border)', background: 'var(--panel)' }}
      role="group"
      aria-label="Colour theme"
    >
      {THEMES.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => setTheme(t.id)}
          aria-pressed={theme === t.id}
          title={t.label}
          className="rounded-lg px-2 py-1 text-[0.55rem] font-black uppercase tracking-[0.12em] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          style={
            theme === t.id
              ? { background: 'var(--accent)', color: '#04060f' }
              : { color: 'var(--muted)' }
          }
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
