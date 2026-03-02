# Arcana UI — AI Agent Operations Manual

> **Purpose:** This file tells AI agents (Claude Code, Cursor, Copilot, etc.) how to track progress on the Arcana UI roadmap and provides copy-paste prompts for every major task.
> **Location:** Place this at the project root as `AI_OPS.md` alongside `ROADMAP.md` and `CLAUDE.md`.

---

## Part 1: How AI Tracks the Roadmap

### The Problem

AI agents have no persistent memory between sessions. Every time Claude Code starts, it doesn't know what was done last session. We need a system that:

1. **Survives between sessions** — lives in the repo, not in AI memory
2. **Is machine-readable** — AI can parse it instantly
3. **Is human-readable** — you can glance at it and see progress
4. **Blocks duplicate work** — AI knows not to redo completed tasks
5. **Enforces sequencing** — AI knows Phase 1 must finish before Phase 2

### The Solution: Three-Layer Tracking

```
┌─────────────────────────────────────────────┐
│  Layer 1: PROGRESS.md (source of truth)     │
│  Markdown checklist that AI reads/updates   │
│  at the start and end of every session      │
├─────────────────────────────────────────────┤
│  Layer 2: GitHub Issues (work units)        │
│  One issue per roadmap task, labeled by     │
│  phase. AI creates PRs that close issues.   │
├─────────────────────────────────────────────┤
│  Layer 3: CLAUDE.md (session context)       │
│  Updated with current phase, blockers,      │
│  and "what to work on next" instructions    │
└─────────────────────────────────────────────┘
```

---

### Layer 1: PROGRESS.md

This file lives at the project root. AI reads it first, works, then updates it before committing. Copy the template below into your repo.

```markdown
# Arcana UI — Progress Tracker

> **Last updated:** YYYY-MM-DD
> **Current phase:** 0 — Foundation Cleanup
> **Next priority task:** 0.1
> **Blocking issues:** None

## Phase 0: Foundation Cleanup (Weeks 1–2)
- [ ] 0.1 — Audit & document current token set
- [ ] 0.2 — Restructure token JSON to three-tier hierarchy
- [ ] 0.3 — Establish code standards (strict TS, naming, exports)
- [ ] 0.4 — Add build pipeline for tokens (JSON → CSS)
- [ ] 0.5 — Clean up component API surfaces
- [ ] 0.6 — Set up testing infrastructure (Vitest + Playwright)
- [ ] 0.7 — Add linting rules (enforce token usage)
- [ ] 0.8 — Update README, CLAUDE.md, SPEC.md
- [ ] 0.9 — Set up CI/CD
- [ ] 0.10 — Establish CONTRIBUTING.md

## Phase 1: Token System Maturity (Weeks 3–5)
- [ ] 1.1 — Full color system
- [ ] 1.2 — Typography system
- [ ] 1.3 — Spacing system
- [ ] 1.4 — Elevation system (shadows + z-index)
- [ ] 1.5 — Layout tokens (breakpoints, containers, grid)
- [ ] 1.6 — Motion tokens
- [ ] 1.7 — Border & shape tokens
- [ ] 1.8 — Opacity tokens
- [ ] 1.9 — Token validation CI check
- [ ] 1.10 — Theme switching (data-theme + system pref)
- [ ] 1.11 — WCAG contrast validation

## Phase 2: Responsive & Mobile (Weeks 5–7)
- [ ] 2.1 — Responsive behavior matrix (docs)
- [ ] 2.2 — Responsive container component
- [ ] 2.3 — Responsive grid system
- [ ] 2.4 — Audit & fix all 22 existing components for mobile
- [ ] 2.5 — Mobile-specific patterns (bottom sheet, drawer nav)
- [ ] 2.6 — Responsive typography (fluid clamp)
- [ ] 2.7 — Viewport-aware spacing
- [ ] 2.8 — Mobile-first CSS refactor
- [ ] 2.9 — Touch & interaction (44px targets, no hover-only)
- [ ] 2.10 — Visual regression test matrix (5 breakpoints)

## Phase 3: Expanded Component Library (Weeks 7–12)
- [ ] 3.1 — Refine existing 22 components
- [ ] 3.2 — Navigation: Navbar, Sidebar, Breadcrumb, Pagination, Tabs, MobileNav, Footer
- [ ] 3.3 — Content: Hero, FeatureSection, Testimonial, PricingCard, CTA, StatsBar, Timeline
- [ ] 3.4 — Data display: DataTable, StatCard, ProgressBar, KPICard
- [ ] 3.5 — Forms: Select, Checkbox, Radio, Toggle, Textarea, DatePicker, FileUpload, FormField
- [ ] 3.6 — Overlays: Modal, Drawer, Popover, Toast, CommandPalette
- [ ] 3.7 — Layout: Stack, Grid, Container, Divider, Spacer, AspectRatio
- [ ] 3.8 — Media: Avatar, AvatarGroup, Image, Video, Carousel
- [ ] 3.9 — Feedback: Alert, Banner, Skeleton, Spinner, EmptyState, ErrorBoundary
- [ ] 3.10 — E-commerce: ProductCard, CartItem, QuantitySelector, PriceDisplay, RatingStars
- [ ] 3.11 — Editorial: ArticleLayout, PullQuote, AuthorCard, RelatedPosts, NewsletterSignup
- [ ] 3.12 — Utility: ScrollArea, Collapsible, Accordion, CopyButton, KeyboardShortcut

## Phase 4: Theme Presets & Demo Sites (Weeks 10–14)
- [ ] 4.1 — Redesign existing 6 presets for full token architecture
- [ ] 4.2 — Build new presets: Corporate, Startup, Editorial, Commerce, Midnight, Nature, Neon, Mono
- [ ] 4.3 — Demo: SaaS Dashboard
- [ ] 4.4 — Demo: Marketing Landing Page
- [ ] 4.5 — Demo: Editorial Blog
- [ ] 4.6 — Demo: E-commerce Product Page
- [ ] 4.7 — Demo: Documentation Site
- [ ] 4.8 — Demo: Admin Panel
- [ ] 4.9 — Visual regression test fixtures from demos
- [ ] 4.10 — Themeable demo switcher

## Phase 5: AI Integration & Launch (Weeks 13–16)
- [ ] 5.1 — Update manifest.ai.json
- [ ] 5.2 — Build Claude Code skill
- [ ] 5.3 — Build prompt templates
- [ ] 5.4 — Publish to npm (v1.0)
- [ ] 5.5 — Build documentation site
- [ ] 5.6 — SEO & discoverability
- [ ] 5.7 — Community starter templates (Next, Vite, Remix, Astro)
- [ ] 5.8 — Figma token sync
- [ ] 5.9 — Performance audit
- [ ] 5.10 — Launch checklist
```

