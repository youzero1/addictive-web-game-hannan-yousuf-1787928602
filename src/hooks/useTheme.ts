import { useCallback, useEffect, useState } from 'react';
import { loadTheme, saveTheme } from '@/lib/storage';

export const THEMES = [
  { id: 'neon', label: 'Neon' },
  { id: 'crt', label: 'Retro CRT' },
  { id: 'pastel', label: 'Pastel' },
] as const;

export type ThemeId = (typeof THEMES)[number]['id'];

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeId>(() => loadTheme() as ThemeId);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const setTheme = useCallback((next: ThemeId) => {
    setThemeState(next);
    saveTheme(next);
  }, []);

  return { theme, setTheme };
}
