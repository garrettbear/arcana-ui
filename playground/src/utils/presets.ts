/**
 * Theme preset system for Arcana UI Playground.
 *
 * Each preset activates a `[data-theme="name"]` selector from arcana.css.
 * Optional globalCSS can inject extra styles (e.g., body backgrounds).
 */

export type PresetId =
  | 'light'
  | 'dark'
  | 'terminal'
  | 'retro98'
  | 'glass'
  | 'brutalist'
  | 'corporate'
  | 'startup'
  | 'editorial'
  | 'commerce'
  | 'midnight'
  | 'nature'
  | 'neon'
  | 'mono';

export interface ThemePreset {
  id: PresetId;
  label: string;
  emoji: string;
  description: string;
  /** CSS custom property overrides (applied via documentElement.style) */
  tokens: Record<string, string>;
  /** Optional CSS injected into a <style> tag (for body bg, etc.) */
  globalCSS?: string;
  /** Inline SVG brand logo for theme gallery */
  logo?: string;
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

  // 3. Set data-theme attribute — arcana.css has selectors for all 14 themes
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

/**
 * Apply an AI-generated theme on top of a base preset.
 *
 * Generated themes follow a simplified schema (primitive colors + fonts +
 * radius, semantic references using the `{primitive.path}` syntax). We flatten
 * them to CSS custom property overrides and apply them inline, using `light`
 * or `dark` as the base depending on the theme's background luminance so
 * every unmapped token has a reasonable fallback.
 */
export function applyGeneratedTheme(theme: {
  name?: string;
  primitive?: Record<string, unknown>;
  semantic?: Record<string, unknown>;
}): void {
  const overrides = flattenGeneratedTheme(theme);

  // Pick base preset by background luminance. If we can't tell, default to light.
  const bg = overrides['--color-bg-page'];
  const isDark = bg ? isDarkColor(bg) : false;
  const basePreset = PRESETS.find((p) => p.id === (isDark ? 'dark' : 'light'));

  const root = document.documentElement;

  // Clear previous overrides + global CSS (same pattern as applyPreset)
  for (const k of appliedTokenKeys) root.style.removeProperty(k);
  appliedTokenKeys = [];
  injectedStyleEl?.remove();
  injectedStyleEl = null;

  // Lay down the base preset's data-theme so unmapped vars still have values.
  root.setAttribute('data-theme', isDark ? 'dark' : 'light');

  // Apply base preset's own overrides first (if any)
  if (basePreset) {
    for (const [varName, value] of Object.entries(basePreset.tokens)) {
      root.style.setProperty(varName, value);
      appliedTokenKeys.push(varName);
    }
  }

  // Then stack the generated theme's overrides on top
  for (const [varName, value] of Object.entries(overrides)) {
    if (!value) continue;
    root.style.setProperty(varName, value);
    appliedTokenKeys.push(varName);
  }
}

/** Flatten a generated theme JSON into a { cssVar: value } map. */
export function flattenGeneratedTheme(theme: {
  primitive?: Record<string, unknown>;
  semantic?: Record<string, unknown>;
}): Record<string, string> {
  const primitive = (theme.primitive ?? {}) as Record<string, unknown>;
  const semantic = (theme.semantic ?? {}) as Record<string, unknown>;

  const resolve = (value: unknown): string | undefined => {
    if (typeof value !== 'string') return undefined;
    const match = /^\{(.+)\}$/.exec(value.trim());
    if (!match) return value;
    const path = match[1].split('.');
    let cursor: unknown = { primitive, semantic };
    for (const key of path) {
      if (cursor && typeof cursor === 'object' && key in (cursor as Record<string, unknown>)) {
        cursor = (cursor as Record<string, unknown>)[key];
      } else {
        return undefined;
      }
    }
    return typeof cursor === 'string' ? cursor : undefined;
  };

  const semColor = (...path: string[]): string | undefined => {
    let cursor: unknown = semantic;
    for (const k of ['color', ...path]) {
      if (cursor && typeof cursor === 'object' && k in (cursor as Record<string, unknown>)) {
        cursor = (cursor as Record<string, unknown>)[k];
      } else return undefined;
    }
    return resolve(cursor);
  };

  const primValue = (...path: string[]): string | undefined => {
    let cursor: unknown = primitive;
    for (const k of path) {
      if (cursor && typeof cursor === 'object' && k in (cursor as Record<string, unknown>)) {
        cursor = (cursor as Record<string, unknown>)[k];
      } else return undefined;
    }
    return typeof cursor === 'string' ? cursor : undefined;
  };

  const map: Record<string, string | undefined> = {
    // Backgrounds
    '--color-bg-page': semColor('background', 'default'),
    '--color-bg-surface': semColor('background', 'surface'),
    '--color-bg-elevated': semColor('background', 'elevated'),
    '--color-bg-subtle': semColor('background', 'surface'),
    '--color-bg-sunken': semColor('background', 'surface'),

    // Foregrounds
    '--color-fg-primary': semColor('foreground', 'primary'),
    '--color-fg-secondary': semColor('foreground', 'secondary'),
    '--color-fg-muted': semColor('foreground', 'muted'),

    // Actions
    '--color-action-primary': semColor('action', 'primary'),
    '--color-action-primary-hover': semColor('action', 'primaryHover'),
    '--color-action-primary-active': semColor('action', 'primaryActive'),
    '--color-action-secondary': semColor('action', 'secondary'),
    '--color-action-secondary-hover': semColor('action', 'secondaryHover'),

    // Borders
    '--color-border-default': semColor('border', 'default'),
    '--color-border-strong': semColor('border', 'strong'),
    '--color-border-focus': semColor('border', 'focus'),

    // Feedback
    '--color-action-destructive': semColor('feedback', 'danger'),
    '--color-action-success': semColor('feedback', 'success'),
    '--color-action-warning': semColor('feedback', 'warning'),

    // Radius
    '--radius-sm': primValue('radius', 'sm'),
    '--radius-md': primValue('radius', 'md'),
    '--radius-lg': primValue('radius', 'lg'),
    '--radius-xl': primValue('radius', 'xl'),
    '--radius-full': primValue('radius', 'full'),

    // Fonts
    '--font-family-display': primValue('font', 'display'),
    '--font-family-body': primValue('font', 'body'),
    '--font-family-mono': primValue('font', 'mono'),
  };

  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(map)) {
    if (typeof v === 'string' && v.length > 0) out[k] = v;
  }
  return out;
}

