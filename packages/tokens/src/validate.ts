/**
 * Arcana UI Token Validation Script
 *
 * Validates all token presets for:
 *   1. Structural integrity (required fields, naming patterns)
 *   2. Reference integrity (broken/circular references)
 *   3. Completeness (all presets match light preset structure)
 *   4. WCAG AA color contrast (fg/bg pairs meet 4.5:1 or 3:1)
 *   5. Value format validation (colors, sizes, durations)
 *
 * Exit code 0 = all checks pass, 1 = failures found.
 * Generates report at docs/audits/token-validation-report.md
 */

import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  WCAG_AA_LARGE,
  WCAG_AA_NORMAL,
  alphaComposite,
  contrastRatio,
  parseColor,
} from './utils/contrast.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const presetsDir = join(root, 'src/presets');

// ─── Types ─────────────────────────────────────────────────────────────────

interface ValidationResult {
  preset: string;
  errors: string[];
  warnings: string[];
}

interface ContrastPair {
  label: string;
  fgPath: string;
  bgPath: string;
  threshold: number;
}

// ─── Reference Resolution (shared with build.ts) ───────────────────────────

const REFERENCE_RE = /^\{(.+)\}$/;

function resolvePath(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.');

  function resolve(current: unknown, index: number): string | undefined {
    if (index >= parts.length) {
      return typeof current === 'string' ? current : undefined;
    }
    if (current === null || current === undefined || typeof current !== 'object') return undefined;
    const record = current as Record<string, unknown>;
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

function resolveValue(
  preset: Record<string, unknown>,
  value: string,
  visited: Set<string> = new Set(),
): { resolved: string; error?: string } {
  const match = REFERENCE_RE.exec(value);
  if (!match) return { resolved: value };

  const refPath = match[1];
  if (visited.has(refPath)) {
    return {
      resolved: value,
      error: `Circular reference: ${[...visited, refPath].join(' → ')}`,
    };
  }

  const target = resolvePath(preset, refPath);
  if (target === undefined) {
    return { resolved: value, error: `Broken reference: {${refPath}}` };
  }

  const next = new Set(visited);
  next.add(refPath);
  return resolveValue(preset, target, next);
}

// ─── Path Collection ───────────────────────────────────────────────────────

/** Collect all leaf paths from an object */
function collectPaths(obj: unknown, prefix: string, paths: Set<string>): void {
  if (typeof obj === 'string') {
    paths.add(prefix);
  } else if (typeof obj === 'object' && obj !== null) {
    for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
      collectPaths(value, prefix ? `${prefix}.${key}` : key, paths);
    }
  }
}

/** Collect all reference strings from an object */
function collectReferences(obj: unknown, refs: Set<string>): void {
  if (typeof obj === 'string') {
    const match = REFERENCE_RE.exec(obj);
    if (match) refs.add(match[1]);
  } else if (typeof obj === 'object' && obj !== null) {
    for (const value of Object.values(obj as Record<string, unknown>)) {
      collectReferences(value, refs);
    }
  }
}

// ─── Check 1: Structural Validation ────────────────────────────────────────

function checkStructure(data: Record<string, unknown>, filename: string): string[] {
  const errors: string[] = [];

  // Top-level fields
  const required = ['name', 'version', 'description', 'primitive', 'semantic'];
  for (const field of required) {
    if (!(field in data)) {
      errors.push(`Missing required field: "${field}"`);
    }
  }

  // Name pattern
  if (typeof data.name === 'string' && !/^arcana-[a-z0-9-]+$/.test(data.name)) {
    errors.push(`"name" must match pattern "arcana-{preset-name}", got "${data.name}"`);
  }

  // Version pattern
  if (typeof data.version === 'string' && !/^\d+\.\d+\.\d+$/.test(data.version)) {
    errors.push(`"version" must be semver, got "${data.version}"`);
  }

  // Primitive sub-sections
  if (typeof data.primitive === 'object' && data.primitive !== null) {
    const prim = data.primitive as Record<string, unknown>;
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
      if (!(field in prim)) {
        errors.push(`Missing primitive.${field}`);
      }
    }

    // Typography sub-fields
    if (typeof prim.typography === 'object' && prim.typography !== null) {
      const typo = prim.typography as Record<string, unknown>;
      for (const field of ['fontFamily', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing']) {
        if (!(field in typo)) {
          errors.push(`Missing primitive.typography.${field}`);
        }
      }
    }

    // Motion sub-fields
    if (typeof prim.motion === 'object' && prim.motion !== null) {
      const motion = prim.motion as Record<string, unknown>;
      for (const field of ['duration', 'easing']) {
        if (!(field in motion)) {
          errors.push(`Missing primitive.motion.${field}`);
        }
      }
    }

    // Border sub-fields
    if (typeof prim.border === 'object' && prim.border !== null) {
      const border = prim.border as Record<string, unknown>;
      for (const field of ['width', 'divider']) {
        if (!(field in border)) {
          errors.push(`Missing primitive.border.${field}`);
        }
      }
    }
  }

  // Semantic sub-sections
  if (typeof data.semantic === 'object' && data.semantic !== null) {
    const sem = data.semantic as Record<string, unknown>;
    const semRequired = [
      'color',
      'typography',
      'spacing',
      'elevation',
      'radius',
      'border',
      'motion',
    ];
    for (const field of semRequired) {
      if (!(field in sem)) {
        errors.push(`Missing semantic.${field}`);
      }
    }

    // Semantic color sub-fields
    if (typeof sem.color === 'object' && sem.color !== null) {
      const color = sem.color as Record<string, unknown>;
      for (const field of ['background', 'foreground', 'action', 'border', 'status']) {
        if (!(field in color)) {
          errors.push(`Missing semantic.color.${field}`);
        }
      }
    }

    // Semantic border sub-fields
    if (typeof sem.border === 'object' && sem.border !== null) {
      const border = sem.border as Record<string, unknown>;
      for (const field of ['width', 'focus']) {
        if (!(field in border)) {
          errors.push(`Missing semantic.border.${field}`);
        }
      }
    }
  }

  return errors;
}

// ─── Check 2: Reference Integrity ──────────────────────────────────────────

function checkReferences(data: Record<string, unknown>): string[] {
  const errors: string[] = [];

  function scanForRefs(obj: unknown, path: string): void {
    if (typeof obj === 'string') {
      const match = REFERENCE_RE.exec(obj);
      if (match) {
        const result = resolveValue(data, obj);
        if (result.error) {
          errors.push(`${path}: ${result.error}`);
        }
      }
    } else if (typeof obj === 'object' && obj !== null) {
      for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
        scanForRefs(value, `${path}.${key}`);
      }
    }
  }

  scanForRefs(data.semantic, 'semantic');
  if (data.component) {
    scanForRefs(data.component, 'component');
  }

  return errors;
}