### How AI Uses PROGRESS.md

Add this instruction to `CLAUDE.md`:

```markdown
## Session Protocol

Every session, follow this exact sequence:

1. **Read PROGRESS.md** — know what's done and what's next
2. **Read ROADMAP.md** — understand the full context of the current task
3. **Confirm the task** — tell the user what you're about to work on
4. **Do the work** — follow the standards in ROADMAP.md Section 8
5. **Run checks** — `pnpm lint && pnpm test && pnpm build`
6. **Update PROGRESS.md** — check off completed items, update "Last updated", "Next priority task"
7. **Commit PROGRESS.md** with the work — `chore: update progress tracker`
8. **Summarize** — tell the user what was done, what's next, and any blockers
```

---

### Layer 2: GitHub Issues

Create one GitHub issue per roadmap task. This gives you a project board, history, and lets PRs auto-close issues. Here's a bootstrapping prompt to create them all at once.

#### Prompt: Bootstrap GitHub Issues

```
Read ROADMAP.md and PROGRESS.md. For every unchecked task, create a GitHub 
issue with:

Title: "[{phase}.{number}] {task description}"
Labels: phase-{N}, priority-{P0|P1|P2}, size-{S|M|L|XL}
Body:
  ## Task
  {Description from roadmap}
  
  ## Acceptance Criteria
  {Derived from roadmap standards — be specific}
  
  ## References
  - ROADMAP.md Section {N}
  - Dependencies: {list any blocking tasks}

Example:
  Title: "[1.4] Implement elevation system (shadows + z-index)"
  Labels: phase-1, priority-P0, size-M
  Body: ...

Use the GitHub CLI (`gh issue create`) to create them.
Do NOT create issues for already-checked items in PROGRESS.md.
```

---

### Layer 3: CLAUDE.md Additions

Add a "Current State" section to the existing `CLAUDE.md` that you update each session:

```markdown
## Current State (updated each session)

### Active Phase
Phase 0 — Foundation Cleanup

### Completed This Week
- (nothing yet)

### Currently Working On
Task 0.1 — Audit & document current token set

### Blockers
- None

### Key Decisions Made
- Three-tier token hierarchy (primitive → semantic → component)
- Mobile-first CSS (min-width media queries)
- BEM-like class naming with `arcana-` prefix
- No Tailwind dependency — pure CSS custom properties

### What the Next Agent Should Do
1. Pick up the next unchecked item in PROGRESS.md
2. Read the corresponding section in ROADMAP.md
3. Follow the prompt in AI_OPS.md Part 2
```

---

## Part 2: Prompt Library

These are copy-paste prompts you give to Claude Code (or any AI agent) for each major task. Each prompt is designed to produce work that meets the standards defined in the roadmap.

### How to Use These Prompts

1. Open Claude Code (or your AI code agent) in the Arcana UI project directory
2. Copy the prompt for the task you want done
3. Paste it. The AI should read PROGRESS.md and ROADMAP.md automatically if CLAUDE.md is configured correctly.
4. Review the output before merging.

Each prompt follows a consistent structure:
- **CONTEXT** — what the AI needs to know
- **TASK** — exactly what to build
- **CONSTRAINTS** — quality gates and rules
- **ACCEPTANCE CRITERIA** — how to know it's done
- **DELIVERABLES** — exactly what files to produce

---

### Phase 0: Foundation Cleanup

#### Prompt 0.1 — Audit Current Token Set

