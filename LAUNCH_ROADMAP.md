# Arcana UI - Launch Roadmap

> **Document:** Strategic launch plan for Arcana UI (v0.1.0 stable released)  
> **Prepared:** 2026-04-10  
> **Horizon:** 12 weeks (3 sprints of 4 weeks each)  
> **Audience:** Developers, investors, AI tool makers, open-source contributors

---

## 1. Current State Assessment

### Strengths
- **Architecture is solid.** Three-tier token system, 108 production-grade components, 14 theme presets, all tested and responsive. No technical debt in foundation.
- **AI integration complete.** manifest.ai.json, llms.txt (2,370 lines), Claude Code skill (1,821 lines), MCP server (7 tools), and CLI (init/validate/add-theme) all shipped and working.
- **Community ready.** MIT licensed, clean GitHub org, contributor guide, dual-licensed for commercial use possible.
- **Market timing.** v0 ecosystem locked into shadcn/ui. Codeium, GitHub Copilot, Claude Code users have no purpose-built option. This is the gap.
- **Deployed.** Landing page live, 6 demo sites deployed, playground live at arcana-ui.com, 4 npm packages available.

### Missing Pieces (Critical to Launch)
- **AI theme generation (P.5).** The headline differentiator. User says "Make a brand for a SaaS startup" and gets 2-3 theme options in 10 seconds. This lives in the playground. NOT BUILT YET. All GTM depends on this.
- **Documentation site (5.5).** Every launch needs docs. Auto-generated from manifest.ai.json. Needed for SEO, onboarding, investor credibility. NOT BUILT YET.
- **Performance (5.9).** Tree-shaking broken (import Button = 278 kB unpacked). Fixes known (per-component entry points), not implemented.
- **Test reliability.** 16 useTheme tests fail (localStorage.clear mock issue). Small fix, big credibility hit if unfixed at launch.
- **External repos (5.7).** Two repos under Arcana-UI org to serve as real-world validation and marketing. Specifications exist, not built.
- **DESIGN.md export.** Ride the trend (4.3k GitHub stars in 3 days). Export Arcana tokens as DESIGN.md. Quick win.

### What's Working Well
- Playground token editor (HSV picker, bezier editor, undo/redo, search).
- Component audit shows 91% internal dogfooding (35+ Arcana components in playground UI).
- CLI user experience solid (5 starter layouts × 2 frameworks, all typecheck).
- MCP server has good coverage (list/get components + presets, validate, generate, impact analysis).
- Landing page drives traffic (responsive, 10 sections, SEO tags).

### Honest Gaps
- No paid/commercial options discussed. "Open source forever" is the message, but Arcana needs runway.
- Discord/community coordination missing. GitHub Discussions exist but unmodeated.
- Investor story weak. Missing: unit economics, GTM strategy, defensibility thesis.
- Competition response plan missing. shadcn shipped MCP this week. What's the differentiation we lead with? Answer: AI theme generation uniqueness.

---

## 2. Sprint Plan (12 Weeks / 3 Sprints)

### Sprint 1: The Differentiator (Weeks 1-4)

**Goal:** Ship P.5 (AI theme generation) and fix reliability issues. Make the playground a tool AI agents recommend.

#### Tasks

**1.1 P.5 - AI Theme Generation Flow**
- Playground new route: `/gen` (theme generator)
- Hero input: "What's your brand like? (e.g., fintech startup, indie games, luxury spa)"
- Backend: Vercel Edge Function calls Anthropic API (claude-3-5-sonnet) with system prompt
  - System: Arcana token spec, 5 example themes, constraints (semantic naming, WCAG AA contrast on 5 key pairs)
  - User: Brand description + target category (dashboard / marketing / editorial / ecommerce)
  - Output: JSON array of 3 theme options with names + descriptions