// ─── Check 3: Completeness ─────────────────────────────────────────────────

function checkCompleteness(
  data: Record<string, unknown>,
  canonicalPaths: Set<string>,
  presetName: string,
): { errors: string[]; warnings: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Collect semantic paths from this preset
  const presetPaths = new Set<string>();
  collectPaths(data.semantic, 'semantic', presetPaths);

  // Check for missing semantic paths (compared to canonical/light)
  for (const path of canonicalPaths) {
    if (!presetPaths.has(path)) {
      // Component-level tokens and optional fields are warnings, not errors
      if (
        path.startsWith('semantic.color.accent') ||
        path.startsWith('semantic.layout') ||
        path.startsWith('semantic.opacity') ||
        path.startsWith('semantic.border.divider')
      ) {
        warnings.push(`Missing optional token: ${path}`);
      } else {
        errors.push(`Missing required token: ${path} (present in light)`);
      }
    }
  }

  return { errors, warnings };
}

// ─── Check 4: Color Contrast (WCAG AA) ────────────────────────────────────

/** Standard fg/bg pairs to check for WCAG AA compliance */
const CONTRAST_PAIRS: ContrastPair[] = [
  // Primary text on backgrounds
  {
    label: 'fg-primary on bg-page',
    fgPath: 'semantic.color.foreground.primary',
    bgPath: 'semantic.color.background.page',
    threshold: WCAG_AA_NORMAL,
  },
  {
    label: 'fg-primary on bg-surface',
    fgPath: 'semantic.color.foreground.primary',
    bgPath: 'semantic.color.background.surface',
    threshold: WCAG_AA_NORMAL,
  },
  {
    label: 'fg-primary on bg-elevated',
    fgPath: 'semantic.color.foreground.primary',
    bgPath: 'semantic.color.background.elevated',
    threshold: WCAG_AA_NORMAL,
  },
  // Secondary text on backgrounds
  {
    label: 'fg-secondary on bg-page',
    fgPath: 'semantic.color.foreground.secondary',
    bgPath: 'semantic.color.background.page',
    threshold: WCAG_AA_NORMAL,
  },
  {
    label: 'fg-secondary on bg-surface',
    fgPath: 'semantic.color.foreground.secondary',
    bgPath: 'semantic.color.background.surface',
    threshold: WCAG_AA_NORMAL,
  },
  // Action primary (button text on button bg)
  {
    label: 'fg-on-primary on action-primary',
    fgPath: 'semantic.color.foreground.on-primary',
    bgPath: 'semantic.color.action.primary.default',
    threshold: WCAG_AA_NORMAL,
  },
  // Destructive action
  {
    label: 'fg-on-destructive on action-destructive',
    fgPath: 'semantic.color.foreground.on-destructive',
    bgPath: 'semantic.color.action.destructive.default',
    threshold: WCAG_AA_NORMAL,
  },
  // Status text on status backgrounds
  {
    label: 'status-success-fg on status-success-bg',
    fgPath: 'semantic.color.status.success.fg',
    bgPath: 'semantic.color.status.success.bg',
    threshold: WCAG_AA_NORMAL,
  },
  {
    label: 'status-warning-fg on status-warning-bg',
    fgPath: 'semantic.color.status.warning.fg',
    bgPath: 'semantic.color.status.warning.bg',
    threshold: WCAG_AA_NORMAL,
  },
  {
    label: 'status-error-fg on status-error-bg',
    fgPath: 'semantic.color.status.error.fg',
    bgPath: 'semantic.color.status.error.bg',
    threshold: WCAG_AA_NORMAL,
  },
  {
    label: 'status-info-fg on status-info-bg',
    fgPath: 'semantic.color.status.info.fg',
    bgPath: 'semantic.color.status.info.bg',
    threshold: WCAG_AA_NORMAL,
  },
];

