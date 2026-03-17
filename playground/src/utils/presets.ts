/**
 * Theme preset system for Arcana UI Playground.
 *
 * Each preset activates a `[data-theme="name"]` selector from arcana.css.
 * Optional globalCSS can inject extra styles (e.g., body backgrounds).
 */

export type PresetId = 'light' | 'dark' | 'terminal' | 'retro98' | 'glass' | 'brutalist';

export interface ThemePreset {
  id: PresetId;
  label: string;
  emoji: string;
  description: string;
  /** CSS custom property overrides (applied via documentElement.style) */
  tokens: Record<string, string>;
  /** Optional CSS injected into a <style> tag (for body bg, etc.) */
  globalCSS?: string;
}

// Module-level state for cleanup
let appliedTokenKeys: string[] = [];
let injectedStyleEl: HTMLStyleElement | null = null;

/** Apply a preset — sets data-theme, applies optional token overrides and global styles. */
export function applyPreset(preset: ThemePreset): void {
  const root = document.documentElement;

  // 1. Clear previously applied inline token overrides
  for (const k of appliedTokenKeys) {
    root.style.removeProperty(k);
  }
  appliedTokenKeys = [];

  // 2. Remove previously injected global CSS
  injectedStyleEl?.remove();
  injectedStyleEl = null;

  // 3. Set data-theme attribute — arcana.css has selectors for all 6 themes
  root.setAttribute('data-theme', preset.id);

  // 4. Apply token overrides (if any)
  for (const [varName, value] of Object.entries(preset.tokens)) {
    root.style.setProperty(varName, value);
    appliedTokenKeys.push(varName);
  }

  // 5. Inject global CSS if provided
  if (preset.globalCSS) {
    injectedStyleEl = document.createElement('style');
    injectedStyleEl.id = 'arcana-preset-override';
    injectedStyleEl.textContent = preset.globalCSS;
    document.head.appendChild(injectedStyleEl);
  }
}

/** Read the current computed value of a CSS custom property */
export function getCSSVar(varName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
}

export const PRESETS: ThemePreset[] = [
  {
    id: 'light',
    label: 'Light',
    emoji: '☀️',
    description: 'Default warm stone + indigo',
    tokens: {},
  },
  {
    id: 'dark',
    label: 'Dark',
    emoji: '🌙',
    description: 'Dark mode',
    tokens: {},
  },
  {
    id: 'terminal',
    label: 'Terminal',
    emoji: '💻',
    description: 'Green phosphor on black, mono everything',
    tokens: {},
    globalCSS: `
      body { background: #010409 !important; }
    `,
  },
  {
    id: 'retro98',
    label: 'Retro 98',
    emoji: '🖥️',
    description: 'Windows 98 vibes, gray skies, 2px borders',
    tokens: {},
    globalCSS: `
      body { background: #008080 !important; }
    `,
  },
  {
    id: 'glass',
    label: 'Glass',
    emoji: '🫧',
    description: 'Frosted glass on gradient, Apple-inspired',
    tokens: {},
    globalCSS: `
      body {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #667eea 100%) !important;
        background-size: 400% 400% !important;
        animation: gradientShift 8s ease infinite !important;
      }
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
    `,
  },
  {
    id: 'brutalist',
    label: 'Brutalist',
    emoji: '🔲',
    description: 'No mercy, no radius, no shadows',
    tokens: {},
    globalCSS: `
      body { background: #f8f8f8 !important; }
    `,
  },
];

export function getPresetById(id: PresetId): ThemePreset | undefined {
  return PRESETS.find((p) => p.id === id);
}