```
CONTEXT:
You are working on Arcana UI, an open-source token-driven design system.
Read ROADMAP.md (Section 2) for the target token architecture.

TASK:
Audit every CSS custom property currently defined in the project. Produce 
a gap analysis comparing what exists today vs. what ROADMAP.md Appendix A 
defines as the target state.

STEPS:
1. Search all .css files in packages/tokens/ for CSS custom property declarations
2. Search all .css files in packages/core/ for hardcoded values (colors, px, rem, shadows)
3. Categorize every existing token by the 9 categories in ROADMAP.md Section 2.2
4. For each category, list: what exists, what's missing, what needs renaming
5. Flag every hardcoded value in component CSS — these are violations

DELIVERABLES:
- docs/audits/token-audit-YYYY-MM-DD.md — the complete gap analysis
- A summary table: Category | Existing Count | Target Count | Gap

CONSTRAINTS:
- Do NOT change any code in this task. Audit only.
- Be exhaustive. Every single CSS custom property must be cataloged.
- Flag naming inconsistencies (e.g., some use "bg" and others use "background")

ACCEPTANCE CRITERIA:
- Every CSS file in the project has been scanned
- Every hardcoded value in component CSS is identified
- Gap analysis clearly shows what needs to be built in Phase 1
- Update PROGRESS.md to check off task 0.1
```

#### Prompt 0.2 — Restructure Token Hierarchy

```
CONTEXT:
You are working on Arcana UI. Read ROADMAP.md Section 2 for the target 
three-tier token architecture. Read the token audit from task 0.1.

TASK:
Restructure the token system from its current flat structure to the 
three-tier hierarchy: Primitive → Semantic → Component.

STEPS:
1. Create the JSON schema defined in ROADMAP.md Section 2.3
2. Create packages/tokens/src/schema/tokens.schema.json (JSON Schema for validation)
3. Migrate existing token values into the new primitive → semantic structure
4. Ensure every existing theme preset (light, dark, terminal, retro98, glass, brutalist) 
   is migrated to the new JSON format
5. Update the build script to read new JSON and output CSS custom properties 
   matching the format in ROADMAP.md Section 2.4
6. Verify: `pnpm build:tokens` produces valid CSS
7. Verify: all existing components still render correctly with new token names

CONSTRAINTS:
- Do NOT add new tokens yet — only restructure existing ones
- Maintain backward compatibility: if a component uses --bg-primary, create 
  an alias until the component is updated
- JSON files must validate against the schema
- CSS output must use the naming convention from ROADMAP.md Section 2.4

ACCEPTANCE CRITERIA:
- Every preset has a valid JSON file in packages/tokens/src/presets/
- Build script converts JSON → CSS without errors
- All 6 existing themes produce valid CSS
- Playground renders correctly with restructured tokens
- No regressions in existing components
- Update PROGRESS.md to check off task 0.2
```

#### Prompt 0.3 — Establish Code Standards

```
CONTEXT:
You are working on Arcana UI. Read ROADMAP.md Section 9 for all project 
standards and conventions.

TASK:
Configure the project for strict TypeScript, consistent formatting, and 
enforced code standards.

STEPS:
1. Update tsconfig.json: enable strict mode, noImplicitAny, strictNullChecks, 
   noUnusedLocals, noUnusedParameters
2. Update biome.json: enforce consistent formatting rules that match Section 9
3. Add an .editorconfig for cross-editor consistency
4. Refactor all existing TypeScript files to pass strict mode:
   - Fix any `any` types → use proper types or `unknown`
   - Add explicit return types to all exported functions
   - Fix unused imports and variables
5. Ensure all component files follow the naming conventions in Section 9.4
6. Add a pre-commit hook (via husky or similar) that runs `pnpm lint`

CONSTRAINTS:
- Do NOT change component behavior — only fix types and formatting
- Every fix should be in a separate, reviewable commit
- If a type fix is complex, add a TODO comment rather than using `any`

ACCEPTANCE CRITERIA:
- `pnpm lint` passes with zero errors
- `pnpm build` passes with strict TypeScript
- All files follow naming conventions from ROADMAP.md Section 9.4
- Pre-commit hook is configured and working
- Update PROGRESS.md to check off task 0.3
```

#### Prompt 0.4 — Token Build Pipeline

```
CONTEXT:
You are working on Arcana UI. The token JSON schema is defined in 
ROADMAP.md Section 2.3. The CSS output format is in Section 2.4.

TASK:
Build a robust token build pipeline that converts JSON preset files into 
CSS custom property files.

STEPS:
1. Create packages/tokens/src/build.ts
2. The build script should:
   a. Read every .json file in packages/tokens/src/presets/
   b. Validate each file against the JSON schema
   c. Resolve all token references (e.g., "{primitive.color.blue.500}" → actual value)
   d. Generate CSS with proper :root and [data-theme="X"] selectors
   e. Output individual theme files to packages/tokens/dist/themes/{name}.css
   f. Output a combined file to packages/tokens/dist/arcana.css
3. Add a `build:tokens` script to the root package.json
4. Add validation: fail the build if any token reference is unresolvable
5. Add validation: warn if any semantic token doesn't have a corresponding primitive
6. Add WCAG contrast checking: warn (don't fail) on fg/bg pairs below 4.5:1

CONSTRAINTS:
- Use TypeScript. No shell scripts.
- Zero runtime dependencies — this runs at build time only
- The build must be fast (< 2 seconds for all presets)
- CSS output must be valid and parseable
- Follow the exact CSS variable naming from ROADMAP.md Section 2.4

ACCEPTANCE CRITERIA:
- `pnpm build:tokens` runs without errors
- Each preset produces a valid .css file
- Combined arcana.css contains all themes
- Invalid token references cause build failure
- Contrast warnings are printed for failing pairs
- Update PROGRESS.md to check off task 0.4
```