- Rate limiting: 10 gen/user/day (track by IP + localStorage fallback)
- Cost control: Edge function returns early if API errors (fallback: use a prebuilt theme)
- Landing: User picks one, theme auto-applies in editor, modal prompts "Edit this or generate new"
- UX: Animated loader (3-4s typical), polished error handling, "Generate" button with loading state
- Success metric: Can generate a usable theme in <10 seconds

**Definition of Done:**
- [ ] Edge function deployed and responding
- [ ] Playground `/gen` route renders hero + input + results
- [ ] Three theme options generated and displayable in editor
- [ ] Rate limiting works and shows user remaining quota
- [ ] Error handling shows helpful message (no raw API errors)
- [ ] Mobile UX tested (textarea + button responsive)
- [ ] Analytics: track generation requests, errors, user picks (for future monetization)

**Estimate:** 3-4 days (1 dev, AI agents can parallelize: Edge function, Frontend, Analytics)

---

**1.2 Fix useTheme Test Failures**
- Root cause: vitest jsdom environment, `localStorage.clear()` not mocked
- Fix: Add `beforeEach(() => localStorage.clear())` or mock `storage` object properly
- All 16 tests in `packages/core/src/hooks/useTheme.test.tsx` should pass
- Verify: `pnpm test` 100% pass

**Definition of Done:**
- [ ] 16 tests passing
- [ ] No skipped tests
- [ ] localStorage behavior consistent across all tests

**Estimate:** 1 day

---

**1.3 Performance Quick-Wins (Tree-Shaking)**
- Tracked in KNOWN_ISSUES.md as beta.3 priority
- Per-component entry points in `packages/core/tsup.config.ts`
- Target: import Button alone = <50 kB (vs 278 kB today)
- Verification: `npm pack --dry-run` and `import { Button }` test in quickstart
- Bump to 0.1.1 after merge

**Definition of Done:**
- [ ] Per-component entry points implemented
- [ ] Tree-shaking verified (single import = <50 kB)
- [ ] All 958 tests still pass
- [ ] `pnpm build` green

**Estimate:** 2 days

---

**1.4 Playground Polish**
- Remove "Coming soon" badges (P.5 is done, P.6 theme gallery postponed to Sprint 2)
- Add social share buttons to theme generation results
- Verify all 6 demo site links work from component preview cards
- Update footer with Sprint 1 launch date + version

**Definition of Done:**
- [ ] No "Coming soon" except 5.8, 5.9, 5.10, 5.11 features
- [ ] Share buttons tested (Twitter, LinkedIn, copy)
- [ ] All external links 200 OK

**Estimate:** 1 day

---

**Sprint 1 Completion Criteria:**
- `pnpm test` = 100% pass
- `pnpm lint` = 0 errors
- `pnpm build` = green
- AI theme generation live on arcana-ui.com `/gen`
- CHANGELOG.md updated
- PR merged to develop, back-merged to main if released

---

### Sprint 2: Credibility Layer (Weeks 5-8)

**Goal:** Documentation, external repos, and DESIGN.md export. Make Arcana the reference for token-driven design.

#### Tasks

**2.1 Documentation Site (5.5)**
- New repo: `arcana-ui/docs` (or subdirectory `docs/site` in main repo)
- Framework: Next.js or Astro (static generation preferred for fast load)
- Content sources: Auto-generate from manifest.ai.json
  - Component pages (one per component): props, usage examples, accessibility notes, token references, responsive behavior
  - Token browser: search/filter all 2,600+ CSS variables by category
  - Preset gallery: all 14 themes with HSL/OKLCH values, use cases, comparisons
  - Getting started: CLI init walkthrough, theme setup, migration guides
  - Architecture: three-tier token system explained with diagrams
  - Examples: 4 layout patterns (dashboard, landing, blog, ecommerce) with interactive previews
- SEO: Structured data (schema.org for components), OG images per preset
- Deployment: Vercel (auto-deploy from main branch)
- Success metric: >80% search traffic from "Arcana UI token design system" queries

