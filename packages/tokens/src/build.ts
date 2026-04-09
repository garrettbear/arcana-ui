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
  border: {
    width: Record<string, string>;
    divider: Record<string, string>;
  };
  opacity: Record<string, string>;
  typography: {
    fontFamily: Record<string, string>;
    fontSize: Record<string, string>;
    fontWeight: Record<string, string>;
    lineHeight: Record<string, string>;
    letterSpacing: Record<string, string>;
  };
  shadow: Record<string, string>;
  blur: Record<string, string>;
  motion: {
    duration: Record<string, string>;
    easing: Record<string, string>;
  };
  zIndex: Record<string, string>;
  layout: Record<string, string>;
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
  layout?: Record<string, string>;
  radius: Record<string, string>;
  border: {
    width: Record<string, string>;
    focus: Record<string, string>;
    divider?: Record<string, string>;
  };
  opacity?: Record<string, string>;
  motion: {
    duration: Record<string, string>;
    easing: Record<string, string>;
    transition?: Record<string, string>;
  };
  elementSizing?: Record<string, string>;
}

interface TokenPreset {
  $schema: string;
  name: string;
  version: string;
  description: string;
  primitive: PrimitiveTokens;
  semantic: SemanticTokens;
  component?: Record<string, Record<string, string | DensityValue>>;
}

/** Density-aware component token value */
interface DensityValue {
  compact: string;
  default: string;
  comfortable: string;
}

interface CSSVariable {
  name: string;
  value: string;
}

/** Component vars split by density context */
interface ComponentVarsResult {
  /** Variables for the main theme selector (default density) */
  defaultVars: CSSVariable[];
  /** Variables for compact density override */
  compactVars: CSSVariable[];
  /** Variables for comfortable density override */
  comfortableVars: CSSVariable[];
}

// ─── Reference Resolution ──────────────────────────────────────────────────

const REFERENCE_RE = /^\{(.+)\}$/;

/** Resolve a dotted path against a nested object.
 *  Handles keys that contain dots (e.g., "0.5" in spacing) by trying
 *  greedy matching: at each level, try the longest possible key first. */