---

### Phase 1: Token System Maturity

#### Prompt 1.1 — Full Color System

```
CONTEXT:
You are working on Arcana UI. Read ROADMAP.md Section 2.2 (Color) and 
Appendix A (Colors). The token build pipeline is already in place.

TASK:
Implement the complete color token system for all existing presets.

STEPS:
1. Define the primitive color palette:
   - 12 hues: slate, gray, zinc, stone, red, orange, amber, yellow, 
     green, emerald, blue, indigo, violet, purple, pink
   - 11 steps per hue: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950
   - Use OKLCH color space for perceptual uniformity
   - Add utility colors: white, black, transparent
2. Define all semantic color tokens from Appendix A:
   - Background: page, surface, elevated, sunken, overlay, subtle
   - Foreground: primary, secondary, muted, inverse, on-primary, on-destructive
   - Action: primary (default/hover/active/disabled), secondary, ghost, destructive
   - Border: default, muted, focus, error, success
   - Status: success/warning/error/info (each with bg, fg, border)
   - Accent: primary, secondary
3. Map semantic tokens to primitives for each of the 6 existing presets
4. Run WCAG contrast validation on every fg/bg pair
5. Fix any pairs that fail AA (4.5:1 for normal text, 3:1 for large text)

CONSTRAINTS:
- Every color must come from the primitive palette — no one-off hex values
- Semantic tokens must reference primitives, never raw hex
- All 6 presets must pass WCAG AA contrast checks
- Use the token JSON format from ROADMAP.md Section 2.3
- Dark themes: elevated surfaces should be slightly lighter (not shadowed)

ACCEPTANCE CRITERIA:
- Primitive palette has 165+ color values (15 hues × 11 steps)
- All semantic color tokens from Appendix A are defined
- All 6 presets are updated with the full color system
- `pnpm build:tokens` passes
- WCAG contrast report shows zero AA failures
- Playground renders correctly with new color system
- Update PROGRESS.md to check off task 1.1
```

#### Prompt 1.4 — Elevation System

```
CONTEXT:
You are working on Arcana UI. Read ROADMAP.md Section 2.2 (Elevation & Depth) 
and Appendix A (Elevation). This is one of the most critical missing pieces 
in the current system — there are currently zero shadow tokens.

TASK:
Implement the complete elevation system: box shadows, z-index scale, and 
backdrop blur values.

STEPS:
1. Add shadow primitives to the token JSON:
   - xs, sm, md, lg, xl, 2xl, inner, none
   - Values must match ROADMAP.md Appendix A exactly
2. Add z-index scale to the token JSON:
   - base(0), dropdown(100), sticky(200), fixed(300), overlay(400), 
     modal(500), popover(600), toast(700), tooltip(800)
3. Add backdrop blur values (for glass theme):
   - sm(4px), md(8px), lg(16px), xl(24px)
4. For EACH preset, tune the shadow values to match its personality:
   - Light: standard shadow opacity
   - Dark: deeper shadows with less opacity, OR use surface lightness shifts
   - Terminal: no shadows (use borders instead)
   - Retro 98: hard shadows (no blur, offset only)
   - Glass: frosted glass shadows + backdrop blur
   - Brutalist: heavy, exaggerated shadows OR no shadows
5. Update components that need elevation: Card, Modal, Dropdown, Tooltip, Toast
6. Build the CSS output in the token pipeline

CONSTRAINTS:
- Shadows must be defined as complete CSS box-shadow values in the JSON
- Dark theme shadows should NOT simply be the light theme shadows — 
  dark backgrounds need different shadow treatment
- Every component that "floats" (modal, popover, dropdown, toast, tooltip) 
  must use the z-index tokens, not hardcoded values
- Glass theme must use backdrop-filter: blur() — add a token for this

ACCEPTANCE CRITERIA:
- All shadow tokens from Appendix A are defined in every preset JSON
- Z-index scale is implemented and used by all overlay components
- `pnpm build:tokens` produces shadow and z-index CSS variables
- Card, Modal, and other elevated components visually show shadows
- Each preset has a distinct, intentional elevation personality
- Update PROGRESS.md to check off task 1.4
```

---

### Phase 2: Responsive & Mobile

#### Prompt 2.4 — Audit All Components for Mobile

