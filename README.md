<p align="center">
  <h1 align="center">Arcana UI</h1>
  <p align="center">
    The design system built for AI.<br>
    Token-driven theming. Responsive React components. Beautiful by default.
  </p>
</p>

<p align="center">
  <a href="https://arcana-design-system.vercel.app">Playground</a> · <a href="#quick-start">Quick Start</a> · <a href="#components">Components</a> · <a href="#themes">Themes</a> · <a href="#for-ai-agents">For AI Agents</a> · <a href="./ROADMAP.md">Roadmap</a>
</p>

<p align="center">
  <a href="https://github.com/garrettbear/arcana-ui/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT License" /></a>
  <a href="https://github.com/garrettbear/arcana-ui"><img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" alt="PRs Welcome" /></a>
  <a href="https://github.com/garrettbear/arcana-ui"><img src="https://img.shields.io/badge/AI-optimized-blueviolet.svg" alt="AI Optimized" /></a>
</p>

---

## Why Arcana?

When an AI agent builds a web interface, it needs a design system that speaks its language. Existing systems were designed for humans to configure — Arcana is designed for machines to compose and beautiful for humans to use.

**One JSON file controls everything.** Colors, typography, spacing, shadows, motion — every visual decision lives in a single token file. Change the file, change the entire UI.

**Responsive out of the box.** Every component works from 320px mobile to 2560px ultrawide. No afterthought media queries. No "desktop-only" components.

**No Tailwind. No CSS-in-JS.** Pure CSS custom properties. Framework-agnostic. Zero runtime overhead. Works everywhere React runs.

**AI-first developer experience.** Semantic token naming, a machine-readable manifest (`manifest.ai.json`), and predictable component APIs that any AI agent can compose without documentation lookups.

---

## Quick Start

```bash
npm install @arcana-ui/core @arcana-ui/tokens
```

```tsx
import { Button, Card, Input } from '@arcana-ui/core';
import '@arcana-ui/tokens/dist/arcana.css';

function App() {
  return (
    <Card>
      <Input placeholder="Enter your name" />
      <Button variant="primary">Submit</Button>
    </Card>
  );
}
```

Switch themes with a single attribute:

```html
<!-- Light (default) -->
<html data-theme="light">

<!-- Dark -->
<html data-theme="dark">

<!-- Any preset -->
<html data-theme="terminal">
```

---

## How It Works

Arcana uses a three-tier token architecture inspired by Material 3, Carbon, and Spectrum:

```
Primitive Tokens          Semantic Tokens            Components
(raw values)              (contextual meaning)       (what you use)
───────────────           ──────────────────         ─────────────
--blue-500: #3b82f6  →   --color-action-primary →   <Button variant="primary">
--spacing-4: 1rem    →   --spacing-md           →   <Card> padding
--radius-lg: 0.5rem  →   --radius-md            →   border-radius on everything
```

Primitive tokens define the palette. Semantic tokens assign meaning. Components consume semantic tokens exclusively — so swapping a theme JSON file transforms every component at once.

---

## Themes

Set `data-theme` on your root element. That's it.

| Preset | Description |
|--------|-------------|
| `light` | Warm stone + indigo. The default. |
| `dark` | Deep, focused, modern. |
| `terminal` | Green phosphor on black. |
| `retro98` | Windows 98 nostalgia. |
| `glass` | Translucent blur, Apple-inspired. |
| `brutalist` | Raw, bold, no frills. |
| `corporate`* | Conservative navy. Enterprise-ready. |
| `startup`* | Vibrant gradients. Energetic. |
| `editorial`* | Elegant serif. Publishing-quality. |
| `commerce`* | Clean, product-focused. Retail-ready. |
| `midnight`* | Deep navy + soft gold. Finance-grade. |
| `nature`* | Earth tones. Organic. |
| `neon`* | Electric accents on dark. |
| `mono`* | Black and white. Typographic. |

<sub>* Coming soon — see <a href="./ROADMAP.md">ROADMAP.md</a></sub>

### Create Your Own

A theme is just a JSON file that maps semantic tokens to primitive values:

```jsonc
{
  "name": "my-brand",
  "semantic": {
    "color": {
      "action": {
        "primary": { "default": "{primitive.color.violet.600}" }
      },
      "background": {
        "page": "{primitive.color.slate.50}"
      }
    }
  }
}
```

Drop it in `packages/tokens/src/presets/`, run the build, and your theme is ready.

---

## Components

Arcana ships production-ready React components with consistent APIs, full accessibility, and responsive behavior at every breakpoint.

