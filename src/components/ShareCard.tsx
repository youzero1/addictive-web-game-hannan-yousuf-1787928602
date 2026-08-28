import { useState } from 'react';
import type { BoardState, GameConfig } from '@/types/game';

const MODE_LABEL: Record<GameConfig['mode'], string> = {
  classic: 'Classic',
  blitz: 'Blitz',
  daily: 'Daily',
};

function tileSquares(highest: number): string {
  const steps = Math.max(1, Math.min(8, Math.log2(Math.max(highest, 2)) - 1));
  const palette = ['🟦', '🟩', '🟨', '🟧', '🟥', '🟪', '🟫', '⬛'];
  return palette.slice(0, steps).join('');
}

interface Props {
  board: BoardState;
  config: GameConfig;
  badgeCount: number;
}

export default function ShareCard({ board, config, badgeCount }: Props) {
  const [copied, setCopied] = useState(false);

  const summary = [
    `Neon 2048 · ${MODE_LABEL[config.mode]} ${board.size}×${board.size}`,
    `Score ${board.score.toLocaleString()} · best tile ${board.highestTile}`,
    tileSquares(board.highestTile),
    board.status === 'won' ? 'Target reached ★' : `${board.moves} moves, ${board.merges} merges`,
  ].join('\n');

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div
      className="rounded-2xl border p-4"
      style={{
        borderColor: 'var(--accent)',
        background: 'var(--panel)',
        boxShadow: '0 0 26px color-mix(in srgb, var(--accent) 22%, transparent)',
      }}
    >
      <p className="text-[0.6rem] font-black uppercase tracking-[0.2em] text-[var(--muted)]">
        Run summary
      </p>
      <p className="mt-1 text-2xl font-black tabular-nums">{board.score.toLocaleString()}</p>
      <p className="text-xs text-[var(--muted)]">
        {MODE_LABEL[config.mode]} · {board.size}×{board.size} · best tile {board.highestTile} ·{' '}
        {badgeCount} badges
      </p>
      <p className="mt-2 text-lg tracking-widest">{tileSquares(board.highestTile)}</p>
      <button
        type="button"
        onClick={copy}
        className="mt-3 w-full rounded-xl px-4 py-2 text-[0.65rem] font-black uppercase tracking-[0.2em] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
        style={{
          background: 'linear-gradient(135deg, var(--accent), var(--accent-3))',
          color: '#04060f',
        }}
      >
        {copied ? 'Copied to clipboard' : 'Copy score card'}
      </button>
    </div>
  );
}
