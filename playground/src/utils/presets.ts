/**
 * Theme preset system for Arcana UI Playground.
 *
 * Each preset is a complete set of CSS custom property overrides.
 * Applying a preset updates document.documentElement inline styles,
 * which cascade over the stylesheet-defined defaults.
 */

export type PresetId = 'light' | 'dark' | 'terminal' | 'retro98' | 'glass' | 'brutalist'

export interface ThemePreset {
  id: PresetId
  label: string
  emoji: string
  description: string
  /** Set data-theme attribute. Undefined = remove the attribute. */
  dataTheme?: 'light' | 'dark'
  /** CSS custom property overrides (applied via documentElement.style) */
  tokens: Record<string, string>
  /** Optional CSS injected into a <style> tag (for body bg, etc.) */
  globalCSS?: string
}

// Module-level state for cleanup
let appliedTokenKeys: string[] = []
let injectedStyleEl: HTMLStyleElement | null = null

/** Apply a preset — updates CSS vars and optional global styles. */
export function applyPreset(preset: ThemePreset): void {
  const root = document.documentElement

  // 1. Clear previously applied inline token overrides
  appliedTokenKeys.forEach((k) => root.style.removeProperty(k))
  appliedTokenKeys = []

  // 2. Remove previously injected global CSS
  injectedStyleEl?.remove()
  injectedStyleEl = null

  // 3. Set data-theme
  if (preset.dataTheme) {
    root.setAttribute('data-theme', preset.dataTheme)
  } else if (preset.id !== 'light' && preset.id !== 'dark') {
    // Custom presets: remove data-theme so the base CSS light values apply
    // then override everything via JS tokens
    root.removeAttribute('data-theme')
  }

  // 4. Apply token overrides
  for (const [varName, value] of Object.entries(preset.tokens)) {
    root.style.setProperty(varName, value)
    appliedTokenKeys.push(varName)
  }

  // 5. Inject global CSS if provided
  if (preset.globalCSS) {
    injectedStyleEl = document.createElement('style')
    injectedStyleEl.id = 'arcana-preset-override'
    injectedStyleEl.textContent = preset.globalCSS
    document.head.appendChild(injectedStyleEl)
  }
}

/** Read the current computed value of a CSS custom property */
export function getCSSVar(varName: string): string {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
}

const TERMINAL_TOKENS: Record<string, string> = {
  '--arcana-surface-primary': '#0d1117',
  '--arcana-surface-secondary': '#161b22',
  '--arcana-surface-tertiary': '#21262d',
  '--arcana-surface-elevated': '#1c2128',
  '--arcana-surface-overlay': 'rgba(0, 0, 0, 0.85)',
  '--arcana-surface-inverse': '#39d353',
  '--arcana-surface-canvas': '#010409',
  '--arcana-action-primary': '#39d353',
  '--arcana-action-primary-hover': '#2ea043',
  '--arcana-action-primary-active': '#26a641',
  '--arcana-action-secondary': '#21262d',
  '--arcana-action-secondary-hover': '#30363d',
  '--arcana-action-secondary-active': '#3c434b',
  '--arcana-action-danger': '#f85149',
  '--arcana-action-danger-hover': '#da3633',
  '--arcana-action-danger-active': '#b62324',
  '--arcana-action-ghost': 'transparent',
  '--arcana-action-ghost-hover': 'rgba(57, 211, 83, 0.1)',
  '--arcana-action-ghost-active': 'rgba(57, 211, 83, 0.15)',
  '--arcana-action-outline': 'transparent',
  '--arcana-action-outline-hover': 'rgba(57, 211, 83, 0.08)',
  '--arcana-text-primary': '#39d353',
  '--arcana-text-secondary': '#2ea043',
  '--arcana-text-muted': '#238636',
  '--arcana-text-disabled': '#1a4022',
  '--arcana-text-inverse': '#010409',
  '--arcana-text-link': '#58a6ff',
  '--arcana-text-link-hover': '#79c0ff',
  '--arcana-text-on-action': '#010409',
  '--arcana-text-on-danger': '#ffffff',
  '--arcana-border-default': '#21262d',
  '--arcana-border-strong': '#30363d',
  '--arcana-border-stronger': '#3d444d',
  '--arcana-border-focus': '#39d353',
  '--arcana-border-error': '#f85149',
  '--arcana-border-inverse': '#39d353',
  '--arcana-feedback-success': '#3fb950',
  '--arcana-feedback-success-bg': 'rgba(63, 185, 80, 0.12)',
  '--arcana-feedback-success-border': 'rgba(63, 185, 80, 0.3)',
  '--arcana-feedback-success-text': '#7ee787',
  '--arcana-feedback-warning': '#d29922',
  '--arcana-feedback-warning-bg': 'rgba(210, 153, 34, 0.12)',
  '--arcana-feedback-warning-border': 'rgba(210, 153, 34, 0.3)',
  '--arcana-feedback-warning-text': '#e3b341',
  '--arcana-feedback-error': '#f85149',
  '--arcana-feedback-error-bg': 'rgba(248, 81, 73, 0.12)',
  '--arcana-feedback-error-border': 'rgba(248, 81, 73, 0.3)',
  '--arcana-feedback-error-text': '#ff7b72',
  '--arcana-feedback-info': '#58a6ff',
  '--arcana-feedback-info-bg': 'rgba(88, 166, 255, 0.12)',
  '--arcana-feedback-info-border': 'rgba(88, 166, 255, 0.3)',
  '--arcana-feedback-info-text': '#79c0ff',
  '--arcana-component-radius': '0px',
  '--arcana-component-border-width': '1px',
  '--arcana-component-focus-ring': '0 0 0 3px rgba(57, 211, 83, 0.4)',
  '--arcana-typography-font-family-sans':
    "'JetBrains Mono', 'Cascadia Code', 'Fira Code', 'Courier New', monospace",
}

