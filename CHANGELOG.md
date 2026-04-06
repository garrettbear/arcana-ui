# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- `@arcana-ui/core@0.1.0-beta.2` and `@arcana-ui/tokens@0.1.0-beta.2` — consumer package audit pass. Rebuilt from current source so all 122 exports (including `useClickOutside`, `useDrag`, `useUndoRedo`, `ColorPicker`, `FontPicker`, `BottomSheet`, `DrawerNav`, `LogoCloud`, etc.) are now present in the published package (beta.1 was stale and shipped only 115 exports).
- `@arcana-ui/tokens` exports map: added `./styles` alias, `./dist/*` subpath, and `./package.json` subpath so strict Node ESM resolvers can import `@arcana-ui/tokens/dist/arcana.css` and `@arcana-ui/tokens/styles` directly.
- `@arcana-ui/core` exports map: added `./dist/*` and `./package.json` subpaths for tooling compatibility.
- `examples/quickstart/` — minimal Vite + React + TypeScript consumer that installs Arcana from the registry (not via workspace link), exercises 8 components, theme switching, density switching, and type exports. Serves as both quickstart docs and the reproducible consumer test fixture for future package audits.
- `docs/QUICKSTART.md` — three-step consumer guide (install, import CSS, set `data-theme`). Doubles as the spec for the forthcoming `npx arcana-ui init` CLI.
- `KNOWN_ISSUES.md` at the repo root documenting tree-shaking limitations in beta.2, missing `Video` component, and the vitest jsdom `localStorage` test regression.

### Fixed
- `@arcana-ui/tokens@0.1.0-beta.1` did not expose `./dist/arcana.css` through its package.json `exports` field, causing `ERR_PACKAGE_PATH_NOT_EXPORTED` for consumers using `import '@arcana-ui/tokens/dist/arcana.css'`.

### Added
- Atelier editorial magazine demo: luxury architecture/interiors publication with 3 pages (Home, Article Detail, Archive), editorial theme overrides (zero-radius, warm paper background, Cormorant Garamond + DM Sans typography), full-bleed hero layout, 6 long-form articles with real editorial prose, article tabs (Article/Gallery with lightbox modal), archive with filters/search/pagination, timeline milestones, stat cards, by-the-numbers table, and 25+ Arcana UI components (Navbar, AuthorCard, PullQuote, RelatedPosts, NewsletterSignup, Timeline, StatCard, Tabs, ScrollArea, Modal, Image, Badge, Divider, Breadcrumb, Pagination, Table, Banner, KeyboardShortcut, Skeleton, Toast, Footer, and more)
- Mosaic visual discovery demo: light-themed inspiration/collection app with 3 pages (Discover feed, Collections, Collection Detail), CSS-columns masonry grid, 20 curated feed items, 5 user collections, filter pills, item detail modal with save-to-collection, create collection form, sidebar with suggested collections/people/logo cloud, and 25+ Arcana UI components (Card, Image, Badge, Button, Avatar, Modal, Select, Tabs, Banner, StatCard, Breadcrumb, EmptyState, LogoCloud, ScrollArea, Skeleton, Divider, Toast, and more)
- Wavefront music player demo: midnight-themed listening app with 3 curated collections (20 tracks), sidebar navigation, now-playing bar with playback controls, collection detail view, expanded now-playing view, favorites with toast notifications, keyboard shortcuts (Space = play/pause), volume control, and 20+ Arcana UI components rendered across the app
- Forma ecommerce demo: luxury objects brand with 4 pages (Home, Shop, Product Detail, Cart), 12-product catalog, cart state management, and 33+ Arcana UI components rendered across the app
- Demo uses react-router-dom for client-side routing with `/`, `/shop`, `/shop/:slug`, and `/cart` routes
- Cart context with add/remove/update/clear operations and derived totals
- Quick view modal on shop page, promo code form in cart, shipping progress tracker, testimonials, timeline, newsletter signup

