/**
 * Arcana UI Token Build Script
 * Transforms three-tier JSON design tokens → CSS custom properties
 *
 * Input:  packages/tokens/src/presets/*.json
 * Output: packages/tokens/dist/arcana.css (combined)
 *         packages/tokens/dist/themes/{name}.css (individual)
 *         packages/tokens/dist/compat.css (backward compatibility aliases)
 */

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const presetsDir = join(root, 'src/presets');
const distDir = join(root, 'dist');
const themesDir = join(distDir, 'themes');

// ─── Types ─────────────────────────────────────────────────────────────────

interface PrimitiveTokens {
  color: Record<string, string | Record<string, string>>;
  spacing: Record<string, string>;
  radius: Record<string, string>;
  typography: {
    fontFamily: Record<string, string>;
    fontSize: Record<string, string>;
    fontWeight: Record<string, string>;
    lineHeight: Record<string, string>;
    letterSpacing: Record<string, string>;
  };
  shadow: Record<string, string>;
  motion: {
    duration: Record<string, string>;
    easing: Record<string, string>;
  };
  zIndex: Record<string, string>;
}

interface SemanticTokens {
  color: {
    background: Record<string, string>;
    foreground: Record<string, string>;
    action: Record<string, Record<string, string>>;
    border: Record<string, string>;
    status: Record<string, Record<string, string>>;
    accent?: Record<string, string>;
  };
  typography: {
    family: Record<string, string>;
    size?: Record<string, string>;
    weight?: Record<string, string>;
    lineHeight?: Record<string, string>;
    letterSpacing?: Record<string, string>;
    paragraphSpacing?: string;
  };
  spacing: Record<string, string>;
  elevation: Record<string, string>;
  radius: Record<string, string>;
  border: {
    width: Record<string, string>;
    focus: Record<string, string>;
  };
  motion: {
    duration: Record<string, string>;
    easing: Record<string, string>;
  };
}

interface TokenPreset {
  $schema: string;
  name: string;
  version: string;
  description: string;
  primitive: PrimitiveTokens;
  semantic: SemanticTokens;
  component?: Record<string, Record<string, string>>;
}

interface CSSVariable {
  name: string;
  value: string;
}

// ─── Reference Resolution ──────────────────────────────────────────────────

const REFERENCE_RE = /^\{(.+)\}$/;

/** Resolve a dotted path against a nested object */
function resolvePath(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : undefined;
}

/** Resolve all {references} in a token value, with circular reference detection */
function resolveValue(
  preset: Record<string, unknown>,
  value: string,
  visited: Set<string> = new Set(),
): string {
  const match = REFERENCE_RE.exec(value);
  if (!match) return value;

  const refPath = match[1];
  if (visited.has(refPath)) {
    throw new Error(`Circular reference detected: ${[...visited, refPath].join(' → ')}`);
  }

  const resolved = resolvePath(preset, refPath);
  if (resolved === undefined) {
    throw new Error(`Broken reference: {${refPath}} — path not found in preset`);
  }

  const next = new Set(visited);
  next.add(refPath);
  return resolveValue(preset, resolved, next);
}

/** Sanitize a key for CSS variable names (dots → dashes) */
function sanitizeKey(key: string): string {
  return key.replace(/\./g, '-');
}

// ─── CSS Variable Generation ───────────────────────────────────────────────

/**
 * Generate CSS variables for the primitive tier.
 * Naming convention per MIGRATION.md:
 *   primitive.color.{hue}         → --primitive-{hue}
 *   primitive.color.{hue}.{step}  → --primitive-{hue}-{step}
 *   primitive.spacing.{n}         → --spacing-{n}
 *   primitive.typography.fontSize  → --font-size-{size}
 *   primitive.typography.fontWeight → --font-weight-{w}
 *   primitive.typography.lineHeight → --line-height-{h}
 *   primitive.typography.letterSpacing → --letter-spacing-{s}
 *   primitive.zIndex.{level}      → --z-{level}
 */
