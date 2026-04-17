import {
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useMediaQuery } from '../hooks/useMediaQuery';
import type { ThemeId, ThemeSource, UseThemeReturn } from '../hooks/useTheme';

/** Props for the ThemeProvider component. */
export interface ThemeProviderProps {
  /** Child elements to render within the theme context. */
  children: ReactNode;
  /**
   * Default theme to use when no stored preference exists and system detection is not used.
   *
   * Pass `null` or `"inherit"` to leave the existing `data-theme` attribute on `<html>`
   * untouched — useful when the host app manages the attribute itself (e.g. a playground
   * rendering arbitrary themes, or SSR that has already written the attribute).
   */
  defaultTheme?: ThemeId | null | 'inherit';
  /** localStorage key for persisting theme preference. */
  storageKey?: string;
  /** When `true`, add smooth CSS transitions during theme changes. */
  enableTransitions?: boolean;
  /**
   * Additional theme ids beyond the built-in set. When provided, these are considered
   * valid stored values and are included in the `themes` array exposed via context.
   */
  customThemes?: readonly string[];
}

const ATTRIBUTE = 'data-theme';
const TRANSITION_ATTRIBUTE = 'data-theme-transition';

const BUILT_IN_THEME_IDS: readonly ThemeId[] = [
  'light',
  'dark',
  'terminal',
  'retro98',
  'glass',
  'brutalist',
  'corporate',
  'startup',
  'editorial',
  'commerce',
  'midnight',
  'nature',
  'neon',
  'mono',
] as const;

const ThemeContext = createContext<UseThemeReturn | null>(null);

/**
 * Reads the persisted theme from localStorage. A stored value is accepted if it
 * matches either a built-in theme id or one of the caller-supplied `customThemes`.
 */
function getStoredTheme(key: string, validThemes: readonly string[]): ThemeId | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(key);
    if (stored && validThemes.includes(stored)) {
      return stored as ThemeId;
    }
  } catch {
    // localStorage may be unavailable
  }
  return null;
}

/**
 * Persists the theme choice to localStorage.
 */
function storeTheme(key: string, theme: ThemeId | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (theme === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, theme);
    }
  } catch {
    // Silently fail
  }
}

/**
 * Provides theme state to the component tree via React context.
 *
 * Handles system preference detection (`prefers-color-scheme`), manual override,
 * localStorage persistence, and optional CSS transitions during theme changes.
 *
 * @example
 * ```tsx
 * import { ThemeProvider, useThemeContext } from '@arcana-ui/core';
 *
 * function App() {
 *   return (
 *     <ThemeProvider defaultTheme="light" enableTransitions>
 *       <ThemeSwitcher />
 *     </ThemeProvider>
 *   );
 * }
 *
 * function ThemeSwitcher() {
 *   const { theme, setTheme, themes } = useThemeContext();
 *   return (
 *     <select value={theme} onChange={(e) => setTheme(e.target.value as ThemeId)}>
 *       {themes.map((t) => <option key={t} value={t}>{t}</option>)}
 *     </select>
 *   );
 * }
 * ```
 */
export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'arcana-theme',
  enableTransitions = false,
  customThemes,
}: ThemeProviderProps): ReactNode {
  const systemPrefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');

  // When defaultTheme is null or "inherit", the provider never writes data-theme
  // on its own — the host app owns that attribute.
  const inheritMode = defaultTheme === null || defaultTheme === 'inherit';

  const validThemes = useMemo<readonly string[]>(
    () =>
      customThemes && customThemes.length > 0
        ? [...BUILT_IN_THEME_IDS, ...customThemes]
        : BUILT_IN_THEME_IDS,
    [customThemes],
  );

  const [manualTheme, setManualTheme] = useState<ThemeId | null>(() =>
    getStoredTheme(storageKey, validThemes),
  );

  // Resolve: manual > existing data-theme (inherit mode) > system > defaultTheme
  const resolvedTheme: ThemeId = useMemo(() => {
    if (manualTheme !== null) return manualTheme;
    if (inheritMode) {
      if (typeof document !== 'undefined') {
        const existing = document.documentElement.getAttribute(ATTRIBUTE);
        if (existing) return existing;
      }
      return systemPrefersDark ? 'dark' : 'light';
    }
    return systemPrefersDark ? 'dark' : (defaultTheme as ThemeId);
  }, [manualTheme, inheritMode, systemPrefersDark, defaultTheme]);

  const source: ThemeSource = manualTheme !== null ? 'manual' : 'system';

  // Apply theme to DOM
  useEffect(() => {
    const root = document.documentElement;

    // In inherit mode, only write data-theme when the user has explicitly
    // picked a manual theme; otherwise leave whatever the host app set.
    if (inheritMode && manualTheme === null) {
      return;
    }

    const shouldTransition = enableTransitions && !prefersReducedMotion;

    if (shouldTransition) {
      root.setAttribute(TRANSITION_ATTRIBUTE, '');
    }

    root.setAttribute(ATTRIBUTE, resolvedTheme);

    if (shouldTransition) {
      const timer = setTimeout(() => {
        root.removeAttribute(TRANSITION_ATTRIBUTE);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [resolvedTheme, enableTransitions, prefersReducedMotion, inheritMode, manualTheme]);

  const setTheme = useCallback(
    (theme: ThemeId) => {
      setManualTheme(theme);
      storeTheme(storageKey, theme);
    },
    [storageKey],
  );

  const followSystem = useCallback(() => {
    setManualTheme(null);
    storeTheme(storageKey, null);
  }, [storageKey]);

  const value = useMemo<UseThemeReturn>(
    () => ({
      theme: resolvedTheme,
      source,
      themes: validThemes as readonly ThemeId[],
      systemPrefersDark,
      setTheme,
      followSystem,
    }),
    [resolvedTheme, source, validThemes, systemPrefersDark, setTheme, followSystem],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

/**
 * Access the theme context provided by `ThemeProvider`.
 *
 * @throws Error if called outside of a `ThemeProvider`.
 *
 * @example
 * ```tsx
 * const { theme, setTheme } = useThemeContext();
 * ```
 */
export function useThemeContext(): UseThemeReturn {
  const ctx = useContext(ThemeContext);
  if (ctx === null) {
    throw new Error('useThemeContext must be used within a <ThemeProvider>.');
  }
  return ctx;
}
