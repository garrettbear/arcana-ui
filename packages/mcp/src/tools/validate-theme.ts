import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

// ── Color utilities (ported from @arcana-ui/cli) ──────────────────────────────

interface RGB {
  r: number;
  g: number;
  b: number;
}
interface RGBA extends RGB {
  a: number;
}

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

function parseColor(value: string): RGBA | undefined {
  const v = value.trim().toLowerCase();
  if (v === 'transparent') return { r: 0, g: 0, b: 0, a: 0 };
  if (v.startsWith('#')) {
    const rgb = parseHex(v);
    return rgb ? { ...rgb, a: 1 } : undefined;
  }
  const m = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(v);
  if (!m) return undefined;
  return {
    r: Number.parseInt(m[1], 10),
    g: Number.parseInt(m[2], 10),
    b: Number.parseInt(m[3], 10),
    a: m[4] !== undefined ? Number.parseFloat(m[4]) : 1,
  };
}

function linearize(c: number): number {
  const n = c / 255;
  return n <= 0.04045 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4;
}

function relativeLuminance(rgb: RGB): number {
  return 0.2126 * linearize(rgb.r) + 0.7152 * linearize(rgb.g) + 0.0722 * linearize(rgb.b);
}

function contrastRatio(a: RGB, b: RGB): number {
  const L1 = relativeLuminance(a);
  const L2 = relativeLuminance(b);
  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);
  return (lighter + 0.05) / (darker + 0.05);
}

// ── Validation logic ──────────────────────────────────────────────────────────

const REQUIRED_SEMANTIC_GROUPS = [
  'color.background',
  'color.foreground',
  'color.action',
  'color.border',
];

const WCAG_PAIRS = [
  {
    fg: 'color.foreground.primary',
    bg: 'color.background.default',
    label: 'Body text on page',
    threshold: 4.5,
  },
  {
    fg: 'color.foreground.secondary',
    bg: 'color.background.default',
    label: 'Secondary text on page',
    threshold: 4.5,
  },
  {
    fg: 'color.action.primary',
    bg: 'color.background.default',
    label: 'Primary action on page',
    threshold: 3.0,
  },
  {
    fg: 'color.foreground.primary',
    bg: 'color.background.surface',
    label: 'Text on surface',
    threshold: 4.5,
  },
];

function resolvePath(obj: Record<string, unknown>, dotPath: string): string | undefined {
  const parts = dotPath.split('.');
  let cur: unknown = obj;
  for (const p of parts) {
    if (!cur || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === 'string' ? cur : undefined;
}

function resolvePrimitiveRef(
  value: string,
  primitive: Record<string, unknown>,
): string | undefined {
  const match = /^\{primitive\.(.+)\}$/.exec(value);
  if (!match) return value; // not a reference, return as-is
  return resolvePath(primitive, match[1]);
}

function resolveSemanticColor(
  dotPath: string,
  semantic: Record<string, unknown>,
  primitive: Record<string, unknown>,
): string | undefined {
  const raw = resolvePath(semantic, dotPath);
  if (!raw) return undefined;
  return resolvePrimitiveRef(raw, primitive) ?? raw;
}

interface ThemeJson {
  name?: string;
  primitive?: Record<string, unknown>;
  semantic?: Record<string, unknown>;
}

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
  contrastFailures: Array<{ pair: string; ratio: string; threshold: number; suggestion: string }>;
}

function validateThemeJson(theme: unknown): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const contrastFailures: Array<{
    pair: string;
    ratio: string;
    threshold: number;
    suggestion: string;
  }> = [];

  // 1. Structure check
  if (!theme || typeof theme !== 'object') {
    return {
      valid: false,
      errors: ['Theme must be a JSON object'],
      warnings: [],
      contrastFailures: [],
    };
  }
  const t = theme as ThemeJson;
  if (!t.name) errors.push('Missing required field: name');
  if (!t.primitive) errors.push('Missing required field: primitive');
  if (!t.semantic) errors.push('Missing required field: semantic');

  if (errors.length > 0) {
    return { valid: false, errors, warnings, contrastFailures };
  }

  const primitive = t.primitive as Record<string, unknown>;
  const semantic = t.semantic as Record<string, unknown>;

  // 2. Required semantic groups
  for (const group of REQUIRED_SEMANTIC_GROUPS) {
    const val = resolvePath(semantic, group);
    if (!val && !resolveSemanticColor(group, semantic, primitive)) {
      errors.push(`Missing required semantic group: ${group}`);
    }
  }

  // 3. Reference validation — check all {primitive.x.y} refs resolve
  const semanticStr = JSON.stringify(semantic);
  const refs = [...semanticStr.matchAll(/\{primitive\.([^}]+)\}/g)];
  for (const ref of refs) {
    const resolved = resolvePath(primitive, ref[1]);
    if (!resolved) {
      errors.push(`Unresolved primitive reference: {primitive.${ref[1]}}`);
    }
  }

  // 4. WCAG contrast checks
  for (const pair of WCAG_PAIRS) {
    const fg = resolveSemanticColor(pair.fg, semantic, primitive);
    const bg = resolveSemanticColor(pair.bg, semantic, primitive);
    if (!fg || !bg) {
      warnings.push(`Could not resolve colors for contrast check: ${pair.label}`);
      continue;
    }
    const fgColor = parseColor(fg);
    const bgColor = parseColor(bg);
    if (!fgColor || !bgColor) {
      warnings.push(`Could not parse colors for contrast check: ${pair.label} (${fg} / ${bg})`);
      continue;
    }
    const ratio = contrastRatio(fgColor, bgColor);
    if (ratio < pair.threshold) {
      contrastFailures.push({
        pair: pair.label,
        ratio: `${ratio.toFixed(2)}:1`,
        threshold: pair.threshold,
        suggestion: `Adjust ${pair.fg} or ${pair.bg} to achieve at least ${pair.threshold}:1 contrast`,
      });
    }
  }

  const valid = errors.length === 0 && contrastFailures.length === 0;
  return { valid, errors, warnings, contrastFailures };
}

export function registerValidateTheme(server: McpServer): void {
  server.tool(
    'validate_theme',
    'Validate a theme JSON object for Arcana UI. Checks structure (required fields), completeness (semantic groups), reference resolution (primitive refs), and WCAG AA contrast ratios for key fg/bg pairs.',
    {
      theme: z
        .record(z.unknown())
        .describe(
          'The complete theme JSON object to validate (must include name, primitive, semantic fields)',
        ),
    },
    async ({ theme }) => {
      const result = validateThemeJson(theme);
      return {
        content: [
          {
            type: 'text' as const,
            text: JSON.stringify(result, null, 2),
          },
        ],
      };
    },
  );
}
