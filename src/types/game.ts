export type Direction = 'up' | 'down' | 'left' | 'right';

export type GameMode = 'classic' | 'blitz' | 'daily';

export type Difficulty = 'chill' | 'normal' | 'brutal';

export type BoardSize = 4 | 5 | 6;

export type GameStatus = 'idle' | 'playing' | 'won' | 'lost';

export interface Tile {
  id: number;
  row: number;
  col: number;
  value: number;
  isNew: boolean;
  merged: boolean;
}

export interface GameConfig {
  mode: GameMode;
  size: BoardSize;
  difficulty: Difficulty;
}

export interface BoardState {
  tiles: Tile[];
  size: BoardSize;
  score: number;
  status: GameStatus;
  keptGoing: boolean;
  moves: number;
  merges: number;
  highestTile: number;
}

export interface MoveResult {
  board: BoardState;
  moved: boolean;
  gained: number;
  mergeCount: number;
  biggestMerge: number;
}

export type PowerUpKind = 'delete' | 'shuffle' | 'swap';

export interface LeaderboardEntry {
  score: number;
  highestTile: number;
  mode: GameMode;
  size: BoardSize;
  date: string;
}

export interface PlayerProfile {
  gamesPlayed: number;
  wins: number;
  bestScore: Record<GameMode, number>;
  highestTileEver: number;
  totalMerges: number;
  currentStreak: number;
  longestStreak: number;
  lastDailyDate: string | null;
  unlocked: string[];
}