function isDarkColor(hex: string): boolean {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim().replace(/^#/, '#'));
  if (!m) return false;
  const n = Number.parseInt(m[1], 16);
  const r = ((n >> 16) & 0xff) / 255;
  const g = ((n >> 8) & 0xff) / 255;
  const b = (n & 0xff) / 255;
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum < 0.5;
}

export const PRESETS: ThemePreset[] = [
  {
    id: 'light',
    label: 'Light',
    emoji: '☀️',
    description: 'Default warm stone + indigo',
    tokens: {},
    logo: '<svg viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#44403c" letter-spacing="-0.02em">arcana</text></svg>',
  },
  {
    id: 'dark',
    label: 'Dark',
    emoji: '🌙',
    description: 'Dark mode',
    logo: '<svg viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" font-family="Inter, sans-serif" font-size="14" font-weight="500" fill="#e2e8f0" letter-spacing="-0.02em">arcana</text><rect x="62" y="4" width="4" height="12" rx="2" fill="#818cf8" opacity="0.6"/></svg>',
    tokens: {},
  },
  {
    id: 'terminal',
    label: 'Terminal',
    emoji: '💻',
    description: 'Premium terminal — green phosphor on black, Warp-inspired',
    tokens: {},
    logo: '<svg viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" font-family="monospace" font-size="12" fill="#00ff41" letter-spacing="0.05em">&gt;_arcana</text></svg>',
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
    logo: '<svg viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="0" y="2" width="16" height="16" fill="#c0c0c0" stroke="#808080" stroke-width="1"/><rect x="1" y="3" width="14" height="3" fill="#000080"/><text x="20" y="15" font-family="Tahoma, sans-serif" font-size="11" font-weight="700" fill="#000000">Arcana</text></svg>',
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
    logo: '<svg viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" font-family="-apple-system, sans-serif" font-size="13" font-weight="300" fill="white" letter-spacing="0.04em" opacity="0.9">arcana</text></svg>',
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
    logo: '<svg viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="16" font-family="Arial Black, Impact, sans-serif" font-size="15" font-weight="900" fill="#000000" letter-spacing="-0.03em" text-transform="uppercase">ARCANA</text></svg>',
  },
  {
    id: 'corporate',
    label: 'Corporate',
    emoji: '🏢',
    description: 'Navy/slate, trustworthy, Stripe-inspired',
    tokens: {},
    logo: '<svg viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#1d4ed8" letter-spacing="-0.01em">arcana</text></svg>',
  },
  {
    id: 'startup',
    label: 'Startup',
    emoji: '🚀',
    description: 'Vibrant purple/pink gradients, energetic',
    tokens: {},
    logo: '<svg viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#7c3aed" letter-spacing="-0.02em">arcana</text></svg>',
  },
  {
    id: 'editorial',
    label: 'Editorial',
    emoji: '📰',
    description: 'Elegant serif, high contrast, NYT-inspired',
    tokens: {},
    logo: '<svg viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" font-family="Georgia, serif" font-size="15" font-weight="400" font-style="italic" fill="#1c1917" letter-spacing="-0.01em">arcana</text></svg>',
  },
  {
    id: 'commerce',
    label: 'Commerce',
    emoji: '🛍️',
    description: 'Clean product-focused, Shopify-inspired',
    tokens: {},
    logo: '<svg viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" font-family="Inter, sans-serif" font-size="14" font-weight="600" fill="#047857" letter-spacing="-0.01em">arcana</text></svg>',
  },
  {
    id: 'midnight',
    label: 'Midnight',
    emoji: '🌌',
    description: 'Deep navy, soft gold accents, premium finance',
    tokens: {},
    logo: '<svg viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" font-family="Inter, sans-serif" font-size="14" font-weight="500" fill="#fbbf24" letter-spacing="-0.02em">arcana</text></svg>',
  },
  {
    id: 'nature',
    label: 'Nature',
    emoji: '🌿',
    description: 'Earth tones, warm greens, organic wellness',
    tokens: {},
    logo: '<svg viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" font-family="Inter, sans-serif" font-size="14" font-weight="500" fill="#15803d" letter-spacing="-0.01em">arcana</text></svg>',
  },
  {
    id: 'neon',
    label: 'Neon',
    emoji: '⚡',
    description: 'Electric cyan/pink on dark, cyberpunk gaming',
    tokens: {},
    logo: '<svg viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" font-family="Inter, sans-serif" font-size="14" font-weight="700" fill="#22d3ee" letter-spacing="0.05em">arcana</text></svg>',
    globalCSS: `
      [data-theme="neon"] .arcana-button--primary {
        box-shadow: 0 0 12px rgba(34, 211, 238, 0.3);
      }
      [data-theme="neon"] .arcana-button--primary:hover {
        box-shadow: 0 0 20px rgba(34, 211, 238, 0.5);
      }
    `,
  },
  {
    id: 'mono',
    label: 'Mono',
    emoji: '◼️',
    description: 'Pure black and white, stark typographic minimalism',
    tokens: {},
    logo: '<svg viewBox="0 0 80 20" fill="none" xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" font-family="monospace" font-size="13" font-weight="400" fill="#000000" letter-spacing="0.02em">arcana</text></svg>',
  },
];

export function getPresetById(id: PresetId): ThemePreset | undefined {
  return PRESETS.find((p) => p.id === id);
}
