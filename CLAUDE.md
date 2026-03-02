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
| `SPEC.md` | Technical specification (legacy — being superseded by ROADMAP.md) | Reference only |
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
├── SPEC.md                         # Legacy spec
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
Phase 0 — Foundation Cleanup

### Completed
- Comprehensive ROADMAP.md created (token architecture, phased plan, component library, preset matrix)
- AI_OPS.md created (prompt library, tracking system, session management)
- PROGRESS.md created (task tracker)
- CLAUDE.md rewritten (this file)
- Task 0.1 — Token audit completed (`docs/audits/token-audit.md`)

### Currently Working On
Ready to begin Phase 0, Task 0.2 — Restructure token JSON to three-tier hierarchy

### Blockers
None

### What the Next Agent Should Do
1. Read `PROGRESS.md` to confirm Phase 0 / Task 0.2 is next
2. Read `docs/audits/token-audit.md` for the complete gap analysis
3. Read the prompt for Task 0.2 in `AI_OPS.md` Part 2
4. Restructure token JSON to three-tier hierarchy (primitive → semantic → component)
5. Create JSON Schema for token validation
6. Migrate all 6 theme presets to new format
7. Update build script to resolve references and output all themes
8. Update `PROGRESS.md` to check off 0.2

### Session History

| Date | Agent | Tasks Completed | Notes |
|------|-------|-----------------|-------|
| 2026-03-01 | Claude (claude.ai) | Project planning | Created ROADMAP.md, AI_OPS.md, PROGRESS.md, CLAUDE.md |
| 2026-03-02 | Claude (Claude Code) | Task 0.1 — Token audit | Scanned 32 CSS files, cataloged ~176 tokens, found 88 hardcoded violations in components, 4 unbuilt themes. Full report at docs/audits/token-audit.md |