function resolveColorValue(preset: Record<string, unknown>, tokenPath: string): string | undefined {
  const rawValue = resolvePath(preset, tokenPath);
  if (!rawValue) return undefined;
  const { resolved, error } = resolveValue(preset, rawValue);
  if (error) return undefined;
  return resolved;
}

/**
 * Resolve a background color, compositing over page bg if it has alpha.
 * For themes where page bg itself is semi-transparent (glass), composite
 * over an assumed solid dark backdrop (#000000).
 */
function resolveEffectiveBackground(
  data: Record<string, unknown>,
  bgColorStr: string,
): string | undefined {
  const bgParsed = parseColor(bgColorStr);
  if (!bgParsed) return bgColorStr; // return raw, let caller handle parse failure

  // Fully opaque — use as-is
  if (bgParsed.a >= 1) return bgColorStr;

  // Semi-transparent bg: composite over the page background
  const pageBgStr = resolveColorValue(data, 'semantic.color.background.page');
  if (!pageBgStr) return bgColorStr;

  const pageParsed = parseColor(pageBgStr);
  if (!pageParsed) return bgColorStr;

  let effectivePage: { r: number; g: number; b: number };
  if (pageParsed.a < 1) {
    // Page bg is also semi-transparent (glass): composite over black
    effectivePage = alphaComposite(pageParsed, { r: 0, g: 0, b: 0 });
  } else {
    effectivePage = pageParsed;
  }

  const composited = alphaComposite(bgParsed, effectivePage);
  return `rgb(${composited.r}, ${composited.g}, ${composited.b})`;
}

