# Arcana UI -- Progress Tracker

> **Last updated:** 2026-04-14
> **Current version:** v0.1.0 (stable, published to npm)
> **Current sprint:** P.5 Sprint 2 close-out; P.5.2 (Supabase accounts) next
> **Source of truth for current state:** CLAUDE.md "Current State" section
> **Next priority:** P.5.2 Supabase accounts + workspaces, then external starter repos

---

## Release Status

| Package | Version | npm | Status |
|---------|---------|-----|--------|
| `@arcana-ui/tokens` | 0.1.0 | Published | Stable |
| `@arcana-ui/core` | 0.1.0 | Published | Stable |
| `@arcana-ui/cli` | 0.1.0 | Published | Stable |
| `@arcana-ui/mcp` | 0.1.0 | Published | Stable |

---

## Phases 0-3: Complete

All foundation work, token system (2,600+ CSS variables), responsive framework (5-breakpoint visual regression suite), and component library built. 14 theme presets. Test infrastructure, CI/CD, and npm publish done.

- **Primitives:** 9 (Button, Input, Textarea, Select, Checkbox, Radio, Toggle, Badge, Avatar)
- **Composites:** 10 (Accordion, Alert, Banner, Card, ErrorBoundary, Modal, Skeleton, Spinner, Tabs, Toast)
- **Patterns:** 47 (Navbar, Sidebar, DataTable, Hero, PricingCard, CommandPalette, etc.)
- **Playground components:** 2 (ColorPicker, FontPicker)
- **Layout:** 1 (Layout)
- **Hooks:** 8 (useTheme, useBreakpoint, useClickOutside, useDrag, useFloating, useHotkey, useMediaQuery, usePrefersReducedMotion, useUndoRedo)
- **Total named exports:** 114 (108 components per manifest.ai.json)

---

## Phase 4: Demo Sites -- COMPLETE

- [x] 4.1 -- Manifest generator: type alias resolution, skip filter fixes
- [x] 4.2 -- Component audit: 100% manifest coverage
- [x] 4.3 -- Demo: Forma -- luxury ecommerce (`commerce` theme, 4 pages, 47 components)
- [x] 4.4 -- Demo: Wavefront -- music player (`midnight` theme, sidebar + player bar, 3 views)
- [x] 4.5 -- Demo: Mosaic -- visual discovery app (`light` theme, masonry grid, 3 pages)
- [x] 4.6 -- Demo: Atelier -- editorial magazine (`editorial` theme, zero-radius, real prose, 3 pages)
- [x] 4.7 -- Demo: Control -- component analytics dashboard (`dark` theme, 4 pages, full registry)
- [x] 4.8 -- Deploy all demos to Vercel
  - dashboard.arcana-ui.com
  - wavefront.arcana-ui.com
  - ecommerce.arcana-ui.com
  - atelier.arcana-ui.com
  - mosaic.arcana-ui.com
  - control.arcana-ui.com

---

## Phase P: Playground Product

