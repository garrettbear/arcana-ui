/**
 * Arcana UI Token Build Script
 * Transforms JSON design tokens → CSS custom properties
 */

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

// Load token files
const base = JSON.parse(readFileSync(join(root, 'src/base.json'), 'utf-8'))
const light = JSON.parse(readFileSync(join(root, 'src/light.json'), 'utf-8'))
const dark = JSON.parse(readFileSync(join(root, 'src/dark.json'), 'utf-8'))

type TokenValue = string | number | Record<string, unknown>

/**
 * Flattens a nested token object into CSS custom property declarations.
 * { color: { stone: { 50: "#fafaf9" } } } → --arcana-color-stone-50: #fafaf9
 */
function flattenTokens(
  obj: Record<string, TokenValue>,
  prefix = '--arcana',
  lines: string[] = []
): string[] {
  for (const [key, value] of Object.entries(obj)) {
    const varName = `${prefix}-${camelToKebab(key)}`
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      flattenTokens(value as Record<string, TokenValue>, varName, lines)
    } else {
      lines.push(`  ${varName}: ${value};`)
    }
  }
  return lines
}

/** Convert camelCase to kebab-case for CSS variable names */
function camelToKebab(str: string): string {
  return str
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/\./g, '-')
    .replace(/_/g, '-')
}

/** Generate base token CSS (primitive scale) */
function generateBaseCSS(): string {
  const lines = flattenTokens(base as Record<string, TokenValue>)
  return `:root {\n${lines.join('\n')}\n}\n`
}

/** Generate theme CSS for a given theme object */
function generateThemeCSS(tokens: Record<string, TokenValue>, selector: string): string {
  const lines: string[] = []

  // Flatten all semantic token categories
  for (const [category, values] of Object.entries(tokens)) {
    if (category === 'theme') continue // skip meta key
    if (values !== null && typeof values === 'object') {
      flattenTokens(
        values as Record<string, TokenValue>,
        `--arcana-${camelToKebab(category)}`,
        lines
      )
    }
  }

  return `${selector} {\n${lines.join('\n')}\n}\n`
}

/** Generate the combined arcana.css file with base + light theme defaults */
function generateCombinedCSS(): string {
  const sections: string[] = [
    `/**`,
    ` * Arcana UI — Design Tokens`,
    ` * Generated from JSON source. Do not edit directly.`,
    ` * Version: 0.1.0`,
    ` */`,
    '',
    '/* ─── Google Fonts Import ─── */',
    `@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');`,
    '',
    '/* ─── Base Scale Tokens ─── */',
    generateBaseCSS(),
    '/* ─── Light Theme (default) ─── */',
    generateThemeCSS(light as Record<string, TokenValue>, ':root, [data-theme="light"]'),
    '/* ─── Dark Theme ─── */',
    generateThemeCSS(dark as Record<string, TokenValue>, '[data-theme="dark"]'),
    '',
    '/* ─── Global Reset + Base Styles ─── */',
    `*, *::before, *::after {`,
    `  box-sizing: border-box;`,
    `}`,
    '',
    `body {`,
    `  margin: 0;`,
    `  font-family: var(--arcana-typography-font-family-sans);`,
    `  font-size: var(--arcana-typography-font-size-base);`,
    `  line-height: var(--arcana-typography-line-height-normal);`,
    `  color: var(--arcana-text-primary);`,
    `  background-color: var(--arcana-surface-primary);`,
    `  -webkit-font-smoothing: antialiased;`,
    `  -moz-osx-font-smoothing: grayscale;`,
    `}`,
    '',
    `/* ─── Focus Visible Utility ─── */`,
    `:focus-visible {`,
    `  outline: 2px solid var(--arcana-border-focus);`,
    `  outline-offset: 2px;`,
    `}`,
    '',
    `/* ─── Color Scheme ─── */`,
    `:root, [data-theme="light"] { color-scheme: light; }`,
    `[data-theme="dark"] { color-scheme: dark; }`,
  ]

  return sections.join('\n')
}

// Ensure dist directories exist
mkdirSync(join(root, 'dist/themes'), { recursive: true })

// Write combined CSS (base + both themes + reset)
const combinedCSS = generateCombinedCSS()
writeFileSync(join(root, 'dist/arcana.css'), combinedCSS, 'utf-8')
console.log('✓ dist/arcana.css')

// Write standalone light theme
const lightCSS = [
  `/* Arcana UI — Light Theme */`,
  generateThemeCSS(light as Record<string, TokenValue>, ':root, [data-theme="light"]'),
].join('\n')
writeFileSync(join(root, 'dist/themes/light.css'), lightCSS, 'utf-8')
console.log('✓ dist/themes/light.css')

// Write standalone dark theme
const darkCSS = [
  `/* Arcana UI — Dark Theme */`,
  generateThemeCSS(dark as Record<string, TokenValue>, '[data-theme="dark"]'),
].join('\n')
writeFileSync(join(root, 'dist/themes/dark.css'), darkCSS, 'utf-8')
console.log('✓ dist/themes/dark.css')

console.log('\n🔮 Arcana tokens built successfully!')