function checkContrast(data: Record<string, unknown>): {
  errors: string[];
  warnings: string[];
  details: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];
  const details: string[] = [];

  for (const pair of CONTRAST_PAIRS) {
    const fgColor = resolveColorValue(data, pair.fgPath);
    const bgColor = resolveColorValue(data, pair.bgPath);

    if (!fgColor || !bgColor) {
      warnings.push(
        `Cannot check "${pair.label}": missing color (fg=${fgColor ?? '?'}, bg=${bgColor ?? '?'})`,
      );
      continue;
    }

    // Skip transparent/non-parseable colors
    if (
      fgColor === 'transparent' ||
      bgColor === 'transparent' ||
      fgColor.includes('var(') ||
      bgColor.includes('var(')
    ) {
      details.push(`  SKIP  ${pair.label}: non-static color (fg=${fgColor}, bg=${bgColor})`);
      continue;
    }

    // Composite semi-transparent backgrounds over page bg
    const effectiveBg = resolveEffectiveBackground(data, bgColor) ?? bgColor;

    const ratio = contrastRatio(fgColor, effectiveBg);
    if (ratio === undefined) {
      const fgParsed = parseColor(fgColor);
      const bgParsed = parseColor(effectiveBg);
      if (!fgParsed && !bgParsed) {
        warnings.push(
          `Cannot parse colors for "${pair.label}": fg="${fgColor}", bg="${effectiveBg}"`,
        );
      } else if (!fgParsed) {
        warnings.push(`Cannot parse foreground for "${pair.label}": "${fgColor}"`);
      } else {
        warnings.push(`Cannot parse background for "${pair.label}": "${effectiveBg}"`);
      }
      continue;
    }

    const ratioStr = ratio.toFixed(2);
    const thresholdStr = pair.threshold.toFixed(1);
    const bgNote = effectiveBg !== bgColor ? ` (composited: ${effectiveBg})` : '';

    if (ratio >= pair.threshold) {
      details.push(`  PASS  ${pair.label}: ${ratioStr}:1 (need ${thresholdStr}:1)${bgNote}`);
    } else {
      errors.push(
        `${pair.label}: contrast ${ratioStr}:1 < ${thresholdStr}:1 required (fg=${fgColor}, bg=${bgColor}${bgNote})`,
      );
      details.push(
        `  FAIL  ${pair.label}: ${ratioStr}:1 < ${thresholdStr}:1 (fg=${fgColor}, bg=${bgColor}${bgNote})`,
      );
    }
  }

  return { errors, warnings, details };
}

// ─── Check 5: Value Format Validation ──────────────────────────────────────