function resolvePath(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.');

  function resolve(current: unknown, index: number): string | undefined {
    if (index >= parts.length) {
      return typeof current === 'string' ? current : undefined;
    }
    if (current === null || current === undefined || typeof current !== 'object') {
      return undefined;
    }
    const record = current as Record<string, unknown>;
    // Try progressively longer keys to handle dots in key names (e.g., "0.5")
    for (let end = parts.length; end > index; end--) {
      const key = parts.slice(index, end).join('.');
      if (key in record) {
        const result = resolve(record[key], end);
        if (result !== undefined) return result;
      }
    }
    return undefined;
  }

  return resolve(obj, 0);
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

/** Size-based shadow keys (vs contextual elevation keys) */
const SHADOW_SIZE_KEYS_SET = new Set(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', 'inner']);

/**
 * Convert a token reference path (e.g., "semantic.radius.md") to its CSS variable
 * form (e.g., "var(--radius-md)"). Returns null if the mapping is unknown,
 * in which case the caller should fall back to resolveValue().
 *
 * This enables component tokens to reference semantic/primitive CSS vars at runtime,
 * so that changing a semantic token (e.g., via the playground slider) cascades to
 * all component tokens that depend on it.
 */
function referenceToVar(ref: string): string | null {
  const parts = ref.split('.');

  if (parts[0] === 'semantic') {
    if (parts[1] === 'radius' && parts[2]) return `var(--radius-${parts[2]})`;
    if (parts[1] === 'spacing' && parts[2]) return `var(--spacing-${sanitizeKey(parts[2])})`;
    if (parts[1] === 'opacity' && parts[2]) return `var(--opacity-${parts[2]})`;

    // Border
    if (parts[1] === 'border' && parts[2] === 'width' && parts[3]) {
      return `var(--border-width-${parts[3]})`;
    }

    // Elevation: size-based → --shadow-*, contextual → --elevation-*
    if (parts[1] === 'elevation' && parts[2]) {
      const prefix = SHADOW_SIZE_KEYS_SET.has(parts[2]) ? '--shadow' : '--elevation';
      return `var(${prefix}-${parts[2]})`;
    }

    // Color
    if (parts[1] === 'color' && parts[2]) {
      if (parts[2] === 'background' && parts[3])
        return `var(--color-bg-${parts.slice(3).join('-')})`;
      if (parts[2] === 'foreground' && parts[3])
        return `var(--color-fg-${parts.slice(3).join('-')})`;
      if (parts[2] === 'border' && parts[3])
        return `var(--color-border-${parts.slice(3).join('-')})`;
      if (parts[2] === 'action' && parts[3]) {
        const rest = parts.slice(3);
        // action.primary.default → --color-action-primary (no suffix for default)
        if (rest.length >= 2 && rest[rest.length - 1] === 'default') {
          return `var(--color-action-${rest.slice(0, -1).join('-')})`;
        }
        return `var(--color-action-${rest.join('-')})`;
      }
      if (parts[2] === 'status' && parts[3]) {
        const rest = parts.slice(3);
        if (rest.length >= 2 && rest[rest.length - 1] === 'default') {
          return `var(--color-status-${rest.slice(0, -1).join('-')})`;
        }
        return `var(--color-status-${rest.join('-')})`;
      }
      if (parts[2] === 'accent' && parts[3])
        return `var(--color-accent-${parts.slice(3).join('-')})`;
    }

    return null;
  }

  if (parts[0] === 'primitive') {
    if (parts[1] === 'shadow' && parts[2]) return `var(--shadow-${parts[2]})`;
    if (parts[1] === 'blur' && parts[2]) return `var(--blur-${parts[2]})`;
    if (parts[1] === 'color' && parts.length >= 3) {
      return `var(--primitive-${parts.slice(2).join('-')})`;
    }
    if (parts[1] === 'typography') {
      if (parts[2] === 'fontSize' && parts[3]) return `var(--font-size-${parts[3]})`;
      if (parts[2] === 'fontWeight' && parts[3]) return `var(--font-weight-${parts[3]})`;
      if (parts[2] === 'letterSpacing' && parts[3]) return `var(--letter-spacing-${parts[3]})`;
      if (parts[2] === 'lineHeight' && parts[3]) return `var(--line-height-${parts[3]})`;
    }
    return null;
  }

  return null;
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

  // Blur
  for (const [key, value] of Object.entries(primitive.blur)) {
    vars.push({ name: `--blur-${key}`, value: resolveValue(preset, value) });
  }

  // Motion duration (primitives: --duration-0, --duration-75, etc.)
  for (const [key, value] of Object.entries(primitive.motion.duration)) {
    vars.push({ name: `--duration-${key}`, value: resolveValue(preset, value) });
  }

  // Motion easing (primitives: --ease-linear, --ease-default, etc.)
  for (const [key, value] of Object.entries(primitive.motion.easing)) {
    vars.push({ name: `--ease-${key}`, value: resolveValue(preset, value) });
  }

  // Z-index
  for (const [key, value] of Object.entries(primitive.zIndex)) {
    vars.push({ name: `--z-${key}`, value: resolveValue(preset, value) });
  }

  // Layout
  for (const [key, value] of Object.entries(primitive.layout)) {
    vars.push({ name: `--${key}`, value: resolveValue(preset, value) });
  }

  // Border widths
  for (const [key, value] of Object.entries(primitive.border.width)) {
    vars.push({ name: `--border-${key}`, value: resolveValue(preset, value) });
  }

  // Divider primitives
  for (const [key, value] of Object.entries(primitive.border.divider)) {
    vars.push({ name: `--divider-${key}`, value: resolveValue(preset, value) });
  }

  // Opacity
  for (const [key, value] of Object.entries(primitive.opacity)) {
    vars.push({ name: `--opacity-${key}`, value: resolveValue(preset, value) });
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
  // Also emits --font-size-fluid-* aliases so components can reference the fluid variant explicitly
  if (semantic.typography.size) {
    for (const [key, value] of Object.entries(semantic.typography.size)) {
      const resolved = resolveValue(preset, value);
      vars.push({ name: `--font-size-${key}`, value: resolved });
      vars.push({ name: `--font-size-fluid-${key}`, value: resolved });
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

  // Element sizing (heights and padding for interactive elements)
  if (semantic.elementSizing) {
    for (const [key, value] of Object.entries(semantic.elementSizing)) {
      vars.push({ name: `--${key}`, value: resolveValue(preset, value) });
    }
  }

  // Elevation → --shadow-* (size-based) + --elevation-* (contextual)
  for (const [key, value] of Object.entries(semantic.elevation)) {
    const prefix = SHADOW_SIZE_KEYS_SET.has(key) ? '--shadow' : '--elevation';
    vars.push({ name: `${prefix}-${key}`, value: resolveValue(preset, value) });
  }

  // Layout
  if (semantic.layout) {
    for (const [key, value] of Object.entries(semantic.layout)) {
      vars.push({ name: `--${key}`, value: resolveValue(preset, value) });
    }
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
  if (semantic.border.focus.ringWidth) {
    vars.push({
      name: '--focus-ring-width',
      value: resolveValue(preset, semantic.border.focus.ringWidth),
    });
  }
  if (semantic.border.focus.ringColor) {
    vars.push({
      name: '--focus-ring-color',
      value: resolveValue(preset, semantic.border.focus.ringColor),
    });
  }
  vars.push({ name: '--focus-ring', value: resolveValue(preset, semantic.border.focus.ring) });
  if (semantic.border.focus.ringError) {
    vars.push({
      name: '--focus-ring-error',
      value: resolveValue(preset, semantic.border.focus.ringError),
    });
  }
  vars.push({ name: '--focus-offset', value: resolveValue(preset, semantic.border.focus.offset) });

  // Border divider
  if (semantic.border.divider) {
    for (const [key, value] of Object.entries(semantic.border.divider)) {
      vars.push({ name: `--divider-${key}`, value: resolveValue(preset, value) });
    }
  }

  // Opacity
  if (semantic.opacity) {
    for (const [key, value] of Object.entries(semantic.opacity)) {
      vars.push({ name: `--opacity-${key}`, value: resolveValue(preset, value) });
    }
  }

  // Motion duration
  for (const [key, value] of Object.entries(semantic.motion.duration)) {
    vars.push({ name: `--duration-${key}`, value: resolveValue(preset, value) });
  }

  // Motion easing
  for (const [key, value] of Object.entries(semantic.motion.easing)) {
    vars.push({ name: `--ease-${key}`, value: resolveValue(preset, value) });
  }

  // Motion transition shorthands
  if (semantic.motion.transition) {
    for (const [key, value] of Object.entries(semantic.motion.transition)) {
      vars.push({ name: `--transition-${key}`, value });
    }
  }

  return vars;
}

/**
 * Check if a value is a density-aware object (has compact/default/comfortable keys).
 */
function isDensityValue(value: unknown): value is DensityValue {
  return (
    typeof value === 'object' &&
    value !== null &&
    'default' in value &&
    typeof (value as Record<string, unknown>).default === 'string'
  );
}

/**
 * Resolve a component token value. If the value is a {reference} to a semantic
 * or primitive token, emit a var() reference to the corresponding CSS variable
 * so that runtime changes cascade. Falls back to resolveValue() for unknown refs
 * or raw values.
 */
function resolveComponentValue(preset: Record<string, unknown>, value: string): string {
  const match = REFERENCE_RE.exec(value);
  if (match) {
    const varRef = referenceToVar(match[1]);
    if (varRef) return varRef;
  }
  // Already a var() reference or raw value — use as-is or resolve
  return resolveValue(preset, value);
}

/**
 * Generate CSS variables for the component tier.
 * component.{name}.{prop} → --{name}-{prop}
 *
 * Density-aware values (objects with compact/default/comfortable) produce:
 *   - Default value in the main theme selector
 *   - Compact override in [data-theme][data-density="compact"]
 *   - Comfortable override in [data-theme][data-density="comfortable"]
 */
function generateComponentVars(
  component: Record<string, Record<string, string | DensityValue>>,
  preset: Record<string, unknown>,
): ComponentVarsResult {
  const defaultVars: CSSVariable[] = [];
  const compactVars: CSSVariable[] = [];
  const comfortableVars: CSSVariable[] = [];

  for (const [name, props] of Object.entries(component)) {
    for (const [prop, value] of Object.entries(props)) {
      const varName = `--${name}-${prop}`;

      if (isDensityValue(value)) {
        defaultVars.push({ name: varName, value: resolveComponentValue(preset, value.default) });
        if (value.compact) {
          compactVars.push({ name: varName, value: resolveComponentValue(preset, value.compact) });
        }
        if (value.comfortable) {
          comfortableVars.push({
            name: varName,
            value: resolveComponentValue(preset, value.comfortable),
          });
        }
      } else {
        defaultVars.push({ name: varName, value: resolveComponentValue(preset, value) });
      }
    }
  }

  return { defaultVars, compactVars, comfortableVars };
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
  corporate: 'light',
  startup: 'light',
  editorial: 'light',
  commerce: 'light',
  midnight: 'dark',
  nature: 'light',
  neon: 'dark',
  mono: 'light',
};

// ─── CSS File Generation ───────────────────────────────────────────────────

/** Result of generating all vars for a preset, including density overrides */
interface AllVarsResult {
  vars: CSSVariable[];
  compactVars: CSSVariable[];
  comfortableVars: CSSVariable[];
}

/** Generate all CSS variables for a single preset */
function generateAllVars(preset: TokenPreset): AllVarsResult {
  const presetObj = preset as unknown as Record<string, unknown>;
  const primitiveVars = generatePrimitiveVars(preset.primitive, presetObj);
  const semanticVars = generateSemanticVars(preset.semantic, presetObj);

  const emptyResult: ComponentVarsResult = {
    defaultVars: [],
    compactVars: [],
    comfortableVars: [],
  };
  const componentResult = preset.component
    ? generateComponentVars(preset.component, presetObj)
    : emptyResult;

  return {
    vars: [...primitiveVars, ...semanticVars, ...componentResult.defaultVars],
    compactVars: componentResult.compactVars,
    comfortableVars: componentResult.comfortableVars,
  };
}

/** Generate individual theme CSS file */
function generateThemeCSS(preset: TokenPreset): string {
  const themeName = getThemeName(preset);
  const selector = getThemeSelector(themeName);
  const { vars, compactVars, comfortableVars } = generateAllVars(preset);

  const sections: string[] = [
    '/**',
    ` * Arcana UI — ${capitalize(themeName)} Theme`,
    ` * ${preset.description}`,
    ' * Generated from JSON source. Do not edit directly.',
    ' */',
    '',
    formatCSSBlock(selector, vars),
    '',
  ];

  if (compactVars.length > 0) {
    sections.push(formatCSSBlock(`${selector}[data-density="compact"]`, compactVars));
    sections.push('');
  }
  if (comfortableVars.length > 0) {
    sections.push(formatCSSBlock(`${selector}[data-density="comfortable"]`, comfortableVars));
    sections.push('');
  }

  return sections.join('\n');
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
    const selector = getThemeSelector(themeName);
    const { vars, compactVars, comfortableVars } = generateAllVars(preset);
    sections.push(`/* ─── ${label} Theme${isDefault} ─── */`);
    sections.push(formatCSSBlock(selector, vars));
    sections.push('');

    if (compactVars.length > 0) {
      sections.push(formatCSSBlock(`${selector}[data-density="compact"]`, compactVars));
      sections.push('');
    }
    if (comfortableVars.length > 0) {
      sections.push(formatCSSBlock(`${selector}[data-density="comfortable"]`, comfortableVars));
      sections.push('');
    }
  }

  // Density modes (theme-independent)
  sections.push(
    '/* ─── Density: Compact ─── */',
    '[data-density="compact"] {',
    '  --spacing-xs: var(--spacing-0-5);',
    '  --spacing-sm: var(--spacing-1);',
    '  --spacing-md: var(--spacing-2);',
    '  --spacing-lg: var(--spacing-3);',
    '  --spacing-xl: var(--spacing-5);',
    '  --spacing-2xl: var(--spacing-8);',
    '  --spacing-3xl: var(--spacing-12);',
    '  --spacing-section: var(--spacing-16);',
    '  --spacing-section-lg: var(--spacing-24);',
    '',
    '  /* Element sizing — compact */  ',
    '  --element-height-xs: 1.5rem;',
    '  --element-height-sm: 1.75rem;',
    '  --element-height-md: 2.25rem;',
    '  --element-height-lg: 2.75rem;',
    '  --element-height-xl: 3.25rem;',
    '',
    '  --element-padding-y-xs: 0.125rem;',
    '  --element-padding-y-sm: 0.25rem;',
    '  --element-padding-y-md: 0.375rem;',
    '  --element-padding-y-lg: 0.5rem;',
    '  --element-padding-y-xl: 0.625rem;',
    '',
    '  --element-padding-x-xs: 0.375rem;',
    '  --element-padding-x-sm: 0.5rem;',
    '  --element-padding-x-md: 0.75rem;',
    '  --element-padding-x-lg: 1rem;',
    '  --element-padding-x-xl: 1.25rem;',
    '}',
    '',
    '/* ─── Density: Comfortable ─── */',
    '[data-density="comfortable"] {',
    '  --spacing-xs: var(--spacing-2);',
    '  --spacing-sm: var(--spacing-3);',
    '  --spacing-md: var(--spacing-6);',
    '  --spacing-lg: var(--spacing-8);',
    '  --spacing-xl: var(--spacing-12);',
    '  --spacing-2xl: var(--spacing-16);',
    '  --spacing-3xl: var(--spacing-24);',
    '  --spacing-section: var(--spacing-32);',
    '  --spacing-section-lg: var(--spacing-40);',
    '',
    '  /* Element sizing — comfortable */  ',
    '  --element-height-xs: 2rem;',
    '  --element-height-sm: 2.25rem;',
    '  --element-height-md: 2.75rem;',
    '  --element-height-lg: 3.25rem;',
    '  --element-height-xl: 3.75rem;',
    '',
    '  --element-padding-y-xs: 0.375rem;',
    '  --element-padding-y-sm: 0.5rem;',
    '  --element-padding-y-md: 0.625rem;',
    '  --element-padding-y-lg: 0.75rem;',
    '  --element-padding-y-xl: 0.875rem;',
    '',
    '  --element-padding-x-xs: 0.625rem;',
    '  --element-padding-x-sm: 0.875rem;',
    '  --element-padding-x-md: 1.25rem;',
    '  --element-padding-x-lg: 1.5rem;',
    '  --element-padding-x-xl: 1.75rem;',
    '}',
    '',
  );

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

  // Reduced-motion: zero out all duration tokens for accessibility
  sections.push(
    '',
    '/* ─── Reduced Motion ─── */',
    '@media (prefers-reduced-motion: reduce) {',
    '  :root {',
    '    --duration-0: 0ms;',
    '    --duration-75: 0ms;',
    '    --duration-100: 0ms;',
    '    --duration-150: 0ms;',
    '    --duration-200: 0ms;',
    '    --duration-300: 0ms;',
    '    --duration-500: 0ms;',
    '    --duration-700: 0ms;',
    '    --duration-1000: 0ms;',
    '    --duration-instant: 0ms;',
    '    --duration-fast: 0ms;',
    '    --duration-normal: 0ms;',
    '    --duration-slow: 0ms;',
    '    --duration-slower: 0ms;',
    '  }',
    '}',
  );

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
    ['--arcana-spacing-9', 'var(--spacing-9)'],
    ['--arcana-spacing-10', 'var(--spacing-10)'],
    ['--arcana-spacing-11', 'var(--spacing-11)'],
    ['--arcana-spacing-12', 'var(--spacing-12)'],
    ['--arcana-spacing-14', 'var(--spacing-14)'],
    ['--arcana-spacing-16', 'var(--spacing-16)'],
    ['--arcana-spacing-20', 'var(--spacing-20)'],
    ['--arcana-spacing-24', 'var(--spacing-24)'],
    ['--arcana-spacing-28', 'var(--spacing-28)'],
    ['--arcana-spacing-32', 'var(--spacing-32)'],
    ['--arcana-spacing-36', 'var(--spacing-36)'],
    ['--arcana-spacing-40', 'var(--spacing-40)'],
    ['--arcana-spacing-44', 'var(--spacing-44)'],
    ['--arcana-spacing-48', 'var(--spacing-48)'],
    // Radius
    ['--arcana-radius-none', 'var(--radius-none)'],
    ['--arcana-radius-xs', 'var(--radius-xs)'],
    ['--arcana-radius-sm', 'var(--radius-sm)'],
    ['--arcana-radius-md', 'var(--radius-md)'],
    ['--arcana-radius-lg', 'var(--radius-lg)'],
    ['--arcana-radius-xl', 'var(--radius-xl)'],
    ['--arcana-radius-2xl', 'var(--radius-2xl)'],
    ['--arcana-radius-3xl', 'var(--radius-3xl)'],
    ['--arcana-radius-full', 'var(--radius-full)'],
    // Border width
    ['--arcana-border-width-thin', 'var(--border-width-thin)'],
    ['--arcana-border-width-default', 'var(--border-width-default)'],
    ['--arcana-border-width-thick', 'var(--border-width-thick)'],
    ['--arcana-border-width-heavy', 'var(--border-width-heavy)'],
    // Opacity
    ['--arcana-opacity-disabled', 'var(--opacity-disabled)'],
    ['--arcana-opacity-overlay', 'var(--opacity-overlay)'],
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
    ['--arcana-z-index-fixed', 'var(--z-fixed)'],
    ['--arcana-z-index-popover', 'var(--z-popover)'],
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
  const primRequired = [
    'color',
    'spacing',
    'radius',
    'border',
    'opacity',
    'typography',
    'shadow',
    'blur',
    'motion',
    'zIndex',
    'layout',
  ];
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
    const { compactVars, comfortableVars } = generateAllVars(preset);
    const densityNote =
      compactVars.length > 0 || comfortableVars.length > 0
        ? ` + ${compactVars.length + comfortableVars.length} density overrides`
        : '';
    console.log(`  ✓ dist/themes/${themeName}.css (${varCount} variables${densityNote})`);
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
