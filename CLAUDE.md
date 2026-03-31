# CLAUDE.md — Arcana UI

> This file provides guidance to Claude Code and other AI coding agents when working with this repository.
> Read this file completely before making any changes to the codebase.

---

## Project Identity

**Arcana UI** is an open-source, token-driven design system built for AI agents to assemble production-grade web interfaces. Tokens in, beautiful UI out.

- **Repo:** `Arcana-UI/arcana`
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

## Branching Model

This project uses a two-branch model. See `RELEASING.md` for the full strategy.

- **`develop`** — Staging branch. This is where all day-to-day work happens. Feature branches are created from `develop`. PRs target `develop`. Beta releases are published from `develop`.
- **`main`** — Releases only. Every commit on `main` is a published release. Never commit directly to `main`. Only receives merges from `develop` via release PRs.
- **Feature branches** — Created from `develop`, named `{type}/{task-number}-{description}` (e.g., `feat/3.4-data-display`). Deleted after merge.

**Rules for AI agents:**
- Never directly commit to `main`. Never run `npm publish`. Never bump versions.
- Always branch from `develop`. Always PR into `develop`.

---

## Branch Rules

EVERY new task gets a NEW branch. Never reuse a branch from a previous task.

```bash
# ALWAYS start from a clean, updated develop
git checkout develop && git pull origin develop

# ALWAYS create a new branch with this EXACT format:
git checkout -b {type}/{task-id}-{descriptive-name}
```

The branch name must be descriptive enough that someone reading ONLY the branch name understands what it contains.

```
# ❌ BAD branch names — vague, not descriptive
feat/updates
fix/bugs
feat/playground
refactor/improvements
feat/phase-3

# ✅ GOOD branch names — specific, descriptive
feat/3.4-datatable-statcard-progressbar-kpicard
fix/playground-token-editor-color-picker-lag
feat/P1-landing-page-hero-features-pricing
refactor/token-editor-collapsible-sections-search
feat/theme-switcher-json-upload-modal
fix/navbar-hamburger-not-opening-on-mobile
docs/releasing-strategy-changelog-setup
chore/npm-beta-publish-preparation
```

**Rules:**
1. Type must be one of: feat, fix, refactor, test, docs, chore
2. Task ID from the roadmap if applicable (3.4, P.1, 1.12, etc.)
3. Descriptive name uses kebab-case and lists the key deliverables
4. Maximum 60 characters total for the branch name
5. NEVER reuse a branch. Every `git checkout -b` is a new branch name.

**When given a new prompt mid-session:**
1. Commit and push your current work
2. Create a PR for the current branch (if it has meaningful changes)
3. Switch to develop: `git checkout develop && git pull`
4. Create a NEW branch for the new task
5. NEVER continue a different task on an existing branch

---

## PR Rules

### PR Title Format

```
{type}({scope}): {specific description} [{task-id}]
```

The title must describe WHAT was done, not just reference a task number.

```
# ❌ BAD PR titles
feat: updates
fix: bug fixes
feat(core): phase 3 work
refactor: improvements

# ✅ GOOD PR titles
feat(core): add DataTable, StatCard, ProgressBar, KPICard [3.4]
fix(playground): fix color picker lag and token editor slider snapping
feat(playground): add landing page with hero, features, pricing sections [P.1]
feat(tokens): redesign all 6 presets with per-preset elevation strategies [4.1]
fix(core): fix Navbar hamburger menu not opening on mobile
refactor(tokens): add cubic bezier editor and motion duration controls
docs: add releasing strategy and changelog
chore: set up npm beta publish and branching infrastructure
```

### PR Description

The repository has a PR template at `.github/pull_request_template.md`. When creating a PR with `gh pr create`, you MUST fill in EVERY section of the template.

**CRITICAL: Do NOT leave template sections empty or with placeholder text.**
**CRITICAL: The "Changes Made" section must list EVERY file you touched.**
**CRITICAL: The "Breaking Changes" section must be filled in — write "None" if there are none.**
**CRITICAL: CHANGELOG.md must be updated BEFORE creating the PR.**

Always read the template before creating a PR:
```bash
cat .github/pull_request_template.md
```

---

## Changelog Rules

`CHANGELOG.md` must be updated in **every PR**, before the PR is created. This is not optional.

Add entries under the `[Unreleased]` section using the Keep a Changelog format:

```markdown
## [Unreleased]

### Added
- DataTable component with sorting, filtering, pagination, and row selection

### Changed
- Updated manifest.ai.json with data display component entries

### Fixed
- Fixed color picker not updating preview in real-time

### Breaking
- Renamed Button prop `type` to `variant` (migration: replace type= with variant=)
```

**Categories:** Added, Changed, Fixed, Deprecated, Removed, Breaking