function checkValueFormats(data: Record<string, unknown>): string[] {
  const errors: string[] = [];
  const prim = data.primitive as Record<string, unknown>;

  // Color values should be valid hex, rgb, rgba, hsl, hsla, or named
  if (typeof prim.color === 'object' && prim.color !== null) {
    const colorValidRe = /^(#[0-9a-fA-F]{3,8}|rgba?\(.+\)|hsla?\(.+\)|transparent|currentColor)$/;
    function validateColors(obj: unknown, path: string): void {
      if (typeof obj === 'string') {
        if (!colorValidRe.test(obj) && !REFERENCE_RE.test(obj)) {
          errors.push(`Invalid color format at ${path}: "${obj}"`);
        }
      } else if (typeof obj === 'object' && obj !== null) {
        for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
          validateColors(value, `${path}.${key}`);
        }
      }
    }
    validateColors(prim.color, 'primitive.color');
  }

  // Spacing values should be valid CSS lengths
  const lengthRe = /^(0|0px|\d+(\.\d+)?(px|rem|em|%|ch|vw|vh)|calc\(.+\)|clamp\(.+\))$/;
  if (typeof prim.spacing === 'object' && prim.spacing !== null) {
    for (const [key, value] of Object.entries(prim.spacing as Record<string, string>)) {
      if (!lengthRe.test(value) && !REFERENCE_RE.test(value)) {
        errors.push(`Invalid spacing format at primitive.spacing.${key}: "${value}"`);
      }
    }
  }

  // Duration values should be valid CSS time
  const timeRe = /^(\d+(\.\d+)?(ms|s)|0)$/;
  if (typeof prim.motion === 'object' && prim.motion !== null) {
    const motion = prim.motion as Record<string, unknown>;
    if (typeof motion.duration === 'object' && motion.duration !== null) {
      for (const [key, value] of Object.entries(motion.duration as Record<string, string>)) {
        if (!timeRe.test(value) && !REFERENCE_RE.test(value)) {
          errors.push(`Invalid duration format at primitive.motion.duration.${key}: "${value}"`);
        }
      }
    }
  }

  // Opacity values should be 0-1
  if (typeof prim.opacity === 'object' && prim.opacity !== null) {
    for (const [key, value] of Object.entries(prim.opacity as Record<string, string>)) {
      const num = Number.parseFloat(value);
      if (Number.isNaN(num) || num < 0 || num > 1) {
        errors.push(`Invalid opacity at primitive.opacity.${key}: "${value}" (must be 0-1)`);
      }
    }
  }

  // Z-index values should be non-negative integers
  if (typeof prim.zIndex === 'object' && prim.zIndex !== null) {
    for (const [key, value] of Object.entries(prim.zIndex as Record<string, string>)) {
      const num = Number.parseInt(value, 10);
      if (Number.isNaN(num) || num < 0 || String(num) !== value) {
        errors.push(
          `Invalid z-index at primitive.zIndex.${key}: "${value}" (must be non-negative integer)`,
        );
      }
    }
  }

  return errors;
}

// ─── Report Generation ─────────────────────────────────────────────────────

function generateReport(
  results: ValidationResult[],
  contrastDetails: Map<string, string[]>,
): string {
  const now = new Date().toISOString().split('T')[0];
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
  const status = totalErrors === 0 ? 'PASS' : 'FAIL';

  const lines: string[] = [
    '# Token Validation Report',
    '',
    `> **Generated:** ${now}`,
    `> **Status:** ${status}`,
    `> **Presets checked:** ${results.length}`,
    `> **Errors:** ${totalErrors}`,
    `> **Warnings:** ${totalWarnings}`,
    '',
    '## Summary',
    '',
    '| Preset | Errors | Warnings | Status |',
    '|--------|--------|----------|--------|',
  ];

  for (const r of results) {
    const s = r.errors.length === 0 ? 'PASS' : 'FAIL';
    lines.push(`| ${r.preset} | ${r.errors.length} | ${r.warnings.length} | ${s} |`);
  }

  lines.push('');

  // Contrast details
  lines.push('## WCAG AA Contrast Check');
  lines.push('');
  for (const [preset, details] of contrastDetails) {
    lines.push(`### ${preset}`);
    lines.push('```');
    for (const d of details) {
      lines.push(d);
    }
    lines.push('```');
    lines.push('');
  }

  // Errors and warnings per preset
  for (const r of results) {
    if (r.errors.length === 0 && r.warnings.length === 0) continue;

    lines.push(`## ${r.preset}`);
    lines.push('');

    if (r.errors.length > 0) {
      lines.push('### Errors');
      for (const e of r.errors) {
        lines.push(`- ${e}`);
      }
      lines.push('');
    }

    if (r.warnings.length > 0) {
      lines.push('### Warnings');
      for (const w of r.warnings) {
        lines.push(`- ${w}`);
      }
      lines.push('');
    }
  }

  return `${lines.join('\n')}\n`;
}

