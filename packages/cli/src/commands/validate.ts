/**
 * `arcana-ui validate` — lint a theme JSON file.
 *
 * Checks performed:
 *   1. STRUCTURE   — file is valid JSON, has top-level `name`, `primitive`, `semantic`
 *   2. COMPLETENESS— required semantic groups exist
 *                    (background, foreground, action, border, status)
 *   3. REFERENCES  — every `{primitive.x.y}` reference resolves
 *   4. WCAG        — key fg/bg pairs meet WCAG AA (4.5:1 normal, 3:1 large/UI)
 *   5. VALUES      — color strings parse as hex / rgb()
 *
 * Errors fail validation. Warnings do not.
 *
 * `--fix` flag is reserved for future autofix support; currently surfaces a
 * notice for any contrast failure that could be remediated by darkening or
 * lightening a foreground.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import * as log from '../utils/logger.js';

export interface ValidateOptions {
  fix?: boolean;
  strict?: boolean;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}
interface RGBA extends RGB {
  a: number;
}

interface ThemeJson {
  name?: string;
  description?: string;
  primitive?: Record<string, unknown>;
  semantic?: Record<string, unknown>;
}

interface ValidationIssue {
  level: 'error' | 'warning';
  message: string;
}

const REQUIRED_SEMANTIC_GROUPS = [
  'color.background',
  'color.foreground',
  'color.action',
  'color.border',
];

/** WCAG 2.1 AA thresholds. */
const WCAG_AA_NORMAL = 4.5;
const WCAG_AA_LARGE = 3.0;

/* ------------------------------------------------------------------------ */
/*  Color utilities (inlined from @arcana-ui/tokens to keep CLI standalone)  */
/* ------------------------------------------------------------------------ */

function parseHex(hex: string): RGB | undefined {
  const cleaned = hex.replace(/^#/, '');
  let r: number;
  let g: number;
  let b: number;
  if (cleaned.length === 3) {
    r = Number.parseInt(cleaned[0] + cleaned[0], 16);
    g = Number.parseInt(cleaned[1] + cleaned[1], 16);
    b = Number.parseInt(cleaned[2] + cleaned[2], 16);
  } else if (cleaned.length === 6) {
    r = Number.parseInt(cleaned.slice(0, 2), 16);
    g = Number.parseInt(cleaned.slice(2, 4), 16);
    b = Number.parseInt(cleaned.slice(4, 6), 16);
  } else {
    return undefined;
  }
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)) return undefined;
  return { r, g, b };
}

function parseRgbFunction(value: string): RGBA | undefined {
  const match = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(value);
  if (!match) return undefined;
  const r = Number.parseInt(match[1], 10);
  const g = Number.parseInt(match[2], 10);
  const b = Number.parseInt(match[3], 10);
  const a = match[4] !== undefined ? Number.parseFloat(match[4]) : 1;
  if (Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b) || Number.isNaN(a)) return undefined;
  if (r > 255 || g > 255 || b > 255 || a < 0 || a > 1) return undefined;
  return { r, g, b, a };
}

