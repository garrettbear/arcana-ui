# Arcana UI Architecture — Quick Reference

> **Purpose:** High-level overview of system design. For detailed info, see ROADMAP.md.

---

## System Overview

**Arcana UI** is a token-driven design system: JSON files (themes) → CSS custom properties → React components.

**Three-tier token model:**
- **Primitives** (`--primitive-blue-500`): Raw design values (never used directly by components)
- **Semantic** (`--color-action-primary`): Contextual tokens referencing primitives (what components use)
- **Component** (`--button-height`): Optional per-component scoped overrides

**Result:** Change one JSON file, change the entire UI. Zero runtime overhead.

---

## Monorepo Structure

```
arcana-ui/
├── packages/
│   ├── tokens/
│   │   ├── src/
│   │   │   ├── presets/       # Theme JSON files (light.json, dark.json, etc.)
│   │   │   ├── schema/        # JSON Schema for validation
│   │   │   ├── build.ts       # Reads presets, generates CSS custom properties
│   │   │   └── lint-tokens.ts # Enforces token-only CSS (no hardcoded values)
│   │   └── dist/
│   │       ├── arcana.css     # All themes + global reset
│   │       └── themes/        # Individual theme files
│   └── core/
│       ├── src/
│       │   ├── primitives/    # Button, Input, Toggle, Badge, Avatar, etc. (9)
│       │   ├── composites/    # Modal, Card, Tabs, Accordion, Alert, Toast (6)
│       │   ├── patterns/      # Form, Navbar, Table, EmptyState (4)
│       │   ├── layout/        # Stack, HStack, Grid, Container (4)
│       │   ├── hooks/         # useTheme, useBreakpoint, etc.
│       │   └── utils/         # cn, token helpers
│       └── dist/
├── playground/       # Live theme editor (Vercel deployment)
├── demos/           # Example sites (dashboard, marketing, blog, ecom)
├── tests/           # Vitest unit tests + Playwright visual regression
├── docs/
│   ├── audits/      # Token audit, responsive audit reports
│   ├── ARCHITECTURE.md  # This file
│   ├── COMPONENT-INVENTORY.md  # Registry of all components
│   └── MIGRATION.md # Old → new token name mappings
├── CLAUDE.md        # AI agent instructions
├── PROGRESS.md      # Task tracker
├── ROADMAP.md       # Full architecture + phased plan
├── AI_OPS.md        # Prompt library for AI agents
└── manifest.ai.json # Machine-readable component/token registry
```

**23 main components** across 4 categories. Each component:
- Exports via barrel export (`packages/core/src/index.ts`)
- Has TypeScript interfaces with JSDoc (feeds AI context)
- Uses `forwardRef` for ref forwarding
- Uses CSS modules with token-only styling
- Includes ≥3 unit tests + visual regression coverage
- Is keyboard accessible (WCAG AA minimum)

---

## Token & CSS Pipeline

```
1. Theme JSON (packages/tokens/src/presets/light.json)
   ↓
2. build.ts reads + validates against schema
   ↓
3. Resolves {primitive.*} and {semantic.*} references
   ↓
4. Generates CSS with new naming:
   - --color-*, --spacing-*, --radius-*, --shadow-*
   - --font-size-*, --font-weight-*, --line-height-*
   - --duration-*, --ease-*, --z-*
   ↓
5. Outputs:
   - dist/themes/{light,dark,terminal,etc}.css (1 file per theme)
   - dist/arcana.css (all themes combined)
   - dist/compat.css (177 backwards-compat aliases for old --arcana-* names)
```

**Current presets:** `light` (default), `dark`, `terminal`, `retro98`, `glass`, `brutalist`
**Planned presets:** `corporate`, `startup`, `editorial`, `commerce`, `midnight`, `nature`, `neon`, `mono`

---

## Theme Switching (Runtime)

```jsx
// 1. Import CSS
import '@arcana-ui/tokens/dist/arcana.css';

// 2. Set data-theme attribute on HTML element
document.documentElement.setAttribute('data-theme', 'dark');

// 3. All components automatically use the new theme's token values
```

**CSS structure:** Each theme's tokens are scoped under `[data-theme="themeName"]` selector. No JavaScript runtime needed.

---

## Component Architecture

**Every component follows this pattern:**

```tsx
import styles from './Button.module.css';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...rest }, ref) => (
    <button
      ref={ref}
      className={`${styles.button} ${styles[variant]} ${styles[size]} ${className || ''}`}
      {...rest}
    />
  ),
);
Button.displayName = 'Button';
```

**CSS modules (Button.module.css):**
- Mobile-first design (default styles = mobile)
- All values reference tokens: `var(--color-action-primary)`, `var(--spacing-md)`, etc.
- No hardcoded colors, sizes, shadows, durations
- BEM-like naming: `button`, `button--primary`, `button__icon`
- Max 3 levels nesting, no `!important`

---

## Testing Strategy

| Type | Tool | Coverage | Purpose |
|------|------|----------|---------|
| **Unit** | Vitest + React Testing Library | 274 tests, 70% threshold | Prop behavior, ref forwarding, keyboard nav, a11y |
| **Visual** | Playwright | 3 viewports (320px, 768px, 1280px) | Regression detection across breakpoints |
| **A11y** | axe-core via Playwright | Playground scan | Critical violations, contrast validation |
| **Linting** | Custom `lint-tokens.ts` | 0 hardcoded CSS violations | Enforce token-only styling |

---

## Development Commands

```bash
# Install dependencies
pnpm install

# Build tokens + components
pnpm build

# Build tokens only
pnpm build:tokens

# Dev server (playground)
pnpm dev

# Test
pnpm test              # All tests
pnpm test:visual       # Visual regression only
pnpm test:all          # Unit + visual

# Lint
pnpm lint              # Biome + token linter

# Full verification (before every commit)
pnpm lint && pnpm test && pnpm build
```

---

## Key Decisions

| Decision | Why |
|----------|-----|
| **Three-tier tokens** | Matches Material 3, Carbon, Spectrum. Enables theming at multiple levels. |
| **Mobile-first CSS** | Industry standard. Prevents desktop-then-hide antipattern. |
| **CSS custom properties (no CSS-in-JS)** | Zero runtime cost. Framework-agnostic. Inspectable in DevTools. |
| **BEM-like class naming** | Predictable. Avoids collisions. AI-friendly. |
| **forwardRef on all components** | Required for library interop and ref composition. |
| **Conventional commits** | Enables automated changelogs and semantic versioning. |

---

**For detailed specifications, see:**
- `ROADMAP.md` — Full architecture, component standards, phased plan
- `CLAUDE.md` — Project rules, code standards, current state
- `docs/COMPONENT-INVENTORY.md` — Complete component registry
