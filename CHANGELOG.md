# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- **[ci] `release.yml` no longer short-circuits when a tag bumps only one
  package.** Each `Publish @arcana-ui/*` step now delegates to
  `.github/scripts/publish-if-new.mjs`, which reads the package's
  `package.json` version, checks `npm view` for that exact version, and
  skips the `npm publish` call if it already exists. Previously a hotfix
  that bumped only `@arcana-ui/core` failed at the first `Publish
  @arcana-ui/tokens` step (because 0.1.0 was already on npm), which blocked
  the core publish and the GitHub Release creation — the v0.1.1 publish had
  to be done manually from a maintainer's shell.
- **[ci] Added missing publish steps** for `@arcana-ui/cli` and
  `@arcana-ui/mcp` to `release.yml`. Both were previously ignored by the
  tag-push workflow and had to be published by hand.

## [0.1.1] - 2026-04-17

Hotfix for `@arcana-ui/core@0.1.0`. The published bundle shipped every
component with empty CSS-module class-name maps (`var Button_default = {};`,
`var Navbar_default = {};`, etc.), so every component rendered with `class=""`
and no styling. This release fixes the build pipeline, hardens it with a
post-build smoke test, and rolls in a few small P1 API fixes that surfaced
while investigating.

Only `@arcana-ui/core` is republished. `@arcana-ui/tokens`, `@arcana-ui/cli`,
and `@arcana-ui/mcp` stay at `0.1.0`.

### Fixed

