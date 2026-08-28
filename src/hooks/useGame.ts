import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type {
  BoardSize,
  BoardState,
  Difficulty,
  Direction,
  GameConfig,
  GameMode,
  LeaderboardEntry,
  PowerUpKind,
} from '@/types/game';
import {
  createBoard,
  hasMoves,
  hasWon,
  resolveMove,
  spawnTile,
  winTarget,
} from '@/lib/game-engine';
import { removeTile, shuffleBoard, swapTiles, areAdjacent } from '@/lib/powerups';
import { dailySeed, makeSeededRandom, todayKey } from '@/lib/daily';
import { ACHIEVEMENTS, checkAchievements } from '@/lib/achievements';
import * as store from '@/lib/storage';
import { play, setMuted as setAudioMuted } from '@/lib/audio';

export const BLITZ_SECONDS = 180;
const START_CHARGES = 2;
const MILESTONE = 2000;

export interface FloatingScore {
  id: number;
  amount: number;
}

export interface UseGame {
  config: GameConfig;
  board: BoardState;
  best: number;
  status: BoardState['status'];
  target: number;
  leaderboard: LeaderboardEntry[];
  profile: ReturnType<typeof store.loadProfile>;
  charges: Record<PowerUpKind, number>;
  armed: PowerUpKind | null;
  swapFirst: number | null;
  floats: FloatingScore[];
  combo: number;
  shake: boolean;
  canUndo: boolean;
  timeLeft: number | null;
  dailyDoneToday: boolean;
  muted: boolean;
  newBest: boolean;
  toasts: string[];
  move: (direction: Direction) => void;
  newGame: (next?: Partial<GameConfig>) => void;
  undo: () => void;
  keepGoing: () => void;
  armPowerUp: (kind: PowerUpKind) => void;
  cancelArm: () => void;
  tapTile: (tileId: number) => void;
  setMuted: (m: boolean) => void;
  dismissToast: (id: string) => void;
  resetEverything: () => void;
}