**Definition of Done:**
- [ ] Docs site deployed at docs.arcana-ui.com
- [ ] All 108 components have individual pages
- [ ] Token browser is searchable and filterable
- [ ] 14 presets gallery with visual previews
- [ ] Getting started guide has zero friction (takes <10 min to init project)
- [ ] Mobile responsive
- [ ] 0 broken internal links
- [ ] Schema.org structured data present
- [ ] OG images generated for social sharing
- [ ] Dark/light theme toggle works
- [ ] Performance score >90 (Lighthouse)

**Estimate:** 2 weeks (can parallelize content generation from manifest)

---

**2.2 External Repo 1: Arcana Starters (arcana-ui/starters)**
- Purpose: Templates for common app archetypes using Arcana from npm
- Five starter templates:
  1. **Dashboard Starter** (Next.js + TypeScript)
     - Uses Arcana tokens in global styles
     - 3 pages: home, users, settings
     - Uses 15 components (card, button, table, form, etc.)
     - Real data mock (faker.js)
  2. **SaaS Landing** (Astro + TailwindCSS)
     - Wait, no Tailwind. Astro + vanilla CSS using Arcana tokens
     - 5 sections: hero, features, pricing, FAQ, CTA
     - All components from Arcana
  3. **Blog** (Remix + Markdown)
     - MDX support, theme-aware prose styling
     - Article listing + detail pages
     - Editorial preset applied by default
  4. **E-commerce Product Page** (Vite + React)
     - Product gallery, cart, checkout preview
     - Commerce theme applied
     - Mobile-first checkout flow
  5. **Admin Panel** (Next.js + Forms)
     - 4 pages: dashboard, users, analytics, settings
     - All form patterns from Arcana (select, input, date picker, etc.)
- Installation: Clone or use `npm create arcana@latest`
- Success metric: 100+ GitHub stars in 4 weeks

**Definition of Done:**
- [ ] All 5 starters deployed (GitHub repos, live previews on Vercel)
- [ ] Each starter installs Arcana from npm (not monorepo link)
- [ ] Each starter has README with screenshots, setup instructions, customization guide
- [ ] All starters responsive at 320px, 768px, 1280px
- [ ] TypeScript: all starters strict mode
- [ ] Tests: each starter has 3+ vitest tests
- [ ] No hardcoded colors (all Arcana tokens)
- [ ] Performance: Lighthouse >85 on all starters
- [ ] Deployable to Vercel with zero config
- [ ] Linked from main README

**Estimate:** 1.5 weeks (parallelize across starters; reuse shared components)

---

**2.3 External Repo 2: Arcana Examples (arcana-ui/examples)**
- Purpose: Advanced examples for developers learning Arcana internals
- Five examples:
  1. **Custom Theme Preset** (JSON + CSS build)
     - Shows how to create a new preset from scratch
     - Explains token hierarchy, color choices, motion personality
  2. **Token-Driven Dark Mode** (React + hooks)
     - useTheme hook usage, switching presets at runtime
     - Explains localStorage persistence
  3. **Density Switching** (Compact/Default/Comfortable)
     - Dashboard example with density toggle
     - Shows how one token change scales entire app
  4. **Color System Deep Dive** (OKLCH, contrast validation)
     - Script to visualize color scale
     - Explains perceptual uniformity
     - Contrast checker (WCAG AA pass/fail)
  5. **Component Composition** (Real app building)
     - Building a feature-complete app (e.g., Kanban board)
     - Shows best practices for component API usage
- All examples include: working code, detailed comments, explanation doc, test cases
- Success metric: Used as reference in 50+ community projects

**Definition of Done:**
- [ ] All 5 examples working and deployed
- [ ] Each has detailed README explaining the pattern
- [ ] All examples have TypeScript strict mode
- [ ] No console warnings or errors
- [ ] Linked from docs site
- [ ] GitHub topic: `arcana-ui-example`

