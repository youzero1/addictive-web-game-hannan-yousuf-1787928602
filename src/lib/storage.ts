import type { GameMode, LeaderboardEntry, PlayerProfile } from '@/types/game';

const KEYS = {
  best: 'neon2048.best',
  board: 'neon2048.leaderboard',
  profile: 'neon2048.profile',
  muted: 'neon2048.muted',
  theme: 'neon2048.theme',
  dailyDone: 'neon2048.dailyDone',
};

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as T;
    if (parsed === null || parsed === undefined) return fallback;
    return parsed;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage unavailable (private mode, quota) — the game keeps working in memory.
  }
}

export const emptyProfile: PlayerProfile = {
  gamesPlayed: 0,
  wins: 0,
  bestScore: { classic: 0, blitz: 0, daily: 0 },
  highestTileEver: 0,
  totalMerges: 0,
  currentStreak: 0,
  longestStreak: 0,
  lastDailyDate: null,
  unlocked: [],
};

export function loadBest(): number {
  const v = read<number>(KEYS.best, 0);
  return typeof v === 'number' && Number.isFinite(v) ? v : 0;
}

export function saveBest(score: number) {
  write(KEYS.best, score);
}

export function loadLeaderboard(): LeaderboardEntry[] {
  const list = read<LeaderboardEntry[]>(KEYS.board, []);
  if (!Array.isArray(list)) return [];
  return list.filter(
    (e) => e && typeof e.score === 'number' && typeof e.highestTile === 'number',
  );
}

export function addLeaderboardEntry(entry: LeaderboardEntry): LeaderboardEntry[] {
  const next = [...loadLeaderboard(), entry]
    .sort((a, b) => b.score - a.score)
    .slice(0, 20);
  write(KEYS.board, next);
  return next;
}

export function loadProfile(): PlayerProfile {
  const p = read<PlayerProfile>(KEYS.profile, emptyProfile);
  return {
    ...emptyProfile,
    ...p,
    bestScore: { ...emptyProfile.bestScore, ...(p?.bestScore ?? {}) },
    unlocked: Array.isArray(p?.unlocked) ? p.unlocked : [],
  };
}

export function saveProfile(profile: PlayerProfile) {
  write(KEYS.profile, profile);
}

export function loadMuted(): boolean {
  return read<boolean>(KEYS.muted, false) === true;
}

export function saveMuted(muted: boolean) {
  write(KEYS.muted, muted);
}

export function loadTheme(): string {
  const t = read<string>(KEYS.theme, 'neon');
  return ['neon', 'crt', 'pastel'].includes(t) ? t : 'neon';
}

export function saveTheme(theme: string) {
  write(KEYS.theme, theme);
}

export function loadDailyDone(): string | null {
  return read<string | null>(KEYS.dailyDone, null);
}

export function saveDailyDone(date: string) {
  write(KEYS.dailyDone, date);
}

export function bestForMode(mode: GameMode): number {
  return loadProfile().bestScore[mode] ?? 0;
}

export function resetAllData() {
  try {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  } catch {
    // ignore
  }
}
