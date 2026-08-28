import { createFileRoute, Link } from '@tanstack/react-router';

export const Route = createFileRoute('/how-to-play')({
  component: HowToPlayPage,
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section
      className="rounded-2xl border p-4"
      style={{ borderColor: 'var(--panel-border)', background: 'var(--panel)' }}
    >
      <h2 className="mb-2 text-[0.65rem] font-black uppercase tracking-[0.2em]" style={{ color: 'var(--accent)' }}>
        {title}
      </h2>
      <div className="space-y-2 text-sm leading-relaxed text-[var(--muted)]">{children}</div>
    </section>
  );
}

export default function HowToPlayPage() {
  return (
    <div className="space-y-4 py-2">
      <h1 className="text-xl font-black uppercase tracking-[0.2em]">How to play</h1>

      <Section title="The basics">
        <p>
          Every move slides <span className="text-[var(--text)]">all</span> tiles as far as they go
          in one direction. Two tiles with the same number collide and merge into their double,
          scoring you that amount. A new tile appears after each successful move.
        </p>
        <p>The run ends when the board is full and nothing can merge.</p>
      </Section>

      <Section title="Controls">
        <ul className="list-inside list-disc space-y-1">
          <li>Arrow keys or W A S D — slide the tiles</li>
          <li>Swipe in any direction on touch screens</li>
          <li>N — new game · U — undo one move · M — mute</li>
          <li>1 / 2 / 3 — arm a power-up · Esc — cancel it</li>
        </ul>
      </Section>

      <Section title="Modes">
        <ul className="space-y-1">
          <li>
            <span className="text-[var(--text)]">Classic</span> — no timer, play until you are stuck.
            Choose a 4×4, 5×5 or 6×6 board.
          </li>
          <li>
            <span className="text-[var(--text)]">Blitz</span> — a 3 minute countdown starts on your
            first move. Squeeze out as many merges as possible.
          </li>
          <li>
            <span className="text-[var(--text)]">Daily</span> — everyone gets the exact same tile
            sequence each day, and it resets at midnight.
          </li>
        </ul>
        <p>
          Difficulty changes how often a 4 spawns instead of a 2 — Brutal fills your board much
          faster. The winning tile is 2048 on a 4×4, 4096 on 5×5 and 8192 on 6×6.
        </p>
      </Section>

      <Section title="Power-ups">
        <ul className="space-y-1">
          <li>
            <span className="text-[var(--text)]">Zap</span> — removes any single tile you tap.
          </li>
          <li>
            <span className="text-[var(--text)]">Shuffle</span> — scatters every tile to new cells.
          </li>
          <li>
            <span className="text-[var(--text)]">Swap</span> — tap two neighbouring tiles to trade
            their places.
          </li>
        </ul>
        <p>
          You start each run with two charges of each, and earn extra charges every 2,000 points.
        </p>
      </Section>

      <Section title="Badges and streaks">
        <p>
          Badges unlock for milestones like your first 2048, a 10,000 point run or a week of daily
          puzzles in a row. Everything is stored on this device only — see{' '}
          <Link to="/stats" className="underline underline-offset-2" style={{ color: 'var(--accent)' }}>
            your stats
          </Link>
          .
        </p>
      </Section>

      <Link
        to="/"
        className="inline-block rounded-xl px-5 py-2.5 text-[0.65rem] font-black uppercase tracking-[0.2em]"
        style={{
          background: 'linear-gradient(135deg, var(--accent), var(--accent-3))',
          color: '#04060f',
        }}
      >
        Start playing
      </Link>
    </div>
  );
}
