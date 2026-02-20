/**
 * WCAG contrast ratio utilities
 * Uses the relative luminance formula from WCAG 2.1
 */

/** Parse a CSS color string into [r, g, b] (0-255). Returns null if unparseable. */
export function parseColor(str: string): [number, number, number] | null {
  if (!str) return null
  str = str.trim()

  if (str === 'transparent') return null

  // #rgb
  if (/^#[0-9a-f]{3}$/i.test(str)) {
    const r = parseInt(str[1] + str[1], 16)
    const g = parseInt(str[2] + str[2], 16)
    const b = parseInt(str[3] + str[3], 16)
    return [r, g, b]
  }

  // #rrggbb
  if (/^#[0-9a-f]{6}$/i.test(str)) {
    return [
      parseInt(str.slice(1, 3), 16),
      parseInt(str.slice(3, 5), 16),
      parseInt(str.slice(5, 7), 16),
    ]
  }

  // rgb(r, g, b)
  const rgbMatch = str.match(/^rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/)
  if (rgbMatch) {
    return [parseInt(rgbMatch[1]), parseInt(rgbMatch[2]), parseInt(rgbMatch[3])]
  }

  // rgba(r, g, b, a) — blend with white for contrast purposes
  const rgbaMatch = str.match(/^rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)$/)
  if (rgbaMatch) {
    const r = parseInt(rgbaMatch[1])
    const g = parseInt(rgbaMatch[2])
    const b = parseInt(rgbaMatch[3])
    const a = parseFloat(rgbaMatch[4])
    // Blend with white (#ffffff)
    return [
      Math.round(r * a + 255 * (1 - a)),
      Math.round(g * a + 255 * (1 - a)),
      Math.round(b * a + 255 * (1 - a)),
    ]
  }

  return null
}

/** Convert an [r, g, b] triplet to a #rrggbb hex string */
export function toHexString([r, g, b]: [number, number, number]): string {
  return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('')
}

/** Convert any CSS color string to #rrggbb (best effort, falls back to #000000) */
export function toHex(color: string): string {
  const rgb = parseColor(color)
  return rgb ? toHexString(rgb) : '#000000'
}

/** WCAG relative luminance of an sRGB color */
export function relativeLuminance([r, g, b]: [number, number, number]): number {
  const toLinear = (c: number) => {
    const s = c / 255
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4)
  }
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b)
}

/** WCAG contrast ratio between two color strings. Returns null if either is unparseable. */
export function contrastRatio(fg: string, bg: string): number | null {
  const fgRgb = parseColor(fg)
  const bgRgb = parseColor(bg)
  if (!fgRgb || !bgRgb) return null

  const l1 = relativeLuminance(fgRgb)
  const l2 = relativeLuminance(bgRgb)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

/** WCAG compliance level for a given contrast ratio */
export function wcagLevel(ratio: number): 'AAA' | 'AA' | 'Fail' {
  if (ratio >= 7) return 'AAA'
  if (ratio >= 4.5) return 'AA'
  return 'Fail'
}

/**
 * Find the nearest hex color to `fg` that achieves at least `targetRatio`
 * contrast against `bg` by progressively darkening/lightening `fg`.
 */
export function suggestFix(fg: string, bg: string, targetRatio = 4.5): string | null {
  const bgRgb = parseColor(bg)
  if (!bgRgb) return null

  const bgLum = relativeLuminance(bgRgb)
  const darkBg = bgLum < 0.5

  // Try to darken or lighten fg toward full black or white
  const fgRgb = parseColor(fg) ?? [0, 0, 0]
  const target = darkBg ? [255, 255, 255] : [0, 0, 0]

  for (let step = 0; step <= 20; step++) {
    const t = step / 20
    const r = Math.round(fgRgb[0] + (target[0] - fgRgb[0]) * t)
    const g = Math.round(fgRgb[1] + (target[1] - fgRgb[1]) * t)
    const b = Math.round(fgRgb[2] + (target[2] - fgRgb[2]) * t)
    const candidate: [number, number, number] = [r, g, b]
    const lum = relativeLuminance(candidate)
    const lighter = Math.max(lum, bgLum)
    const darker = Math.min(lum, bgLum)
    const ratio = (lighter + 0.05) / (darker + 0.05)
    if (ratio >= targetRatio) {
      return toHexString(candidate)
    }
  }

  return darkBg ? '#ffffff' : '#000000'
}