function generatePrimitiveVars(
  primitive: PrimitiveTokens,
  preset: Record<string, unknown>,
): CSSVariable[] {
  const vars: CSSVariable[] = [];

  // Colors
  for (const [hue, value] of Object.entries(primitive.color)) {
    if (typeof value === 'string') {
      vars.push({ name: `--primitive-${hue}`, value: resolveValue(preset, value) });
    } else {
      for (const [step, colorValue] of Object.entries(value)) {
        vars.push({
          name: `--primitive-${hue}-${step}`,
          value: resolveValue(preset, colorValue),
        });
      }
    }
  }

  // Spacing
  for (const [key, value] of Object.entries(primitive.spacing)) {
    vars.push({ name: `--spacing-${sanitizeKey(key)}`, value: resolveValue(preset, value) });
  }

  // Typography
  for (const [key, value] of Object.entries(primitive.typography.fontSize)) {
    vars.push({ name: `--font-size-${key}`, value: resolveValue(preset, value) });
  }
  for (const [key, value] of Object.entries(primitive.typography.fontWeight)) {
    vars.push({ name: `--font-weight-${key}`, value: resolveValue(preset, value) });
  }
  for (const [key, value] of Object.entries(primitive.typography.lineHeight)) {
    vars.push({ name: `--line-height-${key}`, value: resolveValue(preset, value) });
  }
  for (const [key, value] of Object.entries(primitive.typography.letterSpacing)) {
    vars.push({ name: `--letter-spacing-${key}`, value: resolveValue(preset, value) });
  }

  // Z-index
  for (const [key, value] of Object.entries(primitive.zIndex)) {
    vars.push({ name: `--z-${key}`, value: resolveValue(preset, value) });
  }

  return vars;
}

/**
 * Generate CSS variables for the semantic tier.
 * Naming convention per MIGRATION.md:
 *   semantic.color.background.{key}     → --color-bg-{key}
 *   semantic.color.foreground.{key}     → --color-fg-{key}
 *   semantic.color.action.{v}.default   → --color-action-{v}
 *   semantic.color.action.{v}.{state}   → --color-action-{v}-{state}
 *   semantic.color.border.{key}         → --color-border-{key}
 *   semantic.color.status.{t}.default   → --color-status-{t}
 *   semantic.color.status.{t}.{sub}     → --color-status-{t}-{sub}
 *   semantic.typography.family.{key}    → --font-family-{key}
 *   semantic.spacing.{key}              → --spacing-{key}
 *   semantic.elevation.{key}            → --shadow-{key}
 *   semantic.radius.{key}               → --radius-{key}
 *   semantic.border.width.{key}         → --border-width-{key}
 *   semantic.border.focus.ring          → --focus-ring
 *   semantic.border.focus.offset        → --focus-offset
 *   semantic.motion.duration.{key}      → --duration-{key}
 *   semantic.motion.easing.{key}        → --ease-{key}
 */