**Rules:**
1. Every `feat` commit = an "Added" entry
2. Every `fix` commit = a "Fixed" entry
3. Every breaking change = a "Breaking" entry WITH migration instructions
4. Entries must be specific — "Added DataTable with sorting and pagination" not "Added new components"
5. The Unreleased section accumulates until a release, then gets moved under a version header

---

## Essential Documents

| File | Purpose | When to Read |
|------|---------|--------------|
| `CLAUDE.md` | Agent instructions, project rules, current state | Every session (start) |
| `PROGRESS.md` | Checklist tracker — what's done, what's next | Every session (start + end) |
| `ROADMAP.md` | Full architecture, token spec, component standards, phased plan | When working on any task |
| `AI_OPS.md` | Prompt library, tracking system, session management | When you need the specific prompt for a task |
| `RELEASING.md` | Branching model, release process, version numbering | When branching, releasing, or versioning |
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
Phase 4 (partial) + Phase P (partial)

### Phase Completion Summary

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 0 — Foundation Cleanup | ✅ Complete | |
| Phase 1 — Token System Maturity | ✅ Complete | 2,600+ CSS variables, 14 presets |
| Phase 2 — Responsive & Mobile | ✅ Complete | 5-breakpoint visual regression suite |
| Phase 3 — Expanded Component Library | ✅ Complete | 60+ components |
| Phase 4 — Theme Presets & Demo Sites | 🔄 Partial | 4.1, 4.2, 4.3, 4.6, 4.10 done |
| Phase P — Playground Product | 🔄 Partial | P.1, P.1.1, P.1.2, P.1.3, P.1.4 done |
| Phase 5 — AI Integration & Launch | ⬜ Not started | |

### Key Milestones Reached
- **14 theme presets** built and polished: light, dark, terminal, retro98, glass, brutalist, corporate, startup, editorial, commerce, midnight, nature, neon, mono
- **60+ components** across navigation, forms, data display, overlays, layout, media, feedback, e-commerce, editorial, and utility categories
- **npm packages published** as `0.1.0-beta.1` on npmjs.com — `@arcana-ui/tokens` and `@arcana-ui/core`
- **Landing page** live at `arcana-design-system.vercel.app` — dark premium aesthetic, 10 sections, SEO, responsive
- **Token editor** rebuilt to investor-demo quality: custom HSV color picker, cubic bezier editor, undo/redo (Cmd+Z), search/filter, modified indicators, mobile message
- **Demo infrastructure** in place: SaaS dashboard + e-commerce demos with shared ThemeSwitcher
- **Playground site map** with 6 route types: editor, component gallery, component detail, token explorer, token impact, and D3 force-directed relationship graph
- **Repo** at `github.com/Arcana-UI/arcana`; branching: `develop` (day-to-day), `main` (releases only)

### Remaining Work

**Phase 4:**
- 4.4 — Demo: Marketing Landing Page
- 4.5 — Demo: Editorial Blog
- 4.7 — Demo: Documentation Site
- 4.8 — Demo: Admin Panel
- 4.9 — Visual regression test fixtures from demos

**Phase P:**
- P.2 — AI theme generation (prompt input → theme JSON)

**Phase 5:** Not started (depends on Phase 4 completion)

### Blockers
None. npm packages are published. Credentials not needed for development work.

### What the Next Agent Should Do
1. Read CLAUDE.md, PROGRESS.md, ROADMAP.md, AI_OPS.md
2. Create a new branch from `develop` for the task (NEVER commit directly to develop)
3. Priority: P.2 — AI theme generation, OR 4.4/4.5/4.7/4.8 demo content
4. Pre-existing test issue: 16 tests in `useTheme.test.tsx` fail (`localStorage.clear is not a function`) — investigate vitest jsdom environment config when time permits

### Session History