```
CONTEXT:
You are working on Arcana UI. Read ROADMAP.md Section 6 for the complete 
responsive strategy. Layout tokens (breakpoints, containers) are already 
implemented from Phase 1.

TASK:
Audit and fix all 22 existing components for mobile responsiveness.

STEPS:
1. For each component, open it in a browser at 320px width and document:
   - Does it overflow horizontally? 
   - Are touch targets at least 44×44px?
   - Is text readable (minimum 14px on mobile)?
   - Does it handle long content gracefully (truncation, wrapping)?
   - Are there any hover-only interactions with no touch equivalent?
2. Create a responsive audit spreadsheet: 
   docs/audits/responsive-audit-YYYY-MM-DD.md
3. Fix every issue found. For each component:
   a. Refactor CSS to mobile-first (default styles = mobile, add min-width queries)
   b. Ensure touch targets meet 44px minimum
   c. Add text truncation or wrapping where needed
   d. Replace hover-only interactions with focus/tap equivalents
   e. Test at 320, 768, 1024, 1280px
4. For complex components (Table, Modal, Sidebar), implement the responsive 
   patterns from ROADMAP.md Section 6.4:
   - Table → card stack on mobile
   - Modal → full-screen bottom sheet on mobile
   - Sidebar → overlay drawer on mobile

CONSTRAINTS:
- Mobile-first: default CSS = mobile, then add `@media (min-width: ...)` for larger
- All spacing must use token references, not hardcoded px
- No `display: none` to "hide" desktop elements on mobile — restructure instead
- Touch targets: minimum 44×44px with 8px gap between interactive elements
- Test with actual mobile viewport (320px), not just a narrow browser window

ACCEPTANCE CRITERIA:
- Responsive audit document lists every component and its issues
- All 22 components render correctly at 320px with no horizontal overflow
- All interactive elements have 44px minimum touch targets on mobile
- No hover-only interactions remain
- All CSS is mobile-first with min-width media queries
- Update PROGRESS.md to check off task 2.4
```

---

### Phase 3: Component Library

#### Prompt 3.2 — Navigation Components

```
CONTEXT:
You are working on Arcana UI. Read ROADMAP.md Section 4.2 (Navigation) 
and Section 4.3 (Component API Standards). The token system and responsive 
infrastructure are complete.

TASK:
Build the complete navigation component set: Navbar, Sidebar, Breadcrumb, 
Pagination, Tabs, MobileNav, Footer.

BUILD EACH COMPONENT WITH THIS CHECKLIST:
For each component, create these files:
  packages/core/src/components/{Name}/{Name}.tsx
  packages/core/src/components/{Name}/{Name}.css
  packages/core/src/components/{Name}/{Name}.test.tsx
  packages/core/src/components/{Name}/index.ts

For each component, ensure:
  ✓ TypeScript interface with JSDoc on every prop
  ✓ forwardRef for DOM access
  ✓ Default values for all optional props
  ✓ CSS uses only token references (zero hardcoded values)
  ✓ Mobile-first responsive CSS
  ✓ ARIA attributes for accessibility
  ✓ Keyboard navigation (Tab, Enter, Escape, Arrow keys)
  ✓ Works at 320px, 768px, and 1280px

COMPONENT SPECIFICATIONS:

**Navbar**
- Props: logo, items[], actions[], sticky, transparent, variant
- Mobile: collapses to hamburger icon, opens drawer/dropdown
- Variants: default (solid bg), transparent (for hero overlays)
- Sticky option with backdrop blur on scroll
- Active item indicator

**Sidebar**
- Props: items[], collapsed, onCollapse, width, variant
- Sections with headers, icons, nested items (1 level)
- Collapsible: full → icons-only → hidden
- Mobile: hidden by default, overlay on toggle
- Active item highlight, hover states

**Breadcrumb**
- Props: items[], separator, maxItems
- Truncation: show first + last N items with "..." in between on mobile
- Home icon option for first item
- Semantic <nav aria-label="breadcrumb"> with <ol>

**Pagination**
- Props: total, current, onChange, pageSize, variant
- Variants: default (numbered), compact (prev/next only)
- Mobile: compact variant auto-activates below sm breakpoint
- Disabled states for first/last boundaries

**Tabs**
- Props: items[], activeKey, onChange, variant, orientation
- Variants: underline, pill, outline
- Orientation: horizontal (default), vertical (for settings pages)
- Horizontal overflow: scroll with fade indicators on mobile
- Keyboard: Arrow keys to navigate, Enter/Space to select

**MobileNav**
- Props: items[], activeKey, onChange
- Fixed bottom bar pattern (iOS/Android style)
- Maximum 5 items with icon + label
- Active indicator with subtle animation
- Only renders below md breakpoint

**Footer**
- Props: columns[], bottom (copyright/legal), variant
- Responsive: 4-col → 2-col → stacked accordion on mobile
- Variants: minimal (single row), standard (multi-column), expanded

CONSTRAINTS:
- Build in this order: Navbar → Sidebar → Breadcrumb → Tabs → Pagination → MobileNav → Footer
- Each component gets its own commit
- Run `pnpm lint && pnpm test && pnpm build` after each component
- Add each component to the barrel export in packages/core/src/index.ts

ACCEPTANCE CRITERIA:
- All 7 components are built, tested, and exported
- Every component passes lint, test, and build
- Every component renders correctly at 320, 768, 1280px
- Every component has at least 3 test cases
- Screen reader announces all navigation items correctly
- Update PROGRESS.md to check off task 3.2
```

