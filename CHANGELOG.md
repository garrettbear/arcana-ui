# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Component-level token editor in playground
- ThemeSwitcher component for demo sites
- Playground component audit report (`docs/audits/playground-component-audit.md`)

### Changed
- Landing page buttons (mobile menu, hero CTA, playground CTA, GitHub link) now use Arcana `<Button>`
- Landing page hero badge and active badge now use Arcana `<Badge>`

### Fixed
- Reverted Arcana component replacements in token editor tooling (TokenEditor, AccessibilityPanel, ColorPicker, CubicBezierEditor) — Arcana components consume the same CSS tokens the editor modifies, causing circular UI corruption
- Fixed hero prompt input on landing page — reverted from Arcana `<Input>` (wrapper markup broke layout) to raw `<input>`
- Fixed Reset All button not working in token editor
- Fixed token reset buttons (18px) being oversized due to Arcana Button min-height
- Fixed color picker z-index — Arcana Button's `overflow: hidden` was clipping the popup
- Fixed segmented control buttons changing color when editing `--color-action-primary` token

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
