# CLAUDE.md — Arcana UI

> This file provides guidance to Claude Code and other AI coding agents when working with this repository.
> Read this file completely before making any changes to the codebase.

---

## Project Identity

**Arcana UI** is an open-source, token-driven design system built for AI agents to assemble production-grade web interfaces. Tokens in, beautiful UI out.

- **Repo:** `garrettbear/arcana-ui`
- **License:** MIT
- **Packages:** `@arcana-ui/tokens` (design tokens → CSS custom properties), `@arcana-ui/core` (React components)
- **Playground:** [arcana-design-system.vercel.app](https://arcana-design-system.vercel.app)
- **Maintainer:** Garrett Bear (@garrettbear)

---

## Session Protocol

**Follow this sequence at the start of every session:**

1. Read this file (`CLAUDE.md`) — you're doing this now
2. Read `PROGRESS.md` — current phase, what's done, what's next
3. Read `ROADMAP.md` — full architecture, standards, and task details
4. Read `AI_OPS.md` — prompts, tracking system, workflow instructions
5. Run `pnpm install && pnpm build` to verify the project builds
6. Run `pnpm test` to verify tests pass
7. Tell the user what you plan to work on. **Do NOT start coding until confirmed.**

**Before ending a session:**

1. Run `pnpm lint && pnpm test && pnpm build` — report results
2. Update `PROGRESS.md` — check off completed items, update metadata
3. Update the "Current State" section at the bottom of this file
4. Commit all changes with conventional commit messages
5. Summarize: what was done, what's next, any blockers

---

## Essential Documents

| File | Purpose | When to Read |
|------|---------|--------------|
| `CLAUDE.md` | Agent instructions, project rules, current state | Every session (start) |
| `PROGRESS.md` | Checklist tracker — what's done, what's next | Every session (start + end) |
| `ROADMAP.md` | Full architecture, token spec, component standards, phased plan | When working on any task |
| `AI_OPS.md` | Prompt library, tracking system, session management | When you need the specific prompt for a task |
| `manifest.ai.json` | Machine-readable component/token registry for AI discovery | When updating AI integration |

---

## Architecture Overview

### Monorepo Structure

```
arcana-ui/
├── packages/
│   ├── tokens/                     # Design token system
│   │   ├── src/
│   │   │   ├── presets/            # Theme JSON files (light.json, dark.json, etc.)
│   │   │   ├── schema/            # JSON Schema for token validation
│   │   │   └── build.ts           # JSON → CSS build script
│   │   └── dist/
│   │       ├── arcana.css          # All themes combined
│   │       └── themes/             # Individual theme CSS files
│   └── core/                       # React component library
│       └── src/
│           ├── components/         # All components (one dir each)
│           │   ├── Button/
│           │   │   ├── Button.tsx
│           │   │   ├── Button.css
│           │   │   ├── Button.test.tsx
│           │   │   └── index.ts
│           │   └── ...
│           ├── hooks/              # Shared hooks (useTheme, useBreakpoint, etc.)
│           ├── utils/              # Utilities (cn, token helpers)
│           └── index.ts            # Barrel export — every component exports here
├── playground/                     # Live theme editor (deployed on Vercel)
├── demos/                          # Example sites (SaaS dashboard, marketing, etc.)
│   ├── saas-dashboard/
│   ├── marketing-landing/
│   ├── editorial-blog/
│   └── ecommerce-product/
├── docs/
│   └── audits/                     # Token audits, responsive audits
├── CLAUDE.md                       # ← You are here
├── ROADMAP.md                      # Full roadmap + architecture
├── PROGRESS.md                     # Task tracker
├── AI_OPS.md                       # Prompt library + workflow
├── manifest.ai.json                # AI discovery manifest
├── biome.json                      # Linter/formatter config
├── vitest.workspace.ts             # Test config
├── pnpm-workspace.yaml             # Monorepo workspace config
└── package.json                    # Root package.json
```

### Token Architecture (Three-Tier)

```
Primitive Tokens     →    Semantic Tokens      →    Component Tokens
(raw values)              (contextual meaning)       (scoped overrides)

--primitive-blue-500      --color-action-primary      --button-bg
#3b82f6                   var(--primitive-blue-500)    var(--color-action-primary)
```

- **Primitives:** Raw design values (colors, spacing scale, etc.). Never referenced directly by components.
- **Semantic:** Contextual tokens that reference primitives. This is what components use. (e.g., `--color-bg-surface`, `--color-action-primary`, `--shadow-md`)
- **Component:** Optional per-component overrides for fine-grained control.

Full token inventory: `ROADMAP.md` → Appendix A.

### Theme System

Themes are JSON files in `packages/tokens/src/presets/`. The build script converts them to CSS custom properties scoped under `[data-theme="name"]` selectors. Switching themes is as simple as changing the `data-theme` attribute on the root element.

Current presets: `light` (default), `dark`, `terminal`, `retro98`, `glass`, `brutalist`
Planned presets: `corporate`, `startup`, `editorial`, `commerce`, `midnight`, `nature`, `neon`, `mono`

---

## Build & Development Commands

```bash
# Install dependencies
pnpm install

# Build everything (tokens + components)
pnpm build

# Build tokens only (JSON → CSS)
pnpm build:tokens

# Run development server (playground)
pnpm dev

# Run tests
pnpm test

# Run linter
pnpm lint

# Full verification (run before every commit)
pnpm lint && pnpm test && pnpm build
```

---

## Code Standards

### TypeScript

- **Strict mode is required.** `"strict": true` in tsconfig.
- **No `any` types.** Use `unknown` and narrow, or define a proper interface.
- **Explicit return types** on all exported functions.
- **Interfaces over types** for component props (supports declaration merging).
- **JSDoc comments** on every component prop — these feed into AI context and documentation.

### CSS — The Cardinal Rules

**NEVER hardcode values.** Every visual property must reference a CSS custom property (token).

```css
/* ❌ FORBIDDEN — will fail lint/review */
.arcana-button {
  background: #4f46e5;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  font-size: 14px;
  transition: all 0.2s ease;
}

/* ✅ REQUIRED — tokens only */
.arcana-button {
  background: var(--color-action-primary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  font-size: var(--font-size-sm);
  transition: background var(--duration-fast) var(--ease-default);
}
```

Additional CSS rules:
- **Mobile-first:** Default styles = mobile. Use `@media (min-width: ...)` for larger screens.
- **BEM-like naming:** `arcana-{component}`, `arcana-{component}--{variant}`, `arcana-{component}__part`
- **Max 3 levels of nesting.** No deeper.
- **No `!important`.** Ever.
- **Use `prefers-reduced-motion`** for all animations.

### Component API

Every component must:

```tsx
// 1. Use forwardRef
export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  // ...
});
Button.displayName = 'Button';

// 2. Have a typed props interface with JSDoc
export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
}

// 3. Provide defaults for all optional props
const { variant = 'primary', size = 'md', ...rest } = props;

// 4. Support className passthrough
<button className={`arcana-button arcana-button--${variant} ${className}`} />

// 5. Include ARIA attributes for accessibility
<button aria-busy={loading} disabled={loading || disabled} />
```

### Accessibility Requirements

- Every interactive element: keyboard accessible (Tab, Enter, Escape, Arrow keys)
- Every form input: associated `<label>`
- Color never the sole state indicator (pair with icons or text)
- Focus indicators visible in every theme
- Minimum contrast: 4.5:1 (normal text), 3:1 (large text / UI elements)
- Touch targets: minimum 44×44px on mobile

### Naming Conventions

| Type | Convention | Example |
|------|-----------|---------|
| Component files | PascalCase | `Button.tsx` |
| Component test files | PascalCase + `.test` | `Button.test.tsx` |
| Token/preset files | kebab-case | `light.json` |
| CSS classes | `arcana-` prefix, kebab-case | `arcana-button--primary` |
| Hooks | camelCase, `use` prefix | `useTheme.ts` |
| Utilities | camelCase | `mergeProps.ts` |

### Commit Convention

```
type(scope): description

Types:  feat, fix, refactor, style, docs, test, chore, perf
Scopes: tokens, core, docs, playground, demo, ci

Examples:
  feat(core): add Navbar component with responsive collapse
  feat(tokens): add elevation shadow system
  fix(core): Button focus ring not visible in dark theme
  test(core): add visual regression tests for Card
  chore: update progress tracker
```

---

## Responsive Strategy

### Breakpoints

```
Mobile     Tablet     Desktop    Wide       Ultra
< 640px    640–1023   1024–1279  1280–1535  ≥ 1536
sm         md         lg         xl         2xl
```

### Mobile-First

All CSS is written for mobile first, then layered up:

```css
/* Default = mobile */
.arcana-card { padding: var(--spacing-md); }

/* Tablet+ */
@media (min-width: 640px) {
  .arcana-card { padding: var(--spacing-lg); }
}

/* Desktop+ */
@media (min-width: 1024px) {
  .arcana-card { padding: var(--spacing-xl); }
}
```

### Touch Targets

- Minimum 44×44px for all interactive elements on mobile
- Minimum 8px gap between adjacent interactive elements
- No hover-only interactions — everything must have a focus or tap equivalent

---

## How to Add a New Component

```bash
# 1. Create directory
mkdir -p packages/core/src/components/Navbar

# 2. Create files
# Navbar.tsx    — Component implementation
# Navbar.css    — Styles (tokens only!)
# Navbar.test.tsx — Tests
# index.ts      — Barrel export

# 3. Build the component following the API standards above

# 4. Export from packages/core/src/index.ts
# export * from './components/Navbar';

# 5. Verify
pnpm lint && pnpm test && pnpm build
```

See `ROADMAP.md` Section 4.3 for full component API standards.
See `ROADMAP.md` Section 8.7 for detailed step-by-step.

## How to Add a New Theme Preset

```bash
# 1. Copy an existing preset
cp packages/tokens/src/presets/light.json packages/tokens/src/presets/corporate.json

# 2. Edit the JSON:
#    - Change name, description
#    - Update primitive colors (use OKLCH for perceptual uniformity)
#    - Choose typography (display + body + mono fonts)
#    - Set radius curve, shadow style, motion personality
#    - Validate WCAG contrast on all fg/bg pairs

# 3. Build and verify
pnpm build:tokens
# Check playground with new preset

# 4. Build a corresponding demo site (see ROADMAP.md Section 5)
```

See `ROADMAP.md` Section 5.3 for preset design guidelines.
See `ROADMAP.md` Section 8.8 for detailed step-by-step.

---

## Dependencies — Keep It Minimal

**Runtime:**
- React (peer dependency — user provides)
- No CSS-in-JS runtime
- No Tailwind
- No lodash, moment, or heavy utilities

**Dev only:**
- TypeScript (strict)
- Vitest + React Testing Library (unit tests)
- Playwright (visual regression)
- Biome (lint + format)

Do NOT add new dependencies without discussing with the maintainer. Every dependency adds to bundle size and maintenance burden.

---

## PR Checklist

Before opening any PR, verify all of these:

- [ ] `pnpm build` passes
- [ ] `pnpm lint` passes with zero errors
- [ ] `pnpm test` passes with zero failures
- [ ] No hardcoded values in CSS (only `var(--token-name)` references)
- [ ] All new components have TypeScript interfaces with JSDoc
- [ ] All interactive elements have ARIA attributes
- [ ] Component works at 320px, 768px, and 1280px viewport widths
- [ ] New components have test files with ≥3 test cases
- [ ] Barrel exports updated (`index.ts`)
- [ ] Commit messages follow conventional commits
- [ ] `PROGRESS.md` updated if a roadmap task was completed

### CI / Branch Protection

GitHub Actions CI runs on every PR and push to `main` (`.github/workflows/ci.yml`). The `main` branch should be configured with these protection rules (requires repo admin):

- **Require status checks to pass:** `Lint`, `Typecheck`, `Test`, `Build`
- **Require branches to be up to date** before merging
- **Require at least 1 review** (optional for solo maintainer — can be relaxed)
- **PR titles must follow conventional commits** (enforced by `.github/workflows/pr-title.yml`)

---

## What NOT to Do

These are common mistakes. Do not make them.

1. **Don't use hardcoded colors, sizes, or shadows in component CSS.** Use tokens. Always.
2. **Don't add Tailwind or any utility-class CSS framework.** Arcana uses pure CSS custom properties.
3. **Don't write desktop-first CSS.** Mobile-first with `min-width` queries only.
4. **Don't use `any` in TypeScript.** Use `unknown` and narrow.
5. **Don't skip accessibility.** Every component needs keyboard nav, ARIA, and focus indicators.
6. **Don't use `!important`.** Fix the specificity instead.
7. **Don't create hover-only interactions.** Every hover must have a focus/tap equivalent.
8. **Don't commit without running `pnpm lint && pnpm test && pnpm build`.**
9. **Don't add runtime dependencies** without maintainer approval.
10. **Don't forget to update `PROGRESS.md`** when completing a roadmap task.
11. **Don't start coding before reading PROGRESS.md** to know what phase we're in.
12. **Don't work on Phase N+1 tasks until Phase N is complete** (unless explicitly told otherwise).

---

## Design Philosophy (Condensed)

For the full philosophy, see `ROADMAP.md` Section 1.

- **Machine-first, human-beautiful.** Predictable API surfaces for AI. Gorgeous output for users.
- **One JSON file controls everything.** A theme is a single JSON file. Change it, change the entire UI.
- **Progressive disclosure.** Beginner uses a preset. Expert creates new token sets. Both are first-class.
- **No Tailwind.** Pure CSS custom properties. Framework-agnostic.
- **Responsive by default.** Every component works from 320px to 2560px. No exceptions.

---

## Key Decisions Log

Decisions made during development that should not be revisited without discussion:

| Decision | Rationale | Date |
|----------|-----------|------|
| Three-tier token hierarchy (primitive → semantic → component) | Matches Material 3, Carbon, Spectrum patterns. Enables theming at multiple levels. | 2026-03-01 |
| Mobile-first CSS with `min-width` queries | Industry standard. Prevents desktop-then-hide antipattern. | 2026-03-01 |
| BEM-like class naming with `arcana-` prefix | Avoids collisions. Predictable for AI agents. No build step needed. | 2026-03-01 |
| No Tailwind dependency | Keeps Arcana framework-agnostic. AI doesn't need to reason about utility classes. | Original |
| CSS custom properties over CSS-in-JS | Zero runtime cost. Works without React. Inspectable in browser devtools. | Original |
| `forwardRef` on all components | Required for composition, ref forwarding, and library interop. | 2026-03-01 |
| JSDoc on every prop | Feeds directly into AI context and IDE tooltips. Documentation as code. | 2026-03-01 |
| WCAG AA as minimum contrast standard | Legal compliance + ethical obligation. Non-negotiable. | 2026-03-01 |
| Conventional commits | Enables automated changelogs and semantic versioning. | 2026-03-01 |
| Vitest + Playwright over Jest + Cypress | Faster, modern, better ESM support, native TypeScript. | 2026-03-01 |

---

## Current State

*This section is updated at the end of every AI agent session.*

### Active Phase
Phase 2 COMPLETE — ready for Phase 3

### Completed
- Comprehensive ROADMAP.md created (token architecture, phased plan, component library, preset matrix)
- AI_OPS.md created (prompt library, tracking system, session management)
- PROGRESS.md created (task tracker)
- CLAUDE.md rewritten (this file)
- Task 0.1 — Token audit completed (`docs/audits/token-audit.md`)
- Task 0.2 — Token JSON restructured to three-tier hierarchy (primitive → semantic → component)
  - Created JSON Schema (`packages/tokens/src/schema/tokens.schema.json`)
  - Migrated all 6 presets to new format (`packages/tokens/src/presets/{light,dark,terminal,retro98,glass,brutalist}.json`)
  - All 6 presets validated against schema
  - Created migration guide (`docs/MIGRATION.md`) with old→new token name mapping
- Task 0.3 — Code standards established
  - Root `tsconfig.json` created with strict mode + all sub-options
  - Package tsconfigs updated: `noImplicitAny`, `strictNullChecks`, `noUnusedLocals`, `noUnusedParameters`
  - `biome.json` updated: trailing commas (all), semicolons (always), import sorting, line width 100
  - `.editorconfig` created (2-space indent, UTF-8, LF, trim trailing whitespace)
  - All lint/format violations fixed (zero `any` types, consistent formatting)
  - Husky + lint-staged pre-commit hook installed (runs biome on staged files)
  - 54 a11y warnings documented for future component improvement tasks
- Task 0.4 — Build pipeline for tokens (JSON → CSS)
  - Created `packages/tokens/src/build.ts` — new main build script
  - Reads all 6 preset JSON files from `src/presets/`
  - Validates each preset against schema (structural + naming pattern checks)
  - Resolves all `{primitive.*}` and `{semantic.*}` references (with circular reference detection)
  - Generates CSS with new variable naming per MIGRATION.md (e.g., `--color-bg-page`, `--color-fg-primary`)
  - Outputs individual theme files: `dist/themes/{light,dark,terminal,retro98,glass,brutalist}.css`
  - Outputs combined `dist/arcana.css` (all 6 themes + global reset + focus utility + color scheme hints)
  - Outputs `dist/compat.css` (177 backward-compatible aliases mapping old `--arcana-*` to new names)
  - Updated `packages/tokens/package.json`: build script → `src/build.ts`, exports for all 6 themes + compat
  - Reports: 195 variables per theme, 1170 total, unreferenced primitive warnings
  - All builds pass (tokens + core + docs + playground), 238 tests pass, 0 lint errors
- Task 0.5 — Component API surfaces cleaned up
  - Migrated all 20 `.module.css` files from old `--arcana-*` token names to new semantic names (511 replacements, 0 old tokens remaining)
  - Added JSDoc comments to every prop in all 48 components across 4 categories (primitives, composites, layout, patterns)
  - Added `forwardRef` + `displayName` to 23 components that were missing it (RadioGroup, AvatarGroup, Modal, ModalClose, Alert, Tabs, TabList, Tab, TabPanels, TabPanel, Accordion, AccordionItem, AccordionTrigger, AccordionContent, Navbar, NavbarBrand, NavbarContent, NavbarActions, EmptyState, FormField, FormLabel, FormHelperText, FormErrorMessage)
  - Renamed Button variant `danger` → `destructive` to match token naming
  - Fixed inline token references in Layout.tsx and Avatar.tsx
  - Created `docs/COMPONENT-INVENTORY.md` — full component registry with props, forwardRef status, migration status
  - All 238 tests pass, 0 lint errors, build succeeds

- Task 0.6 — Testing infrastructure set up
  - **Part A — Vitest + React Testing Library:**
    - Added coverage config (v8 provider, 70% thresholds for statements/branches/functions/lines)
    - Enhanced Button tests: 19 tests (ref forwarding, className, userEvent, keyboard Tab/Enter/Space, disabled focus, icons)
    - Enhanced Input tests: 23 tests (ref, className, label association, error/helper aria-describedby, prefix/suffix, userEvent typing, onFocus/onBlur, disabled)
    - Enhanced Modal tests: 28 tests (ModalClose ref/className, Modal ref/className, sizes, overlay click, Escape/closeOnEsc, focus trap, aria-labelledby/describedby, body scroll lock)
    - Total: 274 tests pass (up from 238)
  - **Part B — Playwright visual regression:**
    - Installed @playwright/test@1.56.0 (compatible with cached chromium-1194)
    - Created playwright.config.ts: 3 viewports (320x568 mobile, 768x1024 tablet, 1280x800 desktop), chromium only
    - Created test helpers (theme switching, page ready wait)
    - Visual tests: playground default + dark theme + button section, all at 3 breakpoints
    - Generated 12 baseline screenshots committed to tests/visual/snapshots/
    - 13 tests pass, 2 correctly skipped
  - **Part C — Accessibility testing:**
    - Installed @axe-core/playwright for Playwright a11y tests
    - Created a11y test: runs axe-core on playground, fails on critical violations, logs serious/moderate as warnings
    - Excluded known playground-only issues (TokenEditor sliders/selects missing labels)
    - Zero critical violations, 1 serious (color contrast in playground sidebar — 35 instances, pre-existing)
    - jest-axe already integrated in component tests (from pre-existing setup)
  - **Test template:** Created templates/component-test-template.tsx with all 9 test categories
  - **Scripts added:** test:visual, test:visual:update, test:all
  - All 274 Vitest tests pass, 13 Playwright tests pass, 0 lint errors (54 pre-existing warnings)

- Task 0.7 — CSS token usage linter
  - Created `packages/tokens/src/lint-tokens.ts` — custom CSS linter that scans component CSS for hardcoded values
  - Detects: hex colors, rgb/rgba/hsl functions, hardcoded px/rem/em in spacing/size/font-size/radius properties, hardcoded box-shadow values, hardcoded animation durations, hardcoded z-index, hardcoded font-weight/font-family/line-height
  - Allows: 0/0px, percentages, structural keywords (none, auto, inherit, transparent), var() references, calc() with var(), properties like display/position/cursor/flex-direction
  - Created `packages/tokens/src/lint-tokens.config.json` — configurable ignore paths and allowed properties
  - Added `pnpm lint:tokens` script; integrated into `pnpm lint` (biome + token lint combined)
  - Fixed 93 hardcoded violations across 16 CSS files:
    - Replaced hardcoded sizes with component CSS custom properties (--button-height, --avatar-size, --toggle-width, --modal-max-width, etc.)
    - Replaced hardcoded colors (#ffffff → var(--color-fg-on-primary), rgba error rings → var(--focus-ring-error))
    - Replaced hardcoded font-sizes with --font-size-* tokens
    - Replaced hardcoded spacing with --spacing-* tokens
    - Replaced hardcoded animation duration with var(--duration-slow)
  - Added `--focus-ring-error` token to all 6 presets and build script
  - Suppressed false-positive biome a11y error on TabPanel tabIndex (WAI-ARIA compliant)
  - All 274 tests pass, 0 lint errors (53 pre-existing warnings), build succeeds

- Task 0.8 — Documentation update and AI integration
  - Updated `manifest.ai.json`: new token naming (three-tier architecture), updated key token examples with new names (--color-*, --spacing-*, --radius-*, --shadow-*, --font-size-*, --duration-*), changed Button variant "danger" → "destructive"
  - Updated CLAUDE.md "Current State" section to mark tasks 0.1-0.8 complete
  - Updated PROGRESS.md: checked off tasks 0.1-0.8, set next task to 0.9
  - Created `docs/ARCHITECTURE.md` — quick reference guide (system overview, monorepo structure, token pipeline, component architecture, testing strategy, theme switching)
  - Verified README.md: accurate component count (23 main components), correct theme presets (6 current + 8 planned), working quick start, "For AI Agents" section
  - Verified all supporting docs: ROADMAP.md, AI_OPS.md, docs/COMPONENT-INVENTORY.md, docs/MIGRATION.md all present and accurate
  - All 274 tests pass, 0 lint errors, build succeeds

- Task 0.9 — CI/CD setup
  - Created `.github/workflows/ci.yml` — 5 jobs: Lint, Typecheck, Test, Build (parallel), Visual Regression (after build)
  - Lint/typecheck/test/build run in parallel; visual-test is non-blocking (`continue-on-error: true`) due to font rendering differences in CI
  - pnpm store cached via `pnpm/action-setup` + `actions/setup-node` cache; Playwright browsers cached via `actions/cache`
  - Concurrency group cancels in-progress runs on same branch
  - Coverage report uploaded as artifact; screenshot diffs uploaded on visual test failure
  - Created `.github/workflows/pr-title.yml` — validates PR titles follow conventional commits (feat, fix, refactor, style, docs, test, chore, perf)
  - Added CI status badge to README.md
  - Added branch protection recommendation to CLAUDE.md (required status checks: Lint, Typecheck, Test, Build)
  - Verified Vercel deployment: `vercel.json` configured with `buildCommand: "pnpm build"`, `outputDirectory: "playground/dist"` — Vercel GitHub integration handles deployment automatically
  - All 274 tests pass, 0 lint errors, build succeeds

- Task 0.10 — CONTRIBUTING.md
  - Created `CONTRIBUTING.md` at project root with 11 sections: Welcome, Getting Started, Project Orientation, How to Contribute, Code Standards, Adding a Component, Adding a Theme, For AI Agents, Commit Convention, Code of Conduct, Getting Help
  - Serves both human contributors and AI code agents in one document
  - All internal links verified to resolve to real files in the repo
  - Updated README.md to link to CONTRIBUTING.md and mark Phase 0 as complete
  - Under 300 lines, dense and scannable
  - All 274 tests pass, 0 lint errors, build succeeds

- Task 1.1 — Full color system
  - Expanded primitive color palettes across all 6 presets:
    - light/dark/glass: Full 16-hue Tailwind palette (slate, gray, zinc, stone, red, orange, amber, yellow, green, emerald, teal, blue, indigo, violet, purple, pink) × 11 steps + white/black/transparent = 179 primitives each
    - terminal: Reduced to green + gray only (25 primitives) — no other hues
    - retro98: Custom Win98-authentic colors (gray, blue, teal, red, green, yellow) with saturated 11-step scales
    - brutalist: Minimal palette (gray, red, blue, green, amber) — restrained by design
  - Added missing semantic color tokens to all 6 presets:
    - `color-accent-primary` and `color-accent-secondary` (new category)
    - `color-border-muted` and `color-border-success` (new border tokens)
    - `color-action-primary-disabled` (new state)
  - Fixed raw hex values in semantic tier → primitive references (light: status.fg/border now use {primitive.color.*})
  - Dark theme: elevated surfaces are LIGHTER than base (950 → 900 → 800 hierarchy)
  - Added component color tokens (bg, fg, border-color) to button, input, card in all presets
  - Updated `build.ts`: added accent token support to SemanticTokens type and CSS generation
  - Build output: 1703 total variables across 6 themes (up from ~1170)
  - All 274 tests pass, 0 lint errors, build succeeds

- Task 1.3 — Spacing system
  - Expanded primitive spacing scale to 29 values (spacing-0 through spacing-48) across all 6 presets
  - Semantic spacing aliases: xs, sm, md, lg, xl, 2xl, 3xl, section, section-lg
  - Terminal and retro98 presets use compact-equivalent default spacing (xs=2px, sm=4px, md=8px, lg=12px)
  - Three density modes via `data-density` attribute: compact, default, comfortable
  - Density CSS generated theme-independently in arcana.css (composes with any `data-theme`)
  - Component spacing tokens (button padding-x/y, input padding-x, card padding) use `var(--spacing-*)` for automatic density adaptation
  - Fixed `resolvePath` in build.ts to handle dotted keys (e.g., "0.5" in spacing)
  - Updated compat aliases for new spacing values (9, 11, 28, 36, 40, 44, 48)
  - Build output: 1955 total variables across 6 themes, 188 compat aliases
  - All 274 tests pass, 0 lint errors (53 pre-existing warnings), build succeeds

- Task 1.4 — Elevation system (shadows + z-index + backdrop blur)
  - Added primitive shadow values: light=standard Tailwind shadows, dark=higher opacity (0.2-0.5), terminal=all none, retro98=hard pixel shadows (no blur), glass=diffused soft shadows, brutalist=exaggerated hard shadows (no blur)
  - Added primitive backdrop blur scale (none through 3xl: 0-40px) to all 6 presets; terminal/retro98/brutalist set all to 0
  - Updated z-index scale: base(0), raised(10), dropdown(100), sticky(200), fixed(300), overlay(400), modal(500), popover(600), toast(700), tooltip(800)
  - Added 8 semantic contextual elevation tokens: card, card-hover, dropdown, modal, popover, toast, navbar, sidebar
  - Per-preset elevation strategies: light/dark=shadow-based depth, terminal=zero shadows (borders only), retro98=hard pixel shadows, glass=subtle shadows + backdrop-blur, brutalist=exaggerated hard shadows
  - Added component elevation tokens: card (shadow, shadow-hover), modal (shadow, overlay-bg), toast (shadow), navbar (shadow, backdrop-blur)
  - Updated build.ts: added blur to PrimitiveTokens, --blur-* generation, split elevation naming (size-based → --shadow-*, contextual → --elevation-*), added fixed/popover compat aliases
  - Updated component CSS: Card uses --elevation-card/--elevation-card-hover, Modal uses --elevation-modal, Toast uses --elevation-toast, Navbar uses --elevation-navbar + backdrop-filter with --navbar-backdrop-blur
  - Build output: 2099 total variables across 6 themes, 190 compat aliases
  - All 274 tests pass, 0 token lint violations, build succeeds

- Task 1.5 — Layout tokens (breakpoints, containers, grid)
  - Added primitive layout tokens to all 6 presets: 5 breakpoints (sm/md/lg/xl/2xl), 5 container max-widths, 5 content widths (prose/narrow/default/wide/full), grid-columns (12)
  - Added semantic layout tokens: grid-gutter (sm/default/lg), grid-margin (default/lg) — all reference spacing tokens
  - Per-preset variations: terminal=narrower content (56rem/72rem) + tighter gutters (--spacing-sm), brutalist=wider gutters (--spacing-lg); dark/glass/retro98=standard values matching light
  - Updated build.ts: added layout to PrimitiveTokens/SemanticTokens interfaces, layout variable generation with --{key} naming, added 'layout' to primRequired validation
  - Created `packages/core/src/styles/layout.css`: container utility (.arcana-container + size variants), content width variants (.arcana-content--*), 12-column grid (.arcana-grid + gutter variants), column spans (.arcana-col-1 through .arcana-col-12 + .arcana-col-full), responsive columns (.arcana-col-sm-*, .arcana-col-lg-*), stack utility (.arcana-stack + modifiers)
  - Created `packages/core/src/hooks/useMediaQuery.ts`: SSR-safe hook using window.matchMedia, returns boolean
  - Created `packages/core/src/hooks/useBreakpoint.ts`: returns { breakpoint, isMobile, isTablet, isDesktop } using useMediaQuery
  - Exported useMediaQuery, useBreakpoint, Breakpoint, UseBreakpointReturn from packages/core/src/index.ts
  - Integrated layout.css via import in index.ts for automatic bundling
  - Build output: 2321 total variables across 6 themes
  - All 274 tests pass, 0 lint errors, build succeeds

- Task 1.6 — Motion tokens (durations, easing, transitions, reduced-motion)

- Tasks 1.7 + 1.8 — Border/shape + opacity tokens (combined)
  - Added primitive border widths (border-0 through border-8: 0px, 1px, 1.5px, 2px, 4px) and divider (weight, style) to all 6 presets
  - Added 16 primitive opacity values (0, 5, 10, 15, 20, 25, 30, 40, 50, 60, 70, 75, 80, 90, 95, 100) to all 6 presets
  - Updated primitive radius scale: added 3xl (1.5rem/24px), adjusted sizes for finer granularity (md=0.375rem, lg=0.5rem, xl=0.75rem, 2xl=1rem)
  - Added semantic border widths: thin (1px), default (1.5px), thick (2px), heavy (4px) — all referencing primitive border widths
  - Added composable focus ring tokens: --focus-ring-width, --focus-ring-color, --focus-ring (using var() references)
  - Added semantic divider-color token referencing color-border-muted
  - Added 5 semantic opacity tokens: disabled (0.4), placeholder (0.5), hover-overlay (0.08), overlay, overlay-heavy
  - Per-preset border/radius strategies:
    - light/dark: standard radius scale, 1.5px default borders, indigo focus rings at 30%
    - terminal: radius-none everywhere, 1px thin borders, green focus ring at 40%
    - retro98: radius-none everywhere, chunky 2px default borders, solid 1px black focus ring
    - glass: generous radius (0.25–3rem), subtle focus ring at 25% opacity
    - brutalist: radius-none everywhere, thick 3px default borders, bold 3px solid black focus ring
  - Per-preset opacity: dark=heavier overlays (0.65), terminal=imposing (0.8), retro98=solid (1.0), glass=light (0.3), brutalist=nearly solid (0.95)
  - Added component tokens: modal.radius, toast.radius, badge.radius, alert.radius to all 6 presets
  - Fixed hardcoded border values: Avatar 2px→var(--border-width-thick), Toast 3px→var(--border-width-thick), Tabs 1px/2px→border-width tokens, Radio 5px→var(--border-width-heavy)
  - Replaced hardcoded disabled opacity (0.4–0.6) with var(--opacity-disabled) in 10 components (Button, Input, Checkbox, Radio, Toggle, Select, Textarea, Accordion, Tabs)
  - Updated build.ts: primitive border/opacity generation, semantic opacity/divider/focus-ring-width/focus-ring-color generation, validation requires border+opacity
  - Added 197 compat aliases (up from 190) with new border/radius entries
  - Build output: 2681 total variables across 6 themes (up from 2459)
  - All 274 tests pass, 0 lint errors (53 pre-existing warnings), 0 token lint violations, build succeeds
  - Expanded primitive motion to 9 duration values (0–1000ms) and 7 easing curves (linear, default, in, out, in-out, spring, bounce) across all 6 presets
  - Added semantic duration aliases (instant, fast, normal, slow, slower) with per-preset personalities
  - Added 5 transition shorthand tokens (transition-colors, transition-shadow, transition-transform, transition-opacity, transition-all)
  - Per-preset motion personalities: light/dark=standard (fast=100ms, normal=200ms), terminal=instant (fast/normal=0ms, linear easing), retro98=minimal (fast=0ms, normal=75ms, linear), glass=smooth/elegant (fast=150ms, normal=300ms, ease-out default, spring for transforms), brutalist=instant (all 0ms, linear)
  - Added reduced-motion media query to arcana.css: zeros out ALL duration tokens when prefers-reduced-motion: reduce
  - Updated 14 component CSS files to use transition shorthand tokens (var(--transition-colors), var(--transition-shadow), etc.)
  - Fixed hardcoded `linear` in Button spinner → var(--ease-linear)
  - Created usePrefersReducedMotion hook (SSR-safe, uses useMediaQuery)
  - Updated token linter to catch hardcoded easing functions (cubic-bezier, ease keywords)
  - Updated build.ts: primitive motion CSS generation, transition shorthand generation, reduced-motion block
  - Build output: 2459 total variables across 6 themes
  - All 274 tests pass, 0 lint errors, 0 token lint violations, build succeeds

### Active Phase
Phase 3 IN PROGRESS — Tasks 3.1, 3.2, 3.3, 3.4, 3.5, 3.6 complete

### Blockers
None

### What the Next Agent Should Do
1. Read `PROGRESS.md` to confirm Phase 3 / Task 3.7 is next
2. Read `ROADMAP.md` for Phase 3 (Expanded Component Library) requirements
3. Begin Task 3.7 — Layout: Stack, Grid, Container, Divider, Spacer, AspectRatio

### Session History

| Date | Agent | Tasks Completed | Notes |
|------|-------|-----------------|-------|
| 2026-03-01 | Claude (claude.ai) | Project planning | Created ROADMAP.md, AI_OPS.md, PROGRESS.md, CLAUDE.md |
| 2026-03-02 | Claude (Claude Code) | Task 0.1 — Token audit | Scanned 32 CSS files, cataloged ~176 tokens, found 88 hardcoded violations in components, 4 unbuilt themes. Full report at docs/audits/token-audit.md |
| 2026-03-03 | Claude (Claude Code) | Task 0.2 — Token restructure | Created JSON Schema, migrated 6 presets to three-tier format, validated all against schema, created MIGRATION.md |
| 2026-03-03 | Claude (Claude Code) | Task 0.3 — Code standards | Strict TS config, biome formatting rules, .editorconfig, husky pre-commit hook, zero `any` types, 238 tests pass |
| 2026-03-04 | Claude (Claude Code) | Task 0.4 — Build pipeline | New build.ts: reads 6 presets, resolves refs, generates CSS with new naming. 195 vars/theme, compat.css with 177 aliases. All builds + tests pass. |
| 2026-03-04 | Claude (Claude Code) | Task 0.5 — Component API cleanup | Migrated all 20 CSS files from old `--arcana-*` to new token names (511 replacements). Added JSDoc to all props across 48 components. Added forwardRef to 23 components. Renamed Button `danger` → `destructive`. Created docs/COMPONENT-INVENTORY.md. 238 tests pass, 0 lint errors. |
| 2026-03-04 | Claude (Claude Code) | Playground bugfix | Fixed theme switching and interactive controls. Root cause: playground files referenced old `--arcana-*` token names after Task 0.5 migration. Fix: rewrote presets.ts to use `data-theme` attribute for all 6 themes (removed ~240 lines of inline token overrides), migrated 322 old token references across 6 playground files, fixed 3 `variant="danger"` → `variant="destructive"`. 238 tests pass, 0 lint errors. |
| 2026-03-04 | Claude (Claude Code) | Task 0.6 — Testing infrastructure | Enhanced Vitest with coverage (70% thresholds). Rewrote Button (19), Input (23), Modal (28) test suites with ref/className/keyboard/a11y coverage. Set up Playwright 1.56 with 3 viewports, 12 baseline screenshots. Added axe-core a11y Playwright test (0 critical violations). Created test template. 274 unit tests + 13 visual tests pass. |
| 2026-03-07 | Claude (Claude Code) | Task 0.7 — CSS token linter | Created lint-tokens.ts + config. Fixed 93 hardcoded violations across 16 CSS files using component CSS custom properties. Added --focus-ring-error token to all 6 presets. Integrated into pnpm lint. 274 tests pass, 0 lint errors. |
| 2026-03-07 | Claude (Claude Code) | Task 0.8 — Documentation update | Updated manifest.ai.json with new token names and destructive variant. Updated CLAUDE.md and PROGRESS.md to mark tasks 0.1-0.8 complete. Created docs/ARCHITECTURE.md. Verified all docs accuracy. |
| 2026-03-07 | Claude (Claude Code) | Task 0.9 — CI/CD setup | Created ci.yml (5 jobs: lint, typecheck, test, build, visual-test), pr-title.yml (conventional commit validation). Added CI badge to README. Verified Vercel deployment. 274 tests pass, 0 lint errors. |
| 2026-03-07 | Claude (Claude Code) | Task 0.10 — CONTRIBUTING.md | Created CONTRIBUTING.md (11 sections, under 300 lines). Updated README.md with link. Phase 0 complete. 274 tests pass, 0 lint errors. |
| 2026-03-08 | Claude (Claude Code) | Task 1.1 — Full color system | Expanded primitive palettes: light/dark/glass get full 16-hue Tailwind palette (179 primitives), terminal green+gray only, retro98 Win98-authentic, brutalist minimal. Added accent, border-muted, border-success, action-disabled semantic tokens. Added component color tokens. 1703 total vars. 274 tests pass, 0 lint errors. |
| 2026-03-08 | Claude (Claude Code) | Task 1.2 — Typography system | Added display font family, 6xl/7xl sizes, light/black weights to all 6 presets. Changed loose line height from 2 to 1.75. Added semantic typography: fluid clamp() sizes (lg–7xl) for 5 presets, fixed sizes for retro98. Added semantic weight/lineHeight/letterSpacing aliases (heading, body, strong, ui, caps). Added paragraphSpacing token. Added component typography tokens (button font-size/weight/letter-spacing, input font-size). Preset personalities: glass=lighter weights, brutalist=heavy black headings, terminal=monospace everywhere. Removed Google Fonts import from build.ts. Updated build.ts SemanticTokens type. 1883 total vars. 274 tests pass, 0 lint errors. |
| 2026-03-08 | Claude (Claude Code) | Task 1.3 — Spacing system | Expanded primitive scale to 29 values (0–48). Added semantic aliases (xs–section-lg). Terminal/retro98 use compact defaults. Three density modes (compact/default/comfortable) via data-density attribute. Component spacing tokens use var() for density adaptation. Fixed resolvePath for dotted keys. 1955 total vars. 274 tests pass, 0 lint errors. |
| 2026-03-09 | Claude (Claude Code) | Task 1.4 — Elevation system | Added primitive shadows (xs–2xl, inner, none), backdrop blur (none–3xl), updated z-index scale (added fixed/popover, reordered 0–800). Added 8 semantic elevation tokens (card, card-hover, dropdown, modal, popover, toast, navbar, sidebar). Per-preset strategies: light=standard shadows, dark=higher opacity shadows, terminal=zero shadows, retro98=hard pixel shadows, glass=subtle shadows + backdrop-blur, brutalist=exaggerated hard shadows. Added component elevation tokens (card shadow/shadow-hover, modal shadow/overlay-bg, toast shadow, navbar shadow/backdrop-blur). Updated Card/Modal/Toast/Navbar CSS to use elevation tokens. Updated build.ts: blur primitive generation, contextual --elevation-* naming. 2099 total vars. 274 tests pass, 0 lint errors. |
| 2026-03-09 | Claude (Claude Code) | Task 1.5 — Layout tokens | Added primitive layout tokens (5 breakpoints, 5 container sizes, 5 content widths, grid-columns) and semantic layout tokens (grid-gutter variants, grid-margin variants) to all 6 presets. Per-preset variations: terminal=narrower content (56rem/72rem) + tighter gutters, brutalist=wider gutters. Updated build.ts with layout generation + validation. Created layout.css utility classes (container, content width, 12-column grid, responsive columns, stack). Created useMediaQuery and useBreakpoint hooks (SSR-safe). Exported hooks from index.ts. 2321 total vars. 274 tests pass, 0 lint errors. |
| 2026-03-10 | Claude (Claude Code) | Task 1.6 — Motion tokens | Expanded primitive motion to 9 durations × 7 easings. Added semantic aliases + 5 transition shorthands. Per-preset personalities: light/dark=standard, terminal/brutalist=instant, retro98=minimal, glass=smooth/elegant. Added reduced-motion media query zeroing all durations. Updated 14 component CSS files to use shorthand tokens. Created usePrefersReducedMotion hook. Enhanced token linter for hardcoded easing. 2459 total vars. 274 tests pass, 0 lint errors. |
| 2026-03-15 | Claude (Claude Code) | Tasks 1.7+1.8 — Border/shape + opacity | Added primitive border widths (0/1/2/4/8), divider (weight/style), 16 opacity values (0–100). Updated primitive radius scale (added 3xl, adjusted sizes for finer granularity). Added semantic border (thin/default/thick/heavy referencing primitives), focus ring (composable ringWidth + ringColor + ring shorthand), divider color, 5 semantic opacity tokens (disabled/placeholder/hover-overlay/overlay/overlay-heavy). Per-preset: terminal/retro98/brutalist=radius-none everywhere; glass=generous radius (0.25–3rem); retro98=chunky 2px borders + solid 1px focus ring; brutalist=3px default borders + 3px solid black focus ring; glass=subtle 25% opacity focus ring. Added component tokens (modal/toast/badge/alert radius). Fixed hardcoded values: Avatar 2px→border-width-thick, Toast 3px→border-width-thick, Tabs 1px/2px→border-width-thin/thick, Radio 5px→border-width-heavy. Replaced hardcoded disabled opacity (0.4–0.6) with var(--opacity-disabled) in 10 components. Updated build.ts: primitive border/opacity generation, semantic opacity/divider/focus-ring-width/focus-ring-color generation, validation. 2681 total vars. 274 tests pass, 0 lint/token-lint errors. |
| 2026-03-15 | Claude (Claude Code) | Task 1.9 — Token validation CI check | Created validate.ts with 5 checks: structural validation (required fields + naming patterns), reference integrity (broken/circular refs), completeness (all presets match light structure), WCAG AA contrast (11 fg/bg pairs per preset with alpha compositing for rgba backgrounds), value format validation (colors, spacing, durations, opacity, z-index). Created utils/contrast.ts (WCAG 2.1 relative luminance + contrast ratio calculator). Fixed 4 WCAG contrast failures: dark action-primary (indigo-500→600), dark action-destructive (red-500→700), brutalist destructive (red-500→600), terminal destructive (#f85149→#cc0000). Added Validate Tokens CI job. Generated docs/audits/token-validation-report.md. All 6 presets pass, 0 errors. 274 tests pass, 0 lint errors. |
| 2026-03-15 | Claude (Claude Code) | Task 1.10 — Theme switching | Implemented useTheme hook (useSyncExternalStore, localStorage, system preference detection), ThemeProvider context, theme-transition.css. 16 new tests (290 total). |
| 2026-03-15 | Claude (Claude Code) | Task 1.12 — Component token layer | Implemented Tier 3 component tokens with density support. Updated build.ts for density-aware DensityValue objects. Expanded component sections in all 6 preset JSONs (19 components × ~5-12 tokens each). Wired all 19 component CSS files to use var(--{component}-{prop}, var(--semantic-fallback)) pattern. Density modes: compact/default/comfortable for button/input/select height, card padding, table cell-padding-y. Created docs/COMPONENT-TOKENS.md reference. 3239+ total vars. 290 tests pass, 0 token lint violations. Phase 1 COMPLETE. |
| 2026-03-17 | Claude (Claude Code) | Tasks 2.5–2.10 — Mobile patterns + responsive completion | Built BottomSheet, MobileNav, DrawerNav components. Integrated DrawerNav into Navbar (replaced inline mobile panel). Verified tasks 2.6–2.8 already complete (fluid clamp typography from 1.2, density spacing from 1.3, zero max-width queries). Fixed 5 hover-only violations (Card, Table, Tabs, Toast) by adding focus-visible equivalents. Expanded Playwright from 3→5 viewports (320, 375, 768, 1280, 1536). Visual regression tests: 57 baseline screenshots across 5 breakpoints × 2 themes + 2 density modes. Phase 2 COMPLETE. |
| 2026-03-17 | Claude (Claude Code) | Playground bugfix + restoration | Audited playground for broken features. Found: no density switching, brutalist wildcard !important breaking all transitions/shadows, 8 !important declarations, hardcoded box-shadow. Fixes: (1) Added density toggle (compact/default/comfortable) to Token Editor spacing section, (2) Removed brutalist `* { box-shadow: none !important; transition: none !important; }` — theme tokens already handle this, (3) Replaced all !important with proper specificity via double class selectors, (4) Replaced hardcoded font picker dropdown shadow with var(--shadow-lg). All 359 tests pass, 58 Playwright visual tests pass, 0 lint errors. |
| 2026-03-18 | Claude (Claude Code) | Playground bugfix + Phase 2 demos | Fixed border radius not cascading to components (build.ts now outputs var() references for component tokens instead of static values). Added referenceToVar() mapper for semantic/primitive→CSS var names. Added Scale slider (50-200%) via CSS zoom on preview area. Fixed refreshValues to sync all editor state (display font, line-height, base size, spacing, scale, density) on preset switch. Fixed handleReset to clear body/mono fonts. Removed !important from preset globalCSS. Added Mobile Patterns section with BottomSheet, DrawerNav, MobileNav, and Container demos. Updated 57 visual regression baselines. 359 tests pass, 58 Playwright visual tests pass, 0 lint errors. |
| 2026-03-18 | Claude (Claude Code) | Task 3.1 — Refine existing components | Button: added iconOnly prop (square icon buttons). Card: added keyboard handling (Enter/Space) and tabIndex/role for interactive cards. Input: added size prop (sm/md/lg), required indicator with asterisk. Modal: replaced Math.random() IDs with useId() for stable/SSR-safe IDs. Table: added size prop (sm/md/lg) and bordered prop with cell borders. Badge: added size prop (sm/md/lg). Alert: extended HTMLAttributes for full prop spreading. Avatar: replaced hardcoded hex colors with token-based CSS classes (8 color variants using semantic tokens). Toggle: added description prop with aria-describedby. Tabs: added arrow key navigation (Left/Right/Up/Down/Home/End) in TabList per WAI-ARIA. Accordion: wired up controlled value/onChange props. 359 tests pass, 0 token lint violations, build succeeds. |
| 2026-03-18 | Claude (Claude Code) | Task 3.3 — Marketing components | Rewrote 7 existing components from composition-based to prop-driven APIs: Hero (3 variants: centered/split/fullscreen, overlay, badge, height), PricingCard (popular treatment with badge/elevated shadow, compact variant, feature checklist), FeatureSection (grid/list/alternating variants, section title+subtitle, feature links), Testimonial (card/inline/featured variants, star rating, decorative quote marks, cite element), CTA (banner/card/minimal variants, contrasting bg), StatsBar (animated number counting on scroll via IntersectionObserver, trend up/down indicators, dl/dt/dd semantic structure), Timeline (complete/active/pending status dots, pulsing animation, ol structure, compact/alternating variants). Created LogoCloud from scratch (grid/marquee/fade variants, grayscale-to-color hover, reduced-motion respecting). Added 8 component token sections to all 6 presets (hero, pricing, feature, testimonial, cta, stats, timeline, logocloud). Added Marketing section to playground with realistic demos. Updated manifest.ai.json with all 8 components. 3587 total token vars (up from ~3239). 543 tests pass, 0 token lint violations, build succeeds. |
| 2026-03-18 | Claude (Claude Code) | Task 3.4 — Data display components | Built 4 data display components: DataTable (generic <T>, sorting, filtering, row selection with select-all/indeterminate, pagination with page size selector, sticky header, sticky columns, loading skeletons, empty state, keyboard navigation on clickable rows), StatCard (dl/dt/dd semantics, trend indicators with colored arrows, prefix/suffix, icon, compact variant, loading skeleton), ProgressBar (default/striped/animated variants, sm/md/lg sizes, 5 color options, indeterminate mode, showValue, prefers-reduced-motion), KPICard (pure SVG sparkline from data array, target dashed line, trend-colored sparkline, period label, compact variant). Added component tokens (datatable, statcard, progress, kpicard) to all 6 presets with per-preset overrides (terminal/retro98/brutalist=radius-none, glass=radius-xl). Added playground demos with Lumina Analytics realistic data (12 users, sortable/filterable/selectable DataTable with pagination, 4 StatCards with trends, all ProgressBar variants, 4 KPICards with sparklines). Updated manifest.ai.json, COMPONENT-TOKENS.md. 621 tests pass (up from 543), 0 lint errors, 0 token lint violations, build succeeds. |
| 2026-03-18 | Claude (Claude Code) | Task 3.5 — Form components | Enhanced Select: rebuilt as custom combobox dropdown with searchable (type-to-filter), multiple (checkmark pills, stays open), grouped options (section headers), clearable (X button), loading spinner. Added CheckboxGroup (fieldset/legend, vertical/horizontal orientation, array value management). Enhanced RadioGroup: added card variant (selectable cards with border highlight), horizontal orientation, error prop. Built DatePicker from scratch: calendar dropdown with month navigation, day grid, today highlight, min/max date constraints, clearable, keyboard Escape to close, text input parsing. Built FileUpload from scratch: dropzone variant (drag-and-drop with visual feedback, dashed border), button variant, file list with name/size/remove, maxSize/maxFiles validation, onError callback. Added component tokens (datepicker, fileupload) to all 6 presets. Updated playground with enhanced form demos (searchable grouped select, multi-select, checkbox group, card radio, toggle, datepicker, file upload, combined form). 688 tests pass (up from 621), 0 lint errors, 0 token lint violations, build succeeds. |
| 2026-03-18 | Claude (Claude Code) | Task 3.6 — Overlay components | Verified existing: Modal (complete with focus trap, scroll lock, sizes, escape, overlay click, ARIA), Toast (complete with provider, variants, auto-dismiss, stacking), BottomSheet and DrawerNav (complete). Built Drawer from scratch: general-purpose overlay panel with left/right/top/bottom sides, sm/md/lg/full sizes, focus trap, scroll lock, sticky header/footer, slide animations, escape to close, overlay backdrop. Built Popover from scratch: positioned floating panel with auto-flip viewport detection, click/hover triggers, arrow support, getBoundingClientRect positioning, scroll/resize repositioning, escape to close. Built CommandPalette from scratch: ⌘K search and command interface with grouped items, keyboard arrow nav, Enter to select, search filtering, shortcuts display, focus trap, scroll lock, fast scale+fade animation. Created useHotkey hook: SSR-safe keyboard shortcut listener with meta/ctrl/alt/shift modifiers, ignores editable elements. Added component tokens (drawer, popover, command) to all 6 presets. Playground Overlays section with Drawer (3 sides), Popover (click + arrow), CommandPalette (⌘K). 742 tests pass (up from 688), 0 lint errors, 0 token lint violations, build succeeds. |