#### Prompt 3.3 — Content & Marketing Components

```
CONTEXT:
You are working on Arcana UI. Read ROADMAP.md Section 4.2 (Content & Marketing).
These components are critical for expanding Arcana beyond dashboards into 
marketing sites, landing pages, and editorial content.

TASK:
Build: Hero, FeatureSection, Testimonial, PricingCard, CTASection, StatsBar, 
Timeline, LogoCloud.

COMPONENT SPECIFICATIONS:

**Hero**
- Props: headline, subheadline, primaryCTA, secondaryCTA, image, video, 
  variant, align, height
- Variants: centered, split (text + image side by side), fullscreen
- Height: viewport (100vh), large (80vh), standard (auto)
- Responsive: split → stacked on mobile, image below text
- Background options: solid color, gradient, image, video
- Must support overlay text on image/video backgrounds

**FeatureSection**
- Props: title, subtitle, features[], columns, variant
- Feature item: icon, title, description, link
- Variants: grid (icon cards), list (horizontal icon + text), alternating
- Responsive: 3-col → 2-col → 1-col

**Testimonial**
- Props: quote, author, role, company, avatar, variant, rating
- Variants: card (with background), inline (minimal), featured (large)
- Support for star rating display
- Quotation mark decorative element

**PricingCard**
- Props: name, price, period, description, features[], cta, popular, variant
- Popular badge/highlight treatment
- Feature list with check/x icons
- Responsive: 3-col → stacked with horizontal scroll option

**CTASection**
- Props: headline, description, primaryCTA, secondaryCTA, variant
- Variants: banner (full-width), card (contained), minimal
- Background color support (uses action or accent tokens)

**StatsBar**
- Props: stats[], variant
- Stat item: value, label, prefix, suffix, trend
- Variants: inline (row), card (grid of stat cards)
- Animated number counting (respects prefers-reduced-motion)
- Responsive: 4-col → 2-col → stacked

**Timeline**
- Props: items[], variant, orientation
- Item: title, description, date, icon, status (complete/active/pending)
- Variants: standard, compact, alternating (left/right)
- Responsive: alternating → linear on mobile

**LogoCloud**
- Props: logos[], variant, title
- Logo item: src, alt, href
- Variants: grid, scrolling marquee, fade row
- Responsive: wrapping grid on mobile
- Grayscale with color on hover

CONSTRAINTS:
- These are MARKETING components — they should feel generous with whitespace.
  Use --spacing-section (96px) between sections, --spacing-xl (32px) within.
- Typography should be expressive — use --font-family-display for headlines,
  --font-size-4xl or --font-size-5xl for hero text
- All of these must look professional enough for a real marketing site
- Test these against the "Startup" and "Corporate" preset aesthetics

ACCEPTANCE CRITERIA:
- All 8 components built, tested, exported
- Every component responsive at 320, 768, 1280px
- Hero supports all 3 variants with responsive behavior
- PricingCard shows "popular" treatment clearly
- StatsBar animates (with reduced-motion respect)
- Update PROGRESS.md to check off task 3.3
```

---

### Phase 4: Presets & Demo Sites

#### Prompt 4.3 — Demo: SaaS Dashboard

```
CONTEXT:
You are working on Arcana UI. All components and token presets are built.
Read ROADMAP.md Section 5.2 for demo site specifications.

TASK:
Build a complete SaaS analytics dashboard demo site using only Arcana 
components and the "Light" preset (default theme).

PAGES TO BUILD:
1. **Dashboard** — Main analytics view
   - Top bar with logo, search, notifications, user avatar
   - Sidebar navigation with sections: Dashboard, Analytics, Users, Settings
   - 4 KPI stat cards (Revenue, Users, Conversion, Growth)
   - Line chart area (use a chart wrapper or placeholder)
   - Recent activity table (5-10 rows)
   - Right sidebar with quick actions or notifications

2. **Users Table** — Data management view
   - DataTable with columns: Name, Email, Role, Status, Last Active, Actions
   - Filters: role dropdown, status toggle, search
   - Pagination
   - Row actions: Edit, Delete (with confirmation modal)
   - Bulk selection with batch actions

3. **Settings** — Form-heavy view
   - Tabs: Profile, Notifications, Security, Billing
   - Profile tab: avatar upload, name, email, bio textarea
   - Notifications tab: toggle switches for email, push, SMS
   - Form validation states (error, success)

4. **Login** — Authentication view
   - Centered card with logo
   - Email + password inputs
   - "Remember me" checkbox
   - Submit button with loading state
   - "Forgot password" link
   - Social login buttons (Google, GitHub)

SETUP:
- Create demos/saas-dashboard/ with Vite + React + TypeScript
- Install @arcana-ui/core and @arcana-ui/tokens
- Import arcana.css and set data-theme="light"
- Add a floating theme picker that lets users switch presets

CONSTRAINTS:
- Use ONLY Arcana components. No external UI libraries.
- Use realistic content, not lorem ipsum. Use fictional company "Lumina Analytics"
- Use realistic data in tables and charts (fabricated but plausible)
- All pages must be responsive (test at 320, 768, 1024, 1280px)
- Mobile: sidebar collapses, table switches to card view, forms stack
- Add a vercel.json for deployment

ACCEPTANCE CRITERIA:
- All 4 pages are built and navigable
- Demo works with all 6+ presets (switch via theme picker)
- Responsive at all breakpoints — no horizontal overflow, no broken layouts
- Dashboard feels like a real SaaS product, not a tutorial
- Ready for Playwright visual regression tests
- Update PROGRESS.md to check off task 4.3
```

