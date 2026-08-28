import type { BoardState, GameConfig, PlayerProfile } from '@/types/game';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: 'first-128', name: 'Warming Up', description: 'Create a 128 tile.', icon: '✦' },
  { id: 'first-512', name: 'Getting Serious', description: 'Create a 512 tile.', icon: '◆' },
  { id: 'first-2048', name: 'Neon Legend', description: 'Reach the 2048 tile.', icon: '★' },
  { id: 'score-10k', name: 'Ten Thousand', description: 'Score 10,000 in a single run.', icon: '⚡' },
  { id: 'purist', name: 'Purist', description: 'Finish a run without using undo.', icon: '⬢' },
  { id: 'blitz-3k', name: 'Speed Demon', description: 'Score 3,000 in Blitz mode.', icon: '⏱' },
  { id: 'daily-streak-7', name: 'Daily Devotee', description: 'Play the daily puzzle 7 days in a row.', icon: '☀' },
  { id: 'no-powerups', name: 'Bare Hands', description: 'Win a run without spending a power-up.', icon: '✊' },
  { id: 'big-board', name: 'Wide Load', description: 'Play a run on a 6×6 board.', icon: '▦' },
  { id: 'combo-4', name: 'Chain Reaction', description: 'Land 4 merges in one move.', icon: '⟴' },
];

export interface RunFacts {
  usedUndo: boolean;
  usedPowerUps: boolean;
  bestCombo: number;
}

export function checkAchievements(
  board: BoardState,
  config: GameConfig,
  profile: PlayerProfile,
  facts: RunFacts,
  runEnded: boolean,
): string[] {
  const owned = new Set(profile.unlocked);
  const earned: string[] = [];
  const grant = (id: string) => {
    if (!owned.has(id)) {
      owned.add(id);
      earned.push(id);
    }
  };

  if (board.highestTile >= 128) grant('first-128');
  if (board.highestTile >= 512) grant('first-512');
  if (board.highestTile >= 2048) grant('first-2048');
  if (board.score >= 10000) grant('score-10k');
  if (config.mode === 'blitz' && board.score >= 3000) grant('blitz-3k');
  if (config.size === 6 && board.moves >= 10) grant('big-board');
  if (facts.bestCombo >= 4) grant('combo-4');
  if (profile.currentStreak >= 7) grant('daily-streak-7');
  if (runEnded && !facts.usedUndo && board.moves >= 20) grant('purist');
  if (runEnded && board.status === 'won' && !facts.usedPowerUps) grant('no-powerups');

  return earned;
}

export function achievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id);
}
