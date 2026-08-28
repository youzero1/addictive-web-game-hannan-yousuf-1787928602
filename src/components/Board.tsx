import { useEffect, useRef, useState } from 'react';
import type { BoardState, PowerUpKind } from '@/types/game';
import Tile from '@/components/Tile';

const GAP_PCT = 2.2;
const SPARKS = Array.from({ length: 12 }, (_, i) => {
  const angle = (i / 12) * Math.PI * 2;
  return { dx: Math.cos(angle) * 90, dy: Math.sin(angle) * 90 };
});

interface Props {
  board: BoardState;
  target: number;
  shake: boolean;
  armed: PowerUpKind | null;
  swapFirst: number | null;
  onTapTile: (id: number) => void;
  onNewGame: () => void;
  onKeepGoing: () => void;
}

export default function Board({
  board,
  target,
  shake,
  armed,
  swapFirst,
  onTapTile,
  onNewGame,
  onKeepGoing,
}: Props) {
  const size = board.size;
  const cellPct = (100 - GAP_PCT * (size + 1)) / size;
  const cells = Array.from({ length: size * size });
  const selectable = armed === 'delete' || armed === 'swap';
  const gameOver = board.status === 'lost';
  const won = board.status === 'won';

  const prevHighest = useRef(board.highestTile);
  const [burst, setBurst] = useState(false);

  useEffect(() => {
    if (board.highestTile > prevHighest.current && board.highestTile >= 128) {
      setBurst(true);
      const id = window.setTimeout(() => setBurst(false), 620);
      prevHighest.current = board.highestTile;
      return () => window.clearTimeout(id);
    }
    prevHighest.current = board.highestTile;
  }, [board.highestTile]);

  return (
    <div className={`relative w-full ${shake ? 'anim-shake' : ''}`}>
      <div
        className="relative w-full rounded-2xl border"
        style={{
          aspectRatio: '1 / 1',
          borderColor: 'var(--panel-border)',
          background:
            'linear-gradient(160deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02))',
          boxShadow:
            '0 0 40px color-mix(in srgb, var(--accent) 14%, transparent), inset 0 0 40px rgba(0,0,0,0.5)',
          touchAction: 'none',
        }}
      >
        {cells.map((_, i) => {
          const row = Math.floor(i / size);
          const col = i % size;
          return (
            <div
              key={i}
              className="absolute rounded-xl"
              style={{
                left: `${GAP_PCT + col * (cellPct + GAP_PCT)}%`,
                top: `${GAP_PCT + row * (cellPct + GAP_PCT)}%`,
                width: `${cellPct}%`,
                height: `${cellPct}%`,
                background: 'var(--cell)',
                boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.45)',
              }}
            />
          );
        })}

        {board.tiles.map((tile) => (
          <Tile
            key={tile.id}
            tile={tile}
            size={size}
            gapPct={GAP_PCT}
            selectable={selectable}
            selected={swapFirst === tile.id}
            onSelect={onTapTile}
          />
        ))}

        {burst && (
          <div className="pointer-events-none absolute inset-0 z-20 grid place-items-center">
            {SPARKS.map((s, i) => (
              <span
                key={i}
                className="absolute h-2 w-2 rounded-full"
                style={{
                  background: i % 2 ? 'var(--accent)' : 'var(--accent-2)',
                  boxShadow: '0 0 12px currentColor',
                  animation: 'sparkle-out 600ms ease-out forwards',
                  ['--dx' as string]: `${s.dx}px`,
                  ['--dy' as string]: `${s.dy}px`,
                }}
              />
            ))}
          </div>
        )}

        {(gameOver || won) && (
          <div
            className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 rounded-2xl px-6 text-center backdrop-blur-sm"
            style={{ background: 'rgba(5,6,13,0.78)' }}
          >
            <p
              className="text-2xl font-black uppercase tracking-[0.2em] sm:text-3xl"
              style={{ color: won ? 'var(--accent)' : 'var(--accent-2)' }}
            >
              {won ? `${target} reached!` : 'Game over'}
            </p>
            <p className="text-sm text-[var(--muted)]">
              Score {board.score.toLocaleString()} · best tile {board.highestTile}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-2">
              {won && (
                <button
                  type="button"
                  onClick={onKeepGoing}
                  className="rounded-xl px-4 py-2 text-xs font-bold uppercase tracking-widest focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                  style={{
                    background: 'linear-gradient(135deg, var(--accent), var(--accent-3))',
                    color: '#04060f',
                  }}
                >
                  Keep going
                </button>
              )}
              <button
                type="button"
                onClick={onNewGame}
                className="rounded-xl border px-4 py-2 text-xs font-bold uppercase tracking-widest text-[var(--text)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]"
                style={{ borderColor: 'var(--panel-border)', background: 'var(--panel)' }}
              >
                New game
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