#### Prompt 4.4 — Demo: Marketing Landing Page

```
CONTEXT:
You are working on Arcana UI. Read ROADMAP.md Section 5.2 for demo specs.
This demo proves Arcana works for marketing sites, not just dashboards.

TASK:
Build a complete marketing landing page using Arcana components and the 
"Startup" preset.

SECTIONS TO BUILD (single long-scroll page):
1. **Navbar** — Logo, nav links (Features, Pricing, Blog, Contact), CTA button
   - Sticky with backdrop blur on scroll
   - Hamburger menu on mobile

2. **Hero** — Full viewport height
   - Headline: bold, 2 lines max
   - Subheadline: 1-2 sentences
   - Primary CTA (filled button) + Secondary CTA (outline button)
   - Hero image or abstract illustration (use a placeholder SVG)
   - Subtle background gradient or pattern

3. **Logo Cloud** — "Trusted by" section
   - 6 grayscale logos (use placeholder boxes with company names)

4. **Features** — 3-column grid
   - Icon + title + description per feature
   - 6 features total (2 rows of 3, stacks on mobile)

5. **Stats Bar** — Social proof numbers
   - 4 stats: Users, Countries, Uptime %, Support rating

6. **Testimonials** — Customer quotes
   - 3 testimonial cards in a row
   - Avatar, name, role, company, quote

7. **Pricing** — 3 tiers
   - Free, Pro, Enterprise
   - "Pro" marked as popular/recommended
   - Feature comparison list per tier
   - CTA button per tier

8. **CTA Section** — Final conversion push
   - Headline + description + email capture form
   - Contrasting background (uses accent color)

9. **Footer** — Multi-column
   - Product, Resources, Company, Legal columns
   - Social links, copyright

CONSTRAINTS:
- This must feel like a REAL startup landing page, not a component demo
- Use the fictional product "Nimbus" — a cloud collaboration platform
- Write compelling, realistic copy (not lorem ipsum or generic text)
- Generous whitespace — use --spacing-section between major sections
- Typography hierarchy must be clear: display font for headlines, body for text
- Smooth scroll between sections via anchor links
- Mobile: every section stacks gracefully, pricing cards scroll horizontally

ACCEPTANCE CRITERIA:
- Full page scrolls smoothly with all 9 sections
- Switching to "Corporate" or "Light" preset still looks professional
- Responsive at all breakpoints — hero, features, pricing all adapt
- Lighthouse score: Performance > 90, Accessibility > 95
- Feels like a page you'd actually visit, not a UI kit demo
- Update PROGRESS.md to check off task 4.4
```

---

### Phase 5: AI Integration & Launch

#### Prompt 5.2 — Build Claude Code Skill

```
CONTEXT:
You are working on Arcana UI. All components, tokens, and presets are built.
Read ROADMAP.md Section 8 for AI agent standards.

TASK:
Create a Claude Code skill file that gives Claude complete context to build 
interfaces with Arcana UI.

CREATE: .claude/skills/arcana-ui/SKILL.md

CONTENTS:
1. **Overview** — What Arcana is, how to install, how it works
2. **Quick Start** — Minimum code to render a themed page
3. **Token System** — How tokens work, how to reference them, how to switch themes
4. **Component Reference** — Every component with:
   - Import statement
   - Props interface (all props, types, defaults)
   - Usage example (2-3 lines minimum)
   - Common patterns (component composition)
5. **Layout Patterns** — How to build common page types:
   - Dashboard layout (sidebar + main content)
   - Marketing page (full-width sections)
   - Editorial layout (prose-width content)
   - E-commerce layout (product grid + sidebar filters)
6. **Theme Presets** — List of all presets with their personality/best use case
7. **Responsive Patterns** — How components adapt, breakpoint usage
8. **Rules** — CSS rules (tokens only), accessibility requirements, testing

The skill file should be comprehensive enough that Claude can build a 
complete multi-page application using only this file as reference, without 
needing to read source code.

CONSTRAINTS:
- Keep it under 5000 lines (Claude has context limits)
- Every component must have a working code example
- Include both simple and composed (multi-component) examples
- Prioritize the most common use cases
- Write for an AI agent, not a human — be precise, not conversational

ACCEPTANCE CRITERIA:
- A new Claude Code session can build a complete dashboard using only this skill
- Every component listed in packages/core/src/index.ts is documented
- Code examples compile without modification
- Theme switching instructions are clear and testable
- Update PROGRESS.md to check off task 5.2
```