**Estimate:** 1 week (parallelize)

---

**2.4 DESIGN.md Export Feature**
- New button in playground token editor: "Export as DESIGN.md"
- Generates a DESIGN.md file (the 4.3k-star standard format) from current theme
- Captures:
  - Color palette (hex + names)
  - Typography (font families + sizes)
  - Spacing scale
  - Border radius, shadows
  - Animation durations + easings
- Format follows https://www.designmd.io/ standard
- Downloadable + copyable to clipboard
- Success metric: Featured in DESIGN.md community (gets stars)

**Definition of Done:**
- [ ] Export button visible in token editor
- [ ] Generated DESIGN.md validates against schema
- [ ] File is human-readable (proper formatting)
- [ ] Download + clipboard copy both work
- [ ] Mobile-friendly workflow
- [ ] Example DESIGN.md in repo for reference

**Estimate:** 2-3 days

---

**2.5 Documentation Polish**
- Update main README with docs link
- Add CONTRIBUTING.md (expanded contributor guide)
- Create COMMUNITY.md (feature request process, governance)
- Update RELEASING.md with new maintainer runbook

**Definition of Done:**
- [ ] All docs linked from main README
- [ ] Contributor guide has zero blockers for first-time contributors
- [ ] Feature request template in GitHub Issues
- [ ] Release process documented for future maintainers

**Estimate:** 3 days

---

**Sprint 2 Completion Criteria:**
- Docs site live and >80 Lighthouse score
- 2 external repos deployed (starters + examples)
- DESIGN.md export working
- All 958 tests pass
- CHANGELOG updated
- PR merged, back-merged to main if released

---

### Sprint 3: Distribution & Launch (Weeks 9-12)

**Goal:** Get Arcana in front of AI agents and developers. Launch + GTM push.

#### Tasks

**3.1 README Overhaul & Competitive Positioning**
- Add comparison table: Arcana vs shadcn vs Chakra vs Material Design
  - Comparison dimensions: AI-readiness, token system, theme presets, component count, mobile support, tree-shaking, CSS vars only, semantic naming
- Lead with AI theme generation as headline
- Add "Why AI Agents Choose Arcana" callout box
- Include demo GIF of theme generation flow
- Update project identity section with latest stats (108 components, 14 presets, 4 npm packages)
- Add social proof placeholders (GitHub stars, npm downloads) with current metrics
- New "Quick Start" section: CLI init in 3 commands
- "Built with Arcana" section (link to starters + examples)

**Definition of Done:**
- [ ] README has competitive positioning
- [ ] All stats current (108 components, 14 presets, versions)
- [ ] Quick start takes <5 minutes
- [ ] GIF of theme generation embedded
- [ ] Links to all external repos visible
- [ ] "Why Arcana" section targets AI tool makers specifically

**Estimate:** 2 days

---

**3.2 AI Tool Integration (Claude, Cursor, Copilot, v0)**
- Submit Arcana to Claude marketplace (if a formal "skills" listing exists; else: ensure llms.txt + MCP are linked in README)
- Create pitch document for v0.dev (show how Arcana solves their "design system is missing" problem)
- Reach out to Cursor team: "Consider recommending Arcana for project initialization"
- GitHub Copilot integration: Ensure `llms.txt` is discoverable in repo root
- Write short blog post: "How to Use AI to Build a UI with Arcana" (target: dev.to, Hacker News)
- PR review for any community interest in MCP or skill improvements

**Definition of Done:**
- [ ] Claude marketplace listing (or marketplace equivalent)
- [ ] MCP server linked prominently in README
- [ ] `@arcana-ui/cli init` works from Copilot + Claude Code
- [ ] Blog post published on dev.to + cross-posted to Medium
- [ ] Hacker News ready (link to blog or GitHub)
- [ ] Tracked: inbound links from AI tools + referral metrics

**Estimate:** 1 week (mostly async outreach)

---