### Fixed
- `useTheme.test.tsx`: 16 failing tests caused by missing `localStorage.clear` in vitest+jsdom environment. Fixed by patching `globalThis.localStorage` with an in-memory implementation in `packages/core/src/test/setup.ts`. Also added `environmentOptions.jsdom.url` to `vitest.config.ts` for proper jsdom origin context.

### Added
- Global element sizing token system: `--element-height-{xs..xl}`, `--element-padding-y-{xs..xl}`, `--element-padding-x-{xs..xl}`, `--element-font-size-{xs..xl}`, `--element-icon-size-{xs..xl}` with density scaling (compact/comfortable)
- Button xs and xl sizes, plus icon-only sizes (`icon-xs`, `icon-sm`, `icon`, `icon-lg`, `icon-xl`) that create square buttons
- Button `shape` prop with `default`, `circle`, and `pill` options
- Input and Select xs and xl sizes matching Button heights
- Per-size component tokens for Button, Input, Select, QuantitySelector with three-level fallback chain (`--button-height-md → --button-height → --element-height-md`)
- Element Sizing section in token editor with height/padding-y/padding-x sliders per size and visual alignment preview across all 5 sizes
- Button shapes gallery and cross-component alignment proof in playground component detail page
- Personality-appropriate element sizing overrides for 8 presets (terminal/retro98/mono=compact, glass/editorial/nature=spacious, startup/brutalist=slightly spacious)

### Changed
- Input component: border, background, height, padding now live on the wrapper div; inner `<input>` is fully transparent — prefix/suffix elements are visually contained inside the border and focus ring
- Input component: added `wrapperClassName` prop for custom wrapper styling
- Landing page hero input: submit button rendered inside Input via `suffix` prop instead of absolute positioning
- Refactored 11 component CSS files (Button, Input, Select, Textarea, DatePicker, QuantitySelector, Pagination, Tabs, Badge, Sidebar, Drawer) to use element sizing tokens with proper fallbacks
- Renamed element padding tokens from `--spacing-element-y-*` / `--spacing-element-x-*` to `--element-padding-y-*` / `--element-padding-x-*`
- All sized components use `min-height` (not `height`) with 44px mobile touch target floor

### Fixed
- Fixed spacing editor base unit showing 0px when preset uses rem values (rem-to-px conversion was missing)
- `useClickOutside` hook — fires callback on mousedown outside a ref element, SSR-safe, with enabled flag
- `useDrag` hook — generic drag handling with RAF throttling, touch support, relative positioning, and ref-based callbacks
- `useUndoRedo<T>` hook — generic history stack with branch trimming, configurable max history, and reactive canUndo/canRedo
- `ColorPicker` component — full HSV color picker with canvas rendering, hue/alpha sliders, hex/RGB inputs, EyeDropper API, preset colors, recent colors, and size variants (sm/md/lg)
- `FontPicker` component — searchable font dropdown with Google Fonts integration, category grouping, font preview, and click-outside dismissal
- Unified single-source-of-truth documentation pipeline (`scripts/generate-docs.mjs`) with 7 generators producing all docs from source code
- `pnpm generate-docs` command that runs all generators: manifest, token map, component inventory, component tokens reference, export verification, llms.txt/llms-full.txt, and version sync
- Auto-generated `docs/generated/token-component-map.json` mapping 67 components to 551 tokens with both component→token and token→component lookups
- Auto-generated `docs/generated/COMPONENT-INVENTORY.md` listing all 102 components with variants, sizes, and sub-components
- Auto-generated `docs/generated/COMPONENT-TOKENS.md` documenting the complete token surface per component
- Export verification that checks all component directories have corresponding barrel exports
- `llms.txt` (short) and `llms-full.txt` (complete) AI agent reference files generated from manifest and token data
- Version sync between `packages/core/package.json` and `manifest.ai.json`
- Source-of-truth audit report at `docs/audits/source-of-truth-audit.md`
- Automated `manifest.ai.json` generation pipeline (`scripts/generate-manifest.mjs`) that parses TypeScript source to extract component props, hook metadata, and token information
- `pnpm manifest` and `pnpm manifest:check` scripts for generating and validating the AI discovery manifest
- Playground site map architecture with individual component pages, token impact views, and relationship graph
- Component gallery at `/playground/components` with search, category filter, and visual previews
- Individual component deep-dive pages at `/playground/components/:name` with variants, sizes, states, interactive demo, component tokens editor, props reference, and token dependencies
- Token explorer at `/playground/tokens` with search, category filter, and usage counts
- Token impact pages at `/playground/tokens/:category/:name` showing inline editor and all affected components rendered live
- Token-component relationship graph at `/playground/graph` — D3 force-directed SVG visualization with glow effects, hover highlighting, zoom/pan, drag, search-to-focus, and node click navigation
- Component-to-token mapping build script (`scripts/generate-token-map.mjs`) that scans all 67 component CSS files and generates a JSON registry of 551 tokens
- Shared `PlaygroundLayout` with top navigation (Editor, Components, Tokens, Graph), theme switcher bar, and breadcrumb navigation
- Component registry data (`playground/src/data/component-registry.ts`) with metadata for 55+ components
- Deep linking support — all routes accept `?theme=` parameter for shareable links
- Theme persistence across all playground routes
- Navigation links added to main editor page for cross-navigation
- Component-level token editor in playground
- ThemeSwitcher component for demo sites
- Playground component audit report (`docs/audits/playground-component-audit.md`)