// ─── Main ──────────────────────────────────────────────────────────────────

function main(): void {
  console.log('🔮 Arcana UI Token Validation\n');

  // Load all presets
  const presetFiles = readdirSync(presetsDir)
    .filter((f) => f.endsWith('.json'))
    .sort();
  if (presetFiles.length === 0) {
    console.error('❌ No preset JSON files found');
    process.exit(1);
  }

  const presets: Map<string, Record<string, unknown>> = new Map();
  for (const file of presetFiles) {
    const filepath = join(presetsDir, file);
    const data = JSON.parse(readFileSync(filepath, 'utf-8')) as Record<string, unknown>;
    presets.set(file, data);
  }

  // Collect canonical (light) semantic paths for completeness check
  const lightData = presets.get('light.json');
  const canonicalPaths = new Set<string>();
  if (lightData) {
    collectPaths(lightData.semantic, 'semantic', canonicalPaths);
  }

  const results: ValidationResult[] = [];
  const contrastDetails = new Map<string, string[]>();
  let hasErrors = false;

  for (const [file, data] of presets) {
    const presetName =
      typeof data.name === 'string' ? data.name.replace(/^arcana-/, '') : file.replace('.json', '');
    console.log(`  Validating ${file} (${presetName})...`);

    const result: ValidationResult = {
      preset: presetName,
      errors: [],
      warnings: [],
    };

    // 1. Structural validation
    const structErrors = checkStructure(data, file);
    result.errors.push(...structErrors.map((e) => `[structure] ${e}`));

    // 2. Reference integrity
    const refErrors = checkReferences(data);
    result.errors.push(...refErrors.map((e) => `[reference] ${e}`));

    // 3. Completeness (skip for light itself)
    if (file !== 'light.json' && canonicalPaths.size > 0) {
      const { errors: compErrors, warnings: compWarnings } = checkCompleteness(
        data,
        canonicalPaths,
        presetName,
      );
      result.errors.push(...compErrors.map((e) => `[completeness] ${e}`));
      result.warnings.push(...compWarnings.map((w) => `[completeness] ${w}`));
    }

    // 4. Color contrast
    const { errors: contrastErrors, warnings: contrastWarnings, details } = checkContrast(data);
    result.errors.push(...contrastErrors.map((e) => `[contrast] ${e}`));
    result.warnings.push(...contrastWarnings.map((w) => `[contrast] ${w}`));
    contrastDetails.set(presetName, details);

    // 5. Value format validation
    const formatErrors = checkValueFormats(data);
    result.errors.push(...formatErrors.map((e) => `[format] ${e}`));

    // Report per-preset
    if (result.errors.length > 0) {
      hasErrors = true;
      console.log(`    ❌ ${result.errors.length} error(s)`);
      for (const e of result.errors) {
        console.log(`       ${e}`);
      }
    } else {
      console.log('    ✓ passed');
    }

    if (result.warnings.length > 0) {
      console.log(`    ⚠ ${result.warnings.length} warning(s)`);
    }

    results.push(result);
  }

  // Generate report
  const reportDir = join(root, '..', '..', 'docs', 'audits');
  mkdirSync(reportDir, { recursive: true });
  const report = generateReport(results, contrastDetails);
  writeFileSync(join(reportDir, 'token-validation-report.md'), report, 'utf-8');
  console.log('\n  📄 Report: docs/audits/token-validation-report.md');

  // Summary
  const totalErrors = results.reduce((sum, r) => sum + r.errors.length, 0);
  const totalWarnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
  console.log(
    `\n🔮 Validation complete: ${presets.size} presets, ${totalErrors} errors, ${totalWarnings} warnings`,
  );

  if (hasErrors) {
    process.exit(1);
  }
}

main();