**3.3 SEO & Discoverability (5.6)**
- Update OG images: Landing page, 4 demo sites, docs site (use Arcana design tokens for consistency)
- Add structured data: schema.org/SoftwareApplication for main page
- Add structured data: schema.org/Component for each component page
- Blog post on Arcana blog: "The Token System Behind Arcana"
- Keyword targets: "token design system", "AI-ready design system", "CSS custom properties components"
- Backlinks: Reach out to design system blogs (Design System Podcast, Design Systems Repo, etc.)
- Verify sitemap.xml on all sites
- Google Search Console setup (if not already done)

**Definition of Done:**
- [ ] All OG images generated and deployed
- [ ] Schema.org markup present + valid
- [ ] Blog post published + indexed
- [ ] Sitemap present on docs + playground + demos
- [ ] GSC showing 1000+ indexed pages
- [ ] 0 crawl errors

**Estimate:** 1 week

---

**3.4 Community & Contributor Onboarding (5.7)**
- Create GitHub Discussions categories: Announcements, Show & Tell, Questions, Feature Ideas
- Add contributor rewards (stickers, README credits, etc.)
- Create "Good First Issue" label + backlog (10-15 items)
- Discord or Slack community (start with GitHub Discussions, upgrade if engagement justifies)
- Monthly community call (optional, async-first focus)
- "Arcana Certified" badge for projects using Arcana (opt-in marketing)

**Definition of Done:**
- [ ] Discussions moderated + active
- [ ] 10+ "Good First Issue" items
- [ ] Community guide published
- [ ] First community contributor thanked publicly
- [ ] Growth: 50+ GitHub stars from community in 2 weeks post-launch

**Estimate:** 1 week setup, ongoing moderation

---

**3.5 Performance Audit (5.9)**
- Full Lighthouse run on: playground, docs, 2 demo sites, 1 starter
- Target: >85 on all (90+ preferred)
- Profiling: Investigate slow components, heavy dependencies, unused CSS
- Optimization: Code split large pages, defer non-critical JS, image optimization
- Bundle analysis: Verify tree-shaking working in real apps
- Metrics dashboard: Track Core Web Vitals over time

**Definition of Done:**
- [ ] All audited sites >85 Lighthouse
- [ ] Core Web Vitals in green
- [ ] Bundle size report in docs
- [ ] Performance regression tests in CI (if time permits)

**Estimate:** 5-6 days

---

**3.6 Launch Checklist (5.10)**
- Go/no-go decision criteria:
  - All tests pass
  - Performance >85 Lighthouse on 3+ sites
  - Zero open critical bugs
  - Docs complete
  - 2 external repos deployed
  - 100+ GitHub stars on main repo
- Launch day:
  - Ship release v0.1.0 (or v0.2.0 if needed)
  - Post on Product Hunt (needs 6+ months of use first; skip if launch is first time)
  - Publish blog: "Arcana UI 0.1 is here"
  - Tweet from project account + community retweets
  - Reach out to design system podcasts + blogs for interviews
  - Post on Hacker News (timing: Tuesday 10 AM EST)
  - Email design system folks (Steve Schoger, Brad Frost, etc.) with link
- Post-launch (week 13+):
  - Daily monitoring: GitHub stars, npm downloads, Discord/discussions activity
  - Respond to every early user question (critical for momentum)
  - Gather feedback: collect feature requests, prioritize for 0.2
  - Maintain 0.1.x branch for backport fixes
  - Start roadmap for 0.2 (Figma plugin, Tailwind integration, etc.)

**Definition of Done:**
- [ ] Checklist signed off
- [ ] Launch blog post live
- [ ] Product Hunt live (optional)
- [ ] 100+ stars within 48 hours
- [ ] 0 critical bugs in launch version
- [ ] Community responses monitored daily

**Estimate:** 2-3 days launch prep, ongoing monitoring

---

