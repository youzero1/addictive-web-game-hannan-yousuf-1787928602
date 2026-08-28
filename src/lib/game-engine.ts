import type {
  BoardSize,
  BoardState,
  Difficulty,
  Direction,
  MoveResult,
  Tile,
} from '@/types/game';

let nextId = 1;
export function resetIds() {
  nextId = 1;
}
function makeId() {
  return nextId++;
}

export type Rand = () => number;

export function winTarget(size: BoardSize): number {
  if (size === 4) return 2048;
  if (size === 5) return 4096;
  return 8192;
}

function fourChance(difficulty: Difficulty): number {
  if (difficulty === 'chill') return 0.05;
  if (difficulty === 'normal') return 0.1;
  return 0.25;
}

export function emptyCells(tiles: Tile[], size: number): Array<{ row: number; col: number }> {
  const taken = new Set(tiles.map((t) => `${t.row},${t.col}`));
  const cells: Array<{ row: number; col: number }> = [];
  for (let row = 0; row < size; row++) {
    for (let col = 0; col < size; col++) {
      if (!taken.has(`${row},${col}`)) cells.push({ row, col });
    }
  }
  return cells;
}

export function spawnTile(
  board: BoardState,
  difficulty: Difficulty,
  rand: Rand = Math.random,
): BoardState {
  const free = emptyCells(board.tiles, board.size);
  if (free.length === 0) return board;
  const cell = free[Math.floor(rand() * free.length)];
  const value = rand() < fourChance(difficulty) ? 4 : 2;
  const tile: Tile = { id: makeId(), row: cell.row, col: cell.col, value, isNew: true, merged: false };
  return { ...board, tiles: [...board.tiles, tile] };
}

export function createBoard(
  size: BoardSize,
  difficulty: Difficulty,
  rand: Rand = Math.random,
): BoardState {
  let board: BoardState = {
    tiles: [],
    size,
    score: 0,
    status: 'playing',
    keptGoing: false,
    moves: 0,
    merges: 0,
    highestTile: 0,
  };
  board = spawnTile(board, difficulty, rand);
  board = spawnTile(board, difficulty, rand);
  board.highestTile = Math.max(...board.tiles.map((t) => t.value), 0);
  return board;
}

function traversalOrder(direction: Direction, size: number) {
  // Returns lines of coordinates ordered from the wall the tiles slide toward.
  const lines: Array<Array<{ row: number; col: number }>> = [];
  for (let i = 0; i < size; i++) {
    const line: Array<{ row: number; col: number }> = [];
    for (let j = 0; j < size; j++) {
      if (direction === 'left') line.push({ row: i, col: j });
      else if (direction === 'right') line.push({ row: i, col: size - 1 - j });
      else if (direction === 'up') line.push({ row: j, col: i });
      else line.push({ row: size - 1 - j, col: i });
    }
    lines.push(line);
  }
  return lines;
}

export function resolveMove(board: BoardState, direction: Direction): MoveResult {
  const size = board.size;
  const grid = new Map<string, Tile>();
  for (const t of board.tiles) grid.set(`${t.row},${t.col}`, t);

  const result: Tile[] = [];
  let moved = false;
  let gained = 0;
  let mergeCount = 0;
  let biggestMerge = 0;

  for (const line of traversalOrder(direction, size)) {
    const inLine: Tile[] = [];
    for (const cell of line) {
      const tile = grid.get(`${cell.row},${cell.col}`);
      if (tile) inLine.push(tile);
    }

    let target = 0;
    let index = 0;
    while (index < inLine.length) {
      const current = inLine[index];
      const next = inLine[index + 1];
      const dest = line[target];

      if (next && next.value === current.value) {
        const value = current.value * 2;
        gained += value;
        mergeCount += 1;
        biggestMerge = Math.max(biggestMerge, value);
        // Both source tiles collapse into one new tile at the destination.
        result.push({
          id: makeId(),
          row: dest.row,
          col: dest.col,
          value,
          isNew: false,
          merged: true,
        });
        moved = true;
        index += 2;
      } else {
        if (current.row !== dest.row || current.col !== dest.col) moved = true;
        result.push({ ...current, row: dest.row, col: dest.col, isNew: false, merged: false });
        index += 1;
      }
      target += 1;
    }
  }

  const highestTile = Math.max(board.highestTile, ...result.map((t) => t.value), 0);

  const nextBoard: BoardState = {
    ...board,
    tiles: result,
    score: board.score + gained,
    moves: board.moves + (moved ? 1 : 0),
    merges: board.merges + mergeCount,
    highestTile,
  };

  return { board: nextBoard, moved, gained, mergeCount, biggestMerge };
}

export function hasMoves(board: BoardState): boolean {
  if (emptyCells(board.tiles, board.size).length > 0) return true;
  const grid = new Map<string, number>();
  for (const t of board.tiles) grid.set(`${t.row},${t.col}`, t.value);
  for (let row = 0; row < board.size; row++) {
    for (let col = 0; col < board.size; col++) {
      const v = grid.get(`${row},${col}`);
      if (v === undefined) continue;
      if (grid.get(`${row},${col + 1}`) === v) return true;
      if (grid.get(`${row + 1},${col}`) === v) return true;
    }
  }
  return false;
}

export function hasWon(board: BoardState): boolean {
  return board.highestTile >= winTarget(board.size);
}
