import { useState } from 'react';
import { Link } from '@tanstack/react-router';

interface Props {
  target: number;
  muted: boolean;
  onToggleMute: () => void;
}

export default function HowToPlay({ target, muted, onToggleMute }: Props) {
  const [open, setOpen] = useState(true);

  return (
    <div
      className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border px-3 py-2"
      style={{ borderColor: 'var(--panel-border)', background: 'var(--panel)' }}
    >
      {open ? (
        <p className="flex-1 text-[0.7rem] leading-relaxed text-[var(--muted)]">
          <span className="font-bold" style={{ color: 'var(--accent)' }}>
            Arrow keys or swipe
          </span>{' '}
          to slide every tile. Equal numbers merge — reach{' '}
          <span className="font-bold text-[var(--text)]">{target}</span> to win.{' '}
          <Link to="/how-to-play" className="underline underline-offset-2">
            Full rules
          </Link>
        </p>
      ) : (
        <p className="flex-1 text-[0.7rem] text-[var(--muted)]">Good luck.</p>
      )}

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onToggleMute}
          aria-label={muted ? 'Unmute sound' : 'Mute sound'}
          className="rounded-lg px-2 py-1 text-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
          style={{ color: muted ? 'var(--muted)' : 'var(--accent)' }}
        >
          {muted ? '🔇' : '🔊'}
        </button>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="rounded-lg px-2 py-1 text-[0.6rem] font-bold uppercase tracking-[0.15em] text-[var(--muted)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        >
          {open ? 'Hide' : 'Tips'}
        </button>
      </div>
    </div>
  );
}
