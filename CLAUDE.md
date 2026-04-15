# CLAUDE.md — Arcana UI

> This file provides guidance to Claude Code and other AI coding agents when working with this repository.
> Read this file completely before making any changes to the codebase.

---

## Project Identity

**Arcana UI** is an open-source, token-driven design system built for AI agents to assemble production-grade web interfaces. Tokens in, beautiful UI out.

- **Repo:** `Arcana-UI/arcana`
- **License:** MIT
- **Packages:** `@arcana-ui/tokens` (design tokens → CSS custom properties), `@arcana-ui/core` (React components)
- **Production:** [arcana-ui.com](https://arcana-ui.com)
- **Staging (develop branch):** [develop.arcana-ui.com](https://develop.arcana-ui.com) — auto-deploys on every push to `develop`
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
Landing-motion sweep (three-PR series) is now fully delivered. All three land on `develop`. PR 1 `refactor/landing-consume-motion-tokens` (merged) tokenized every hardcoded duration / easing string in `playground/src/pages/Landing.module.css`. PR 2 `feat/landing-enterprise-motion` (merged, PR #116) introduced the four motion primitives (`FadeIn`, `Stagger`, `CountUp`, `GradientBorder`) plus the shared `useInView` hook, retrofitted every landing section with them, added the cursor-tracked CTA spotlight and hero drift blobs, and added a `scale(0.98)` on `:active` to `@arcana-ui/core` Buttons. PR 3 (this branch `feat/tokens-preset-motion-personalities`) closes the sweep: per-preset motion personalities now override `semantic.motion` in each JSON under `packages/tokens/src/presets/` (editorial=calm linear 180/300/450ms, glass=languid ease-in-out 200/350/600ms, midnight=deliberate ease-in-out 120/240/360ms, nature=organic spring 150/260/420ms, neon=energetic spring 150/200/300ms, retro98=snappy steps(3,end) 0/100/150ms, brutalist and terminal keep their existing instant baselines, the rest stay on the 100/200/300ms cubic default); the playground Token Editor's Motion section grows two new sliders (Fast and Slow) alongside the existing Normal slider and already-wired `CubicBezierEditor`, each piped through its own `applyMotionDuration*` helper and captured in `collectTokenSnapshot` so JSON / CSS exports round-trip; `scripts/generate-manifest.mjs` gets a new `resolveTokenRef` + `classifyMotion` helper that resolves `{primitive.x.y.z}` refs against a preset's tree and writes `tokens.themes[].motion` as `{ personality, fast, normal, slow, defaultEasing }` into `manifest.ai.json`; ROADMAP.md's preset matrix gets a Motion Personality column with the resolved ms / easing string; and `tests/visual/landing.spec.ts` ships the Playwright harness that calls `page.addStyleTag` with `animation-delay: -999s` + `transition-duration: 0s` so reveal motion settles before the snapshot (baselines generated via `pnpm test:visual --update-snapshots` on first run). All 14 presets rebuild cleanly through `pnpm build:tokens` and the per-preset CSS reflects the new durations / easings exactly.

P.5 Sprint 2 is fully closed. First cut (PR #106) landed the Anthropic-backed edge function, landing hero, `/generate` preview route, pick-into-editor. PR #107 hardened the shared server key with a tightened origin allowlist, per-IP limit of 5 per minute, and a 60 per minute global ceiling. Sprint 2 itself was four follow-up PRs (#108 BYOK UI, #109 topbar chip, #110 KV cache, #113 error.type forwarding), each on its own branch off `develop`, plus a final storage swap on `refactor/P.5-swap-kv-for-supabase-cache`:

1. `feat/P.5.1-byok-settings-ui` (PR #108, merged). Gear icon in the playground topbar opens a Popover with the BYOK API key Input, Test-and-save, Clear, and a "Your key" Badge when set.
2. `feat/P.5.1-topbar-generated-name` (PR #109, merged). Shows the picked theme's name as a chip in the topbar when `?theme=generated` is active.
3. `feat/P.5.1-kv-semantic-cache` (PR #110, merged, later superseded). Original Vercel KV lookup keyed on SHA-256 of the normalized `{description, siteType, density, count, model}` tuple, 7-day TTL.
4. `feat/P.5-forward-anthropic-error-type` (PR #113, merged). Edge function parses Anthropic's JSON error envelope on non-2xx, copies `error.type` to a new `code` field, and forwards upstream HTTP status unchanged.
5. `refactor/P.5-swap-kv-for-supabase-cache` (this PR). Swapped `@vercel/kv@3` (deprecated upstream) for `@supabase/supabase-js` against the shared `arcana-ops-prod` Supabase project. Same cache key (now written as `<modelShort>:<hash16>` directly into `theme_cache.cache_key` without the legacy `arcana:theme:` prefix), same 7-day TTL via an absolute `expires_at` column the read path filters in SQL, same BYOK skip (now made explicit: BYOK sets `Cache-Control: no-store` and bypasses both read and write paths), same hit/miss `console.log` instrumentation. New: responses carry an `X-Cache: HIT | MISS` header and the hit path fires a `increment_theme_cache_hit` RPC fire-and-forget. Client initialized once at module scope; missing `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` logs one warning and the cache layer soft-fails to a pass-through, so local dev without the env vars still works. `buildCacheKey` is exported and pinned by a new 8-case unit suite (`api/generate-theme.test.ts`, new `api/vitest.config.ts` wired into the workspace) so the hash scheme cannot drift silently.

Post-Sprint 2 hotfixes for the landing hero input:

1. Root `vercel.json` SPA rewrite source was `/(.*)`, which caught `/api/*` and returned 405 on POST to `/api/generate-theme`. Changed the rewrite source to `/((?!api/).*)` so edge functions handle `/api/*` while the SPA still gets every other path. (PR #111)
2. After the rewrite fix, the same call returned 404: the Vercel project's Root Directory is the repo root, so Vercel only scans `./api/*` for functions. Moved the function (and its README) to `./api/` and moved `.env.example` to the repo root alongside. (PR #112)

Supabase accounts + workspaces (P.5.2) are the next sprint. Infrastructure for that sprint (the `arcana-ops-prod` Supabase project, the service role key in Vercel env) is already in place thanks to the cache swap.

### Phase Completion Summary

| Phase | Status | Notes |
|-------|--------|-------|
| Phase 0 — Foundation Cleanup | ✅ Complete | |
| Phase 1 — Token System Maturity | ✅ Complete | 2,600+ CSS variables, 14 presets |
| Phase 2 — Responsive & Mobile | ✅ Complete | 5-breakpoint visual regression suite |
| Phase 3 — Expanded Component Library | ✅ Complete | 60+ components |
| Phase 4 — Theme Presets & Demo Sites | 🔄 Partial | 4.1, 4.2, 4.3, 4.6, 4.10 done |
| Phase P — Playground Product | 🔄 Partial | P.1, P.1.1, P.1.2, P.1.3, P.1.4, P.5 done |
| Phase 5 — AI Integration & Launch | 🔄 Partial | 5.1, 5.2, 5.11 done |

### Key Milestones Reached
- **v0.1.0 stable release PR** open against `main` from `release/0.1.0` — all four packages bumped to `0.1.0`, finalized CHANGELOG, migration doc infrastructure in place for future breaking changes.
- **14 theme presets** built and polished: light, dark, terminal, retro98, glass, brutalist, corporate, startup, editorial, commerce, midnight, nature, neon, mono
- **108 components** across navigation, forms, data display, overlays, layout, media, feedback, e-commerce, editorial, and utility categories
- **npm packages published** as `0.1.0-beta.2` on npmjs.com — `@arcana-ui/tokens` and `@arcana-ui/core`; stable `0.1.0` pending release PR merge
- **Landing page** live at `arcana-ui.com` — dark premium aesthetic, 10 sections, SEO, responsive
- **Token editor** rebuilt to investor-demo quality: custom HSV color picker, cubic bezier editor, undo/redo (Cmd+Z), search/filter, modified indicators, mobile message
- **Demo infrastructure** in place: SaaS dashboard + e-commerce demos with shared ThemeSwitcher
- **Playground site map** with 6 route types: editor, component gallery, component detail, token explorer, token impact, and D3 force-directed relationship graph
- **Repo** at `github.com/Arcana-UI/arcana`; branching: `develop` (day-to-day), `main` (releases only)
- **CLI** built and published as new `@arcana-ui/cli@0.1.0-beta.1` on npm: `init` (5 starter layouts × Vite/Next), `validate` (theme JSON linter with WCAG AA contrast checks), `add-theme` (preset activation snippet). All 10 layout/framework combos typecheck against published `@arcana-ui/core`.

### Remaining Work

**Phase 4:**
- 4.4 — Demo: Marketing Landing Page
- 4.5 — Demo: Editorial Blog
- 4.7 — Demo: Documentation Site
- 4.8 — Demo: Admin Panel
- 4.9 — Visual regression test fixtures from demos

**Phase P:**
- P.5 — AI theme generation ✅ (first cut PR #106, shared-key hardening PR #107, Sprint 2 = BYOK UI #108 + topbar chip #109 + KV cache #110 + error.type forwarding #113 + Supabase cache swap in this PR; plus hotfixes #111/#112)
- P.5.2 — Accounts + workspaces (Supabase) so users can save cocacola-light, cocacola-dark, etc. under one brand workspace — **next up**
- P.5.3 — Asset-augmented generation (logo + inspo upload, vision-conditioned generation)

**Phase 5:**
- 5.3 — Claude Code skill ✅ `.claude/skills/arcana/SKILL.md` (1,821 lines)
- 5.4 — MCP server ✅ `@arcana-ui/mcp@0.1.0-beta.1` (7 tools, 130 kB package)
- 5.5 — Documentation site
- 5.6 — SEO & discoverability
- 5.7 — Community starter templates beyond Vite + Next
- 5.8 — Figma Code Connect
- 5.9 — Performance audit
- 5.10 — Launch checklist

### Blockers
**Release PR open** — `release/0.1.0` → `main`. Waiting on Bear to: (1) merge the PR to main, (2) tag `v0.1.0` on the merge commit and push, (3) `npm publish` each of `@arcana-ui/tokens`, `@arcana-ui/core`, `@arcana-ui/cli`, `@arcana-ui/mcp` from `main`, (4) create a GitHub Release from the tag. Until those finish, no npm installs of the stable `0.1.0` will work.

### What the Next Agent Should Do
1. Read CLAUDE.md, PROGRESS.md, ROADMAP.md, AI_OPS.md
2. Priority: P.5.2 — accounts + workspaces on Supabase. The `arcana-ops-prod` Supabase project is already wired into Vercel env thanks to the cache swap, so the anon key for the browser is the only net-new secret needed. Reuse the same project.
3. Alternate priorities if P.5.2 is blocked: 5.5 — documentation site, 5.9 — performance audit, 6.x — extensibility.
4. Pre-existing test issue: 16 tests in `useTheme.test.tsx` fail (`localStorage.clear is not a function`) — investigate vitest jsdom environment config when time permits

### Session History

| Date | Agent | Tasks Completed | Notes |
|------|-------|-----------------|-------|
| 2026-04-15 | Claude (Claude Code) | Landing motion primitives + enterprise polish (PR 2 of the 3-PR motion sweep) | Branch `feat/landing-enterprise-motion` off `develop`. Builds on the (still-open) PR `refactor/landing-consume-motion-tokens` which tokenized every hardcoded `ms` / `s` value in `Landing.module.css`; this branch is independent of that one, so the two can merge in either order. Created the shared `useInView` hook at `playground/src/hooks/useInView.ts` (threshold 0.15, triggers once, disconnects the observer on first intersection, reports `true` immediately when `IntersectionObserver` is absent or `prefers-reduced-motion: reduce` is set so the primitives fall through to a visible resting state). Added four motion primitives under `playground/src/components/motion/` wired through a barrel at `index.ts`: `FadeIn` (opacity + `translateY(24px)` reveal keyed to `--duration-slow` / `--ease-out`, merges internal observer ref with forwarded ref, renders as `div` / `span` / `section`), `Stagger` (walks `Children.map`, clones bare elements into `FadeIn`s with `baseDelay + i * step` delays, clones existing `FadeIn`s in place instead of double-wrapping them, leaves non-element children verbatim), `CountUp` (rAF-driven ease-out cubic animating 0 -> `to` over 1200ms once the span enters view, respects `prefers-reduced-motion` by snapping to the final value, supports a `suffix` prop rendered inside its own aria-hidden span and a `formatThousands` toggle that wraps `value.toLocaleString`), `GradientBorder` (masked `::before` pseudo-element paints a conic gradient from `var(--color-accent)` / `var(--color-accent-bright)`, invisible at rest, fades in and rotates `--gradient-angle` from 0deg to 360deg on hover / focus-within; uses the CSS `@property` registration so the angle interpolates smoothly). Shared sheet `motion.module.css` collapses every transition to `0ms` under `prefers-reduced-motion: reduce`. Retrofitted `playground/src/pages/Landing.tsx` section-by-section: hero wraps the Badge + headline + accent span + subheadline + prompt form + alt-links in `FadeIn`s at 0 / 100 / 200 / 300 / 400ms; logo cloud uses a `Stagger` with `step=60`; the features grid is a `Stagger` with `step=80` whose three children are `GradientBorder`-wrapped feature cards; how-it-works is a `Stagger` with `step=120`; the 14-theme gallery is a `Stagger` with `step=40`; the browser-framed component showcase is a `FadeIn` with `translateY=48`; the four stats are `CountUp`s inside a `Stagger` (108+, 2,600+, 14, 5); the CTA section was extracted into a new `CtaSection` helper that pipes cursor position into `--spotlight-x` / `--spotlight-y` on a `.ctaSpotlight` radial gradient (revealed on hover only). Hero also gets two new radial-gradient `heroDriftBlobA` / `heroDriftBlobB` divs that loop at 18s / 24s using the accent + accent-bright tokens, backed by a `.hero > *:not(.heroDriftBlobA):not(.heroDriftBlobB) { position: relative; z-index: 1 }` selector so the content stays above the drift layer. All new landing CSS keyed to motion tokens; the `@media (prefers-reduced-motion: reduce)` block at the bottom of `Landing.module.css` now also zeroes the drift animations and the spotlight transition. Enterprise-polish tweak in core: `packages/core/src/primitives/Button/Button.module.css` adds `transform var(--duration-fast) var(--ease-out)` to the transition list and applies `transform: scale(0.98)` on `:active:not(:disabled)`, neutralized to `none` under reduced motion. No new runtime deps (all four primitives combined come in well under the 2 kB gzipped ceiling the spec called for). Verified: `pnpm lint` 0 errors / 77 pre-existing warnings, `pnpm test` 982/982 pass (no motion-primitive tests added because their behavior is framework-bound; JSDOM can't exercise rAF / IntersectionObserver in a way that meaningfully tests the animation), `pnpm build` green across every workspace project. Playwright visual regression was not regenerated in this session because (a) the existing suite only snapshots playground routes, not the landing, and (b) the only core visual change is a `:active`-only transform which does not appear in static screenshots; if the landing ever gets a visual baseline the Playwright harness should set `animation-delay: -999s` globally so the reveal animations settle before capture. |
| 2026-04-15 | Claude (Claude Code) | P.5 Sprint 2 tail — swap Vercel KV for Supabase theme cache | Branch `refactor/P.5-swap-kv-for-supabase-cache` off `develop`. Storage swap only; no behavior changes to the BYOK header logic, Anthropic call, rate limiter, or error.type forwarding from #113. `package.json`: `@vercel/kv@^3.0.0` dropped, `@supabase/supabase-js@^2.45.4` added at the repo root (the edge function bundles from `./api/`, not `./playground/api/`, since the Vercel Root Directory is repo root). `api/generate-theme.ts`: deleted the `kv` import and singleton; added `createClient`-based Supabase client at module scope wrapped in try/catch, logging a single warning if `SUPABASE_URL` / `SUPABASE_SERVICE_ROLE_KEY` is missing and leaving the client null so the cache layer soft-fails to a pass-through (local dev keeps working). Cache key shape dropped the `arcana:theme:` prefix — now `<modelShort>:<hash16>` where modelShort is `haiku` or `sonnet`; `buildCacheKey` was exported so a new 8-case unit suite can pin the hash scheme. Read path selects `response, expires_at` from `theme_cache` filtered by `expires_at > now()`, fires an `increment_theme_cache_hit` RPC fire-and-forget on hit. Write path is an upsert on `cache_key` with `expires_at = now() + 7 days`, also fire-and-forget. BYOK skip made explicit: both read and write bypassed when `X-User-API-Key` is present, and the response carries `Cache-Control: no-store`. Every successful response now carries `X-Cache: HIT | MISS`. Docstring at the top of `api/generate-theme.ts` rewritten to reference Supabase; `api/README.md` and `playground/src/utils/generateTheme.ts` docstring swapped the same way. `.env.example` now documents `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`. New `api/vitest.config.ts` + workspace entry so the edge function participates in the root test run. Verified: `pnpm lint` 0 errors / 77 pre-existing warnings, `pnpm test` 982/982 pass (974 prior + 8 new for `buildCacheKey`), `pnpm build` green across all workspace projects. The prereq SQL (table + `increment_theme_cache_hit` function) lives in the kickoff doc on the ops host. Follow-up to confirm on preview: POST `/api/generate-theme` twice with the same prompt, second response must carry `X-Cache: HIT` and the corresponding `theme_cache` row's `hit_count > 0`. |
| 2026-04-14 | Claude (Claude Code) | P.5 Sprint 2 close-out — Anthropic error.type forwarding | Branch `feat/P.5-forward-anthropic-error-type` off `develop` after #108/#109/#110/#112 had already merged Sprint 2. Edge function (`api/generate-theme.ts`) now parses Anthropic's JSON error envelope on non-2xx, copies `error.type` to a new `code` field, and forwards the upstream HTTP status unchanged (out-of-range statuses fall back to 502). New `AnthropicApiError` class carries `{status, code, detail}` from `generateOne` to the handler catch. New `parseAnthropicError` helper + allowlist of documented types (`invalid_request_error`, `authentication_error`, `permission_error`, `not_found_error`, `request_too_large`, `rate_limit_error`, `api_error`, `overloaded_error`, `billing_error`); unknown types collapse to `null`. All 4xx/5xx responses now include `code` (often `null` for locally-produced errors) so the client gets a consistent shape. `playground/src/utils/generateTheme.ts`: `GenerateThemeError.code` added to the type, `readableError` exported and rewritten to dispatch in order `code` → status → `err.error` with tailored copy for `billing_error`, `authentication_error`, `overloaded_error`, `rate_limit_error`, `invalid_request_error`; our own 429 (IP/global rate limit) takes the status branch with distinct copy. New `playground/src/utils/generateTheme.test.ts` (16 cases) covers every branch without mocking fetch. New `playground/vitest.config.ts` + entry in `vitest.workspace.ts` so the playground participates in the root test run; `vitest` added as a playground devDep with `test` / `test:watch` scripts. Ignored a hook-flagged `@vercel/kv@3` deprecation warning; that code came from #110 and is filed as a follow-up in Current State since migrating storage is out of scope for this PR. Cleaned up a stale-lock git index (from a crashed Apr 13 session) with `rm .git/HEAD.lock .git/index.lock .git/ORIG_HEAD.lock` + `git reset HEAD` before branching. Verified `pnpm lint` (0 errors, 77 pre-existing warnings), `pnpm test` (974/974 pass including the 16 new), `pnpm build` (green across all workspace projects). |
| 2026-04-09 | Claude (Claude Code) | v0.1.0 stable release prep | Cut `release/0.1.0` from `develop`. Bumped all four packages to `0.1.0` (`@arcana-ui/tokens`, `@arcana-ui/core` were on beta.2; `@arcana-ui/cli`, `@arcana-ui/mcp` were on beta.1). Moved every `[Unreleased]` entry in `CHANGELOG.md` under a new `[0.1.0] - 2026-04-09` header (added a "Release Overview" summary bullet list) and left `[Unreleased]` empty. Built migration-guide infrastructure: `docs/migrations/README.md` (explains to AI agents how to iterate `manifest.ai.json.releaseHistory` to find every breaking change between two versions) + `docs/migrations/TEMPLATE.md` (scaffold for future guides with Breaking Changes table, Before/After code, automated-fix scripts, rollback steps). Added runtime `VERSION` export: new `packages/core/src/version.ts` + re-export at the bottom of `packages/core/src/index.ts`, so consumers can `import { VERSION } from '@arcana-ui/core'` for telemetry/logging. Patched `scripts/generate-manifest.mjs` so manifest.ai.json now always includes a static `releaseHistory` array (entries for 0.1.0, 0.1.0-beta.2, 0.1.0-beta.1 with version/date/breaking/migration/summary shape) — previously the field was wiped on every regenerate; also added `entry.fromPath === './version'` skip so the new `VERSION` constant doesn't get counted as a component; and added a `spawnSync(biome, format --write)` step so the generated JSON matches repo formatting. Same biome-format post-step added to `writeJSON` in `scripts/generate-docs.mjs` so `playground/src/data/token-map.json` no longer fails lint after regeneration. Updated `release.changelog` in manifest to the canonical `github.com/Arcana-UI/arcana/blob/main/CHANGELOG.md` URL. Verified: `pnpm lint` 0 errors / 77 pre-existing warnings, `pnpm test` 958/958 pass, `pnpm build` green across all 12 workspace projects (tokens, core, cli, mcp, playground, 6 demos), `pnpm generate-docs` all 8 generators pass, manifest.ai.json has `version: 0.1.0`, `release.version: 0.1.0`, `releaseHistory` length 3, 108 components, 11 hooks, 14 themes. |
| 2026-04-09 | Claude (Claude Code) | Launch polish — landing + playground | Updated "60+ components" → "108 components" everywhere (playground `index.html` description/og:description/twitter:description, `Landing.tsx` hero subheadline + "108 Production Components" feature card + "How it works" step copy, `App.tsx` Hero subheadline + StatCard + FAQ accordion) so meta tags, hero copy and in-playground stats match the real manifest count. Playground `?theme=` URL param now stays in sync when the user changes presets inside the Token Editor — `handlePresetChange` rewrites the query via `setSearchParams({ replace: true })`, so a refresh or shared URL keeps the selected theme. Added `Export CSS` button to Token Editor next to `Export JSON`: `handleExportCss` serializes the current `collectTokenSnapshot()` into a ready-to-paste `:root { --token: value; ... }` block (plus a `[data-density="..."]` companion selector when the density override is active), downloaded as `arcana-theme-{preset}.css`. Split the single `handleExport` into `handleExportJson` + `handleExportCss` sharing a `downloadFile` helper. Removed stray `console.log('Undo!')` from Toast "With action" demo — now fires a real "Restored" toast. Verified build (all 958 tests pass, full `pnpm build` green across core/tokens/cli/mcp/playground + 5 demos), lint stayed at the same 77 pre-existing warnings (no new ones introduced), vercel.json llms.txt headers confirmed correct, llms.txt + llms-full.txt present in `playground/dist/`. |
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
| 2026-04-08 | Claude (Claude Code) | Task 5.11 ships — `@arcana-ui/cli@0.1.0-beta.1` published | Bear ran `npm publish --tag beta --access public` from `packages/cli/` after a root `pnpm install` + `pnpm --filter @arcana-ui/cli build`. Verified live on the real registry via direct curl to `https://registry.npmjs.org/@arcana-ui/cli/0.1.0-beta.1`: name/version/bin/tarball all correct, unpacked size 51,102 bytes, shasum `b90a1e86e9803a92e2abb1eb16081f50ff663a34`. All three Arcana packages (`@arcana-ui/tokens`, `@arcana-ui/core`, `@arcana-ui/cli`) are now on npm. Doc-only sync branch `docs/5.11-cli-publish-sync` drops the "awaiting Bear" note from Current State and CHANGELOG's Changed bucket. |
| 2026-04-08 | Claude (Claude Code) | Tasks 5.2–5.4 — AI discoverability layer | Enhanced `llms.txt` (grouped by category, density switching, resource links) and `llms-full.txt` (4 layout patterns, theme customization guide, responsive section, 2370 lines). Created `.claude/skills/arcana/SKILL.md` (1,821 lines — all 108 components with props, hooks, token system, 4 complete layout patterns, presets, responsive, rules). Built `@arcana-ui/mcp@0.1.0-beta.1` — MCP server with 7 tools (list_components, get_component, list_presets, get_preset, validate_theme, generate_theme with Anthropic API integration, get_token_impact). Fully self-contained 130 kB npm package. Added Generator 8 to generate-docs pipeline: copies llms files to playground/public/ for Vercel serving. |
| 2026-04-07 | Claude (Claude Code) | Task 5.11 — `@arcana-ui/cli` package | Built new CLI package with three commands: `init` (interactive scaffolder, 5 starter layouts × Vite/Next, package-manager detection, --yes for non-interactive use), `validate` (theme JSON linter — structure, completeness, references, WCAG AA contrast on 5 key fg/bg pairs, --strict promotes warnings, exits 1 on error), `add-theme` (preset activation snippet, --list for all 14 presets). Layouts use real `@arcana-ui/core` imports — all 10 combos typecheck against the published package via local `file:` link. Bundled with tsup ESM (deps externalized — bundling commander into ESM broke `require('events')`). New `packages/cli/README.md` + root README quickstart now leads with `npx @arcana-ui/cli init`. Five logical commits on `feat/5.11-cli-init-validate-add-theme`, merged as PR #90. |
| 2026-04-06 | Claude (Claude Code) | Consumer package audit → beta.2 | Installed `@arcana-ui/core@beta` + `@arcana-ui/tokens@beta` from registry into a fresh project; found beta.1 was stale (115/122 exports, missing `useClickOutside`/`useDrag`/`useUndoRedo`/`ColorPicker`/`FontPicker`/`BottomSheet`/`DrawerNav`/`LogoCloud`), `@arcana-ui/tokens` exports map blocked `./dist/arcana.css` subpath (`ERR_PACKAGE_PATH_NOT_EXPORTED`), and tree-shaking was broken (Button-only import = 278 kB, same as 8-component app). Fixed exports maps on both packages, bumped to `0.1.0-beta.2`, scaffolded `examples/quickstart/` Vite + React + TS consumer test fixture, wrote `docs/QUICKSTART.md` (consumer setup + CLI spec) and `KNOWN_ISSUES.md`. Tree-shaking fix deferred to beta.3 — documented because it requires per-component entry points that conflict with the `"use client"` banner in single-entry mode. **Awaiting Bear to `npm publish` beta.2.** |