**Sprint 3 Completion Criteria:**
- README competitive positioning done
- Docs + starters + examples deployed and linked
- SEO live (OG images, schema, backlinks)
- Community channels open
- Performance >85 on 3+ sites
- Launch day successful (Product Hunt + HN + blog)

---

## 3. External Repo Specifications

### Arcana Starters (arcana-ui/starters)

**Purpose:** Jumpstart development with Arcana. Answer "How do I build X with Arcana?"

**Repo Structure:**
```
starters/
├── README.md (matrix: framework × template, quick links)
├── dashboard-nextjs/ (Next.js + TypeScript)
├── landing-astro/ (Astro, vanilla CSS + Arcana)
├── blog-remix/ (Remix + MDX)
├── ecommerce-vite/ (Vite + React)
└── admin-nextjs/ (Next.js + forms)
```

**Requirements:**
- Each starter installs `@arcana-ui/core`, `@arcana-ui/tokens` from npm (real registry, not monorepo)
- Zero hardcoded colors (all Arcana tokens via `var(--token)`)
- Responsive at 320px, 768px, 1280px (Playwright tests verify)
- TypeScript strict mode
- All components from Arcana (no external UI libraries)
- README: setup, customization, theme switching, deployment
- Vercel-ready (optional `vercel.json`)
- GitHub Actions CI: lint, test, build

**Success Metrics:**
- 100+ GitHub stars in 4 weeks
- Used as reference in 20+ community projects (tracked via search)
- 0 open issues after 1 week

---

### Arcana Examples (arcana-ui/examples)

**Purpose:** Learn Arcana internals through working code.

**Repo Structure:**
```
examples/
├── README.md (overview + links)
├── custom-theme-preset/
├── dark-mode-switching/
├── density-modes/
├── color-system/
└── component-composition/
```

**Requirements:**
- Each example is standalone (can be cloned individually)
- Detailed README (500-1000 words) explaining the pattern
- Working code (no "incomplete" examples)
- TypeScript with strict mode
- Tests: 3+ vitest tests per example
- Comments inline (explain "why", not "what")
- Links to relevant docs pages
- Responsive (mobile-first)

**Success Metrics:**
- Used as reference in 50+ projects
- 10+ community PRs adding new examples
- 0 "How do I...?" questions that aren't already answered by examples

---

## 4. Success Metrics (Definition of "Launched")

### Numeric Targets (4 Weeks Post-Launch)

| Metric | Target | How It's Measured |
|--------|--------|-------------------|
| GitHub Stars | 150+ | GitHub API |
| npm Downloads (@arcana-ui/core) | 1,000+ | npm registry API |
| npm Downloads (@arcana-ui/cli) | 500+ | npm registry API |
| Docs Site Traffic | 2,000+ monthly unique visitors | Vercel Analytics |
| Playground Theme Gens | 100+ | In-app analytics |
| External Starters Stars | 50+ each (minimum) | GitHub API |
| Discord/Community Members | 50+ | Discord/GitHub Discussions |
| Blog Post Views | 500+ on launch post | dev.to + Medium analytics |
| Hacker News Ranking | Top 30 (if posted) | HN search |
| Product Hunt (if launched) | Top 15 Design Tools | PH ranking |

### Qualitative Targets

- [ ] At least 3 community projects use Arcana publicly (link in showcase)
- [ ] At least 1 AI tool (Claude, Cursor, Copilot, v0) recommends Arcana in conversation
- [ ] At least 2 design system practitioners mention Arcana positively on Twitter/LinkedIn
- [ ] Contributor: First pull request from community (not maintainer)
- [ ] Press: At least 1 mention in design system newsletter or podcast
- [ ] Investor interest: Minimum 5 inbound conversations from VC/angels (if applicable)

### Reliability Targets

- [ ] 100% test pass rate (958/958)
- [ ] 0 critical issues in GitHub Issues
- [ ] Lighthouse >85 on all demo sites
- [ ] Core Web Vitals in "Good" range (CLS <0.1, LCP <2.5s, FID <100ms)
- [ ] npm package @arcana-ui/core stable (no breaking changes in 0.1.x)