- [x] P.1 -- Landing page (live at arcana-ui.com)
- [x] P.2 -- ComponentGallery with stats bar, richer cards, audit table mode
- [x] P.3 -- Visual token editor (custom HSV color picker, cubic bezier editor, undo/redo, search/filter, modified indicators)
- [x] P.4 -- Live component preview with category filter
- [x] **P.5 -- AI theme generation flow** (Sprint 2 shipped via PRs #108, #109, #110, #113)
  - [x] Hero input: "Describe your brand" wired to edge function with loading state
  - [x] Anthropic API via Vercel edge function (`api/generate-theme.ts` at repo root after #112)
  - [x] Generate 3 theme variants per request, returned as structured JSON
  - [x] `/generate` route with side-by-side preview cards
  - [x] User picks one, lands in editor with theme applied via sessionStorage
  - [x] Cost controls: Haiku default, prompt caching, max_tokens 2500
  - [x] BYOK via `X-User-API-Key` header (plumbing + UI both live)
  - [x] BYOK settings UI (gear icon + Popover in playground topbar: password input with show/hide, Test and save, Clear key, "Your key" Badge when set) -- #108
  - [x] Semantic cache (Vercel KV on SHA-256 hash of normalized description+siteType+density+count+model, 7-day TTL, `meta.cached` on response, soft-miss when KV env missing) -- #110
  - [x] Topbar shows generated theme name when `?theme=generated` is active (chip with close button, persisted across routes via `arcana-active-generated-name` session key) -- #109
  - [x] Anthropic `error.type` forwarded to the client as `code`, upstream HTTP status preserved so our 429 (IP rate limit) and Anthropic's 429 (`rate_limit_error`/`overloaded_error`) are distinguishable; `readableError` rewritten with tailored copy for `billing_error`, `authentication_error`, `overloaded_error`, `rate_limit_error`, `invalid_request_error`. 16-case unit test suite added. -- this PR
- [ ] P.6 -- Theme gallery (browse presets, one-click load, fork)
- [ ] P.7 -- Authentication (GitHub + Google OAuth)
- [ ] P.8 -- Theme save/load
- [ ] P.9 -- Export enhancements (JSON and CSS export already work)
- [ ] P.10 -- Monetization infrastructure
- [ ] P.11 -- AI generation rate limiting
- [ ] P.12 -- Accessibility panel (live WCAG scoring)

---

## Phase 5: AI Integration & Launch

- [x] 5.1 -- manifest.ai.json (auto-generated, 108 components, 100% coverage)
- [x] 5.2 -- llms.txt + llms-full.txt (2,370 lines, grouped by category, layout patterns, theme guide)
- [x] 5.3 -- Claude Code skill at `.claude/skills/arcana/SKILL.md` (1,821 lines)
- [x] 5.4 -- MCP server: `@arcana-ui/mcp@0.1.0` (7 tools: list_components, get_component, list_presets, get_preset, validate_theme, generate_theme, get_token_impact)
- [ ] 5.5 -- Documentation site (auto-generated from manifest.ai.json)
- [ ] 5.6 -- SEO and discoverability (structured data, OG images, meta tags)
- [ ] 5.7 -- Community starter templates (Next, Vite, Remix, Astro)
- [ ] 5.8 -- Figma Code Connect + token export
- [ ] 5.9 -- Performance audit (tree-shaking, bundle size, CSS size per theme)
- [ ] 5.10 -- Launch checklist
- [x] 5.11 -- CLI: init (5 layouts x 2 frameworks), validate (WCAG checks), add-theme (14 presets)

---

## Phase 6: Extensibility & Developer Experience (NEW)

- [ ] 6.1 -- Icon system: default icon library recommendation, opt-out to none, BYOI (bring your own icons) support
- [ ] 6.2 -- Extension guidelines: EXTENDING.md file for AI agents to follow when building custom components that match the system
- [ ] 6.3 -- CLI enhancements: `add-theme` from description, `update` commands, AI-powered CLI flows
- [ ] 6.4 -- Component variant depth: expose variant-level tokens for components (e.g., button primary vs ghost at the token layer)
- [ ] 6.5 -- DESIGN.md export: generate a DESIGN.md from Arcana tokens for Google Stitch and other AI tools

---

## Phase 7: External Validation (NEW)

- [ ] 7.1 -- `arcana-starter-saas` repo (Next.js dashboard template, under Arcana-UI org)
- [ ] 7.2 -- `arcana-starter-storefront` repo (Vite + React ecommerce/marketing, under Arcana-UI org)
- [ ] 7.3 -- Website clone rebuilds: pick 3-5 real websites and rebuild them with Arcana to stress-test flexibility
- [ ] 7.4 -- DX friction tracking: document every pain point from external repo development as issues on main repo

---

## Phase 8: GTM & Distribution (NEW)

- [ ] 8.1 -- README overhaul with competitive positioning
- [ ] 8.2 -- Claude marketplace / skills listing
- [ ] 8.3 -- Show HN preparation and launch
- [ ] 8.4 -- Contributor guide and community templates
- [ ] 8.5 -- Performance audit and tree-shaking fix (per-component entry points)

---

## Known Issues

| Issue | Severity | Status |
|-------|----------|--------|
| Tree-shaking broken (single entry point, ~278 kB for any import) | Medium | Tracked in KNOWN_ISSUES.md, fix needs per-component entry points |
| 16 useTheme tests fail (`localStorage.clear is not a function` in vitest jsdom) | Low | Investigate vitest jsdom environment config |

---

## Deployed Sites

| Site | URL | Status |
|------|-----|--------|
| Playground / Landing | arcana-ui.com | Live |
| Dashboard demo | dashboard.arcana-ui.com | Live |
| Wavefront demo | wavefront.arcana-ui.com | Live |
| Ecommerce demo | ecommerce.arcana-ui.com | Live |
| Atelier demo | atelier.arcana-ui.com | Live |
| Mosaic demo | mosaic.arcana-ui.com | Live |
| Control demo | control.arcana-ui.com | Live |