const RETRO98_TOKENS: Record<string, string> = {
  '--arcana-surface-primary': '#c0c0c0',
  '--arcana-surface-secondary': '#d4d0c8',
  '--arcana-surface-tertiary': '#e0ddd8',
  '--arcana-surface-elevated': '#ffffff',
  '--arcana-surface-overlay': 'rgba(0, 0, 0, 0.5)',
  '--arcana-surface-inverse': '#000080',
  '--arcana-surface-canvas': '#008080',
  '--arcana-action-primary': '#000080',
  '--arcana-action-primary-hover': '#0000aa',
  '--arcana-action-primary-active': '#00007f',
  '--arcana-action-secondary': '#c0c0c0',
  '--arcana-action-secondary-hover': '#d4d0c8',
  '--arcana-action-secondary-active': '#b0aaa0',
  '--arcana-action-danger': '#800000',
  '--arcana-action-danger-hover': '#990000',
  '--arcana-action-danger-active': '#660000',
  '--arcana-action-ghost': 'transparent',
  '--arcana-action-ghost-hover': 'rgba(0, 0, 0, 0.05)',
  '--arcana-action-ghost-active': 'rgba(0, 0, 0, 0.1)',
  '--arcana-action-outline': 'transparent',
  '--arcana-action-outline-hover': 'rgba(0, 0, 128, 0.1)',
  '--arcana-text-primary': '#000000',
  '--arcana-text-secondary': '#444444',
  '--arcana-text-muted': '#808080',
  '--arcana-text-disabled': '#808080',
  '--arcana-text-inverse': '#ffffff',
  '--arcana-text-link': '#000080',
  '--arcana-text-link-hover': '#0000cc',
  '--arcana-text-on-action': '#ffffff',
  '--arcana-text-on-danger': '#ffffff',
  '--arcana-border-default': '#808080',
  '--arcana-border-strong': '#404040',
  '--arcana-border-stronger': '#000000',
  '--arcana-border-focus': '#000080',
  '--arcana-border-error': '#800000',
  '--arcana-border-inverse': '#ffffff',
  '--arcana-feedback-success': '#008000',
  '--arcana-feedback-success-bg': '#e0ffe0',
  '--arcana-feedback-success-border': '#008000',
  '--arcana-feedback-success-text': '#004000',
  '--arcana-feedback-warning': '#808000',
  '--arcana-feedback-warning-bg': '#ffffe0',
  '--arcana-feedback-warning-border': '#808000',
  '--arcana-feedback-warning-text': '#404000',
  '--arcana-feedback-error': '#800000',
  '--arcana-feedback-error-bg': '#ffe0e0',
  '--arcana-feedback-error-border': '#800000',
  '--arcana-feedback-error-text': '#400000',
  '--arcana-feedback-info': '#000080',
  '--arcana-feedback-info-bg': '#e0e0ff',
  '--arcana-feedback-info-border': '#000080',
  '--arcana-feedback-info-text': '#000040',
  '--arcana-component-radius': '0px',
  '--arcana-component-border-width': '2px',
  '--arcana-component-focus-ring': '0 0 0 1px #000080',
  '--arcana-typography-font-family-sans':
    '"MS Sans Serif", "Tahoma", "Arial", system-ui, sans-serif',
}