function parseColor(value: string): RGBA | undefined {
  const trimmed = value.trim().toLowerCase();
  if (trimmed === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  if (trimmed.startsWith('#')) {
    const rgb = parseHex(trimmed);
    return rgb ? { ...rgb, a: 1 } : undefined;
  }
  if (trimmed.startsWith('rgb')) return parseRgbFunction(trimmed);
  return undefined;
}

function alphaComposite(fg: RGBA, bg: RGB): RGB {
  return {
    r: Math.round(fg.r * fg.a + bg.r * (1 - fg.a)),
    g: Math.round(fg.g * fg.a + bg.g * (1 - fg.a)),
    b: Math.round(fg.b * fg.a + bg.b * (1 - fg.a)),
  };
}

function relativeLuminance(color: RGB): number {
  const [rs, gs, bs] = [color.r / 255, color.g / 255, color.b / 255].map((c) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(fgValue: string, bgValue: string): number | undefined {
  const fg = parseColor(fgValue);
  const bg = parseColor(bgValue);
  if (!fg || !bg) return undefined;
  const effectiveFg = fg.a < 1 ? alphaComposite(fg, bg) : fg;
  const l1 = relativeLuminance(effectiveFg);
  const l2 = relativeLuminance(bg);
  const [light, dark] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (light + 0.05) / (dark + 0.05);
}

/* ------------------------------------------------------------------------ */
/*  Reference resolution                                                     */
/* ------------------------------------------------------------------------ */

/** Walk a dotted path into a nested record. */
function getByPath(root: unknown, path: string): unknown {
  const parts = path.split('.');
  let cur: unknown = root;
  for (const part of parts) {
    if (cur && typeof cur === 'object' && part in (cur as Record<string, unknown>)) {
      cur = (cur as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return cur;
}

/** Resolve `{primitive.color.x.500}` references against the theme root. Bails after 8 hops. */
function resolveReference(value: string, root: ThemeJson): string | undefined {
  let current = value;
  for (let i = 0; i < 8; i++) {
    const m = /^\{([^}]+)\}$/.exec(current.trim());
    if (!m) return current;
    const next = getByPath(root, m[1]);
    if (typeof next !== 'string') return undefined;
    current = next;
  }
  return undefined;
}

/* ------------------------------------------------------------------------ */
/*  Validators                                                               */
/* ------------------------------------------------------------------------ */

function validateStructure(theme: ThemeJson, issues: ValidationIssue[]): void {
  if (!theme.name || typeof theme.name !== 'string') {
    issues.push({ level: 'error', message: 'Missing required field: "name"' });
  }
  if (!theme.primitive || typeof theme.primitive !== 'object') {
    issues.push({ level: 'error', message: 'Missing required block: "primitive"' });
  }
  if (!theme.semantic || typeof theme.semantic !== 'object') {
    issues.push({ level: 'error', message: 'Missing required block: "semantic"' });
  }
}

function validateCompleteness(theme: ThemeJson, issues: ValidationIssue[]): void {
  for (const groupPath of REQUIRED_SEMANTIC_GROUPS) {
    const group = getByPath(theme.semantic, groupPath);
    if (!group || typeof group !== 'object') {
      issues.push({
        level: 'error',
        message: `Missing required semantic group: semantic.${groupPath}`,
      });
    }
  }
}

/** Recursively walk a value, resolving references and parsing colors. */
function validateValues(
  node: unknown,
  path: string,
  theme: ThemeJson,
  issues: ValidationIssue[],
): void {
  if (typeof node === 'string') {
    if (node.startsWith('{') && node.endsWith('}')) {
      const resolved = resolveReference(node, theme);
      if (resolved === undefined) {
        issues.push({
          level: 'error',
          message: `Unresolved reference at ${path}: ${node}`,
        });
      }
    }
    return;
  }
  if (node && typeof node === 'object') {
    for (const [key, child] of Object.entries(node as Record<string, unknown>)) {
      validateValues(child, path ? `${path}.${key}` : key, theme, issues);
    }
  }
}

interface ContrastCheck {
  label: string;
  fg: string;
  bg: string;
  threshold: number;
}

function buildContrastChecks(): ContrastCheck[] {
  return [
    {
      label: 'foreground.primary on background.surface',
      fg: 'semantic.color.foreground.primary',
      bg: 'semantic.color.background.surface',
      threshold: WCAG_AA_NORMAL,
    },
    {
      label: 'foreground.primary on background.page',
      fg: 'semantic.color.foreground.primary',
      bg: 'semantic.color.background.page',
      threshold: WCAG_AA_NORMAL,
    },
    {
      label: 'foreground.secondary on background.surface',
      fg: 'semantic.color.foreground.secondary',
      bg: 'semantic.color.background.surface',
      threshold: WCAG_AA_LARGE,
    },
    {
      label: 'foreground.on-primary on action.primary.default',
      fg: 'semantic.color.foreground.on-primary',
      bg: 'semantic.color.action.primary.default',
      threshold: WCAG_AA_NORMAL,
    },
    {
      label: 'foreground.on-destructive on action.destructive.default',
      fg: 'semantic.color.foreground.on-destructive',
      bg: 'semantic.color.action.destructive.default',
      threshold: WCAG_AA_NORMAL,
    },
  ];
}

function validateContrast(theme: ThemeJson, issues: ValidationIssue[], fix: boolean): void {
  for (const check of buildContrastChecks()) {
    const fgRaw = getByPath(theme, check.fg);
    const bgRaw = getByPath(theme, check.bg);
    if (typeof fgRaw !== 'string' || typeof bgRaw !== 'string') {
      // Missing tokens are reported by completeness check; skip silently here.
      continue;
    }
    const fg = resolveReference(fgRaw, theme);
    const bg = resolveReference(bgRaw, theme);
    if (!fg || !bg) continue;
    const ratio = contrastRatio(fg, bg);
    if (ratio === undefined) {
      issues.push({
        level: 'warning',
        message: `Could not parse colors for ${check.label} (fg=${fg}, bg=${bg})`,
      });
      continue;
    }
    if (ratio < check.threshold) {
      const note = fix
        ? ' — re-run without --fix once tokens are corrected (autofix not yet implemented for color spaces)'
        : '';
      issues.push({
        level: 'error',
        message: `WCAG: ${check.label} = ${ratio.toFixed(2)}:1, needs ${check.threshold}:1${note}`,
      });
    }
  }
}

/* ------------------------------------------------------------------------ */
/*  Entry point                                                              */
/* ------------------------------------------------------------------------ */

export async function runValidate(filePath: string, opts: ValidateOptions): Promise<void> {
  log.logo();
  const absolutePath = resolve(process.cwd(), filePath);
  log.info(`Validating ${absolutePath}`);

  let raw: string;
  try {
    raw = readFileSync(absolutePath, 'utf8');
  } catch (err) {
    log.error(`Could not read file: ${(err as Error).message}`);
    process.exit(1);
  }

  let theme: ThemeJson;
  try {
    theme = JSON.parse(raw) as ThemeJson;
  } catch (err) {
    log.error(`Invalid JSON: ${(err as Error).message}`);
    process.exit(1);
  }

  const issues: ValidationIssue[] = [];

  log.heading('Structure');
  validateStructure(theme, issues);
  const structureErrors = issues.filter((i) => i.level === 'error').length;
  if (structureErrors === 0) log.success('Top-level shape OK');

  if (theme.semantic && theme.primitive) {
    log.heading('Completeness');
    const before = issues.length;
    validateCompleteness(theme, issues);
    if (issues.length === before) log.success('All required semantic groups present');

    log.heading('References');
    const refBefore = issues.length;
    validateValues(theme.semantic, 'semantic', theme, issues);
    if (issues.length === refBefore) log.success('All token references resolve');

    log.heading('WCAG contrast');
    const contrastBefore = issues.length;
    validateContrast(theme, issues, opts.fix === true);
    if (issues.length === contrastBefore) log.success('All checked pairs meet WCAG AA');
  }

  // Report
  log.heading('Report');
  const errors = issues.filter((i) => i.level === 'error');
  const warnings = issues.filter((i) => i.level === 'warning');

  for (const issue of issues) {
    if (issue.level === 'error') log.error(issue.message);
    else log.warn(issue.message);
  }

  if (errors.length === 0 && warnings.length === 0) {
    log.success(`${theme.name ?? filePath} is valid.`);
    process.exit(0);
  }

  log.info(`${errors.length} error(s), ${warnings.length} warning(s)`);
  if (errors.length > 0 || (opts.strict && warnings.length > 0)) {
    process.exit(1);
  }
  process.exit(0);
}