export function useGame(): UseGame {
  const [config, setConfig] = useState<GameConfig>({
    mode: 'classic',
    size: 4,
    difficulty: 'normal',
  });

  const randRef = useRef<() => number>(Math.random);
  const [board, setBoard] = useState<BoardState>(() => createBoard(4, 'normal'));
  const [history, setHistory] = useState<BoardState[]>([]);
  const [best, setBest] = useState<number>(() => store.loadBest());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => store.loadLeaderboard());
  const [profile, setProfile] = useState(() => store.loadProfile());
  const [charges, setCharges] = useState<Record<PowerUpKind, number>>({
    delete: START_CHARGES,
    shuffle: START_CHARGES,
    swap: START_CHARGES,
  });
  const [armed, setArmed] = useState<PowerUpKind | null>(null);
  const [swapFirst, setSwapFirst] = useState<number | null>(null);
  const [floats, setFloats] = useState<FloatingScore[]>([]);
  const [combo, setCombo] = useState(0);
  const [shake, setShake] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [muted, setMutedState] = useState<boolean>(() => store.loadMuted());
  const [newBest, setNewBest] = useState(false);
  const [toasts, setToasts] = useState<string[]>([]);
  const [dailyDoneToday, setDailyDoneToday] = useState<boolean>(
    () => store.loadDailyDone() === todayKey(),
  );

  const profileRef = useRef(profile);
  useEffect(() => {
    profileRef.current = profile;
  }, [profile]);

  const factsRef = useRef({ usedUndo: false, usedPowerUps: false, bestCombo: 0 });
  const milestoneRef = useRef(0);
  const endedRef = useRef(false);
  const floatId = useRef(1);

  useEffect(() => {
    setAudioMuted(muted);
  }, [muted]);

  const target = useMemo(() => winTarget(board.size), [board.size]);

  const startRun = useCallback(
    (mode: GameMode, size: BoardSize, difficulty: Difficulty) => {
      randRef.current = mode === 'daily' ? makeSeededRandom(dailySeed()) : Math.random;
      const fresh = createBoard(size, difficulty, randRef.current);
      setBoard(fresh);
      setHistory([]);
      setCharges({ delete: START_CHARGES, shuffle: START_CHARGES, swap: START_CHARGES });
      setArmed(null);
      setSwapFirst(null);
      setCombo(0);
      setFloats([]);
      setNewBest(false);
      factsRef.current = { usedUndo: false, usedPowerUps: false, bestCombo: 0 };
      milestoneRef.current = 0;
      endedRef.current = false;
      setTimeLeft(mode === 'blitz' ? BLITZ_SECONDS : null);
    },
    [],
  );

  const newGame = useCallback(
    (next?: Partial<GameConfig>) => {
      const merged: GameConfig = { ...config, ...next };
      if (merged.mode === 'daily') {
        merged.size = 4;
        merged.difficulty = 'normal';
      }
      setConfig(merged);
      startRun(merged.mode, merged.size, merged.difficulty);
    },
    [config, startRun],
  );

  const grantAchievements = useCallback(
    (nextBoard: BoardState, runEnded: boolean) => {
      const prev = profileRef.current;
      const earned = checkAchievements(nextBoard, config, prev, factsRef.current, runEnded);
      if (earned.length === 0) return;
      const updated = { ...prev, unlocked: [...prev.unlocked, ...earned] };
      profileRef.current = updated;
      store.saveProfile(updated);
      setProfile(updated);
      setToasts((t) => [...t, ...earned]);
      play('unlock');
    },
    [config],
  );

  const endRun = useCallback(
    (finished: BoardState) => {
      if (endedRef.current) return;
      endedRef.current = true;

      const entry: LeaderboardEntry = {
        score: finished.score,
        highestTile: finished.highestTile,
        mode: config.mode,
        size: config.size,
        date: new Date().toISOString(),
      };
      setLeaderboard(store.addLeaderboardEntry(entry));

      const prev = profileRef.current;
      const isDaily = config.mode === 'daily';
      const today = todayKey();
      let currentStreak = prev.currentStreak;
      if (isDaily && prev.lastDailyDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yKey = todayKey(yesterday);
        currentStreak = prev.lastDailyDate === yKey ? prev.currentStreak + 1 : 1;
      }
      const updated = {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        wins: prev.wins + (finished.status === 'won' ? 1 : 0),
        bestScore: {
          ...prev.bestScore,
          [config.mode]: Math.max(prev.bestScore[config.mode] ?? 0, finished.score),
        },
        highestTileEver: Math.max(prev.highestTileEver, finished.highestTile),
        totalMerges: prev.totalMerges + finished.merges,
        currentStreak,
        longestStreak: Math.max(prev.longestStreak, currentStreak),
        lastDailyDate: isDaily ? today : prev.lastDailyDate,
      };
      profileRef.current = updated;
      store.saveProfile(updated);
      setProfile(updated);

      if (config.mode === 'daily') {
        store.saveDailyDone(todayKey());
        setDailyDoneToday(true);
      }

      grantAchievements(finished, true);
      play(finished.status === 'won' ? 'win' : 'lose');
    },
    [config.mode, config.size, grantAchievements],
  );

  const pushFloat = useCallback((amount: number) => {
    const id = floatId.current++;
    setFloats((f) => [...f, { id, amount }]);
    window.setTimeout(() => setFloats((f) => f.filter((x) => x.id !== id)), 750);
  }, []);

  const commit = useCallback(
    (nextBoard: BoardState, previous: BoardState) => {
      setHistory((h) => [...h.slice(-9), previous]);
      setBoard(nextBoard);
      if (nextBoard.score > best) {
        setBest(nextBoard.score);
        store.saveBest(nextBoard.score);
        setNewBest(true);
      }
    },
    [best],
  );

  const move = useCallback(
    (direction: Direction) => {
      if (board.status === 'lost') return;
      if (board.status === 'won' && !board.keptGoing) return;
      if (armed) return;

      const result = resolveMove(board, direction);
      if (!result.moved) return;

      let next = spawnTile(result.board, config.difficulty, randRef.current);
      if (config.mode === 'blitz' && timeLeft === null) setTimeLeft(BLITZ_SECONDS);

      if (result.gained > 0) {
        pushFloat(result.gained);
        play('merge', Math.log2(Math.max(result.biggestMerge, 2)) - 1);
      } else {
        play('move');
      }

      setCombo(result.mergeCount);
      factsRef.current.bestCombo = Math.max(factsRef.current.bestCombo, result.mergeCount);
      if (result.biggestMerge >= 256) {
        setShake(true);
        window.setTimeout(() => setShake(false), 340);
      }

      // Earn a power-up charge every score milestone.
      const reached = Math.floor(next.score / MILESTONE);
      if (reached > milestoneRef.current) {
        milestoneRef.current = reached;
        const kinds: PowerUpKind[] = ['delete', 'shuffle', 'swap'];
        const pick = kinds[reached % kinds.length];
        setCharges((c) => ({ ...c, [pick]: c[pick] + 1 }));
      }

      if (hasWon(next) && next.status === 'playing' && !next.keptGoing) {
        next = { ...next, status: 'won' };
      } else if (!hasMoves(next)) {
        next = { ...next, status: 'lost' };
      }

      commit(next, board);
      grantAchievements(next, false);
      if (next.status === 'lost' || (next.status === 'won' && !next.keptGoing)) {
        endRun(next);
      }
    },
    [board, armed, config.difficulty, config.mode, timeLeft, pushFloat, commit, grantAchievements, endRun],
  );

  const undo = useCallback(() => {
    if (history.length === 0) return;
    const prev = history[history.length - 1];
    factsRef.current.usedUndo = true;
    endedRef.current = false;
    setBoard(prev);
    setHistory(history.slice(0, -1));
  }, [history]);

  const keepGoing = useCallback(() => {
    setBoard((b) => ({ ...b, status: 'playing', keptGoing: true }));
    endedRef.current = false;
  }, []);

  const armPowerUp = useCallback(
    (kind: PowerUpKind) => {
      if (charges[kind] <= 0 || board.status === 'lost') return;
      if (kind === 'shuffle') {
        setBoard((b) => shuffleBoard(b, randRef.current));
        setCharges((c) => ({ ...c, shuffle: c.shuffle - 1 }));
        factsRef.current.usedPowerUps = true;
        play('power');
        return;
      }
      setArmed((a) => (a === kind ? null : kind));
      setSwapFirst(null);
    },
    [charges, board.status],
  );

  const cancelArm = useCallback(() => {
    setArmed(null);
    setSwapFirst(null);
  }, []);

  const tapTile = useCallback(
    (tileId: number) => {
      if (!armed) return;
      if (armed === 'delete') {
        setBoard((b) => removeTile(b, tileId));
        setCharges((c) => ({ ...c, delete: c.delete - 1 }));
        factsRef.current.usedPowerUps = true;
        play('power');
        setArmed(null);
        return;
      }
      if (armed === 'swap') {
        if (swapFirst === null) {
          setSwapFirst(tileId);
          return;
        }
        if (swapFirst === tileId) {
          setSwapFirst(null);
          return;
        }
        const a = board.tiles.find((t) => t.id === swapFirst);
        const b = board.tiles.find((t) => t.id === tileId);
        if (a && b && areAdjacent(a, b)) {
          setBoard((prev) => swapTiles(prev, a.id, b.id));
          setCharges((c) => ({ ...c, swap: c.swap - 1 }));
          factsRef.current.usedPowerUps = true;
          play('power');
          setArmed(null);
          setSwapFirst(null);
        } else {
          setSwapFirst(tileId);
        }
      }
    },
    [armed, swapFirst, board.tiles],
  );

  // Blitz countdown: starts on the first move, pauses when the tab is hidden.
  useEffect(() => {
    if (config.mode !== 'blitz' || timeLeft === null) return;
    if (board.status !== 'playing' || board.moves === 0) return;
    if (timeLeft <= 0) return;
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setTimeLeft((t) => (t === null ? null : Math.max(0, t - 1)));
    }, 1000);
    return () => window.clearInterval(id);
  }, [config.mode, timeLeft, board.status, board.moves]);

  useEffect(() => {
    if (config.mode !== 'blitz') return;
    if (timeLeft !== 0) return;
    if (board.status !== 'playing') return;
    const finished: BoardState = { ...board, status: 'lost' };
    setBoard(finished);
    endRun(finished);
  }, [timeLeft, config.mode, board, endRun]);

  const setMuted = useCallback((m: boolean) => {
    setMutedState(m);
    store.saveMuted(m);
    setAudioMuted(m);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x !== id));
  }, []);

  const resetEverything = useCallback(() => {
    store.resetAllData();
    setBest(0);
    setLeaderboard([]);
    profileRef.current = store.emptyProfile;
    setProfile(store.emptyProfile);
    setDailyDoneToday(false);
    startRun(config.mode, config.size, config.difficulty);
  }, [config, startRun]);

  return {
    config,
    board,
    best,
    status: board.status,
    target,
    leaderboard,
    profile,
    charges,
    armed,
    swapFirst,
    floats,
    combo,
    shake,
    canUndo: history.length > 0 && board.status !== 'lost',
    timeLeft,
    dailyDoneToday,
    muted,
    newBest,
    toasts,
    move,
    newGame,
    undo,
    keepGoing,
    armPowerUp,
    cancelArm,
    tapTile,
    setMuted,
    dismissToast,
    resetEverything,
  };
}

export const ALL_ACHIEVEMENTS = ACHIEVEMENTS;