const GLASS_TOKENS: Record<string, string> = {
  '--arcana-surface-primary': 'rgba(255, 255, 255, 0.15)',
  '--arcana-surface-secondary': 'rgba(255, 255, 255, 0.1)',
  '--arcana-surface-tertiary': 'rgba(255, 255, 255, 0.06)',
  '--arcana-surface-elevated': 'rgba(255, 255, 255, 0.25)',
  '--arcana-surface-overlay': 'rgba(0, 0, 0, 0.3)',
  '--arcana-surface-inverse': 'rgba(0, 0, 0, 0.8)',
  '--arcana-surface-canvas': '#667eea',
  '--arcana-action-primary': 'rgba(99, 102, 241, 0.9)',
  '--arcana-action-primary-hover': 'rgba(79, 70, 229, 0.95)',
  '--arcana-action-primary-active': '#4338ca',
  '--arcana-action-secondary': 'rgba(255, 255, 255, 0.2)',
  '--arcana-action-secondary-hover': 'rgba(255, 255, 255, 0.35)',
  '--arcana-action-secondary-active': 'rgba(255, 255, 255, 0.5)',
  '--arcana-action-danger': 'rgba(220, 38, 38, 0.9)',
  '--arcana-action-danger-hover': 'rgba(185, 28, 28, 0.95)',
  '--arcana-action-danger-active': '#991b1b',
  '--arcana-action-ghost': 'transparent',
  '--arcana-action-ghost-hover': 'rgba(255, 255, 255, 0.15)',
  '--arcana-action-ghost-active': 'rgba(255, 255, 255, 0.25)',
  '--arcana-action-outline': 'transparent',
  '--arcana-action-outline-hover': 'rgba(99, 102, 241, 0.15)',
  '--arcana-text-primary': '#ffffff',
  '--arcana-text-secondary': 'rgba(255, 255, 255, 0.8)',
  '--arcana-text-muted': 'rgba(255, 255, 255, 0.55)',
  '--arcana-text-disabled': 'rgba(255, 255, 255, 0.3)',
  '--arcana-text-inverse': '#1e1b4b',
  '--arcana-text-link': '#c7d2fe',
  '--arcana-text-link-hover': '#e0e7ff',
  '--arcana-text-on-action': '#ffffff',
  '--arcana-text-on-danger': '#ffffff',
  '--arcana-border-default': 'rgba(255, 255, 255, 0.2)',
  '--arcana-border-strong': 'rgba(255, 255, 255, 0.35)',
  '--arcana-border-stronger': 'rgba(255, 255, 255, 0.55)',
  '--arcana-border-focus': 'rgba(165, 180, 252, 0.8)',
  '--arcana-border-error': 'rgba(252, 165, 165, 0.8)',
  '--arcana-border-inverse': 'rgba(0, 0, 0, 0.3)',
  '--arcana-feedback-success': '#4ade80',
  '--arcana-feedback-success-bg': 'rgba(74, 222, 128, 0.15)',
  '--arcana-feedback-success-border': 'rgba(74, 222, 128, 0.3)',
  '--arcana-feedback-success-text': '#86efac',
  '--arcana-feedback-warning': '#fbbf24',
  '--arcana-feedback-warning-bg': 'rgba(251, 191, 36, 0.15)',
  '--arcana-feedback-warning-border': 'rgba(251, 191, 36, 0.3)',
  '--arcana-feedback-warning-text': '#fde68a',
  '--arcana-feedback-error': '#f87171',
  '--arcana-feedback-error-bg': 'rgba(248, 113, 113, 0.15)',
  '--arcana-feedback-error-border': 'rgba(248, 113, 113, 0.3)',
  '--arcana-feedback-error-text': '#fca5a5',
  '--arcana-feedback-info': '#60a5fa',
  '--arcana-feedback-info-bg': 'rgba(96, 165, 250, 0.15)',
  '--arcana-feedback-info-border': 'rgba(96, 165, 250, 0.3)',
  '--arcana-feedback-info-text': '#93c5fd',
  '--arcana-component-radius': '16px',
  '--arcana-component-border-width': '1px',
  '--arcana-component-focus-ring': '0 0 0 3px rgba(165, 180, 252, 0.4)',
  '--arcana-typography-font-family-sans':
    '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Arial, sans-serif',
}

