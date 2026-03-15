/**
 * WCAG 2.1 Contrast Ratio Utilities
 *
 * Implements the standard relative luminance formula for computing
 * contrast ratios between foreground and background colors.
 * Supports hex (#rgb, #rrggbb), rgb(), and rgba() color formats.
 * Handles alpha compositing for semi-transparent foregrounds on opaque backgrounds.
 */

interface RGB {
  r: number;
  g: number;
  b: number;
}

interface RGBA extends RGB {
  a: number;
}

/** Parse a hex color string to RGB (0-255) */
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

/** Parse rgb() or rgba() function to RGBA (0-255, alpha 0-1) */
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

/** Parse any supported color string to RGBA */
export function parseColor(value: string): RGBA | undefined {
  const trimmed = value.trim().toLowerCase();

  if (trimmed.startsWith('#')) {
    const rgb = parseHex(trimmed);
    return rgb ? { ...rgb, a: 1 } : undefined;
  }

  if (trimmed.startsWith('rgb')) {
    return parseRgbFunction(trimmed);
  }

  return undefined;
}

/**
 * Composite a semi-transparent foreground color over an opaque background.
 * Uses standard alpha compositing: result = fg * alpha + bg * (1 - alpha)
 */
export function alphaComposite(fg: RGBA, bg: RGB): RGB {
  return {
    r: Math.round(fg.r * fg.a + bg.r * (1 - fg.a)),
    g: Math.round(fg.g * fg.a + bg.g * (1 - fg.a)),
    b: Math.round(fg.b * fg.a + bg.b * (1 - fg.a)),
  };
}

/**
 * Calculate relative luminance per WCAG 2.1.
 * https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
 *
 * For each sRGB component (0-255):
 *   1. Normalize to 0-1
 *   2. Apply inverse sRGB companding
 *   3. Combine with luminance coefficients
 */
export function relativeLuminance(color: RGB): number {
  const [rs, gs, bs] = [color.r / 255, color.g / 255, color.b / 255].map((c) =>
    c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**
 * Calculate WCAG 2.1 contrast ratio between two colors.
 * Returns a value between 1 (identical) and 21 (black on white).
 *
 * If the foreground has alpha < 1, it is composited over the background first.
 */
export function contrastRatio(fgValue: string, bgValue: string): number | undefined {
  const fg = parseColor(fgValue);
  const bg = parseColor(bgValue);

  if (!fg || !bg) return undefined;

  // Alpha-composite if foreground is semi-transparent
  const effectiveFg = fg.a < 1 ? alphaComposite(fg, bg) : fg;
  const effectiveBg: RGB = bg;

  const l1 = relativeLuminance(effectiveFg);
  const l2 = relativeLuminance(effectiveBg);

  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/** WCAG AA threshold for normal text (< 18pt / 14pt bold) */
export const WCAG_AA_NORMAL = 4.5;

/** WCAG AA threshold for large text (>= 18pt / 14pt bold) */
export const WCAG_AA_LARGE = 3;
