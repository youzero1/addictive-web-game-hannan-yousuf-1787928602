import { createFileRoute } from '@tanstack/react-router';
import { useCallback } from 'react';
import Board from '@/components/Board';
import ScorePanel from '@/components/ScorePanel';
import ModeSelect from '@/components/ModeSelect';
import PowerUpBar from '@/components/PowerUpBar';
import Leaderboard from '@/components/Leaderboard';
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
      if (key === 'm' || key === 'M') game.setMuted(!game.muted);
      if (key === '1') game.armPowerUp('delete');
      if (key === '2') game.armPowerUp('shuffle');
      if (key === '3') game.armPowerUp('swap');
      if (key === 'Escape') game.cancelArm();
    },
    [game],
  );

  useSwipeAndKeys({ onMove: game.move, onShortcut });

  return (
    <div className="grid gap-5 py-2 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <div className="flex flex-col gap-4">
        <ModeSelect
          config={game.config}
          inProgress={game.board.moves > 0 && game.board.status === 'playing'}
          dailyDoneToday={game.dailyDoneToday}
          onChange={(next) => game.newGame(next)}
        />

        <ScorePanel
          score={game.board.score}
          best={game.best}
          combo={game.combo}
          floats={game.floats}
          timeLeft={game.timeLeft}
          canUndo={game.canUndo}
          newBest={game.newBest}
          onNewGame={() => game.newGame()}
          onUndo={game.undo}
        />

        <PowerUpBar
          charges={game.charges}
          armed={game.armed}
          swapFirst={game.swapFirst}
          onArm={game.armPowerUp}
          onCancel={game.cancelArm}
        />

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
        <Leaderboard
          entries={game.leaderboard}
          currentScore={game.board.score}
          newBest={game.newBest}
        />
      </aside>
    </div>
  );
}