function generateSemanticVars(
  semantic: SemanticTokens,
  preset: Record<string, unknown>,
): CSSVariable[] {
  const vars: CSSVariable[] = [];

  // Background
  for (const [key, value] of Object.entries(semantic.color.background)) {
    vars.push({ name: `--color-bg-${key}`, value: resolveValue(preset, value) });
  }

  // Foreground
  for (const [key, value] of Object.entries(semantic.color.foreground)) {
    vars.push({ name: `--color-fg-${key}`, value: resolveValue(preset, value) });
  }

  // Action (nested: variant → state)
  for (const [variant, states] of Object.entries(semantic.color.action)) {
    for (const [state, value] of Object.entries(states)) {
      const suffix = state === 'default' ? '' : `-${state}`;
      vars.push({
        name: `--color-action-${variant}${suffix}`,
        value: resolveValue(preset, value),
      });
    }
  }

  // Border colors
  for (const [key, value] of Object.entries(semantic.color.border)) {
    vars.push({ name: `--color-border-${key}`, value: resolveValue(preset, value) });
  }

  // Status (nested: type → sub)
  for (const [type, subs] of Object.entries(semantic.color.status)) {
    for (const [sub, value] of Object.entries(subs)) {
      const suffix = sub === 'default' ? '' : `-${sub}`;
      vars.push({
        name: `--color-status-${type}${suffix}`,
        value: resolveValue(preset, value),
      });
    }
  }

  // Accent
  if (semantic.color.accent) {
    for (const [key, value] of Object.entries(semantic.color.accent)) {
      vars.push({ name: `--color-accent-${key}`, value: resolveValue(preset, value) });
    }
  }

  // Typography family
  for (const [key, value] of Object.entries(semantic.typography.family)) {
    vars.push({ name: `--font-family-${key}`, value: resolveValue(preset, value) });
  }

  // Typography size (overrides primitive --font-size-* with fluid values)
  if (semantic.typography.size) {
    for (const [key, value] of Object.entries(semantic.typography.size)) {
      vars.push({ name: `--font-size-${key}`, value: resolveValue(preset, value) });
    }
  }

  // Typography weight (semantic aliases like heading, body, strong, ui)
  if (semantic.typography.weight) {
    for (const [key, value] of Object.entries(semantic.typography.weight)) {
      vars.push({ name: `--font-weight-${key}`, value: resolveValue(preset, value) });
    }
  }

  // Typography line height (semantic aliases)
  if (semantic.typography.lineHeight) {
    for (const [key, value] of Object.entries(semantic.typography.lineHeight)) {
      vars.push({ name: `--line-height-${key}`, value: resolveValue(preset, value) });
    }
  }

  // Typography letter spacing (semantic aliases)
  if (semantic.typography.letterSpacing) {
    for (const [key, value] of Object.entries(semantic.typography.letterSpacing)) {
      vars.push({ name: `--letter-spacing-${key}`, value: resolveValue(preset, value) });
    }
  }

  // Paragraph spacing
  if (semantic.typography.paragraphSpacing) {
    vars.push({
      name: '--paragraph-spacing',
      value: resolveValue(preset, semantic.typography.paragraphSpacing),
    });
  }

  // Spacing
  for (const [key, value] of Object.entries(semantic.spacing)) {
    vars.push({ name: `--spacing-${key}`, value: resolveValue(preset, value) });
  }

  // Elevation → shadow
  for (const [key, value] of Object.entries(semantic.elevation)) {
    vars.push({ name: `--shadow-${key}`, value: resolveValue(preset, value) });
  }

  // Radius
  for (const [key, value] of Object.entries(semantic.radius)) {
    vars.push({ name: `--radius-${key}`, value: resolveValue(preset, value) });
  }

  // Border width
  for (const [key, value] of Object.entries(semantic.border.width)) {
    vars.push({ name: `--border-width-${key}`, value: resolveValue(preset, value) });
  }

  // Border focus
  vars.push({ name: '--focus-ring', value: resolveValue(preset, semantic.border.focus.ring) });
  if (semantic.border.focus.ringError) {
    vars.push({
      name: '--focus-ring-error',
      value: resolveValue(preset, semantic.border.focus.ringError),
    });
  }
  vars.push({ name: '--focus-offset', value: resolveValue(preset, semantic.border.focus.offset) });

  // Motion duration
  for (const [key, value] of Object.entries(semantic.motion.duration)) {
    vars.push({ name: `--duration-${key}`, value: resolveValue(preset, value) });
  }

  // Motion easing
  for (const [key, value] of Object.entries(semantic.motion.easing)) {
    vars.push({ name: `--ease-${key}`, value: resolveValue(preset, value) });
  }

  return vars;
}

/**
 * Generate CSS variables for the component tier.
 * component.{name}.{prop} → --{name}-{prop}
 */
function generateComponentVars(
  component: Record<string, Record<string, string>>,
  preset: Record<string, unknown>,
): CSSVariable[] {
  const vars: CSSVariable[] = [];
  for (const [name, props] of Object.entries(component)) {
    for (const [prop, value] of Object.entries(props)) {
      vars.push({ name: `--${name}-${prop}`, value: resolveValue(preset, value) });
    }
  }
  return vars;
}

// ─── CSS Formatting ────────────────────────────────────────────────────────

/** Format CSS variables into a selector block */
function formatCSSBlock(selector: string, vars: CSSVariable[]): string {
  const lines = vars.map((v) => `  ${v.name}: ${v.value};`);
  return `${selector} {\n${lines.join('\n')}\n}`;
}

/** Extract theme name from preset (strip "arcana-" prefix) */
function getThemeName(preset: TokenPreset): string {
  return preset.name.replace(/^arcana-/, '');
}

