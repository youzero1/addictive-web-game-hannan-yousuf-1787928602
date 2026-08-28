import { createFileRoute } from '@tanstack/react-router';
import { useCallback } from 'react';
import Board from '@/components/Board';
import { useGame } from '@/hooks/useGame';
import { useSwipeAndKeys } from '@/hooks/useSwipeAndKeys';

export const Route = createFileRoute('/')({
  component: GamePage,
});

function GamePage() {
  const game = useGame();

  const onShortcut = useCallback(
    (key: string) => {
      if (key === 'n' || key === 'N') game.newGame();
      if (key === 'u' || key === 'U') game.undo();
      if (key === 'Escape') game.cancelArm();
    },
    [game],
  );

  useSwipeAndKeys({ onMove: game.move, onShortcut });

  return (
    <div className="grid gap-5 py-2 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="flex flex-col gap-4">
        {/* ScorePanel placeholder */}
        <div className="flex gap-3">
          <div className="h-20 flex-1 rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-4">
            <div className="mb-2 h-3 w-12 rounded bg-white/15" />
            <div className="h-6 w-20 rounded bg-white/25" />
          </div>
          <div className="h-20 flex-1 rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-4">
            <div className="mb-2 h-3 w-10 rounded bg-white/15" />
            <div className="h-6 w-16 rounded bg-white/25" />
          </div>
        </div>

        <div className="mx-auto w-full max-w-lg">
          <Board
            board={game.board}
            target={game.target}
            shake={game.shake}
            armed={game.armed}
            swapFirst={game.swapFirst}
            onTapTile={game.tapTile}
            onNewGame={() => game.newGame()}
            onKeepGoing={game.keepGoing}
          />
        </div>

        <p className="text-center text-xs text-[var(--muted)]">
          Use the arrow keys or swipe to slide the tiles. Merge matching numbers to reach{' '}
          {game.target}.
        </p>
      </div>

      <aside className="flex flex-col gap-4">
        {/* Leaderboard placeholder */}
        <div className="h-64 rounded-2xl border border-[var(--panel-border)] bg-[var(--panel)] p-5">
          <div className="mb-4 h-3 w-24 rounded bg-white/15" />
          <div className="space-y-2">
            <div className="h-8 rounded-lg bg-white/10" />
            <div className="h-8 rounded-lg bg-white/8" />
            <div className="h-8 rounded-lg bg-white/8" />
          </div>
        </div>
      </aside>
    </div>
  );
}
