# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Motion primitives + enterprise-grade landing polish.** Four token-driven
  motion primitives landed under `playground/src/components/motion/`:
  `FadeIn` (opacity + `translateY` reveal keyed to `--duration-slow` /
  `--ease-out`), `Stagger` (wrapper that clones children into `FadeIn`s
  with `baseDelay + i * step` delays), `CountUp` (rAF-driven ease-out
  cubic that animates 0 -> `to` over 1200ms with suffix support and
  locale thousands formatting), and `GradientBorder` (conic-gradient
  border painted via a masked pseudo-element that rotates on hover /
  focus-within using a CSS `@property --gradient-angle`). All four
  honor `prefers-reduced-motion`: the shared hook
  `playground/src/hooks/useInView.ts` wraps `IntersectionObserver` and
  reports `true` on mount when reduced motion is set, and
  `motion.module.css` collapses every transition to `0ms` under the
  same media query. The primitives are exported from a barrel at
  `playground/src/components/motion/index.ts`. The landing page
  (`playground/src/pages/Landing.tsx`) now threads every section
  through these primitives: hero headline + subhead + prompt + links
  fade in at 0/100/200/300/400ms; logo cloud staggers at 60ms; features
  stagger at 80ms and each feature card is wrapped in `GradientBorder`
  so a conic accent border reveals on hover; how-it-works staggers at
  120ms; theme gallery staggers at 40ms; component showcase fades in
  with `translateY(48px)`; stats are `CountUp`s (108, 2,600, 14, 5);
  the CTA tracks the cursor with a radial spotlight piped via
  `--spotlight-x` / `--spotlight-y`. The hero also gets two soft
  radial-gradient "drift" blobs looping at 18s / 24s for ambient
  depth.
- **Button scale on `:active`.** `packages/core/src/primitives/Button/Button.module.css`
  now transitions `transform` alongside color / shadow / opacity using
  `var(--duration-fast)` + `var(--ease-out)` and applies
  `transform: scale(0.98)` on `:active:not(:disabled)`. Behind
  `prefers-reduced-motion` the scale is neutralized back to `none`.
  This is the first component-level motion tweak that picks up the
  per-preset motion personality set by the tokens JSON.

### Changed