/** Get CSS selector for a theme */
function getThemeSelector(themeName: string): string {
  if (themeName === 'light') {
    return ':root, [data-theme="light"]';
  }
  return `[data-theme="${themeName}"]`;
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/** Sort presets: light first, dark second, rest alphabetically */
function sortPresets(presets: TokenPreset[]): TokenPreset[] {
  return [...presets].sort((a, b) => {
    const aName = getThemeName(a);
    const bName = getThemeName(b);
    if (aName === 'light') return -1;
    if (bName === 'light') return 1;
    if (aName === 'dark') return -1;
    if (bName === 'dark') return 1;
    return aName.localeCompare(bName);
  });
}

/** Known color schemes per theme */
const COLOR_SCHEMES: Record<string, string> = {
  light: 'light',
  dark: 'dark',
  terminal: 'dark',
  retro98: 'light',
  glass: 'dark',
  brutalist: 'light',
};

// ─── CSS File Generation ───────────────────────────────────────────────────

/** Generate all CSS variables for a single preset */
function generateAllVars(preset: TokenPreset): CSSVariable[] {
  const presetObj = preset as unknown as Record<string, unknown>;
  const primitiveVars = generatePrimitiveVars(preset.primitive, presetObj);
  const semanticVars = generateSemanticVars(preset.semantic, presetObj);
  const componentVars = preset.component ? generateComponentVars(preset.component, presetObj) : [];
  return [...primitiveVars, ...semanticVars, ...componentVars];
}

/** Generate individual theme CSS file */
function generateThemeCSS(preset: TokenPreset): string {
  const themeName = getThemeName(preset);
  const selector = getThemeSelector(themeName);
  const allVars = generateAllVars(preset);

  return [
    '/**',
    ` * Arcana UI — ${capitalize(themeName)} Theme`,
    ` * ${preset.description}`,
    ' * Generated from JSON source. Do not edit directly.',
    ' */',
    '',
    formatCSSBlock(selector, allVars),
    '',
  ].join('\n');
}

/** Generate combined arcana.css with all themes */
function generateCombinedCSS(presets: TokenPreset[]): string {
  const sorted = sortPresets(presets);
  const sections: string[] = [
    '/**',
    ' * Arcana UI — Design Tokens',
    ' * Generated from JSON source. Do not edit directly.',
    ' * Version: 0.1.0',
    ' */',
    '',
  ];

  for (const preset of sorted) {
    const themeName = getThemeName(preset);
    const label = capitalize(themeName);
    const isDefault = themeName === 'light' ? ' (default)' : '';
    sections.push(`/* ─── ${label} Theme${isDefault} ─── */`);
    sections.push(formatCSSBlock(getThemeSelector(themeName), generateAllVars(preset)));
    sections.push('');
  }

  // Global reset + base styles (use new token names)
  sections.push(
    '/* ─── Global Reset + Base Styles ─── */',
    '*, *::before, *::after {',
    '  box-sizing: border-box;',
    '}',
    '',
    'body {',
    '  margin: 0;',
    '  font-family: var(--font-family-body);',
    '  font-size: var(--font-size-base);',
    '  line-height: var(--line-height-normal);',
    '  color: var(--color-fg-primary);',
    '  background-color: var(--color-bg-page);',
    '  -webkit-font-smoothing: antialiased;',
    '  -moz-osx-font-smoothing: grayscale;',
    '}',
    '',
    '/* ─── Focus Visible Utility ─── */',
    ':focus-visible {',
    '  outline: 2px solid var(--color-border-focus);',
    '  outline-offset: var(--focus-offset);',
    '}',
    '',
    '/* ─── Color Scheme ─── */',
  );

  for (const preset of sorted) {
    const themeName = getThemeName(preset);
    const scheme = COLOR_SCHEMES[themeName] ?? 'light';
    sections.push(`${getThemeSelector(themeName)} { color-scheme: ${scheme}; }`);
  }

  return `${sections.join('\n')}\n`;
}

/** Generate backward-compatibility CSS aliases (old --arcana-* → new names) */
function generateCompatCSS(): string {
  // Primitive color aliases — covers all hues/steps from the light preset
  const colorAliases: [string, string][] = [];
  const colorHues: Record<string, string[]> = {
    white: [],
    stone: ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'],
    indigo: ['50', '100', '400', '500', '600', '700', '800'],
    amber: ['400', '500', '600'],
    red: ['50', '100', '400', '500', '600', '700', '800'],
    green: ['50', '100', '400', '500', '600', '700', '800'],
    blue: ['50', '100', '400', '500', '600', '700'],
  };

  for (const [hue, steps] of Object.entries(colorHues)) {
    if (steps.length === 0) {
      colorAliases.push([`--arcana-color-${hue}`, `var(--primitive-${hue})`]);
    } else {
      for (const step of steps) {
        colorAliases.push([`--arcana-color-${hue}-${step}`, `var(--primitive-${hue}-${step})`]);
      }
    }
  }

  const semanticAliases: [string, string][] = [
    // Spacing
    ['--arcana-spacing-0', 'var(--spacing-0)'],
    ['--arcana-spacing-px', 'var(--spacing-px)'],
    ['--arcana-spacing-0-5', 'var(--spacing-0-5)'],
    ['--arcana-spacing-1', 'var(--spacing-1)'],
    ['--arcana-spacing-1-5', 'var(--spacing-1-5)'],
    ['--arcana-spacing-2', 'var(--spacing-2)'],
    ['--arcana-spacing-2-5', 'var(--spacing-2-5)'],
    ['--arcana-spacing-3', 'var(--spacing-3)'],
    ['--arcana-spacing-3-5', 'var(--spacing-3-5)'],
    ['--arcana-spacing-4', 'var(--spacing-4)'],
    ['--arcana-spacing-5', 'var(--spacing-5)'],
    ['--arcana-spacing-6', 'var(--spacing-6)'],
    ['--arcana-spacing-7', 'var(--spacing-7)'],
    ['--arcana-spacing-8', 'var(--spacing-8)'],
    ['--arcana-spacing-10', 'var(--spacing-10)'],
    ['--arcana-spacing-12', 'var(--spacing-12)'],
    ['--arcana-spacing-14', 'var(--spacing-14)'],
    ['--arcana-spacing-16', 'var(--spacing-16)'],
    ['--arcana-spacing-20', 'var(--spacing-20)'],
    ['--arcana-spacing-24', 'var(--spacing-24)'],
    ['--arcana-spacing-32', 'var(--spacing-32)'],
    // Radius
    ['--arcana-radius-none', 'var(--radius-none)'],
    ['--arcana-radius-xs', 'var(--radius-xs)'],
    ['--arcana-radius-sm', 'var(--radius-sm)'],
    ['--arcana-radius-md', 'var(--radius-md)'],
    ['--arcana-radius-lg', 'var(--radius-lg)'],
    ['--arcana-radius-xl', 'var(--radius-xl)'],
    ['--arcana-radius-2xl', 'var(--radius-2xl)'],
    ['--arcana-radius-full', 'var(--radius-full)'],
    // Typography
    ['--arcana-typography-font-family-sans', 'var(--font-family-body)'],
    ['--arcana-typography-font-family-mono', 'var(--font-family-mono)'],
    ['--arcana-typography-font-size-xs', 'var(--font-size-xs)'],
    ['--arcana-typography-font-size-sm', 'var(--font-size-sm)'],
    ['--arcana-typography-font-size-base', 'var(--font-size-base)'],
    ['--arcana-typography-font-size-lg', 'var(--font-size-lg)'],
    ['--arcana-typography-font-size-xl', 'var(--font-size-xl)'],
    ['--arcana-typography-font-size-2xl', 'var(--font-size-2xl)'],
    ['--arcana-typography-font-size-3xl', 'var(--font-size-3xl)'],
    ['--arcana-typography-font-size-4xl', 'var(--font-size-4xl)'],
    ['--arcana-typography-font-size-5xl', 'var(--font-size-5xl)'],
    ['--arcana-typography-font-size-6xl', 'var(--font-size-6xl)'],
    ['--arcana-typography-font-size-7xl', 'var(--font-size-7xl)'],
    ['--arcana-typography-font-weight-light', 'var(--font-weight-light)'],
    ['--arcana-typography-font-weight-normal', 'var(--font-weight-normal)'],
    ['--arcana-typography-font-weight-medium', 'var(--font-weight-medium)'],
    ['--arcana-typography-font-weight-semibold', 'var(--font-weight-semibold)'],
    ['--arcana-typography-font-weight-bold', 'var(--font-weight-bold)'],
    ['--arcana-typography-font-weight-black', 'var(--font-weight-black)'],
    ['--arcana-typography-line-height-none', 'var(--line-height-none)'],
    ['--arcana-typography-line-height-tight', 'var(--line-height-tight)'],
    ['--arcana-typography-line-height-snug', 'var(--line-height-snug)'],
    ['--arcana-typography-line-height-normal', 'var(--line-height-normal)'],
    ['--arcana-typography-line-height-relaxed', 'var(--line-height-relaxed)'],
    ['--arcana-typography-line-height-loose', 'var(--line-height-loose)'],
    ['--arcana-typography-letter-spacing-tighter', 'var(--letter-spacing-tighter)'],
    ['--arcana-typography-letter-spacing-tight', 'var(--letter-spacing-tight)'],
    ['--arcana-typography-letter-spacing-normal', 'var(--letter-spacing-normal)'],
    ['--arcana-typography-letter-spacing-wide', 'var(--letter-spacing-wide)'],
    ['--arcana-typography-letter-spacing-wider', 'var(--letter-spacing-wider)'],
    ['--arcana-typography-letter-spacing-widest', 'var(--letter-spacing-widest)'],
    // Shadows
    ['--arcana-shadow-none', 'var(--shadow-none)'],
    ['--arcana-shadow-xs', 'var(--shadow-xs)'],
    ['--arcana-shadow-sm', 'var(--shadow-sm)'],
    ['--arcana-shadow-md', 'var(--shadow-md)'],
    ['--arcana-shadow-lg', 'var(--shadow-lg)'],
    ['--arcana-shadow-xl', 'var(--shadow-xl)'],
    ['--arcana-shadow-2xl', 'var(--shadow-2xl)'],
    ['--arcana-shadow-inner', 'var(--shadow-inner)'],
    // Motion
    ['--arcana-motion-duration-instant', 'var(--duration-instant)'],
    ['--arcana-motion-duration-fast', 'var(--duration-fast)'],
    ['--arcana-motion-duration-normal', 'var(--duration-normal)'],
    ['--arcana-motion-duration-slow', 'var(--duration-slow)'],
    ['--arcana-motion-duration-slower', 'var(--duration-slower)'],
    ['--arcana-motion-easing-default', 'var(--ease-default)'],
    ['--arcana-motion-easing-in', 'var(--ease-in)'],
    ['--arcana-motion-easing-out', 'var(--ease-out)'],
    ['--arcana-motion-easing-spring', 'var(--ease-spring)'],
    // Z-index
    ['--arcana-z-index-base', 'var(--z-base)'],
    ['--arcana-z-index-raised', 'var(--z-raised)'],
    ['--arcana-z-index-dropdown', 'var(--z-dropdown)'],
    ['--arcana-z-index-sticky', 'var(--z-sticky)'],
    ['--arcana-z-index-overlay', 'var(--z-overlay)'],
    ['--arcana-z-index-modal', 'var(--z-modal)'],
    ['--arcana-z-index-toast', 'var(--z-toast)'],
    ['--arcana-z-index-tooltip', 'var(--z-tooltip)'],
    // Surface → Background
    ['--arcana-surface-primary', 'var(--color-bg-page)'],
    ['--arcana-surface-secondary', 'var(--color-bg-surface)'],
    ['--arcana-surface-tertiary', 'var(--color-bg-subtle)'],
    ['--arcana-surface-elevated', 'var(--color-bg-elevated)'],
    ['--arcana-surface-overlay', 'var(--color-bg-overlay)'],
    ['--arcana-surface-canvas', 'var(--color-bg-sunken)'],
    // Text → Foreground
    ['--arcana-text-primary', 'var(--color-fg-primary)'],
    ['--arcana-text-secondary', 'var(--color-fg-secondary)'],
    ['--arcana-text-muted', 'var(--color-fg-muted)'],
    ['--arcana-text-disabled', 'var(--color-fg-disabled)'],
    ['--arcana-text-inverse', 'var(--color-fg-inverse)'],
    ['--arcana-text-link', 'var(--color-fg-link)'],
    ['--arcana-text-link-hover', 'var(--color-fg-link-hover)'],
    ['--arcana-text-on-action', 'var(--color-fg-on-primary)'],
    ['--arcana-text-on-danger', 'var(--color-fg-on-destructive)'],
    // Action
    ['--arcana-action-primary', 'var(--color-action-primary)'],
    ['--arcana-action-primary-hover', 'var(--color-action-primary-hover)'],
    ['--arcana-action-primary-active', 'var(--color-action-primary-active)'],
    ['--arcana-action-secondary', 'var(--color-action-secondary)'],
    ['--arcana-action-secondary-hover', 'var(--color-action-secondary-hover)'],
    ['--arcana-action-secondary-active', 'var(--color-action-secondary-active)'],
    ['--arcana-action-danger', 'var(--color-action-destructive)'],
    ['--arcana-action-danger-hover', 'var(--color-action-destructive-hover)'],
    ['--arcana-action-danger-active', 'var(--color-action-destructive-active)'],
    ['--arcana-action-ghost', 'var(--color-action-ghost)'],
    ['--arcana-action-ghost-hover', 'var(--color-action-ghost-hover)'],
    ['--arcana-action-ghost-active', 'var(--color-action-ghost-active)'],
    ['--arcana-action-outline', 'var(--color-action-outline)'],
    ['--arcana-action-outline-hover', 'var(--color-action-outline-hover)'],
    // Border
    ['--arcana-border-default', 'var(--color-border-default)'],
    ['--arcana-border-strong', 'var(--color-border-strong)'],
    ['--arcana-border-stronger', 'var(--color-border-stronger)'],
    ['--arcana-border-focus', 'var(--color-border-focus)'],
    ['--arcana-border-error', 'var(--color-border-error)'],
    ['--arcana-border-inverse', 'var(--color-border-inverse)'],
    // Feedback → Status
    ['--arcana-feedback-success', 'var(--color-status-success)'],
    ['--arcana-feedback-success-bg', 'var(--color-status-success-bg)'],
    ['--arcana-feedback-success-border', 'var(--color-status-success-border)'],
    ['--arcana-feedback-success-text', 'var(--color-status-success-fg)'],
    ['--arcana-feedback-warning', 'var(--color-status-warning)'],
    ['--arcana-feedback-warning-bg', 'var(--color-status-warning-bg)'],
    ['--arcana-feedback-warning-border', 'var(--color-status-warning-border)'],
    ['--arcana-feedback-warning-text', 'var(--color-status-warning-fg)'],
    ['--arcana-feedback-error', 'var(--color-status-error)'],
    ['--arcana-feedback-error-bg', 'var(--color-status-error-bg)'],
    ['--arcana-feedback-error-border', 'var(--color-status-error-border)'],
    ['--arcana-feedback-error-text', 'var(--color-status-error-fg)'],
    ['--arcana-feedback-info', 'var(--color-status-info)'],
    ['--arcana-feedback-info-bg', 'var(--color-status-info-bg)'],
    ['--arcana-feedback-info-border', 'var(--color-status-info-border)'],
    ['--arcana-feedback-info-text', 'var(--color-status-info-fg)'],
    // Component
    ['--arcana-component-radius', 'var(--button-radius)'],
    ['--arcana-component-border-width', 'var(--border-width-default)'],
    ['--arcana-component-focus-ring', 'var(--focus-ring)'],
  ];

  const allAliases = [...colorAliases, ...semanticAliases];

  const lines: string[] = [
    '/**',
    ' * Arcana UI — Backward Compatibility Aliases',
    ' * Maps old --arcana-* variable names to new names.',
    ' * Include this file during migration from v0.0.x.',
    ' * Generated from JSON source. Do not edit directly.',
    ' */',
    '',
    ':root {',
  ];

  for (const [oldName, newRef] of allAliases) {
    lines.push(`  ${oldName}: ${newRef};`);
  }

  lines.push('}');
  return `${lines.join('\n')}\n`;
}

// ─── Validation ────────────────────────────────────────────────────────────

/** Structural validation of a preset (required fields and patterns) */
function validatePreset(data: unknown, filename: string): TokenPreset {
  if (typeof data !== 'object' || data === null) {
    throw new Error(`${filename}: Preset must be a JSON object`);
  }

  const obj = data as Record<string, unknown>;

  const required = ['name', 'version', 'description', 'primitive', 'semantic'];
  for (const field of required) {
    if (!(field in obj)) {
      throw new Error(`${filename}: Missing required field "${field}"`);
    }
  }

  if (typeof obj.name !== 'string' || !/^arcana-[a-z0-9-]+$/.test(obj.name)) {
    throw new Error(`${filename}: "name" must match pattern "arcana-{preset-name}"`);
  }

  if (typeof obj.version !== 'string' || !/^\d+\.\d+\.\d+$/.test(obj.version)) {
    throw new Error(`${filename}: "version" must be semver (e.g., "0.1.0")`);
  }

  const primitive = obj.primitive as Record<string, unknown>;
  const primRequired = ['color', 'spacing', 'radius', 'typography', 'shadow', 'motion', 'zIndex'];
  for (const field of primRequired) {
    if (!(field in primitive)) {
      throw new Error(`${filename}: Missing primitive.${field}`);
    }
  }

  const semantic = obj.semantic as Record<string, unknown>;
  const semRequired = ['color', 'typography', 'spacing', 'elevation', 'radius', 'border', 'motion'];
  for (const field of semRequired) {
    if (!(field in semantic)) {
      throw new Error(`${filename}: Missing semantic.${field}`);
    }
  }

  return obj as unknown as TokenPreset;
}

// ─── Reporting ─────────────────────────────────────────────────────────────

/** Collect all paths referenced by semantic and component tokens */
function collectReferencedPaths(preset: TokenPreset): Set<string> {
  const refs = new Set<string>();

  function scan(obj: unknown): void {
    if (typeof obj === 'string') {
      const match = REFERENCE_RE.exec(obj);
      if (match) {
        refs.add(match[1]);
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const value of Object.values(obj as Record<string, unknown>)) {
        scan(value);
      }
    }
  }

  scan(preset.semantic);
  if (preset.component) {
    scan(preset.component);
  }

  return refs;
}

/** Collect all primitive token paths */
function collectPrimitivePaths(primitive: PrimitiveTokens): Set<string> {
  const paths = new Set<string>();

  function walk(obj: unknown, prefix: string): void {
    if (typeof obj === 'string') {
      paths.add(prefix);
    } else if (typeof obj === 'object' && obj !== null) {
      for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
        walk(value, `${prefix}.${key}`);
      }
    }
  }

  walk(primitive, 'primitive');
  return paths;
}

