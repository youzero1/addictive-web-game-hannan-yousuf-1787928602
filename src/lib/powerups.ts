import type { BoardState, Tile } from '@/types/game';
import { emptyCells } from '@/lib/game-engine';

export function removeTile(board: BoardState, tileId: number): BoardState {
  return { ...board, tiles: board.tiles.filter((t) => t.id !== tileId) };
}

export function shuffleBoard(board: BoardState, rand: () => number = Math.random): BoardState {
  const cells = board.tiles.map((t) => ({ row: t.row, col: t.col }));
  const free = emptyCells(board.tiles, board.size);
  const pool = [...cells, ...free];
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  const tiles: Tile[] = board.tiles.map((t, i) => ({
    ...t,
    row: pool[i].row,
    col: pool[i].col,
    isNew: false,
    merged: false,
  }));
  return { ...board, tiles };
}

export function areAdjacent(a: Tile, b: Tile): boolean {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col) === 1;
}

export function swapTiles(board: BoardState, aId: number, bId: number): BoardState {
  const a = board.tiles.find((t) => t.id === aId);
  const b = board.tiles.find((t) => t.id === bId);
  if (!a || !b) return board;
  const tiles = board.tiles.map((t) => {
    if (t.id === aId) return { ...t, row: b.row, col: b.col, isNew: false, merged: false };
    if (t.id === bId) return { ...t, row: a.row, col: a.col, isNew: false, merged: false };
    return t;
  });
  return { ...board, tiles };
}
