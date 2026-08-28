import { createRootRoute, Link, Outlet } from '@tanstack/react-router';

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: NotFound,
});

const navLink =
  'rounded-lg px-3 py-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--muted)] transition hover:text-[var(--text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]';

function RootLayout() {
  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{
        background:
          'radial-gradient(1200px 600px at 50% -10%, var(--bg-1), var(--bg-0) 70%)',
      }}
    >
      <div className="neon-grid pointer-events-none absolute inset-0 opacity-70" />
      <div
        className="pointer-events-none absolute -top-40 left-1/2 h-80 w-[36rem] -translate-x-1/2 rounded-full blur-[120px]"
        style={{ background: 'var(--accent)', opacity: 0.14 }}
      />
      <div
        className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full blur-[120px]"
        style={{ background: 'var(--accent-2)', opacity: 0.1 }}
      />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-3 pb-10 sm:px-6">
        <header className="flex flex-wrap items-center justify-between gap-3 py-4">
          <Link to="/" className="group flex items-center gap-2">
            <span
              className="grid h-9 w-9 place-items-center rounded-xl text-sm font-black"
              style={{
                background: 'linear-gradient(135deg, var(--accent), var(--accent-3))',
                color: '#04060f',
                boxShadow: '0 0 24px color-mix(in srgb, var(--accent) 55%, transparent)',
              }}
            >
              2
            </span>
            <span className="text-base font-black uppercase tracking-[0.25em] text-[var(--text)]">
              Neon<span style={{ color: 'var(--accent)' }}>2048</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <Link to="/" className={navLink} activeProps={{ className: `${navLink} !text-[var(--text)]` }}>
              Play
            </Link>
            <Link to="/stats" className={navLink} activeProps={{ className: `${navLink} !text-[var(--text)]` }}>
              Stats
            </Link>
            <Link
              to="/how-to-play"
              className={navLink}
              activeProps={{ className: `${navLink} !text-[var(--text)]` }}
            >
              Rules
            </Link>
          </nav>
        </header>

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <p className="text-lg">This page does not exist.</p>
      <Link to="/" className="text-sm underline underline-offset-4" style={{ color: 'var(--accent)' }}>
        Back to the game
      </Link>
    </div>
  );
}