/** Report unreferenced primitives */
function reportUnreferencedPrimitives(preset: TokenPreset): string[] {
  const allPaths = collectPrimitivePaths(preset.primitive);
  const referencedPaths = collectReferencedPaths(preset);

  const warnings: string[] = [];
  for (const path of allPaths) {
    if (!referencedPaths.has(path)) {
      warnings.push(`  ⚠ Unreferenced primitive: ${path}`);
    }
  }

  return warnings;
}

// ─── Main ──────────────────────────────────────────────────────────────────

function main(): void {
  console.log('🔮 Arcana UI Token Build\n');

  // Read all preset files
  const presetFiles = readdirSync(presetsDir).filter((f) => f.endsWith('.json'));
  if (presetFiles.length === 0) {
    throw new Error(`No preset JSON files found in ${presetsDir}`);
  }

  const presets: TokenPreset[] = [];
  const warnings: string[] = [];

  for (const file of presetFiles.sort()) {
    const filepath = join(presetsDir, file);
    const raw = JSON.parse(readFileSync(filepath, 'utf-8')) as unknown;
    const preset = validatePreset(raw, file);
    presets.push(preset);
    console.log(`  ✓ Validated ${file} (${preset.name})`);

    const unreferenced = reportUnreferencedPrimitives(preset);
    if (unreferenced.length > 0) {
      warnings.push(`\n  ${file}:`);
      warnings.push(...unreferenced);
    }
  }

  // Ensure dist directories exist
  mkdirSync(themesDir, { recursive: true });

  console.log('');

  // Generate individual theme files
  let totalVars = 0;
  for (const preset of presets) {
    const themeName = getThemeName(preset);
    const css = generateThemeCSS(preset);
    writeFileSync(join(themesDir, `${themeName}.css`), css, 'utf-8');
    const varCount = (css.match(/ {2}--[\w-]+:/g) ?? []).length;
    totalVars += varCount;
    console.log(`  ✓ dist/themes/${themeName}.css (${varCount} variables)`);
  }

  // Generate combined CSS
  const combinedCSS = generateCombinedCSS(presets);
  writeFileSync(join(distDir, 'arcana.css'), combinedCSS, 'utf-8');
  console.log(`  ✓ dist/arcana.css (combined — all ${presets.length} themes)`);

  // Generate compat CSS
  const compatCSS = generateCompatCSS();
  writeFileSync(join(distDir, 'compat.css'), compatCSS, 'utf-8');
  const compatCount = (compatCSS.match(/ {2}--[\w-]+:/g) ?? []).length;
  console.log(`  ✓ dist/compat.css (${compatCount} backward-compatible aliases)`);

  // Summary
  console.log('\n🔮 Build complete!');
  console.log(
    `   ${presets.length} themes | ${totalVars} total variables | ${compatCount} compat aliases`,
  );

  if (warnings.length > 0) {
    console.log(`\n⚠ Unreferenced primitive warnings:${warnings.join('\n')}`);
  }
}

main();