---

## 5. Risk Register

### High-Risk Items

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-----------|
| **AI theme generation API costs spike** | Medium | High | Rate limit to 10 gen/user/day, use edge function for early exit on errors, monitor spend daily first week. Fallback: use prebuilt theme if API fails. |
| **Tree-shaking not working at consumer level** | Low | High | Implement per-component entry points in Sprint 1, not Sprint 2. Test in real consumer app (quickstart). Verify before launch. |
| **Documentation site too complex, takes 2+ weeks** | Medium | Medium | Use template (Starlight, Nextra, or shadcn docs copy). Auto-generate from manifest.ai.json. Start with 30% coverage, grow post-launch. |
| **Starters don't deploy cleanly to Vercel** | Low | Medium | Test each starter deployment to Vercel before launch week. Add vercel.json to each. Document environment variables. |
| **No community interest (GitHub stars plateau <100)** | Low | High | Launch on HN + Product Hunt simultaneously. Reach out directly to 20 design system practitioners. Do a demo on YouTube. |
| **shadcn ships competing features** | High | Medium | Lead with AI theme generation (unique). Emphasize semantic tokens + DESIGN.md export. Faster iteration = advantage. |
| **Anthropic API rate limiting or quota issues** | Low | High | Set up API monitoring. Configure fallback themes. Contact Anthropic support 1 week before launch to whitelist endpoints if needed. |
| **Browser cache issues with theme generation** | Low | Low | Clear localStorage on generation, test incognito mode, verify localStorage quota. |
| **Docs site SEO doesn't pick up (0 organic traffic)** | Medium | Medium | Post 4-5 blog articles pre-launch. Build backlinks via design system blogs. Use schema.org markup. Monitor GSC weekly. |

### Medium-Risk Items

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-----------|
| **Performance: demo sites load slowly on 3G** | Medium | Low | Limit animation on slow network (prefers-reduced-motion), defer ads/analytics, optimize images. Test on Lighthouse slow 3G. |
| **Community feels design system is missing feature X** | High | Low | Gather feedback in first week. Create "0.2 Backlog" issue. Show responsiveness to issues (respond in <24h). |
| **Contributor onboarding friction** | Medium | Low | Create "Good First Issue" template. Pair first contributors with mentor issues. Fast-track reviews. |
| **Vercel deployment cost spike** (if popular) | Low | Low | Monitor usage. Set up billing alerts. Migrate to self-hosted if needed. Document cost trade-offs. |

### Low-Risk Items
- Monorepo complexity (tooling is solid, proven)
- TypeScript compilation (strict mode, tested)
- CSS variables browser support (99%+ coverage in target browsers)
- Accessibility compliance (audited, WCAG AA verified)

---

## 6. Dependencies & Assumptions

### Hard Dependencies (Must Be Done)
1. **Sprint 1 must ship before Sprint 2 starts** (AI theme generation is the GTM story)
2. **Anthropic API key access** required by mid-Sprint 1 (for AI theme generation)
3. **Vercel deployment** for edge functions (hard to replicate elsewhere)
4. **GitHub org (arcana-ui)** for external repos (org exists already)

### Soft Dependencies (Nice to Have)
- Design system podcast appearances (increases credibility but not required)
- Figma Code Connect integration (5.8, deferred to 0.2)
- Commercial licensing discussion (deferred post-launch)

### Assumptions
- **Development capacity:** 1 full-time maintainer (Bear) + AI agents (Claude Code, parallel work)
- **Infrastructure:** Vercel free tier sufficient for launch (monitor if starters go viral)
- **Community:** GitHub Discussions will self-moderate initially (hire community manager in 0.2 if needed)
- **Funding:** Project is unfunded. No marketing budget. Organic growth strategy.

---