- **[`@arcana-ui/core`] Empty CSS module class-name maps in the published
  bundle** (#119). `dist/index.mjs` shipped `var <Component>_default = {};`
  for every `.module.css` import because tsup 8.x's built-in PostCSS plugin
  registers an `onLoad({ filter: /\.css$/ })` handler without a namespace,
  which wildcards across every namespace and intercepts module-CSS loads
  before our own plugin can. The new custom esbuild plugin rewrites every
  `.module.css` import to a path ending in `?arcana-css-module` (outside
  tsup's filter) and emits both the hashed class-name map as a JS module
  and the rewritten CSS via a sibling virtual sheet. Every rendered
  `<ComponentName>_<className>_<hash>` selector in `dist/index.css` now has
  a corresponding entry in the JS module's default export.
- **[`@arcana-ui/core`] `<Image>` shows a broken-image icon behind the
  fallback on load error.** The underlying `<img>` is now unmounted when
  `status === 'error'` so the browser can't paint its broken-image
  placeholder behind the fallback. Status also resets to `'loading'` when
  `src` changes, so swapping URLs after an error recovers cleanly.
- **[`@arcana-ui/core`] `<ThemeProvider>` always overwrote an existing
  `data-theme` attribute on `<html>`.** Pass `defaultTheme={null}` or
  `defaultTheme="inherit"` to opt into "don't touch the attribute" mode —
  the provider then only writes `data-theme` once the user explicitly calls
  `setTheme`. Host apps that manage the attribute themselves (playground,
  SSR with pre-painted theme) can now wrap their tree without stomping it.

### Added

- **[`@arcana-ui/core`] `<ThemeProvider customThemes={…}>`.** Additional
  theme ids beyond the built-in set are accepted as valid stored values
  and appear in the `themes` array returned from `useThemeContext()`.
- **[`@arcana-ui/core`] Exported `BuiltInThemeId` type** and relaxed
  `ThemeId` to `BuiltInThemeId | (string & {})` so consumers can use
  custom theme names without casting, while keeping autocomplete for
  the built-ins.
- **[`@arcana-ui/core`] `<Image errorFallback={…}>`.** Separate node for
  the error state when callers want distinct loading-vs-error UI; falls
  back to `fallback` when omitted.
- **[`@arcana-ui/core`] `manifest.ai.json` ships in the npm tarball.**
  Available at `@arcana-ui/core/manifest.ai.json` (and at
  `./dist/manifest.ai.json` inside the package) so AI agents can resolve
  it from an installed dependency without cloning the repo.
- **[root] `scripts/verify-build.mjs` post-build smoke test** wired into
  `pnpm verify-build`, `pnpm prepublish-check`, and the `release.yml`
  GitHub Actions workflow. The script greps the JS bundle for empty
  `_default = {}` patterns, renders five flagship components via
  `renderToString` and asserts non-empty `class` attributes, and
  cross-checks every rendered class against `dist/index.css`. Exits 1
  on any failure — **a future build with this regression will block
  release automatically.**

### Changed

- **[`@arcana-ui/core`] Bumped to `0.1.1`.** `VERSION` export updated
  to match.

## [0.1.0] - 2026-04-16

First stable release of Arcana UI. Everything below was accumulated across the
`0.1.0-beta.1` and `0.1.0-beta.2` pre-releases, the P.5 AI theme generation
sprint, and the final launch-polish work on `develop`. All four packages -
`@arcana-ui/tokens`, `@arcana-ui/core`, `@arcana-ui/cli`, and `@arcana-ui/mcp`
- are published to npm at `0.1.0` on the `latest` tag.

### Release Overview

**Shipping in 0.1.0:**

- **108 React components** across primitives, navigation, forms, data
  display, overlays, layout, media, feedback, content/marketing, e-commerce,
  editorial, and utility categories.
- **14 theme presets:** light, dark, terminal, retro98, glass, brutalist,
  corporate, startup, editorial, commerce, midnight, nature, neon, mono -
  each with distinct per-preset motion personalities.
- **Three-tier token architecture** (primitive -> semantic -> component) with
  density modes (compact/default/comfortable), global element sizing, WCAG
  contrast validation, per-preset motion personalities, and
  `prefers-reduced-motion` support.
- **AI theme generation (P.5)** - "Describe your brand. Get a design system."
  Hero input on the landing page generates three Arcana theme variants via
  Anthropic API, with BYOK support, semantic caching (Supabase), per-IP and
  global rate limiting, and Anthropic error code forwarding.
- **11 hooks:** `useTheme`, `useMediaQuery`, `useBreakpoint`,
  `usePrefersReducedMotion`, `useHotkey`, `useFloating`, `useClickOutside`,
  `useDrag`, `useUndoRedo`, plus the `ThemeProvider` context.
- **`@arcana-ui/cli`** with `init`, `validate`, and `add-theme` commands (5
  starter layouts x Vite/Next frameworks).
- **`@arcana-ui/mcp`** - Model Context Protocol server with 7 tools for AI
  agents (Claude Code, Cursor, Codex, Figma Make).
- **Claude Code skill** at `.claude/skills/arcana/SKILL.md` (1,821 lines -
  complete component reference, hooks, token system, 4 layout patterns).
- **`llms.txt` + `llms-full.txt`** AI discovery files served from
  `arcana-ui.com` with correct `text/plain` headers.
- **6 demo sites** deployed to Vercel: Forma (ecommerce), Meridian
  (dashboard), Atelier (editorial), Control (analytics), Wavefront (music),
  Mosaic (visual discovery).
- **Landing page + playground** at `arcana-ui.com` with visual token editor,
  ComponentGallery, D3 token-component relationship graph, export to JSON
  + CSS, `?theme=` deep-link sync, and token-driven motion primitives
  (FadeIn, Stagger, CountUp, GradientBorder).
- **Version control + migration infrastructure:** `docs/migrations/` scaffold
  and `manifest.ai.json` `releaseHistory` array so AI agents can
  programmatically track breaking changes across releases.

### Added

#### AI Theme Generation (P.5)
- AI theme generation flow: hero input on the landing page generates three
  Arcana theme variants from a brand description via `/api/generate-theme`
  (Vercel Edge function proxying to Anthropic API), with a new `/generate`
  route showing side-by-side preview cards. Users pick a theme and land in the
  Token Editor with the theme applied via sessionStorage.
- BYOK settings UI: gear button in the playground topbar opens a Popover for
  managing the user's own Anthropic API key. Masked input with show/hide, "Test
  and save" button, "Clear key" button, and a "Your key" Badge when set.
  `generateTheme` accepts an optional `{ apiKey }` override so the panel can
  test unsaved keys without mutating localStorage first.
- Generated theme chip in playground topbar: when `?theme=generated` is active,
  a pill shows the generated theme's kebab-case name with a close button that
  rolls back to the light preset. Name survives refreshes and cross-route
  navigation via `arcana-active-generated-name` sessionStorage key.
- Semantic cache for AI theme generation: `/api/generate-theme` checks Supabase
  before calling Anthropic. Cache key is a SHA-256 of the normalized
  `{description, siteType, density, count, model}` tuple with a 7-day TTL.
  Cache hits return with `meta.cached = true` and skip Anthropic entirely.
  Soft-fails when env vars are absent so local dev still works.
- Anthropic upstream error codes forwarded to the client: when the upstream
  returns non-2xx, the edge function parses Anthropic's JSON error envelope,
  copies `error.type` to a new `code` field, and forwards the upstream HTTP
  status unchanged. `readableError` dispatches on `code` first with tailored
  copy for `billing_error`, `authentication_error`, `overloaded_error`,
  `rate_limit_error`, and `invalid_request_error`. 16-case unit test suite
  covers every branch.

#### Landing Page Motion & Polish
- Motion primitives: `FadeIn` (opacity + translateY reveal), `Stagger`
  (clones children into FadeIn with sequential delays), `CountUp` (rAF-driven
  ease-out cubic animation with locale formatting), `GradientBorder`
  (conic-gradient border via masked pseudo-element that rotates on hover).
  All honor `prefers-reduced-motion`. Landing page threads every section
  through these primitives with staggered reveal timings.
- Button scale on `:active`: `transform: scale(0.98)` on
  `:active:not(:disabled)` using `var(--duration-fast)` + `var(--ease-out)`,
  neutralized under `prefers-reduced-motion`.
- Per-preset motion personalities: each preset JSON ships a distinct cadence.
  `editorial` is calm (180/300/450ms), `glass` is languid (200/350/600ms),
  `midnight` is deliberate (120/240/360ms), `nature` is organic with spring
  easing, `neon` is energetic with spring easing, `retro98` uses `steps(3,end)`
  for snappy stepped motion. Captured in `manifest.ai.json` under
  `tokens.themes[].motion`.
- Token Editor: three independent Fast/Normal/Slow duration sliders (ranges
  0-600/0-1000/0-1500ms) replacing the single slider. Preset segmented control
  still sets all three at once. `collectTokenSnapshot` exports all three
  durations for clean JSON/CSS round-trips.
- Playwright landing-motion harness: `tests/visual/landing.spec.ts` injects
  stylesheet settling reveal animations before snapshot. Two captures: full-page
  and hero-only.

#### Release Infrastructure
- Version control + migration infrastructure: `docs/migrations/README.md`
  documents how AI agents should read `manifest.ai.json` for breaking-change
  metadata when upgrading between versions, and `docs/migrations/TEMPLATE.md`
  is the scaffold for every future release with breaking changes.
- `manifest.ai.json` - new top-level `releaseHistory` array records every past
  release (version, date, breaking changes, migration guide URL, one-line
  summary) so AI agents upgrading across multiple versions can walk the array
  forward and apply every guide in order.
- `packages/core/src/version.ts` - runtime-exposed `VERSION` constant,
  re-exported from the package entry point. Consumers, the CLI, and AI agents
  can now read the package version without touching the filesystem.

#### Playground & Token Editor
- Playground Token Editor: `Export CSS` button alongside existing `Export JSON`.
  Generates a ready-to-paste `:root { --token: value }` block (with a
  `[data-density="..."]` companion selector when the density override is set).
- Playground `?theme=` URL sync: switching presets from the Token Editor now
  rewrites the `?theme=` query param via `setSearchParams({ replace: true })`,
  so a refresh or shared URL preserves the active theme.
- Component-level token editor in playground
- ThemeSwitcher component for demo sites
- Component gallery at `/playground/components` with search, category filter,
  and visual previews
- Individual component deep-dive pages at `/playground/components/:name` with
  variants, sizes, states, interactive demo, component tokens editor, props
  reference, and token dependencies
- Token explorer at `/playground/tokens` with search, category filter, and
  usage counts
- Token impact pages at `/playground/tokens/:category/:name` showing inline
  editor and all affected components rendered live
- Token-component relationship graph at `/playground/graph` - D3 force-directed
  SVG visualization with glow effects, hover highlighting, zoom/pan, drag,
  search-to-focus, and node click navigation
- Shared `PlaygroundLayout` with top navigation (Editor, Components, Tokens,
  Graph), theme switcher bar, and breadcrumb navigation
- Component registry data (`playground/src/data/component-registry.ts`) with
  metadata for 55+ components
- Deep linking support - all routes accept `?theme=` parameter for shareable
  links
- Theme persistence across all playground routes
- Navigation links added to main editor page for cross-navigation
- Playground component audit report (`docs/audits/playground-component-audit.md`)

#### AI Discoverability
- `@arcana-ui/mcp@0.1.0` - MCP (Model Context Protocol) server for Arcana UI.
  Gives AI agents programmatic access to component docs, theme presets, and
  token impact data. Seven tools: `list_components`, `get_component`,
  `list_presets`, `get_preset`, `validate_theme`, `generate_theme`,
  `get_token_impact`. Fully self-contained 130 kB npm package.
- `.claude/skills/arcana/SKILL.md` - Claude Code skill with complete Arcana
  reference: all 108 components with props tables and examples, 11 hooks, token
  system guide, 4 layout patterns, all 14 preset descriptions. 1,821 lines.
- `scripts/generate-docs.mjs` Generator 8: copies `llms.txt` and
  `llms-full.txt` to `playground/public/` for Vercel serving.

#### CLI
- `@arcana-ui/cli@0.1.0` - command-line tool for scaffolding Arcana UI
  projects, validating themes, and managing presets. Three commands:
  - `arcana-ui init [name]` - interactive project scaffolder. Pick framework
    (Vite + React + TS or Next.js App Router), theme (any of 14 presets),
    density, and one of 5 starter layouts (`dashboard`, `marketing`,
    `ecommerce`, `editorial`, `general`). All layouts use real `@arcana-ui/core`
    imports and typecheck against the published package.
  - `arcana-ui validate <file>` - theme JSON linter. Checks structure,
    completeness, reference resolution, and WCAG AA contrast on 5 key fg/bg
    pairs. `--strict` promotes warnings to errors. Exits 1 on any error.
  - `arcana-ui add-theme [preset]` - show the activation snippet for any of the
    14 built-in presets. `--list` dumps all preset ids.

#### Demo Sites
- Forma ecommerce demo: luxury objects brand with 4 pages (Home, Shop, Product
  Detail, Cart), 12-product catalog, cart state management, and 33+ Arcana UI
  components. react-router-dom routing, cart context with add/remove/update/clear,
  quick view modal, promo code form, shipping progress tracker.
- Meridian dashboard demo: SaaS analytics dashboard with Navbar, StatCards,
  DataTable, ProgressBars.
- Atelier editorial magazine demo: luxury architecture/interiors publication
  with 3 pages, editorial theme overrides, full-bleed hero layout, 6 long-form
  articles with real editorial prose, and 25+ Arcana UI components.
- Mosaic visual discovery demo: light-themed inspiration/collection app with 3
  pages, CSS-columns masonry grid, 20 curated feed items, 5 user collections,
  and 25+ Arcana UI components.
- Wavefront music player demo: midnight-themed listening app with 3 curated
  collections (20 tracks), sidebar navigation, now-playing bar, keyboard
  shortcuts, volume control, and 20+ Arcana UI components.
- Control analytics dashboard demo: component analytics dashboard with dark
  theme, 4 pages, full component registry.
- All demo sites: replaced placeholder images with real Unsplash photos,
  added ThemeSwitcher via `@arcana-ui/demo-shared`.

#### Core Components & Hooks
- Global element sizing token system: `--element-height-{xs..xl}`,
  `--element-padding-y-{xs..xl}`, `--element-padding-x-{xs..xl}`,
  `--element-font-size-{xs..xl}`, `--element-icon-size-{xs..xl}` with density
  scaling (compact/comfortable)
- Button xs and xl sizes, icon-only sizes (`icon-xs` through `icon-xl`),
  `shape` prop with `default`, `circle`, and `pill` options
- Input and Select xs and xl sizes matching Button heights
- Per-size component tokens for Button, Input, Select, QuantitySelector with
  three-level fallback chain
- Personality-appropriate element sizing overrides for 8 presets
- `useClickOutside` hook - fires callback on mousedown outside a ref element,
  SSR-safe
- `useDrag` hook - generic drag handling with RAF throttling, touch support
- `useUndoRedo<T>` hook - generic history stack with branch trimming
- `ColorPicker` component - full HSV color picker with canvas rendering,
  hue/alpha sliders, hex/RGB inputs, EyeDropper API, preset colors, recent
  colors, and size variants (sm/md/lg)
- `FontPicker` component - searchable font dropdown with Google Fonts
  integration, category grouping, font preview

#### Consumer Package Quality
- `@arcana-ui/core@0.1.0` and `@arcana-ui/tokens@0.1.0` - all 122 exports
  present (beta.1 was stale at 115).
- `@arcana-ui/tokens` exports map: added `./styles` alias, `./dist/*` subpath,
  and `./package.json` subpath for strict Node ESM resolvers.
- `@arcana-ui/core` exports map: added `./dist/*` and `./package.json` subpaths.
- `examples/quickstart/` - minimal Vite + React + TypeScript consumer fixture.
- `docs/QUICKSTART.md` - three-step consumer guide.
- `KNOWN_ISSUES.md` documenting tree-shaking limitations and known regressions.

#### Documentation Pipeline
- Unified single-source-of-truth documentation pipeline
  (`scripts/generate-docs.mjs`) with 7 generators producing all docs from
  source code
- `pnpm generate-docs` command that runs all generators: manifest, token map,
  component inventory, component tokens reference, export verification,
  llms.txt/llms-full.txt, and version sync
- Auto-generated `docs/generated/token-component-map.json` mapping 67
  components to 551 tokens
- Auto-generated `docs/generated/COMPONENT-INVENTORY.md` listing all 102
  components
- Auto-generated `docs/generated/COMPONENT-TOKENS.md` documenting the complete
  token surface per component
- Export verification that checks all component directories have barrel exports
- Automated `manifest.ai.json` generation pipeline
  (`scripts/generate-manifest.mjs`) from TypeScript source
- Component-to-token mapping build script
  (`scripts/generate-token-map.mjs`) scanning 67 CSS files for 551 tokens
- Source-of-truth audit report at `docs/audits/source-of-truth-audit.md`

### Changed
- Migrated the playground theme cache from Vercel KV to Supabase.
  `@vercel/kv` was deprecated upstream; behavior is identical (7-day TTL, same
  SHA-256 key scheme, same BYOK skip, same soft-fail). Responses now carry
  `X-Cache: HIT | MISS` header and set `Cache-Control: no-store` on BYOK
  responses.
- Edge function defaults to Claude Haiku 4.5 for roughly 4x lower cost than
  Sonnet. Opt into Sonnet via `"model": "sonnet"`.
- Enabled Anthropic prompt caching on the identical system prompt. Cached input
  reads at ~10% of normal cost within the 5-minute window.
- Reduced `max_tokens` from 4096 to 2500, sized to fit a complete theme JSON.
- Landing page hero form now calls the generator with a loading state instead of
  showing "AI generation coming soon".
- `llms.txt` - components grouped by category, density switching added, resource
  links section.
- `llms-full.txt` - added 4 complete layout pattern code examples, full theme
  customization guide, responsive breakpoints section. 2370 lines.
- `vercel.json` - added `Content-Type: text/plain; charset=utf-8` and
  `Cache-Control` headers for `/llms.txt` and `/llms-full.txt`.
- Root `README.md` - quickstart leads with `npx @arcana-ui/cli init my-app`.
- Input component: border, background, height, padding now live on the wrapper
  div; inner `<input>` is fully transparent. Added `wrapperClassName` prop.
- Landing page hero input: submit button rendered inside Input via `suffix`
  prop instead of absolute positioning.
- Refactored 11 component CSS files to use element sizing tokens with proper
  fallbacks.
- Renamed element padding tokens from `--spacing-element-y-*` /
  `--spacing-element-x-*` to `--element-padding-y-*` / `--element-padding-x-*`.
- All sized components use `min-height` (not `height`) with 44px mobile touch
  target floor.
- TokenEditor uses Arcana `<ColorPicker>`, `<FontPicker>`, `useUndoRedo` hook,
  `<Input>`, and `<Button>` instead of custom/inline implementations.
- CubicBezierEditor uses Arcana `useMediaQuery` and `usePrefersReducedMotion`.
- AccessibilityPanel, ComponentDetail, TokenExplorer, TokenImpact: deduplicated
  `getCSSVar` utility.
- Landing page uses Arcana `<Input>`, `<Button>`, `<Badge>` components.

### Fixed
- Landing hero theme generation returned 404 after the 405 fix. The Vercel
  project's Root Directory is the repo root, so Vercel only scans `./api/*` for
  functions. Moved edge function from `./playground/api/` to `./api/` so Vercel
  discovers it.
- Landing hero theme generation returned 405. The root `vercel.json` SPA
  rewrite used `/(.*)` which caught `/api/*` requests. Changed to
  `/((?!api/).*)` so edge functions handle `/api/*`.
- Landing page and playground copy: replaced outdated "60+ components" with real
  count ("108 components") across meta tags, hero, feature cards, and FAQ.
- Removed stray `console.log('Undo!')` from Toast demo.
- `@arcana-ui/tokens@0.1.0-beta.1` did not expose `./dist/arcana.css` through
  its exports field (`ERR_PACKAGE_PATH_NOT_EXPORTED`). Fixed in beta.2.
- `useTheme.test.tsx`: 16 failing tests caused by missing `localStorage.clear`
  in vitest+jsdom. Fixed by patching `globalThis.localStorage` in test setup.
- Fixed spacing editor base unit showing 0px when preset uses rem values.
- Fixed token CSS lint violations in ColorPicker (hardcoded values replaced with
  token references).
- Button: replaced hardcoded `9999px` with `var(--radius-full)`.
- Element size tokens: removed unsized component height tokens that overrode
  size scale; use `height` instead of `min-height` on desktop.

### Security
- Hardened `/api/generate-theme` against shared-key abuse. The previous CORS
  check accepted any `*.vercel.app` origin. Three independent gates now protect
  the shared key: (1) strict origin allowlist narrowed to `arcana-ui.com`,
  subdomains, localhost, and team preview deploys; (2) per-IP limit dropped to
  5/min; (3) new global 60/min ceiling. 429 responses include `Retry-After`
  header and `scope` field. BYOK requests bypass all checks.

## [0.1.0-beta.1] - 2026-03-24

### Added

#### Phase 0: Foundation
- Three-tier token architecture (primitive -> semantic -> component) with JSON Schema validation
- Token build pipeline: JSON presets -> CSS custom properties with reference resolution
- Strict TypeScript configuration with zero `any` types
- Biome linter/formatter with Husky pre-commit hooks
- Vitest + React Testing Library test infrastructure with 70% coverage thresholds
- Playwright visual regression testing across 5 viewports (320-1536px)
- axe-core accessibility testing (zero critical violations)
- Custom CSS token linter enforcing `var(--token-name)` usage (no hardcoded values)
- CI/CD with GitHub Actions (lint, typecheck, test, build, visual regression)
- PR title validation for conventional commits
- `manifest.ai.json` for AI agent component/token discovery
- `CONTRIBUTING.md`, `ARCHITECTURE.md`, `COMPONENT-INVENTORY.md`, `MIGRATION.md`

#### Phase 1: Token System
- Full color system: 16-hue palettes (light/dark/glass), theme-specific palettes (terminal, retro98, brutalist)
- Typography system: fluid `clamp()` sizing, display/body/mono font families, semantic weight/lineHeight/letterSpacing aliases
- Spacing system: 29-value primitive scale, semantic aliases (xs-section-lg), three density modes (compact/default/comfortable) via `data-density` attribute
- Elevation system: shadows (xs-2xl), backdrop blur, z-index scale (0-800), 8 semantic contextual elevation tokens
- Layout tokens: breakpoints, containers, content widths, 12-column grid, `useMediaQuery` and `useBreakpoint` hooks
- Motion tokens: 9 durations x 7 easings, transition shorthands, per-preset motion personalities, `prefers-reduced-motion` support
- Border/shape tokens: primitive widths, composable focus rings, semantic divider tokens
- Opacity tokens: 16 primitive values, semantic disabled/placeholder/overlay tokens
- Token validation CI check with WCAG AA contrast verification (11 fg/bg pairs per preset)
- Theme switching via `useTheme` hook, `ThemeProvider` context, localStorage persistence, system preference detection
- Component token layer (Tier 3) with density-aware values for 19 components

#### Phase 2: Responsive & Mobile
- `BottomSheet`, `MobileNav`, `DrawerNav` mobile-specific components
- DrawerNav integrated into Navbar (responsive collapse)
- Fluid `clamp()` typography (from Phase 1)
- Density-aware spacing (from Phase 1)
- Zero `max-width` media queries (mobile-first throughout)
- Fixed 5 hover-only violations with `focus-visible` equivalents
- Visual regression tests across 5 viewports x 2 themes + 2 density modes (57 baselines)

#### Phase 3: Component Library (60+ components)
- **Primitives:** Button (iconOnly), Input (sizes), Badge (sizes), Avatar (token-based colors), Toggle (description), Checkbox, Radio, Textarea, Select (searchable, multiple, grouped, clearable)
- **Navigation:** Navbar, Sidebar, Breadcrumb, Pagination, Footer, Tabs (arrow key navigation)
- **Content/Marketing:** Hero (3 variants), FeatureSection (grid/list/alternating), Testimonial (card/inline/featured), PricingCard (popular treatment), CTA (banner/card/minimal), StatsBar (animated counting), Timeline, LogoCloud (marquee)
- **Data Display:** DataTable (sorting, filtering, pagination, row selection, sticky header/columns), StatCard, ProgressBar (striped/animated/indeterminate), KPICard (SVG sparkline)
- **Forms:** CheckboxGroup, RadioGroup (card variant), DatePicker (calendar dropdown), FileUpload (drag-and-drop dropzone)
- **Overlays:** Modal (focus trap, scroll lock), Drawer (4 sides), Popover (auto-flip positioning), Toast (provider, stacking), CommandPalette (command-K search), BottomSheet
- **Layout:** Stack, Grid, Container, Divider (labeled), Spacer, AspectRatio
- **Media:** Image (lazy loading, skeleton fallback), Carousel (scroll-snap, auto-play)
- **Feedback:** Alert, Banner (dismissible, sticky), Skeleton (text/circular/rectangular), Spinner, EmptyState, ErrorBoundary
- **E-commerce:** ProductCard (3 variants, skeleton), CartItem, QuantitySelector, PriceDisplay (Intl.NumberFormat), RatingStars (interactive, half-star)
- **Editorial:** ArticleLayout (prose/wide/full), PullQuote, AuthorCard, RelatedPosts, NewsletterSignup
- **Utilities:** ScrollArea, Collapsible (animated height), CopyButton (clipboard API), KeyboardShortcut (OS-aware Cmd/Ctrl), Accordion (controlled)

#### Phase 4: Theme Presets & Demos
- 14 theme presets: Light, Dark, Terminal, Retro98, Glass, Brutalist, Corporate, Startup, Editorial, Commerce, Midnight, Nature, Neon, Mono
- All presets pass WCAG AA contrast validation
- Per-preset visual personalities (typography, shadows, borders, radius, motion, colors)
- SaaS Dashboard demo with Navbar, StatCards, DataTable, ProgressBars
- E-commerce demo with ProductCard grid, cart, QuantitySelector

#### Landing Page & Playground
- Dark premium landing page with 10 sections (hero, features, theme showcase, component preview, stats, CTA)
- AI prompt input concept ("Describe your brand. Get a design system.")
- 14-theme showcase with mini-previews and `?theme=` deep linking
- Playground: visual token editor (colors, typography, spacing, motion, scale, density)
- Interactive component demos across 13 sections
- SVG wordmark logos for all 14 themes
- react-router-dom routing (/ -> landing, /playground -> editor)

### Changed
- Migrated all component CSS from `--arcana-*` to semantic token names (511 replacements)
- Renamed Button variant `danger` -> `destructive`
- Replaced all hardcoded CSS values with token references (93 violations fixed)
- Replaced hardcoded disabled opacity with `var(--opacity-disabled)` in 10 components
- Dark theme elevated surfaces use lighter values (950 -> 900 -> 800 hierarchy)
- Migrated repository from garrettbear/arcana-ui to Arcana-UI/arcana

### Fixed
- Playground theme switching (rewrote presets.ts to use `data-theme` attribute)
- Brutalist wildcard `!important` breaking transitions/shadows (removed, tokens handle it)
- Border radius not cascading to components (build.ts outputs `var()` references for component tokens)
- Token editor state sync on preset switch (refreshValues syncs all editor state)
- Color-scheme for midnight and neon presets (light -> dark)
- 4 WCAG contrast failures: dark action-primary, dark action-destructive, brutalist destructive, terminal destructive
- Modal IDs use `useId()` instead of `Math.random()` for SSR safety