| Date | Agent | Tasks Completed | Notes |
|------|-------|-----------------|-------|
| 2026-03-01 | Claude (claude.ai) | Project planning | Created ROADMAP.md, AI_OPS.md, PROGRESS.md, CLAUDE.md |
| 2026-03-02 | Claude (Claude Code) | Task 0.1 — Token audit | Scanned 32 CSS files, cataloged ~176 tokens, found 88 hardcoded violations |
| 2026-03-03 | Claude (Claude Code) | Task 0.2 — Token restructure | Created JSON Schema, migrated 6 presets to three-tier format |
| 2026-03-03 | Claude (Claude Code) | Task 0.3 — Code standards | Strict TS config, biome rules, husky pre-commit hook |
| 2026-03-04 | Claude (Claude Code) | Task 0.4 — Build pipeline | build.ts: 195 vars/theme, compat.css with 177 aliases |
| 2026-03-04 | Claude (Claude Code) | Task 0.5 — Component API cleanup | Migrated 20 CSS files (511 replacements), JSDoc on all props, forwardRef on 23 components |
| 2026-03-04 | Claude (Claude Code) | Playground bugfix | Fixed theme switching after 0.5 migration |
| 2026-03-04 | Claude (Claude Code) | Task 0.6 — Testing infrastructure | Vitest coverage, Playwright 5 viewports, axe-core a11y. 274 unit + 13 visual tests |
| 2026-03-07 | Claude (Claude Code) | Tasks 0.7–0.10 | CSS token linter, documentation update, CI/CD (ci.yml + pr-title.yml), CONTRIBUTING.md. Phase 0 complete. |
| 2026-03-08 | Claude (Claude Code) | Tasks 1.1–1.3 | Full color system (16-hue palettes), typography system (fluid clamp), spacing system (29-value scale, density modes) |
| 2026-03-09 | Claude (Claude Code) | Tasks 1.4–1.5 | Elevation system (shadows + backdrop blur + z-index), layout tokens (breakpoints, containers, grid utilities) |
| 2026-03-10 | Claude (Claude Code) | Task 1.6 | Motion tokens (9 durations × 7 easings, per-preset personalities, reduced-motion media query) |
| 2026-03-15 | Claude (Claude Code) | Tasks 1.7–1.12 | Border/shape + opacity tokens, token validation CI, theme switching hook, component token layer. Phase 1 complete. |
| 2026-03-17 | Claude (Claude Code) | Tasks 2.5–2.10 + playground fixes | BottomSheet, MobileNav, DrawerNav. 5-breakpoint Playwright suite. Phase 2 complete. |
| 2026-03-18 | Claude (Claude Code) | Tasks 3.1–3.6 | Refined 22 components; built DataTable, StatCard, ProgressBar, KPICard; enhanced forms (Select, DatePicker, FileUpload); Drawer, Popover, CommandPalette |
| 2026-03-19 | Claude (Claude Code) | Tasks 3.7–3.12 + playground audit | Layout/Media/Feedback/E-commerce/Editorial/Utility components. 928 tests pass. Phase 3 complete. 60+ components. |
| 2026-03-19 | Claude (Claude Code) | Task 4.1 + playground elevation | Redesigned 6 presets to production quality. Token editor Motion section. Interactive demos throughout playground. |
| 2026-03-20 | Claude (Claude Code) | Task 4.2 + Task P.1 | 8 new presets (corporate, startup, editorial, commerce, midnight, nature, neon, mono). Landing page with 10 sections. |
| 2026-03-21 | Claude (Claude Code) | Tasks P.1.1 + P.1.2 | Landing page: 14-theme showcase, ?theme= param, dead link fixes. Playground: 8 new preset logos, color-scheme fixes. |
| 2026-03-23 | Claude (Claude Code) | npm beta prep + demo infrastructure | Published 0.1.0-beta.1 to npm. Built SaaS dashboard + e-commerce demos. ThemeSwitcher shared component. |
| 2026-03-26 | Claude (Claude Code) | Task P.1.3 — Token editor rebuild | Custom HSV ColorPicker (canvas, EyeDropper, recent colors), CubicBezierEditor (canvas, 7 presets, animation preview), rebuilt TokenEditor (6 color sub-groups, search/filter, undo/redo, per-token modified indicators, FontPicker, mobile message). PR #65. |
| 2026-03-26 | Claude (Claude Code) | Doc sync + branch rules | Integrated BRANCH_PR_RULES.md into CLAUDE.md + AI_OPS.md. Added release metadata to manifest.ai.json. Updated Current State to reflect actual project status. |
| 2026-03-27 | Claude (Claude Code) | Playground component audit + dogfooding | Audited all playground UI elements. Replaced 35+ raw HTML elements with Arcana components (Button, Badge, Input, Select, ProgressBar) across TokenEditor, AccessibilityPanel, Landing, ColorPicker, CubicBezierEditor. Audit report at docs/audits/. Arcana usage: 63% → 91%. |
| 2026-03-28 | Claude (Claude Code) | Task P.1.4 — Playground site map architecture | Built 6 new routes: component gallery, component detail, token explorer, token impact, relationship graph. Component-to-token mapping build script (67 components, 551 tokens). Canvas-based graph visualization. All pages use Arcana components, token-driven CSS. 928 tests pass. |
| 2026-03-31 | Claude (Claude Code) | Graph visualization upgrade — D3 force simulation | Replaced Canvas-based graph with D3 force-directed SVG visualization. Added glow filters, hover highlighting with connection tracing, zoom/pan, drag interaction, search-to-focus, legend, category color coding, tooltip, loading spinner, mobile fallback message, click-to-navigate. 958 tests pass. |