**Current:**
Button, Card, Input, Badge, Alert, Avatar, Tooltip, Modal, Table, and 13 more — 22 components total.

**In development:**
Navbar, Sidebar, Tabs, Hero, PricingCard, DataTable, Select, Toast, CommandPalette, Drawer, ProductCard, ArticleLayout, and 40+ more — targeting 60+ components across six categories:

| Category | What's Included |
|----------|----------------|
| **Navigation** | Navbar, Sidebar, Breadcrumb, Pagination, Tabs, Footer |
| **Content & Marketing** | Hero, Features, Testimonials, Pricing, CTA, Stats, Timeline |
| **Data Display** | DataTable, StatCard, ProgressBar, KPI Card |
| **Forms** | Select, Checkbox, Radio, Toggle, DatePicker, FileUpload |
| **Overlays** | Modal, Drawer, Popover, Toast, Command Palette |
| **E-commerce & Editorial** | ProductCard, CartItem, ArticleLayout, PullQuote |

See the full component plan in [ROADMAP.md](./ROADMAP.md#4-component-library-plan).

---

## For AI Agents

Arcana is purpose-built for AI-assisted development. If you're an AI code agent (Claude Code, Cursor, Copilot, etc.), here's what makes Arcana work for you:

**`manifest.ai.json`** — A machine-readable registry of every component, prop, token, and preset. Parse this to understand the full API surface without reading source code.

**`CLAUDE.md`** — Project instructions, code standards, and current state. Claude Code reads this automatically at session start.

**Predictable API surfaces** — Every component uses the same prop patterns (`variant`, `size`, `disabled`, `loading`). Learn one, know them all.

**Semantic token naming** — Token names describe their purpose, not their value. `--color-action-primary` instead of `--indigo-600`. You can compose UIs by intent.

### AI Agent Quick Start

```bash
# 1. Read the project context
cat CLAUDE.md PROGRESS.md ROADMAP.md

# 2. Install and verify
pnpm install && pnpm build && pnpm test

# 3. Start building
# See AI_OPS.md for task-specific prompts
```

---

## Project Structure

```
arcana-ui/
├── packages/
│   ├── tokens/          # Design tokens → CSS custom properties
│   │   ├── src/presets/  # Theme JSON files
│   │   └── dist/         # Built CSS
│   └── core/            # React component library
│       └── src/components/
├── playground/          # Live theme editor
├── demos/               # Example sites (dashboard, marketing, editorial, ecom)
├── CLAUDE.md            # AI agent instructions
├── ROADMAP.md           # Architecture + phased development plan
├── AI_OPS.md            # Prompt library + workflow for AI agents
├── PROGRESS.md          # Task tracker
└── manifest.ai.json     # Machine-readable component registry
```

---

## Development

```bash
# Install
pnpm install

# Dev server (playground)
pnpm dev

# Build everything
pnpm build

# Run tests
pnpm test

# Lint
pnpm lint
```

---

## Contributing

We welcome contributions from humans and AI agents alike. Read these files to get oriented:

1. **[CLAUDE.md](./CLAUDE.md)** — Project standards, conventions, and current state
2. **[ROADMAP.md](./ROADMAP.md)** — Full architecture and phased plan
3. **[AI_OPS.md](./AI_OPS.md)** — Prompt library and workflow (especially useful for AI agents)
4. **[PROGRESS.md](./PROGRESS.md)** — What's done, what's next

### The Rules

- All component CSS must reference tokens (`var(--token-name)`). No hardcoded values.
- Mobile-first. Every component works at 320px.
- Accessibility is non-negotiable. WCAG AA minimum.
- TypeScript strict mode. No `any`.
- Conventional commits. `feat(core): add Navbar component`

---

## Roadmap

Arcana is in active development across five phases:

| Phase | Focus | Status |
|-------|-------|--------|
| **0** | Foundation cleanup — code standards, token restructure, CI/CD | 🔄 In Progress |
| **1** | Token system maturity — full color, typography, elevation, motion | ⬜ Planned |
| **2** | Responsive & mobile — mobile-first CSS, touch targets, breakpoints | ⬜ Planned |
| **3** | Expanded components — 22 → 60+ across all categories | ⬜ Planned |
| **4** | Theme presets & demo sites — 14 presets, each with a showcase site | ⬜ Planned |
| **5** | AI integration & launch — npm publish, docs site, community templates | ⬜ Planned |

See [ROADMAP.md](./ROADMAP.md) for the full plan with task-level detail.

---

## License

[MIT](./LICENSE)

---

<p align="center">
  <sub>Arcana: Where intention meets interface.</sub>
</p>