- **Migrated the playground theme cache from Vercel KV to Supabase.**
  `@vercel/kv` was deprecated upstream and we're consolidating storage on
  the same Supabase project arcana-ops already uses. Behavior is
  identical: 7-day TTL, same SHA-256 key scheme (now written as
  `<modelShort>:<hash16>` directly into `theme_cache.cache_key` without
  the legacy `arcana:theme:` prefix), same BYOK skip, same soft-fail when
  env vars are absent, same hit/miss `console.log` instrumentation.
  Responses now also carry an `X-Cache: HIT | MISS` header and set
  `Cache-Control: no-store` on BYOK responses.
  - `api/generate-theme.ts` — swap `@vercel/kv` for
    `@supabase/supabase-js`. Client is initialized once at module scope
    from `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`; missing env vars
    log a single warning and the cache layer passes through. Read path
    selects `response, expires_at` filtered by `expires_at > now()` and
    bumps `hit_count` fire-and-forget through an
    `increment_theme_cache_hit` RPC. Write path is a fire-and-forget
    upsert on `cache_key` with `expires_at = now() + 7 days`.
  - `buildCacheKey` is now exported and pinned by a new 8-case unit
    suite under `api/generate-theme.test.ts` (new
    `api/vitest.config.ts`, wired into `vitest.workspace.ts`) so the
    hash scheme cannot drift silently.
  - `package.json` — `@vercel/kv@^3.0.0` removed,
    `@supabase/supabase-js@^2.45.4` added at the repo root (the edge
    function lives at `./api/` at the repo root, not in `playground/`).
  - `.env.example` — `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
    documented in place of the KV vars.
  - `api/README.md`, `playground/src/utils/generateTheme.ts` —
    docstrings swapped from "Vercel KV" to "Supabase".

### Added

- **Anthropic upstream error codes are now forwarded to the client.** When
  `/api/generate-theme` calls Anthropic and the upstream returns non-2xx,
  the edge function parses Anthropic's JSON error envelope, copies
  `error.type` to a new `code` field on the response, and forwards the
  upstream HTTP status unchanged. The client can now tell e.g. our 429
  (IP rate limit, `code: null`) apart from Anthropic's 429
  (`code: "rate_limit_error"` / `code: "overloaded_error"`) without
  guessing from the detail message. `readableError` in
  `playground/src/utils/generateTheme.ts` was rewritten to dispatch on
  `code` first, then HTTP status, then the edge function's own string
  codes, and now ships tailored copy for `billing_error`,
  `authentication_error`, `overloaded_error`, `rate_limit_error`, and
  `invalid_request_error`. The function is exported so the new unit test
  suite can exercise every branch without mocking `fetch`.
  - `api/generate-theme.ts` — new `AnthropicApiError` class,
    `parseAnthropicError` helper, and known-type allowlist. Handler catch
    now forwards the parsed status + code + detail. Every error response
    now carries `code` (including `null` for locally-produced errors) so
    the client gets a consistent shape.
  - `playground/src/utils/generateTheme.ts` — `GenerateThemeError.code`
    added to the type. `readableError` exported and rewritten with the
    new dispatch order.
  - `playground/src/utils/generateTheme.test.ts` — new 16-case test
    suite covering every readable-error branch.
  - `playground/vitest.config.ts` — new minimal vitest config so the
    playground participates in the root test run.
  - `vitest.workspace.ts` — added the playground config to the workspace
    so `pnpm test` at the root picks up the new suite.
  - `playground/package.json` — added `test` / `test:watch` scripts and
    `vitest` as a devDependency.

### Fixed

- **Landing hero theme generation returned 404 after the 405 fix.** The
  Vercel project's Root Directory is the repo root, so Vercel only scans
  `./api/*` for functions. The edge function was sitting at
  `./playground/api/generate-theme.ts`, which Vercel never discovered.
  Before the SPA rewrite was tightened, that path fell through to the
  catchall and returned 405; after the rewrite started excluding `/api/`,
  the path resolved to nothing and returned 404. Moved the function to
  `./api/generate-theme.ts` (and the README to `./api/README.md`) so
  Vercel picks it up natively. `@vercel/kv` promoted from the playground
  workspace to the repo root `package.json` so the bundler at the root
  can resolve it. `.env.example` moved to the repo root as well, since
  env vars are now pulled from the root via `vercel env pull`.
  - `api/generate-theme.ts`, `api/README.md` — moved from `playground/api/`.
  - `.env.example` — moved from `playground/.env.example`.
  - `package.json` — added `@vercel/kv@^3.0.0` as a runtime dependency.
  - `playground/package.json` — removed `@vercel/kv` (now inherited).
- **Landing hero theme generation returned 405.** The root `vercel.json` SPA
  rewrite used `/(.*)` as its source, which caught `/api/*` requests before
  Vercel Functions could handle them. POSTs to `/api/generate-theme` were
  rewritten to the static `/index.html`, which responded 405 Method Not
  Allowed. Changed the rewrite source to `/((?!api/).*)` so paths starting
  with `api/` fall through to the edge function and all other paths still
  resolve to the SPA entry.
  - `vercel.json` — single-line rewrite source change.

### Added

- **Semantic cache for AI theme generation (P.5.1).** `/api/generate-theme`
  now checks Vercel KV before calling Anthropic. Cache key is a SHA-256 of
  the normalized `{description, siteType, density, count, model}` tuple
  (description is lowercased and internal whitespace collapsed so cosmetic
  edits still hit the same entry), stored under the `theme:v1:` prefix
  with a 7-day TTL. Cache hits return with `meta.cached = true` and skip
  Anthropic entirely, so repeat prompts cost zero. Cache writes are
  best-effort: any KV failure is swallowed so the Anthropic response still
  reaches the client. KV is optional — when `KV_REST_API_URL` /
  `KV_REST_API_TOKEN` are missing (local dev without `vercel env pull`),
  the cache layer is a no-op and every request hits Anthropic as before.
  - `playground/package.json` — added `@vercel/kv@^3.0.0` as a dependency.
  - `playground/api/generate-theme.ts` — added `kvConfigured`,
    `buildCacheKey`, `cacheGet`, `cacheSet` helpers plus
    `CACHE_KEY_PREFIX` and `CACHE_TTL_SECONDS` constants. Handler now
    consults the cache before running `generateOne` and writes the
    successful response back on a miss. Response `meta` shape extended
    with the optional `cached` boolean.
  - `playground/src/utils/generateTheme.ts` — `GenerateThemeResponse.meta`
    picks up the optional `cached?: boolean` field.
  - `playground/src/pages/Generate.tsx` — preview page shows a "From
    cache" Badge alongside the model and key badges when the response
    was cached.
  - `playground/api/README.md` — documents the KV setup flow, the new
    env vars, and how to bust the cache by bumping `CACHE_KEY_PREFIX`.
- **Generated theme chip in playground topbar (P.5.1).** When `?theme=generated`
  is active, a pill appears in the playground topbar showing a small
  "Generated" prefix plus the generated theme's kebab-case name, with a close
  button that rolls the editor back to the light preset. The chip survives
  page refreshes and cross-route navigation (editor, components, tokens,
  graph) by stashing the name into a new `arcana-active-generated-name`
  sessionStorage key before the picked theme JSON is cleared. Picking a named
  preset in the theme switcher also drops the chip, since the overlay is
  gone.
  - `playground/src/components/GeneratedThemeChip.tsx` +
    `GeneratedThemeChip.module.css`. Pure presentational component that
    accepts a `name` and an `onClear` handler. Token-driven styling only,
    with truncation, tooltip, and an accessible close button.
  - `playground/src/utils/generateTheme.ts`. Added
    `ACTIVE_GENERATED_NAME_KEY`, `setActiveGeneratedName`,
    `getActiveGeneratedName`, `clearActiveGeneratedName` helpers.
  - `playground/src/App.tsx`. Stashes `picked.name` before
    `clearPickedTheme()`, renders the chip between the topbar spacer and the
    editor/a11y panel toggles, and clears the chip on preset switches.
  - `playground/src/pages/PlaygroundLayout.tsx`. Reads the stashed name on
    mount so the chip is visible on every `/playground/*` route, with the
    same clear-on-preset-switch behavior.
- **BYOK settings UI (P.5.1).** New gear button in the playground topbar,
  next to the theme switcher, opens a Popover for managing the user's own
  Anthropic API key. The panel has a masked Input (with a show/hide toggle),
  a "Test and save" button that pings `/api/generate-theme` with a minimal
  description and surfaces the result as a toast, a "Clear key" button, and
  a one-line explainer that the key stays in the browser. A small "Your key"
  Badge appears next to the gear when a key is stored, so the state is
  visible at a glance.
  - `playground/src/components/Settings.tsx` + `Settings.module.css`. Builds
    on the existing `@arcana-ui/core` Popover, Button, Input, Badge, and
    `useToast` primitives. All styling token-driven.
  - `playground/src/utils/generateTheme.ts`. `generateTheme` now accepts an
    optional `{ apiKey }` override so the Settings panel can test an
    unsaved key without mutating localStorage first. The stored key is only
    persisted after a successful test response.
  - `playground/src/pages/PlaygroundLayout.tsx`. Mounts `<Settings />`
    between the topbar spacer and the `ThemeSwitcherBar` on every
    `/playground/*` route.
- **AI theme generation (P.5.1 first cut).** Hero input on the landing page now
  generates three Arcana theme variants from a brand description via a new
  `/generate` route with side-by-side preview cards, then hands the picked
  theme into the Token Editor via sessionStorage.
  - `playground/api/generate-theme.ts` — Vercel Edge function proxying to the
    Anthropic API. Strict origin allowlist on the shared server key (only
    `arcana-ui.com`, its subdomains, `localhost`, and team preview deploys
    under `*.garrett-whistens-projects.vercel.app`), plus per-IP (5/min) and
    global (60/min) rate limits with `Retry-After`. Supports BYOK via the
    `X-User-API-Key` header (origin gating and rate limits bypassed when
    present).
  - `playground/api/README.md` — endpoint spec, BYOK notes, cost controls.
  - `playground/src/pages/Generate.tsx` + `Generate.module.css` — `/generate`
    route showing three theme cards with live-colored preview windows
    (swatches, sample button, sample card, headline in the generated display
    font) plus prompt recap and model badge.
  - `playground/src/utils/generateTheme.ts` — client helper, sessionStorage
    hand-off, typed error mapping, BYOK localStorage plumbing.
  - `applyGeneratedTheme()` in `playground/src/utils/presets.ts` — resolves
    `{primitive.path}` semantic refs into flat CSS custom properties, picks
    light or dark as the base preset by background luminance so unmapped
    tokens still have sensible values, lays the generated overrides on top.
  - `playground/.env.example` documenting `ANTHROPIC_API_KEY`.

### Changed

- Edge function defaults to Claude Haiku 4.5 for roughly 4x lower cost than
  Sonnet on the same structured-JSON task. Opt into Sonnet via
  `"model": "sonnet"`.
- Enabled Anthropic prompt caching on the identical system prompt. Cached
  input reads at ~10% of normal cost within the 5-minute window, effectively
  free for bursts and concurrent variant generations.
- Reduced `max_tokens` from 4096 to 2500, sized to fit a complete theme JSON
  with a small buffer.
- Landing page hero form now calls the generator with a loading state
  instead of showing "AI generation coming soon" and navigating blindly to
  `/playground`. Error states surface via toast.

### Security

- Hardened `/api/generate-theme` against shared-key abuse that could have
  driven up the Anthropic bill. The previous CORS check accepted any
  `*.vercel.app` origin, which any third-party Vercel app could have used to
  proxy through our shared key. Three independent gates now protect the
  shared key: (1) strict origin allowlist narrowed to `arcana-ui.com`,
  subdomains, localhost, and team preview deploys under
  `*.garrett-whistens-projects.vercel.app`, enforced server-side so curl,
  server-to-server, and bot traffic without a valid browser origin get a
  `403 forbidden_origin` before any Anthropic call is made; (2) per-IP limit
  dropped from 10/min to 5/min; (3) new global 60/min ceiling across all
  IPs on the shared key, belt-and-suspenders protection against distributed
  attacks that would compound per-IP limits into a large bill. 429 responses
  now include a `Retry-After` header and a `scope` field (`ip` or `global`).
  BYOK requests bypass all three checks since the user is paying.

## [0.1.0] - 2026-04-09

First stable release of Arcana UI. Everything below was accumulated across the
`0.1.0-beta.1` and `0.1.0-beta.2` pre-releases plus the final launch-polish
sprint on `develop`. All four packages — `@arcana-ui/tokens`,
`@arcana-ui/core`, `@arcana-ui/cli`, and `@arcana-ui/mcp` — are published to
npm at `0.1.0` on the `latest` tag.

### Release Overview

**Shipping in 0.1.0:**

- **108 React components** across primitives, navigation, forms, data
  display, overlays, layout, media, feedback, content/marketing, e-commerce,
  editorial, and utility categories.
- **14 theme presets:** light, dark, terminal, retro98, glass, brutalist,
  corporate, startup, editorial, commerce, midnight, nature, neon, mono.
- **Three-tier token architecture** (primitive → semantic → component) with
  density modes (compact/default/comfortable), global element sizing, WCAG
  contrast validation, per-preset motion personalities, and
  `prefers-reduced-motion` support.
- **11 hooks:** `useTheme`, `useMediaQuery`, `useBreakpoint`,
  `usePrefersReducedMotion`, `useHotkey`, `useFloating`, `useClickOutside`,
  `useDrag`, `useUndoRedo`, plus the `ThemeProvider` context.
- **`@arcana-ui/cli`** with `init`, `validate`, and `add-theme` commands (5
  starter layouts × Vite/Next frameworks).
- **`@arcana-ui/mcp`** — Model Context Protocol server with 7 tools for AI
  agents (Claude Code, Cursor, Codex, Figma Make).
- **Claude Code skill** at `.claude/skills/arcana/SKILL.md` (1,821 lines —
  complete component reference, hooks, token system, 4 layout patterns).
- **`llms.txt` + `llms-full.txt`** AI discovery files served from
  `arcana-ui.com` with correct `text/plain` headers.
- **6 demo sites** deployed to Vercel: Forma (ecommerce), Meridian
  (dashboard), Atelier (editorial), Control (analytics), Wavefront (music),
  Mosaic (visual discovery).
- **Landing page + playground** at `arcana-ui.com` with visual token editor,
  ComponentGallery, D3 token-component relationship graph, export to JSON
  + CSS, and `?theme=` deep-link sync.
- **Version control + migration infrastructure:** `docs/migrations/` scaffold
  and `manifest.ai.json` `releaseHistory` array so AI agents can
  programmatically track breaking changes across releases.

### Added
- Version control + migration infrastructure: `docs/migrations/README.md` documents how AI agents should read `manifest.ai.json` for breaking-change metadata when upgrading between versions, and `docs/migrations/TEMPLATE.md` is the scaffold for every future release with breaking changes.
- `manifest.ai.json` — new top-level `releaseHistory` array records every past release (version, date, breaking changes, migration guide URL, one-line summary) so AI agents upgrading across multiple versions can walk the array forward and apply every guide in order.
- `packages/core/src/version.ts` — runtime-exposed `VERSION` constant, re-exported from the package entry point. Consumers, the CLI, and AI agents can now read the package version without touching the filesystem.
- Playground Token Editor: `Export CSS` button alongside existing `Export JSON`. Generates a ready-to-paste `:root { --token: value }` block (with a `[data-density="..."]` companion selector when the density override is set) so users can copy a tuned theme straight into their own stylesheet.
- Playground `?theme=` URL sync: switching presets from the Token Editor now rewrites the `?theme=` query param via `setSearchParams({ replace: true })`, so a refresh or shared URL preserves the active theme instead of reverting to the landing-page deep-link.

### Fixed
- Landing page and playground copy: replaced outdated "60+ components" language with the real, current count ("108 components") across `playground/index.html` meta tags (description, og:description, twitter:description), `playground/src/pages/Landing.tsx` hero subheadline, "Production Components" feature card, and "How it works" step copy, and `playground/src/App.tsx` Hero subheadline, `StatCard`, and FAQ accordion.
- Playground: removed stray `console.log('Undo!')` from the Toast "With action" demo in `playground/src/App.tsx`; undo now triggers a real restore toast.

### Added
- `@arcana-ui/mcp@0.1.0-beta.1` — new package: MCP (Model Context Protocol) server for Arcana UI. Gives AI agents (Claude Code, Cursor, Codex, Figma Make) programmatic access to component docs, theme presets, and token impact data. Seven tools: `list_components` (filter by category), `get_component` (full props + examples + token surface), `list_presets`, `get_preset` (complete JSON), `validate_theme` (structure + WCAG contrast), `generate_theme` (AI generation via Anthropic API or playground fallback), `get_token_impact` (blast-radius for any token). Ships all data bundled (manifest, token-map, 14 presets) as a fully self-contained 130 kB npm package. Setup: add one entry to `.claude/settings.json` → MCP active.
- `.claude/skills/arcana/SKILL.md` — Claude Code skill with complete Arcana reference: quick start, all 108 components with props tables and examples, 11 hooks, token system guide, 4 complete layout patterns (dashboard, marketing, ecommerce, editorial), all 14 preset descriptions + best-use guide, responsive breakpoints and mobile behavior, rules. 1,821 lines — sufficient to build a full multi-page application without external references.
- `scripts/generate-docs.mjs` Generator 8: copies `llms.txt` and `llms-full.txt` to `playground/public/` after generation so they are served at `/llms.txt` and `/llms-full.txt` on the Vercel deployment.

### Changed
- `llms.txt` — enhanced: components now grouped by category, density switching (`data-density`) added to Quick Start, resources section with GitHub / playground / manifest links.
- `llms-full.txt` — enhanced: added 4 complete layout pattern code examples (dashboard, marketing, ecommerce, editorial), full theme customization JSON guide, responsive breakpoints section with `useBreakpoint` example, density switching docs. 2370 lines (up from 2070).
- `vercel.json` — added `Content-Type: text/plain; charset=utf-8` and `Cache-Control` headers for `/llms.txt` and `/llms-full.txt` so AI crawlers receive correct MIME type.

### Added
- `demos/wavefront` — replaced all `placehold.co` collection and artist artwork with real Unsplash photos matched to each station's mood (night city, coastal sunset, piano, tropical highway, neon cityscape); added 2 new channels: "Sunset Drive" (Tame Impala, Beach House, Washed Out) and "Neo Seoul" (Bonobo, Four Tet, Bicep) bringing the total to 5 stations; added `@arcana-ui/demo-shared` dep and wired ThemeSwitcher (defaultTheme: "midnight").

### Added
- `@arcana-ui/cli@0.1.0-beta.1` — new package: command-line tool for scaffolding Arcana UI projects, validating themes, and managing presets. Three commands:
  - `arcana-ui init [name]` — interactive (or non-interactive via flags) project scaffolder. Pick framework (Vite + React + TS or Next.js App Router), theme (any of 14 presets), density, and one of 5 starter layouts (`dashboard`, `marketing`, `ecommerce`, `editorial`, `general`). Detects package manager from `npm_config_user_agent`, runs install, prints next-steps banner. All 5 layouts use real `@arcana-ui/core` imports and typecheck against the published package.
  - `arcana-ui validate <file>` — theme JSON linter. Checks structure (top-level shape), completeness (required semantic groups), reference resolution (`{primitive.x.y}` lookups), and WCAG AA contrast on 5 key foreground/background pairs. `--strict` promotes warnings to errors. Exits 1 on any error so it slots into CI.
  - `arcana-ui add-theme [preset]` — show the activation snippet (CSS import + `data-theme` attribute) for any of the 14 built-in presets. `--list` dumps all preset ids.
- `packages/cli/README.md` — full command reference with options tables and layout descriptions.

### Changed
- Root `README.md` — quickstart now leads with `npx @arcana-ui/cli init my-app` before the manual install instructions.
- `@arcana-ui/cli@0.1.0-beta.1` published to npm under the `beta` dist-tag. Installable via `npx @arcana-ui/cli init my-app`. All three Arcana packages (`@arcana-ui/tokens`, `@arcana-ui/core`, `@arcana-ui/cli`) are now live on the registry.

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