### Changed
- TokenEditor now uses Arcana `<ColorPicker>` instead of custom playground implementation (deleted playground/src/components/ColorPicker.tsx)
- TokenEditor now uses Arcana `<FontPicker>` instead of inline 120-line custom font picker
- TokenEditor now uses Arcana `useUndoRedo` hook instead of inline implementation
- TokenEditor search input replaced with Arcana `<Input prefix={...} suffix={...} />`
- TokenEditor reset buttons replaced with Arcana `<Button variant="ghost" size="sm">`
- CubicBezierEditor now uses Arcana `useMediaQuery` and `usePrefersReducedMotion` hooks instead of raw window.matchMedia
- AccessibilityPanel, ComponentDetail, TokenExplorer, TokenImpact: deduplicated `getCSSVar` utility (removed 4 inline copies)
- Landing page prompt input replaced with Arcana `<Input>`
- Landing page buttons (mobile menu, hero CTA, playground CTA, GitHub link) now use Arcana `<Button>`
- Landing page hero badge and active badge now use Arcana `<Badge>`

### Fixed
- Fixed token CSS lint violations in ColorPicker (hardcoded font-size and transition values replaced with token references)

## [0.1.0-beta.1] - 2026-03-24

### Added

#### Phase 0: Foundation
- Three-tier token architecture (primitive → semantic → component) with JSON Schema validation
- Token build pipeline: JSON presets → CSS custom properties with reference resolution
- Strict TypeScript configuration with zero `any` types
- Biome linter/formatter with Husky pre-commit hooks
- Vitest + React Testing Library test infrastructure with 70% coverage thresholds
- Playwright visual regression testing across 5 viewports (320–1536px)
- axe-core accessibility testing (zero critical violations)
- Custom CSS token linter enforcing `var(--token-name)` usage (no hardcoded values)
- CI/CD with GitHub Actions (lint, typecheck, test, build, visual regression)
- PR title validation for conventional commits
- `manifest.ai.json` for AI agent component/token discovery
- `CONTRIBUTING.md`, `ARCHITECTURE.md`, `COMPONENT-INVENTORY.md`, `MIGRATION.md`

