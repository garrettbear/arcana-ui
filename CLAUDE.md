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
Phase 0 COMPLETE — ready for Phase 1

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

### Active Phase
Phase 0 COMPLETE. Ready for Phase 1 — Token System Maturity.

### Blockers
None

### What the Next Agent Should Do
1. Read `PROGRESS.md` to confirm Phase 1 / Task 1.1 is next (Full color system)
2. Read `ROADMAP.md` Section 2 for token architecture details
3. Read `AI_OPS.md` for the Task 1.1 prompt
4. Implement the full color token system

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
