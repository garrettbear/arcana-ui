import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from 'react';

/** Built-in theme identifiers shipped with @arcana-ui/core. */
export type BuiltInThemeId =
  | 'brutalist'
  | 'commerce'
  | 'corporate'
  | 'dark'
  | 'editorial'
  | 'glass'
  | 'light'
  | 'midnight'
  | 'mono'
  | 'nature'
  | 'neon'
  | 'retro98'
  | 'startup'
  | 'terminal';

/**
 * Supported theme identifiers. Accepts both built-in themes and arbitrary
 * strings for custom themes — the `(string & {})` preserves autocomplete
 * for built-ins while allowing any string.
 */
export type ThemeId = BuiltInThemeId | (string & {});

/** The resolved source of the current theme. */
export type ThemeSource = 'manual' | 'system';

/** Return type of the `useTheme` hook. */
export interface UseThemeReturn {
  /** The currently active theme id. */
  theme: ThemeId;
  /** How the current theme was determined. */
  source: ThemeSource;
  /** All available theme ids. */
  themes: readonly ThemeId[];
  /** Whether the OS prefers dark mode. */
  systemPrefersDark: boolean;
  /** Set a specific theme, overriding system preference. */
  setTheme: (theme: ThemeId) => void;
  /** Clear manual override and follow system preference. */
  followSystem: () => void;
}

/** All available theme ids. */
const THEME_IDS: readonly ThemeId[] = [
  'light',
  'dark',
  'terminal',
  'retro98',
  'glass',
  'brutalist',
] as const;

const STORAGE_KEY = 'arcana-theme';
const ATTRIBUTE = 'data-theme';

/**
 * Reads the persisted theme from localStorage.
 * Returns `null` if no preference is stored or if running on the server.
 */
function getStoredTheme(): ThemeId | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && THEME_IDS.includes(stored as ThemeId)) {
      return stored as ThemeId;
    }
  } catch {
    // localStorage may be unavailable (e.g., private browsing)
  }
  return null;
}

/**
 * Persists the theme choice to localStorage, or removes it to follow system.
 */
function storeTheme(theme: ThemeId | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (theme === null) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, theme);
    }
  } catch {
    // Silently fail if localStorage is unavailable
  }
}

/**
 * Applies the theme to the document root element.
 */
function applyTheme(theme: ThemeId): void {
  if (typeof document === 'undefined') return;
  document.documentElement.setAttribute(ATTRIBUTE, theme);
}

/**
 * SSR-safe subscription to `prefers-color-scheme: dark` media query.
 */
function useSystemPrefersDark(): boolean {
  const query = '(prefers-color-scheme: dark)';

  const subscribe = useCallback((callback: () => void) => {
    if (typeof window === 'undefined') return () => {};
    const mql = window.matchMedia(query);
    mql.addEventListener('change', callback);
    return () => mql.removeEventListener('change', callback);
  }, []);

  const getSnapshot = useCallback((): boolean => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  }, []);

  const getServerSnapshot = useCallback((): boolean => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/**
 * Manages theme switching with system preference detection, manual override,
 * and localStorage persistence.
 *
 * SSR-safe: defaults to `"light"` when `window` is unavailable.
 *
 * @example
 * ```tsx
 * function App() {
 *   const { theme, setTheme, followSystem, systemPrefersDark } = useTheme();
 *
 *   return (
 *     <div>
 *       <p>Current theme: {theme}</p>
 *       <button onClick={() => setTheme('dark')}>Dark</button>
 *       <button onClick={() => followSystem()}>Auto</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useTheme(): UseThemeReturn {
  const systemPrefersDark = useSystemPrefersDark();

  // Initialize from stored preference, or null (follow system)
  const [manualTheme, setManualTheme] = useState<ThemeId | null>(() => getStoredTheme());

  // Resolve the active theme
  const resolvedTheme: ThemeId = manualTheme ?? (systemPrefersDark ? 'dark' : 'light');
  const source: ThemeSource = manualTheme !== null ? 'manual' : 'system';

  // Apply theme to DOM whenever it changes
  useEffect(() => {
    applyTheme(resolvedTheme);
  }, [resolvedTheme]);

  const setTheme = useCallback((theme: ThemeId) => {
    setManualTheme(theme);
    storeTheme(theme);
  }, []);

  const followSystem = useCallback(() => {
    setManualTheme(null);
    storeTheme(null);
  }, []);

  return useMemo(
    () => ({
      theme: resolvedTheme,
      source,
      themes: THEME_IDS,
      systemPrefersDark,
      setTheme,
      followSystem,
    }),
    [resolvedTheme, source, systemPrefersDark, setTheme, followSystem],
  );
}