#### Phase 1: Token System
- Full color system: 16-hue palettes (light/dark/glass), theme-specific palettes (terminal, retro98, brutalist)
- Typography system: fluid `clamp()` sizing, display/body/mono font families, semantic weight/lineHeight/letterSpacing aliases
- Spacing system: 29-value primitive scale, semantic aliases (xs–section-lg), three density modes (compact/default/comfortable) via `data-density` attribute
- Elevation system: shadows (xs–2xl), backdrop blur, z-index scale (0–800), 8 semantic contextual elevation tokens
- Layout tokens: breakpoints, containers, content widths, 12-column grid, `useMediaQuery` and `useBreakpoint` hooks
- Motion tokens: 9 durations × 7 easings, transition shorthands, per-preset motion personalities, `prefers-reduced-motion` support
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
- Visual regression tests across 5 viewports × 2 themes + 2 density modes (57 baselines)

#### Phase 3: Component Library (60+ components)
- **Primitives:** Button (iconOnly), Input (sizes), Badge (sizes), Avatar (token-based colors), Toggle (description), Checkbox, Radio, Textarea, Select (searchable, multiple, grouped, clearable)
- **Navigation:** Navbar, Sidebar, Breadcrumb, Pagination, Footer, Tabs (arrow key navigation)
- **Content/Marketing:** Hero (3 variants), FeatureSection (grid/list/alternating), Testimonial (card/inline/featured), PricingCard (popular treatment), CTA (banner/card/minimal), StatsBar (animated counting), Timeline, LogoCloud (marquee)
- **Data Display:** DataTable (sorting, filtering, pagination, row selection, sticky header/columns), StatCard, ProgressBar (striped/animated/indeterminate), KPICard (SVG sparkline)
- **Forms:** CheckboxGroup, RadioGroup (card variant), DatePicker (calendar dropdown), FileUpload (drag-and-drop dropzone)
- **Overlays:** Modal (focus trap, scroll lock), Drawer (4 sides), Popover (auto-flip positioning), Toast (provider, stacking), CommandPalette (⌘K search), BottomSheet
- **Layout:** Stack, Grid, Container, Divider (labeled), Spacer, AspectRatio
- **Media:** Image (lazy loading, skeleton fallback), Carousel (scroll-snap, auto-play)
- **Feedback:** Alert, Banner (dismissible, sticky), Skeleton (text/circular/rectangular), Spinner, EmptyState, ErrorBoundary
- **E-commerce:** ProductCard (3 variants, skeleton), CartItem, QuantitySelector, PriceDisplay (Intl.NumberFormat), RatingStars (interactive, half-star)
- **Editorial:** ArticleLayout (prose/wide/full), PullQuote, AuthorCard, RelatedPosts, NewsletterSignup
- **Utilities:** ScrollArea, Collapsible (animated height), CopyButton (clipboard API), KeyboardShortcut (OS-aware ⌘/Ctrl), Accordion (controlled)

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
- react-router-dom routing (/ → landing, /playground → editor)

### Changed
- Migrated all component CSS from `--arcana-*` to semantic token names (511 replacements)
- Renamed Button variant `danger` → `destructive`
- Replaced all hardcoded CSS values with token references (93 violations fixed)
- Replaced hardcoded disabled opacity with `var(--opacity-disabled)` in 10 components
- Dark theme elevated surfaces use lighter values (950 → 900 → 800 hierarchy)
- Migrated repository from garrettbear/arcana-ui to Arcana-UI/arcana

### Fixed
- Playground theme switching (rewrote presets.ts to use `data-theme` attribute)
- Brutalist wildcard `!important` breaking transitions/shadows (removed, tokens handle it)
- Border radius not cascading to components (build.ts outputs `var()` references for component tokens)
- Token editor state sync on preset switch (refreshValues syncs all editor state)
- Color-scheme for midnight and neon presets (light → dark)
- 4 WCAG contrast failures: dark action-primary, dark action-destructive, brutalist destructive, terminal destructive
- Modal IDs use `useId()` instead of `Math.random()` for SSR safety