const BRUTALIST_TOKENS: Record<string, string> = {
  '--arcana-surface-primary': '#ffffff',
  '--arcana-surface-secondary': '#f0f0f0',
  '--arcana-surface-tertiary': '#e0e0e0',
  '--arcana-surface-elevated': '#ffffff',
  '--arcana-surface-overlay': 'rgba(0, 0, 0, 0.8)',
  '--arcana-surface-inverse': '#000000',
  '--arcana-surface-canvas': '#f8f8f8',
  '--arcana-action-primary': '#000000',
  '--arcana-action-primary-hover': '#222222',
  '--arcana-action-primary-active': '#444444',
  '--arcana-action-secondary': '#ffffff',
  '--arcana-action-secondary-hover': '#f0f0f0',
  '--arcana-action-secondary-active': '#e0e0e0',
  '--arcana-action-danger': '#ff0000',
  '--arcana-action-danger-hover': '#cc0000',
  '--arcana-action-danger-active': '#990000',
  '--arcana-action-ghost': 'transparent',
  '--arcana-action-ghost-hover': 'rgba(0, 0, 0, 0.05)',
  '--arcana-action-ghost-active': 'rgba(0, 0, 0, 0.1)',
  '--arcana-action-outline': 'transparent',
  '--arcana-action-outline-hover': 'rgba(0, 0, 0, 0.05)',
  '--arcana-text-primary': '#000000',
  '--arcana-text-secondary': '#333333',
  '--arcana-text-muted': '#666666',
  '--arcana-text-disabled': '#aaaaaa',
  '--arcana-text-inverse': '#ffffff',
  '--arcana-text-link': '#0000ff',
  '--arcana-text-link-hover': '#0000cc',
  '--arcana-text-on-action': '#ffffff',
  '--arcana-text-on-danger': '#ffffff',
  '--arcana-border-default': '#000000',
  '--arcana-border-strong': '#000000',
  '--arcana-border-stronger': '#000000',
  '--arcana-border-focus': '#0000ff',
  '--arcana-border-error': '#ff0000',
  '--arcana-border-inverse': '#ffffff',
  '--arcana-feedback-success': '#008000',
  '--arcana-feedback-success-bg': '#f0fff0',
  '--arcana-feedback-success-border': '#000000',
  '--arcana-feedback-success-text': '#004400',
  '--arcana-feedback-warning': '#886600',
  '--arcana-feedback-warning-bg': '#fffff0',
  '--arcana-feedback-warning-border': '#000000',
  '--arcana-feedback-warning-text': '#554400',
  '--arcana-feedback-error': '#ff0000',
  '--arcana-feedback-error-bg': '#fff0f0',
  '--arcana-feedback-error-border': '#ff0000',
  '--arcana-feedback-error-text': '#880000',
  '--arcana-feedback-info': '#0000aa',
  '--arcana-feedback-info-bg': '#f0f0ff',
  '--arcana-feedback-info-border': '#000000',
  '--arcana-feedback-info-text': '#000055',
  '--arcana-component-radius': '0px',
  '--arcana-component-border-width': '3px',
  '--arcana-component-focus-ring': '0 0 0 3px rgba(0, 0, 255, 0.3)',
  '--arcana-typography-font-family-sans':
    '"Arial Black", "Impact", "Arial", Helvetica, sans-serif',
}

export const PRESETS: ThemePreset[] = [
  {
    id: 'light',
    label: 'Light',
    emoji: '☀️',
    description: 'Default warm stone + indigo',
    dataTheme: 'light',
    tokens: {},
  },
  {
    id: 'dark',
    label: 'Dark',
    emoji: '🌙',
    description: 'Dark mode',
    dataTheme: 'dark',
    tokens: {},
  },
  {
    id: 'terminal',
    label: 'Terminal',
    emoji: '💻',
    description: 'Green phosphor on black, mono everything',
    tokens: TERMINAL_TOKENS,
    globalCSS: `
      body { background: #010409 !important; }
    `,
  },
  {
    id: 'retro98',
    label: 'Retro 98',
    emoji: '🖥️',
    description: 'Windows 98 vibes, gray skies, 2px borders',
    tokens: RETRO98_TOKENS,
    globalCSS: `
      body { background: #008080 !important; }
    `,
  },
  {
    id: 'glass',
    label: 'Glass',
    emoji: '🫧',
    description: 'Frosted glass on gradient, Apple-inspired',
    tokens: GLASS_TOKENS,
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
    tokens: BRUTALIST_TOKENS,
    globalCSS: `
      body { background: #f8f8f8 !important; }
      * { box-shadow: none !important; transition: none !important; }
    `,
  },
]

export function getPresetById(id: PresetId): ThemePreset | undefined {
  return PRESETS.find((p) => p.id === id)
}
