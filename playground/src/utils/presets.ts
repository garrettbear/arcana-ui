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
    description: 'Premium terminal — green phosphor on black, Warp-inspired',
    tokens: {},
    globalCSS: `
      [data-theme="terminal"] * {
        text-shadow: 0 0 8px rgba(0, 255, 65, 0.3);
      }
      [data-theme="terminal"] .arcana-button--primary {
        text-shadow: 0 0 12px rgba(0, 255, 65, 0.5);
      }
    `,
  },
  {
    id: 'retro98',
    label: 'Retro 98',
    emoji: '🖥️',
    description: 'Authentic Windows 98 — pixel-perfect bevels, navy blue',
    tokens: {},
    globalCSS: `
      [data-theme="retro98"] body {
        background: #008080;
      }
      [data-theme="retro98"] .arcana-button--primary {
        box-shadow: inset -1px -1px 0 0 #000080, inset 1px 1px 0 0 #0000ff;
      }
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
        background: linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #667eea 100%);
        background-size: 400% 400%;
        animation: gradientShift 12s ease infinite;
      }
      @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      [data-theme="glass"] .arcana-card,
      [data-theme="glass"] .arcana-navbar,
      [data-theme="glass"] .arcana-modal__content,
      [data-theme="glass"] .arcana-alert,
      [data-theme="glass"] .arcana-input,
      [data-theme="glass"] .arcana-select__trigger,
      [data-theme="glass"] .arcana-badge,
      [data-theme="glass"] .arcana-pricing-card {
        backdrop-filter: blur(20px);
        -webkit-backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.15);
      }
      [data-theme="glass"] .arcana-button--primary {
        backdrop-filter: blur(12px);
        -webkit-backdrop-filter: blur(12px);
      }
    `,
  },
  {
    id: 'brutalist',
    label: 'Brutalist',
    emoji: '🔲',
    description: 'No mercy, no radius, no shadows',
    tokens: {},
  },
];

export function getPresetById(id: PresetId): ThemePreset | undefined {
  return PRESETS.find((p) => p.id === id);
}