## 7. Timeline & Milestones

### Pre-Launch (Weeks 1-4: Sprint 1)
- **Week 1 end:** P.5 AI theme generation live in playground, 50% of tests passing
- **Week 2 end:** All tests passing, performance fixes in progress
- **Week 3 end:** Playground polished, PR reviewed + merged
- **Week 4 end:** Sprint 1 PR merged to main, v0.1.1 released (if tree-shaking fix ready)

### Launch Prep (Weeks 5-8: Sprint 2)
- **Week 5 end:** Docs site deployed, 80% coverage
- **Week 6 end:** 2 external repos deployed (starters)
- **Week 7 end:** Examples repo deployed, DESIGN.md export working
- **Week 8 end:** All docs + repos linked, Sprint 2 PR merged to main

### Launch & GTM (Weeks 9-12: Sprint 3)
- **Week 9 end:** README overhauled, AI tool outreach sent
- **Week 10 end:** Blog post live, SEO live
- **Week 11 end:** Performance audit done, launch checklist signed off
- **Week 12 end:** Launch day (HN + Product Hunt + blog), monitor metrics

### Post-Launch (Week 13+)
- Daily monitoring of GitHub, npm, community channels
- Bug fixes in 0.1.x branch (if needed)
- Start planning 0.2.0 roadmap based on feedback

---

## 8. Next Steps (Immediate Actions)

### For the Next Agent
1. Read this document completely.
2. Read PROGRESS.md, ROADMAP.md, CLAUDE.md, AI_OPS.md (in that order).
3. Verify v0.1.0 is merged to main + published to npm (run: `npm view @arcana-ui/core versions`).
4. Branch from develop: `git checkout -b feat/1.1-ai-theme-generation` (or similar name matching current sprint).
5. Implement Sprint 1 tasks in parallel (Edge function, Frontend, Tests, Performance) using multi-agent pattern if available.
6. Daily standup: Check progress against this roadmap. Update PROGRESS.md at end of day.
7. Weekly review: Check metrics, adjust timeline if needed, communicate blockers.

### For Bear (Maintainer)
1. Share this document with stakeholders (investors, advisors).
2. Ensure Anthropic API key is available for Sprint 1.
3. Monitor GitHub stars + npm downloads daily starting week 9.
4. Approve PRs for starters + examples by end of Sprint 2.
5. Post launch blog post by week 11 + promote on Twitter + LinkedIn.
6. Plan v0.2.0 backlog based on community feedback (week 13+).

---

## 9. Appendix: Competitive Positioning

### Why Arcana Wins

| Dimension | Arcana | shadcn/ui | Chakra | Material |
|-----------|--------|-----------|--------|----------|
| **AI Theme Generation** | Yes (P.5) | No | No | No |
| **Token System Depth** | 3-tier, 2,600 vars | Flat Tailwind | Flat JS | Layered (complex) |
| **Mobile Support** | 100% (5 breakpoints) | 100% | 100% | 100% |
| **Presets** | 14 production themes | 3 basic | 1 (configurable) | 1 (configurable) |
| **Framework Agnostic** | Yes (pure CSS) | No (Tailwind) | Somewhat (Chakra.Provider) | Somewhat (Material Context) |
| **AI-Ready API** | Yes (manifest + llms.txt + MCP) | Emerging (MCP just shipped) | No | No |
| **Tree-Shaking** | Working (0.1.1) | Native Tailwind | Partial | Partial |
| **Learning Curve** | Shallow (tokens first) | Shallow (copy-paste) | Medium | High |
| **Semantic Naming** | Yes (designed for AI) | No (utility classes) | Medium | Yes |
| **Community** | New (growing) | Large | Large | Very large |

**Arcana's unique position:** "The design system built for AI agents. Start with a description of your brand, get a production-ready theme in 10 seconds. No Tailwind, no setup, no compromise."

---

**Document Complete.** Last updated 2026-04-10.
