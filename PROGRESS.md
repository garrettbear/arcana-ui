# Arcana UI — Progress Tracker

> **Last updated:** 2026-04-06 (package audit session)
> **Current sprint:** Week 1 launch sprint — Developer experience / package audit
> **Source of truth for current state:** CLAUDE.md "Current State" section
> **Next priority task:** Sprint 2 — AI Theme Generation (after beta.2 publish)

---

## Phases 0–3: Complete

All foundation work, token system, component library (68 components), 14 theme presets, test infrastructure, CI/CD, and npm publish are done. See CLAUDE.md for details.

---

## Phase 4: Demo Sites ✅ COMPLETE (2026-04-03 to 2026-04-04)

- [x] 4.1 — Manifest generator: type alias resolution, skip filter fixes (commit `2ddea82`)
- [x] 4.2 — Component audit: 68 components, 95.6%→100% manifest coverage (`.sage/COMPONENT_AUDIT.md`)
- [x] 4.3 — Demo: Forma — luxury ecommerce (`commerce` theme, 4 pages, 47 components)
- [x] 4.4 — Demo: Wavefront — music player (`midnight` theme, sidebar + player bar, 3 views)
- [x] 4.5 — Demo: Mosaic — visual discovery app (`light` theme, masonry grid, 3 pages)
- [x] 4.6 — Demo: Atelier — editorial magazine (`editorial` theme, zero-radius, real prose, 3 pages)
- [x] 4.7 — Demo: Control — component analytics dashboard (`dark` theme, 4 pages, full registry)
- [ ] 4.8 — Deploy all 5 demos to Vercel (**Bear action: needs Vercel CLI or manual deploy**)
- [ ] 4.9 — ComponentGallery: wire live manifest coverage data (currently hardcoded 95.6%)
- [ ] 4.10 — Add `vercel.json` to each demo for zero-config Vercel import

---

## Phase P: Playground Product

- [x] P.1 — Landing page (original Vercel deploy live)
- [x] P.2 — ComponentGallery with stats bar, richer cards, audit table mode
- [x] P.3 — Visual token editor (color pickers, sliders)
- [x] P.4 — Live component preview with category filter
- [ ] P.5 — AI theme generation flow (Sprint 2)
- [ ] P.6 — Theme gallery (browse presets, one-click load, fork)
- [ ] P.7 — Authentication (GitHub + Google OAuth)
- [ ] P.8 — Theme save/load
- [ ] P.9 — Export (JSON, CSS, starter project)
- [ ] P.10 — Monetization infrastructure
- [ ] P.11 — AI generation rate limiting
- [ ] P.12 — Accessibility panel (live WCAG scoring)

---

## Phase 5: AI Integration & Launch

- [x] 5.1 — manifest.ai.json (generated, fixed, 100% coverage)
- [x] 5.2 — llms.txt + llms-full.txt (file exists in repo root)
- [ ] 5.3 — Claude Code skill (planned, not published to Clawhub)
- [ ] 5.4 — MCP server
- [ ] 5.5 — Documentation site
- [ ] 5.6 — SEO & discoverability
- [ ] 5.7 — Community starter templates (Next, Vite, Remix, Astro)
- [ ] 5.8 — Figma Code Connect + token export
- [ ] 5.9 — Performance audit
- [ ] 5.10 — Launch checklist
- [ ] 5.11 — CLI: npx arcana-ui init

---

## 8-Week Sprint Plan Status

| Sprint | Goal | Status |
|--------|------|--------|
| 1 | Playground to demo quality + demo sites | ✅ Done |
| 2 | AI theme generation | Not started |
| 3 | MCP server + llms.txt + Claude Code skill | Not started |
| 4 | CLI MVP + Figma Code Connect | Not started |
| 5 | Launch | Not started |

---

## Open Blockers

| Blocker | Owner | Status |
|---------|-------|--------|
| `npm publish` of `@arcana-ui/core@0.1.0-beta.2` and `@arcana-ui/tokens@0.1.0-beta.2` | Bear | Waiting on maintainer — agents cannot publish |
| Vercel deploy for 5 demo sites | Bear | Pending |
| OpenClaw gateway re-pairing | Bear | Pending |
| Anthropic API key for AI generation (Sprint 2) | Bear | Not yet needed |
| Vercel CLI configured | Bear | Not yet needed |

---

## Package Audit (2026-04-06)

- [x] Consumer-test `@arcana-ui/core@beta` + `@arcana-ui/tokens@beta` from a fresh project outside the monorepo
- [x] Document all findings in CHANGELOG.md and KNOWN_ISSUES.md
- [x] Fix `@arcana-ui/tokens` exports map (added `./styles`, `./dist/*`, `./package.json`)
- [x] Fix `@arcana-ui/core` exports map (added `./dist/*`, `./package.json`)
- [x] Bump both packages to `0.1.0-beta.2`
- [x] Rebuild; `npm pack --dry-run` lists only `dist/` + `package.json`
- [x] Write `docs/QUICKSTART.md` (consumer doc + CLI spec)
- [x] Commit `examples/quickstart/` (reproducible consumer test fixture)
- [ ] Publish beta.2 to npm (**Bear action**)
- [ ] Re-verify after publish: `cd examples/quickstart && npm install && npm run build`
- [ ] Follow-up: per-component entry points in `tsup.config.ts` to fix tree-shaking (tracked in KNOWN_ISSUES.md for beta.3)
