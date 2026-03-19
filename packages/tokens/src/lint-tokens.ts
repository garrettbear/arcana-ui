/**
 * Arcana UI — CSS Token Usage Linter
 * Scans component CSS files and flags hardcoded values that should use tokens.
 *
 * Usage: npx tsx packages/tokens/src/lint-tokens.ts
 * Exit code 0 = pass, 1 = violations found
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, '../../..');

// ─── Types ──────────────────────────────────────────────────────────────────

interface LintConfig {
  scanPaths: string[];
  filePattern: string;
  ignorePaths: string[];
  allowedHardcodedValues: string[];
  allowedHardcodedProperties: string[];
}

interface Violation {
  file: string;
  line: number;
  property: string;
  value: string;
  reason: string;
  suggestion: string;
}

// ─── Config ─────────────────────────────────────────────────────────────────

const config: LintConfig = JSON.parse(
  readFileSync(join(__dirname, 'lint-tokens.config.json'), 'utf-8'),
);

const allowedProps = new Set(config.allowedHardcodedProperties);
const allowedValues = new Set(config.allowedHardcodedValues ?? []);

// ─── File Discovery ─────────────────────────────────────────────────────────

function findCssFiles(dir: string): string[] {
  const results: string[] = [];
  const ext = config.filePattern.replace('*', '');

  function walk(d: string): void {
    for (const entry of readdirSync(d)) {
      const full = join(d, entry);
      const stat = statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (entry.endsWith(ext)) {
        const rel = relative(repoRoot, full);
        const ignored = config.ignorePaths.some((p) => rel.startsWith(p) || rel.includes(p));
        if (!ignored) {
          results.push(full);
        }
      }
    }
  }

  walk(dir);
  return results;
}

// ─── CSS Parsing ────────────────────────────────────────────────────────────

/** Strip comments from CSS */
function stripComments(css: string): string {
  return css.replace(/\/\*[\s\S]*?\*\//g, (match) => match.replace(/[^\n]/g, ' '));
}

/** Check if a value is wrapped in or references var() */
function usesVarRef(value: string): boolean {
  return /var\(/.test(value);
}

/** Check if value is only using allowed "structural" values */
function isStructuralValue(value: string): boolean {
  const v = value.trim().toLowerCase();
  // Zero values
  if (/^0(px|rem|em|%)?$/.test(v)) return true;
  // Percentage values
  if (/^-?\d+(\.\d+)?%$/.test(v)) return true;
  // Pure numbers (flex: 1, opacity: 0.5, etc.)
  if (/^-?\d+(\.\d+)?$/.test(v)) return true;
  // Keywords
  if (/^(none|auto|inherit|initial|unset|revert|normal|transparent|currentcolor)$/i.test(v))
    return true;
  // Common keyword combos
  if (/^(solid|dashed|dotted|double|groove|ridge|inset|outset)$/i.test(v)) return true;
  return false;
}

/** Check if the entire value expression is acceptable (calc with var, etc.) */
function isAcceptableExpression(value: string): boolean {
  const v = value.trim();
  // If it uses var() references, it's token usage
  if (usesVarRef(v)) return true;
  // All parts are structural
  if (v.split(/\s+/).every((part) => isStructuralValue(part))) return true;
  return false;
}

// ─── Violation Patterns ─────────────────────────────────────────────────────

const HEX_COLOR = /#(?:[0-9a-fA-F]{3,4}){1,2}\b/;
const COLOR_FUNCTION = /\b(?:rgba?|hsla?|oklch|oklab|lab|lch|color)\s*\(/i;
const HARDCODED_PX = /\b(\d+(?:\.\d+)?)px\b/;
const HARDCODED_REM_EM = /\b(\d+(?:\.\d+)?)(rem|em)\b/;

// Properties that should use spacing tokens
const SPACING_PROPS = new Set([
  'padding',
  'padding-top',
  'padding-right',
  'padding-bottom',
  'padding-left',
  'padding-inline',
  'padding-block',
  'padding-inline-start',
  'padding-inline-end',
  'padding-block-start',
  'padding-block-end',
  'margin',
  'margin-top',
  'margin-right',
  'margin-bottom',
  'margin-left',
  'margin-inline',
  'margin-block',
  'margin-inline-start',
  'margin-inline-end',
  'margin-block-start',
  'margin-block-end',
  'gap',
  'row-gap',
  'column-gap',
]);

// Properties that should use size tokens
const SIZE_PROPS = new Set([
  'width',
  'height',
  'min-width',
  'min-height',
  'max-width',
  'max-height',
]);

// Properties that should use font-size tokens
const FONT_SIZE_PROPS = new Set(['font-size']);

// Properties that should use radius tokens
const RADIUS_PROPS = new Set(['border-radius']);

// Properties that should use shadow tokens
const SHADOW_PROPS = new Set(['box-shadow']);

// Properties that should use color tokens
const COLOR_PROPS = new Set([
  'color',
  'background',
  'background-color',
  'border-color',
  'border-top-color',
  'border-right-color',
  'border-bottom-color',
  'border-left-color',
  'border-inline-color',
  'border-block-color',
  'outline-color',
  'fill',
  'stroke',
  'caret-color',
  'accent-color',
  'text-decoration-color',
  'column-rule-color',
]);

// Properties that should use transition/animation tokens
const MOTION_PROPS = new Set([
  'transition',
  'transition-duration',
  'transition-timing-function',
  'transition-delay',
  'animation',
  'animation-duration',
  'animation-timing-function',
  'animation-delay',
]);

// Properties that should use z-index tokens
const ZINDEX_PROPS = new Set(['z-index']);

// Properties that should use font-weight tokens
const FONT_WEIGHT_PROPS = new Set(['font-weight']);

// Properties that should use line-height tokens
const LINE_HEIGHT_PROPS = new Set(['line-height']);

// Properties that should use font-family tokens
const FONT_FAMILY_PROPS = new Set(['font-family']);

// Border shorthand can contain colors
const BORDER_SHORTHAND_PROPS = new Set([
  'border',
  'border-top',
  'border-right',
  'border-bottom',
  'border-left',
  'border-inline',
  'border-block',
  'outline',
]);

function checkDeclaration(
  property: string,
  value: string,
): { reason: string; suggestion: string } | null {
  const prop = property.trim().toLowerCase();
  const val = value.trim();

  // Skip custom properties (--foo: ...)
  if (prop.startsWith('--')) return null;

  // Skip properties that are allowed to have hardcoded values
  if (allowedProps.has(prop)) return null;

  // Skip globally allowed hardcoded values (e.g., WCAG touch targets, iOS zoom prevention)
  if (allowedValues.has(val)) return null;

  // If it already uses var(), it's fine
  if (isAcceptableExpression(val)) return null;

  // ── Color checks ──────────────────────────────────────────────────────

  if (COLOR_PROPS.has(prop)) {
    if (HEX_COLOR.test(val)) {
      return {
        reason: 'Hardcoded hex color',
        suggestion: 'Use a color token: var(--color-*)',
      };
    }
    if (COLOR_FUNCTION.test(val)) {
      return {
        reason: 'Hardcoded color function',
        suggestion: 'Use a color token: var(--color-*)',
      };
    }
  }

  // Border shorthands: only flag if they contain hardcoded colors
  if (BORDER_SHORTHAND_PROPS.has(prop)) {
    if (HEX_COLOR.test(val)) {
      return {
        reason: 'Hardcoded hex color in border',
        suggestion: 'Use a color token: var(--color-*)',
      };
    }
    if (COLOR_FUNCTION.test(val) && !usesVarRef(val)) {
      return {
        reason: 'Hardcoded color function in border',
        suggestion: 'Use a color token: var(--color-*)',
      };
    }
    // Border shorthands with px values + var() colors are fine
    return null;
  }

  // Check for colors in any other property (hex/rgb in box-shadow, etc.)
  if (HEX_COLOR.test(val) && !isStructuralValue(val)) {
    return {
      reason: 'Hardcoded hex color',
      suggestion: 'Use a color token: var(--color-*)',
    };
  }
  if (COLOR_FUNCTION.test(val) && !usesVarRef(val)) {
    return {
      reason: 'Hardcoded color function',
      suggestion: 'Use a color token: var(--color-*)',
    };
  }

  // ── Shadow checks ─────────────────────────────────────────────────────

  if (SHADOW_PROPS.has(prop)) {
    if (val === 'none') return null;
    // Any non-var shadow value is a violation
    if (!usesVarRef(val)) {
      return {
        reason: 'Hardcoded box-shadow value',
        suggestion: 'Use a shadow token: var(--shadow-*)',
      };
    }
  }

  // ── Spacing checks ────────────────────────────────────────────────────

  if (SPACING_PROPS.has(prop)) {
    if (HARDCODED_PX.test(val) || HARDCODED_REM_EM.test(val)) {
      return {
        reason: 'Hardcoded spacing value',
        suggestion: 'Use a spacing token: var(--spacing-*)',
      };
    }
  }

  // ── Size checks ───────────────────────────────────────────────────────

  if (SIZE_PROPS.has(prop)) {
    if (HARDCODED_PX.test(val) || HARDCODED_REM_EM.test(val)) {
      return {
        reason: 'Hardcoded size value',
        suggestion: 'Use a spacing or size token: var(--spacing-*) or var(--size-*)',
      };
    }
  }

  // ── Font size checks ──────────────────────────────────────────────────

  if (FONT_SIZE_PROPS.has(prop)) {
    if (HARDCODED_PX.test(val) || HARDCODED_REM_EM.test(val)) {
      return {
        reason: 'Hardcoded font-size value',
        suggestion: 'Use a font-size token: var(--font-size-*)',
      };
    }
  }

  // ── Border radius checks ──────────────────────────────────────────────

  if (RADIUS_PROPS.has(prop)) {
    if (HARDCODED_PX.test(val) || HARDCODED_REM_EM.test(val)) {
      return {
        reason: 'Hardcoded border-radius value',
        suggestion: 'Use a radius token: var(--radius-*)',
      };
    }
  }

  // ── Motion checks ─────────────────────────────────────────────────────

  if (MOTION_PROPS.has(prop)) {
    // Allow hardcoded durations in infinite animations (spinners, skeletons, pulses)
    // These are loading/decorative animations, not UI transitions
    if (/\binfinite\b/.test(val)) return null;

    // Flag hardcoded duration values (e.g., 150ms, 0.2s)
    if (/\b\d+(\.\d+)?(ms|s)\b/.test(val) && !usesVarRef(val)) {
      return {
        reason: 'Hardcoded transition/animation duration',
        suggestion: 'Use motion tokens: var(--duration-*) var(--ease-*)',
      };
    }
    // Flag hardcoded easing functions (cubic-bezier, ease, ease-in, ease-out, ease-in-out, linear)
    if (/\bcubic-bezier\s*\(/.test(val) && !usesVarRef(val)) {
      return {
        reason: 'Hardcoded easing function',
        suggestion: 'Use easing tokens: var(--ease-*)',
      };
    }
    if (/\b(ease|ease-in|ease-out|ease-in-out|linear)\b/.test(val) && !usesVarRef(val)) {
      return {
        reason: 'Hardcoded easing keyword',
        suggestion: 'Use easing tokens: var(--ease-*) or var(--transition-*)',
      };
    }
  }

  // ── Z-index checks ───────────────────────────────────────────────────

  if (ZINDEX_PROPS.has(prop)) {
    const num = Number.parseInt(val, 10);
    if (!Number.isNaN(num) && num !== 0 && num !== -1 && num !== 1) {
      return {
        reason: 'Hardcoded z-index value',
        suggestion: 'Use a z-index token: var(--z-*)',
      };
    }
  }

  // ── Font weight checks ────────────────────────────────────────────────

  if (FONT_WEIGHT_PROPS.has(prop)) {
    if (/^\d{3}$/.test(val)) {
      return {
        reason: 'Hardcoded font-weight value',
        suggestion: 'Use a font-weight token: var(--font-weight-*)',
      };
    }
  }

  // ── Line height checks ────────────────────────────────────────────────

  if (LINE_HEIGHT_PROPS.has(prop)) {
    if (HARDCODED_PX.test(val) || HARDCODED_REM_EM.test(val)) {
      return {
        reason: 'Hardcoded line-height value',
        suggestion: 'Use a line-height token: var(--line-height-*)',
      };
    }
  }

  // ── Font family checks ────────────────────────────────────────────────

  if (FONT_FAMILY_PROPS.has(prop)) {
    if (!usesVarRef(val)) {
      return {
        reason: 'Hardcoded font-family value',
        suggestion: 'Use a font-family token: var(--font-family-*)',
      };
    }
  }

  return null;
}

// ─── CSS Declaration Parser ─────────────────────────────────────────────────

function extractDeclarations(
  css: string,
): Array<{ property: string; value: string; line: number }> {
  const cleaned = stripComments(css);
  const lines = cleaned.split('\n');
  const declarations: Array<{
    property: string;
    value: string;
    line: number;
  }> = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    // Skip selectors, @rules, braces, empty lines
    if (
      !line ||
      line.startsWith('@') ||
      line.startsWith('/*') ||
      line === '{' ||
      line === '}' ||
      line.endsWith('{') ||
      line.startsWith('}')
    )
      continue;

    // Match property: value pairs
    const match = line.match(/^([a-z-]+)\s*:\s*(.+?)(?:\s*!important)?\s*;?\s*$/i);
    if (match) {
      declarations.push({
        property: match[1],
        value: match[2].replace(/;$/, '').trim(),
        line: i + 1,
      });
    }
  }

  return declarations;
}

// ─── Main ───────────────────────────────────────────────────────────────────

function main(): void {
  const violations: Violation[] = [];
  let filesScanned = 0;

  for (const scanPath of config.scanPaths) {
    const fullScanPath = join(repoRoot, scanPath);
    const cssFiles = findCssFiles(fullScanPath);

    for (const file of cssFiles) {
      filesScanned++;
      const content = readFileSync(file, 'utf-8');
      const declarations = extractDeclarations(content);
      const relFile = relative(repoRoot, file);

      for (const decl of declarations) {
        const result = checkDeclaration(decl.property, decl.value);
        if (result) {
          violations.push({
            file: relFile,
            line: decl.line,
            property: decl.property,
            value: decl.value,
            reason: result.reason,
            suggestion: result.suggestion,
          });
        }
      }
    }
  }

  // ── Report ────────────────────────────────────────────────────────────

  console.log('\n🔍 Arcana Token Lint Report');
  console.log('─'.repeat(60));
  console.log(`Files scanned: ${filesScanned}`);

  if (violations.length === 0) {
    console.log('Violations:    0');
    console.log('─'.repeat(60));
    console.log('✅ All CSS files use design tokens correctly.\n');
    process.exit(0);
  }

  console.log(`Violations:    ${violations.length}`);
  console.log('─'.repeat(60));

  // Group by file
  const byFile = new Map<string, Violation[]>();
  for (const v of violations) {
    const existing = byFile.get(v.file) ?? [];
    existing.push(v);
    byFile.set(v.file, existing);
  }

  for (const [file, fileViolations] of byFile) {
    console.log(`\n📄 ${file}`);
    for (const v of fileViolations) {
      console.log(`  L${v.line}: ${v.property}: ${v.value}`);
      console.log(`         ⚠ ${v.reason} → ${v.suggestion}`);
    }
  }

  console.log(`\n${'─'.repeat(60)}`);
  console.log(`❌ ${violations.length} violation(s) found. Fix all hardcoded values.\n`);
  process.exit(1);
}

main();