---

## Part 3: Session Management Prompts

These meta-prompts manage the workflow itself rather than building specific features.

### Start-of-Session Prompt

Give this to the AI at the beginning of every work session:

```
Read the following files in this exact order:
1. CLAUDE.md — project context and your instructions
2. PROGRESS.md — current state, what's done, what's next
3. ROADMAP.md — full project roadmap and standards

Then tell me:
- What phase we're in
- What task is next
- Any blockers or dependencies
- Your plan for this session

Do NOT start coding until I confirm the plan.
```

### End-of-Session Prompt

Give this before ending a session:

```
Before we wrap up:

1. Run `pnpm lint && pnpm test && pnpm build` and report results
2. Update PROGRESS.md — check off anything completed, update:
   - "Last updated" date
   - "Current phase" if we advanced
   - "Next priority task" to the next unchecked item
3. Update CLAUDE.md "Current State" section with:
   - What was completed this session
   - What's in progress (if anything is half-done)
   - Any decisions made
   - What the next agent should do
4. Commit all changes with appropriate conventional commit messages
5. Give me a summary: what we did, what's next, estimated sessions remaining
```

### Unstick Prompt

Use when the AI gets confused or loses context:

```
Stop. Reset context by reading these files in order:
1. CLAUDE.md
2. PROGRESS.md  
3. ROADMAP.md

Tell me:
- What task you think you were working on
- What files you've modified
- Whether the project currently builds (`pnpm build`)
- Whether tests pass (`pnpm test`)

Do NOT continue the previous work until we've verified state.
```

### Quality Check Prompt

Use periodically to verify standards are being maintained:

```
Run a full quality audit on the current codebase:

1. **Token compliance**: Search all .css files in packages/core/ for 
   hardcoded values (hex colors, pixel values, shadows, font sizes). 
   List every violation.

2. **TypeScript strictness**: Run `pnpm build` and report any type errors.
   Check for any `any` types that slipped in.

3. **Accessibility**: For every component in packages/core/src/components/:
   - Does it have ARIA attributes where needed?
   - Is it keyboard navigable?
   - Do interactive elements have focus indicators?

4. **Mobile readiness**: For every component:
   - Is the CSS mobile-first (default = mobile, min-width for desktop)?
   - Are there any hover-only interactions?
   - Do touch targets meet 44px minimum?

5. **Test coverage**: Which components lack test files?

6. **Barrel exports**: Is every component exported from packages/core/src/index.ts?

Report a scorecard:
| Category | Score | Issues |
|----------|-------|--------|
| Token compliance | X/10 | ... |
| TypeScript | X/10 | ... |
| Accessibility | X/10 | ... |
| Mobile | X/10 | ... |
| Test coverage | X/10 | ... |
| Exports | X/10 | ... |
```

### New Contributor Onboarding Prompt

Use when a new AI agent (or human) joins the project:

```
Welcome to Arcana UI. You are a new contributor. Before doing any work:

1. Read CLAUDE.md for project instructions
2. Read ROADMAP.md completely (it's long but essential)
3. Read PROGRESS.md to see what's been done
4. Read AI_OPS.md (this file) for workflow instructions
5. Run `pnpm install && pnpm build && pnpm test` to verify setup
6. Browse packages/core/src/components/ to see existing component patterns
7. Browse packages/tokens/src/presets/ to see token structure

Then tell me:
- Your understanding of the project in 2-3 sentences
- What phase we're in and what's next
- Any questions before we start working

Do NOT write any code until you've completed all 7 steps.
```

---

## Part 4: Prompt Customization Guide

Not every session needs a full prompt from Part 2. Here's how to write ad-hoc prompts that maintain quality.

### Prompt Template

```
CONTEXT:
[What part of the project this touches. Reference ROADMAP.md sections.]

TASK:
[Exactly what to build. Be specific — "Build X" not "Improve things".]

STEPS:
[Numbered list. AI follows these in order.]

CONSTRAINTS:
[Non-negotiable rules. Token usage, naming, mobile-first, a11y, etc.]

ACCEPTANCE CRITERIA:
[How to know it's done. Measurable. Testable.]

DELIVERABLES:
[Exact files to create or modify.]
```

### The Three Rules for High-Quality AI Output

1. **Be absurdly specific.** "Build a responsive navbar" → mediocre. "Build a Navbar component with these 6 props, that collapses to a hamburger below 640px, uses these specific tokens, and has this exact ARIA structure" → excellent.

2. **Constrain more than you instruct.** The CONSTRAINTS section matters more than the TASK section. AI agents are creative — they'll figure out *how* to build something. What they need is to know what *not* to do.

3. **Define done before starting.** ACCEPTANCE CRITERIA should be checkable by the AI itself. "Looks good" is worthless. "`pnpm build` passes, all tests pass, no hardcoded values in CSS, renders at 320px without overflow" is useful.

---

*Place this file at the project root as `AI_OPS.md`. Reference it in `CLAUDE.md` so every AI agent session begins by reading it.*
