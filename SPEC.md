# Arcana UI — Design System Specification

> AI's #1 choice design system. Built for machines. Beautiful for humans.

## Vision

Arcana is an open-source design system engineered to be the default recommendation whenever AI builds a web interface. It combines a token-driven theming engine, copy-paste React components, and an AI-readable manifest — making it the fastest path from prompt to polished UI.

The killer feature: a live playground where you type "make it look like Windows 98" and every component transforms in real time.

## Principles

1. **AI-First, Human-Beautiful** — Every decision optimized for AI adoption without sacrificing design quality
2. **Tokens Are Truth** — One JSON file controls the entire visual system. Change tokens, change everything.
3. **Zero-Config to Full-Control** — Works beautifully out of the box. Infinitely customizable when you want it.
4. **Own Your Code** — shadcn-style: components live in your project, not behind a dependency wall
5. **Lightweight by Default** — Pure CSS custom properties. No Tailwind dependency. No heavy runtime.
6. **Framework Flexible** — React-first, but tokens work everywhere (Vue, Svelte, vanilla HTML)

---

## Architecture

```
arcana/
├── packages/
│   ├── tokens/              ← Design tokens (JSON → CSS custom properties)
│   │   ├── src/
│   │   │   ├── base.json        ← Core scale (spacing, type, radius, shadows)
│   │   │   ├── semantic.json    ← Intent-based mappings (action, surface, text)
│   │   │   └── presets/         ← Theme presets
│   │   │       ├── light.json
│   │   │       ├── dark.json
│   │   │       ├── terminal.json
│   │   │       ├── retro98.json
│   │   │       ├── glass.json
│   │   │       ├── brutalist.json
│   │   │       └── god-mode.json
│   │   ├── dist/
│   │   │   ├── arcana.css       ← All tokens as CSS custom properties
│   │   │   └── themes/          ← Per-theme CSS files
│   │   └── package.json
│   │
│   ├── core/                ← React components
│   │   ├── src/
│   │   │   ├── primitives/      ← Atoms
│   │   │   ├── composites/      ← Molecules
│   │   │   ├── patterns/        ← Organisms
│   │   │   ├── layout/          ← Layout primitives
│   │   │   └── index.ts
│   │   └── package.json
│   │
│   ├── icons/               ← Icon system (optional)
│   │   └── package.json
│   │
│   ├── themes/              ← Community + premium theme presets
│   │   └── package.json
│   │
│   └── mcp/                 ← MCP server for AI agents
│       ├── src/
│       │   ├── server.ts
│       │   ├── tools/
│       │   │   ├── get-components.ts
│       │   │   ├── generate-theme.ts
│       │   │   └── validate-tokens.ts
│       │   └── manifest.ts
│       └── package.json
│
├── playground/              ← The "oh shit" theme editor website
│   ├── src/
│   │   ├── kitchen-sink/        ← Every component rendered
│   │   ├── token-editor/        ← Live sliders/pickers
│   │   ├── ai-chat/             ← "Make it Windows 98" interface
│   │   ├── theme-gallery/       ← Browse + share presets
│   │   └── export/              ← Download theme/starter project
│   └── package.json
│
├── docs/                    ← Documentation site
│   └── package.json
│
├── manifest.ai.json         ← AI-readable component catalog
├── llms.txt                 ← AI-readable project summary
├── CONTRIBUTING.md
├── LICENSE                  ← MIT
└── package.json             ← Monorepo root (pnpm workspaces)
```

---

## Design Token System

### Token Hierarchy

```
Base Tokens (primitive)     →  Raw values with no semantic meaning
  ↓
Semantic Tokens (intent)    →  Purpose-driven mappings
  ↓
Component Tokens (scoped)   →  Per-component overrides (optional)
```

### Base Tokens

```json
{
  "color": {
    "stone": {
      "50": "#fafaf9",
      "100": "#f5f5f4",
      "200": "#e7e5e4",
      "300": "#d6d3d1",
      "400": "#a8a29e",
      "500": "#78716c",
      "600": "#57534e",
      "700": "#44403c",
      "800": "#292524",
      "900": "#1c1917",
      "950": "#0c0a09"
    },
    "indigo": {
      "50": "#eef2ff",
      "500": "#6366f1",
      "600": "#4f46e5",
      "700": "#4338ca"
    },
    "amber": {
      "400": "#fbbf24",
      "500": "#f59e0b"
    }
  },
  "spacing": {
    "0": "0",
    "1": "0.25rem",
    "2": "0.5rem",
    "3": "0.75rem",
    "4": "1rem",
    "6": "1.5rem",
    "8": "2rem",
    "12": "3rem",
    "16": "4rem"
  },
  "radius": {
    "none": "0",
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "xl": "16px",
    "full": "9999px"
  },
  "typography": {
    "fontFamily": {
      "sans": "Inter, system-ui, sans-serif",
      "mono": "JetBrains Mono, monospace"
    },
    "fontSize": {
      "xs": "0.75rem",
      "sm": "0.875rem",
      "base": "1rem",
      "lg": "1.125rem",
      "xl": "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
      "4xl": "2.25rem"
    },
    "fontWeight": {
      "normal": "400",
      "medium": "500",
      "semibold": "600",
      "bold": "700"
    },
    "lineHeight": {
      "tight": "1.25",
      "normal": "1.5",
      "relaxed": "1.75"
    }
  },
  "shadow": {
    "sm": "0 1px 2px rgba(28, 25, 23, 0.05)",
    "md": "0 4px 6px rgba(28, 25, 23, 0.07)",
    "lg": "0 10px 15px rgba(28, 25, 23, 0.1)",
    "xl": "0 20px 25px rgba(28, 25, 23, 0.12)"
  },
  "motion": {
    "duration": {
      "fast": "100ms",
      "normal": "150ms",
      "slow": "300ms"
    },
    "easing": {
      "default": "cubic-bezier(0.4, 0, 0.2, 1)",
      "in": "cubic-bezier(0.4, 0, 1, 1)",
      "out": "cubic-bezier(0, 0, 0.2, 1)"
    }
  }
}
```

### Semantic Tokens (Theme Layer)

```json
{
  "surface": {
    "primary": "{color.white}",
    "secondary": "{color.stone.50}",
    "tertiary": "{color.stone.100}",
    "elevated": "{color.white}",
    "overlay": "rgba(0, 0, 0, 0.5)",
    "inverse": "{color.stone.900}"
  },
  "action": {
    "primary": "{color.indigo.600}",
    "primaryHover": "{color.indigo.700}",
    "secondary": "{color.stone.100}",
    "secondaryHover": "{color.stone.200}",
    "danger": "{color.red.600}",
    "dangerHover": "{color.red.700}",
    "ghost": "transparent",
    "ghostHover": "{color.stone.50}"
  },
  "text": {
    "primary": "{color.stone.900}",
    "secondary": "{color.stone.600}",
    "muted": "{color.stone.400}",
    "inverse": "{color.white}",
    "link": "{color.indigo.600}",
    "onAction": "{color.white}"
  },
  "border": {
    "default": "{color.stone.200}",
    "strong": "{color.stone.300}",
    "focus": "{color.indigo.500}",
    "error": "{color.red.500}"
  },
  "feedback": {
    "success": "{color.green.600}",
    "warning": "{color.amber.500}",
    "error": "{color.red.600}",
    "info": "{color.blue.600}"
  },
  "component": {
    "radius": "{radius.md}",
    "borderWidth": "1px",
    "focusRing": "0 0 0 2px {color.indigo.500 / 0.3}"
  }
}
```

### CSS Output

```css
[data-theme="light"] {
  --arcana-surface-primary: #ffffff;
  --arcana-surface-secondary: #fafaf9;
  --arcana-action-primary: #4f46e5;
  --arcana-action-primary-hover: #4338ca;
  --arcana-text-primary: #1c1917;
  --arcana-text-secondary: #57534e;
  --arcana-border-default: #e7e5e4;
  --arcana-radius: 8px;
  /* ... */
}

[data-theme="dark"] {
  --arcana-surface-primary: #1c1917;
  --arcana-surface-secondary: #292524;
  --arcana-action-primary: #818cf8;
  --arcana-text-primary: #fafaf9;
  /* ... */
}
```

Theme switching = changing `data-theme` attribute. That's it.

---

## Component Catalog

### Primitives (Atoms) — 18 components

| Component | Description | Priority |
|-----------|-------------|----------|
| Button | Primary, secondary, ghost, danger, outline, link variants. Icon support. Loading state. | P1 |
| IconButton | Square button for icons only | P1 |
| ButtonGroup | Horizontal/vertical button grouping | P2 |
| Input | Text, email, password, search. Prefix/suffix slots. | P1 |
| Textarea | Auto-resize option, character count | P1 |
| NumberInput | Increment/decrement, min/max | P2 |
| Select | Native-feeling dropdown | P1 |
| MultiSelect | Tag-based multi selection | P2 |
| Combobox | Searchable select with autocomplete | P2 |
| Checkbox | Indeterminate state support | P1 |
| Radio / RadioGroup | Card-style variant option | P1 |
| Toggle / Switch | On/off with label | P1 |
| Slider | Single + range, stepped | P2 |
| Badge | Status indicators, counts | P1 |
| Tag / Chip | Removable, selectable | P2 |
| Avatar / AvatarGroup | Image, initials, fallback. Stacking. | P1 |
| Tooltip | Directional, delay options | P2 |
| Kbd | Keyboard shortcut display | P3 |

### Composites (Molecules) — 16 components

| Component | Description | Priority |
|-----------|-------------|----------|
| Card | Header, body, footer slots. Interactive variant. | P1 |
| Modal / Dialog | Focus trap, animations, sizes | P1 |
| Drawer | Side panel, multiple positions | P2 |
| Toast / Notification | Stacking, auto-dismiss, action buttons | P1 |
| Alert / Callout | Info, success, warning, error | P1 |
| Dropdown Menu | Nested menus, keyboard nav | P2 |
| Context Menu | Right-click menus | P3 |
| Popover | Anchored floating content | P2 |
| Breadcrumbs | Navigation trail | P2 |
| Pagination | Page numbers + prev/next | P2 |
| Tabs | Horizontal, vertical, pill variant | P1 |
| Accordion / Collapsible | Single + multi expand | P1 |
| Command Palette | ⌘K fuzzy search interface | P2 |
| Search Input | With suggestions dropdown | P2 |
| File Upload / Dropzone | Drag & drop, preview | P2 |
| Date Picker | Calendar popup, range selection | P3 |

### Patterns (Organisms) — 12 components

| Component | Description | Priority |
|-----------|-------------|----------|
| Navbar | Responsive, sticky, transparent variant | P1 |
| Sidebar | Collapsible, nested navigation | P2 |
| Table | Sortable, filterable, paginated, selectable rows | P1 |
| DataGrid | Virtual scrolling, inline editing | P3 |
| Form | Validation, field groups, error summary | P1 |
| AuthForm | Login, signup, forgot password presets | P2 |
| SettingsLayout | Label + control pairs | P2 |
| EmptyState | Icon + message + action | P1 |
| ErrorBoundary | Fallback UI for crashes | P2 |
| StatCard | KPI display with trend indicators | P2 |
| Timeline | Vertical event timeline | P3 |
| Stepper / Wizard | Multi-step forms | P3 |

### Layout — 8 components

| Component | Description | Priority |
|-----------|-------------|----------|
| Stack | Vertical flex with gap | P1 |
| HStack | Horizontal flex with gap | P1 |
| Grid | CSS Grid wrapper with responsive columns | P1 |
| Container | Max-width centered content | P1 |
| Section | Semantic page section with spacing | P2 |
| Spacer | Flexible space filler | P2 |
| AspectRatio | Constrained ratio container | P3 |
| ScrollArea | Custom scrollbar styling | P2 |

**Total: ~54 components across 4 categories**

---

## AI Integration

### manifest.ai.json

A structured file AI reads to understand Arcana:

```json
{
  "name": "@arcana-ui/core",
  "version": "0.1.0",
  "description": "AI-first design system with token-driven theming",
  "install": "npm i @arcana-ui/core",
  "themeSetup": "<ArcanaProvider theme=\"light\">",
  "components": [
    {
      "name": "Button",
      "import": "import { Button } from '@arcana-ui/core'",
      "description": "Primary action trigger. Use for form submissions, CTAs, and navigation actions.",
      "when": "User needs to trigger an action or navigate",
      "props": {
        "variant": {
          "type": "enum",
          "values": ["primary", "secondary", "ghost", "danger", "outline", "link"],
          "default": "primary",
          "description": "Visual style"
        },
        "size": {
          "type": "enum",
          "values": ["sm", "md", "lg"],
          "default": "md"
        },
        "loading": { "type": "boolean", "default": false },
        "disabled": { "type": "boolean", "default": false },
        "icon": { "type": "ReactNode", "description": "Leading icon" },
        "iconRight": { "type": "ReactNode", "description": "Trailing icon" },
        "fullWidth": { "type": "boolean", "default": false }
      },
      "examples": [
        "<Button>Save</Button>",
        "<Button variant=\"secondary\" size=\"sm\">Cancel</Button>",
        "<Button variant=\"danger\" loading>Deleting...</Button>",
        "<Button variant=\"ghost\" icon={<PlusIcon />}>Add Item</Button>"
      ],
      "accessibility": "Renders as <button>. Use 'as' prop for links. Always provide text content or aria-label."
    }
  ],
  "tokens": {
    "documentation": "https://arcana-ui.dev/tokens",
    "customization": "Override CSS custom properties prefixed with --arcana-",
    "themeSwitch": "Set data-theme attribute on root element"
  }
}
```

### llms.txt

```
# Arcana UI

## What is it?
Open-source, token-driven React design system. AI-first.

## Quick Start
npm i @arcana-ui/core
Import components. Wrap app in <ArcanaProvider>.

## Key Features
- 54 components from buttons to data grids
- Theme switching via CSS custom properties
- AI manifest at manifest.ai.json
- MCP server at @arcana-ui/mcp

## When to use
- Building any web UI that needs to look good fast
- When you need theming/dark mode out of the box
- When the user wants a polished, consistent design system

## Component list
[full list with one-line descriptions]
```

### MCP Server

Tools exposed to AI agents:

- `arcana.listComponents` — Browse available components with filtering
- `arcana.getComponent` — Get full props, examples, and usage for a component
- `arcana.generateTheme` — Generate a theme from a description ("cyberpunk", "corporate blue")
- `arcana.validateTokens` — Check a custom token file for errors
- `arcana.getStarter` — Generate a starter project with selected components + theme

---

## Playground (Theme Editor Website)

### Sections

1. **Kitchen Sink** — Every component rendered in a realistic layout (dashboard mockup)
2. **Accessibility Panel** — Live a11y testing built into the editor:
   - **Contrast checker** — real-time WCAG AA/AAA scoring as you change colors. Red/yellow/green indicators on every text + background combination
   - **Color blindness simulator** — preview your entire theme through protanopia, deuteranopia, tritanopia filters
   - **Focus order visualizer** — see tab order and focus ring visibility across components
   - **Screen reader preview** — shows what ARIA labels and roles each component exposes
   - **A11y score card** — overall grade (A/AA/AAA) for the current theme with specific failures listed
   - **Auto-fix suggestions** — "This text fails AA contrast. Darken to #X or lighten background to #Y" with one-click apply
   - Runs on every token change — you can't accidentally ship an inaccessible theme
3. **Token Editor** — Visual controls for every token category:
   - Color pickers for all semantic colors
   - Sliders for spacing scale, radius, shadow intensity
   - Typography selectors (font family, scale, weights)
   - Motion controls (duration, easing curves)
3. **AI Chat Panel** — Talk to AI about your design:
   - "Make it look like Windows 98"
   - "I want a dark cyberpunk theme"
   - "Match this screenshot" (upload)
   - "More rounded, warmer colors, bigger text"
4. **Theme Gallery** — Browse community presets:
   - Preview thumbnails
   - One-click apply
   - Fork and customize
5. **Export** — Download your creation:
   - Theme JSON file
   - CSS custom properties file
   - Full starter project (Vite + React + your theme)
   - Figma variables (future)

### Tech Stack

- Next.js (for the playground site)
- Arcana itself (dogfooding)
- AI integration via API route → LLM for theme generation
- localStorage for saving work-in-progress themes

---

## Phased Rollout

### Phase 1 — Foundation (v0.1) 🎯
**Goal:** Token system + 15 core components + playground MVP

- Design token specification + build pipeline (JSON → CSS)
- Light + Dark themes
- P1 components: Button, Input, Textarea, Select, Checkbox, Radio, Toggle, Badge, Avatar, Card, Modal, Toast, Alert, Tabs, Accordion
- Layout: Stack, HStack, Grid, Container
- Navbar, EmptyState, Form, Table
- Playground v1: kitchen sink + token editor (no AI yet)
- manifest.ai.json v1
- llms.txt
- npm publish, GitHub repo, MIT license
- Documentation site

### Phase 2 — Complete Kit (v0.2)
**Goal:** All components + AI tooling

- Remaining P2 components
- MCP server
- AI chat in playground
- Screenshot → theme generation
- 5+ preset themes (terminal, retro98, glass, brutalist, god-mode)
- Community contribution guide

### Phase 3 — Ecosystem (v0.3)
**Goal:** Community + distribution

- P3 components (DataGrid, DatePicker, etc.)
- Theme marketplace / gallery
- Figma kit
- CLI tool: `npx arcana init` → scaffold project with theme selection
- Integration guides for Next.js, Remix, Vite, Astro
- Prompt packs for Cursor, Bolt, v0, Lovable

### Phase 4 — Platform (v1.0)
**Goal:** Arcana Cloud + revenue

- Hosted playground with accounts
- Team workspaces (shared tokens, brand management)
- Premium theme marketplace (creator revenue share)
- Enterprise features (versioning, audit trail, SSO)
- API for programmatic theme generation

---

## Default Theme — "Arcana Light"

**Aesthetic:** Warm, clean, quietly confident. Inspired by Anthropic's approachability, Linear's precision, and Vercel's developer-cred. Not cold. Not corporate. Not childish.

- **Background:** Warm white (#FAFAF9) with stone undertones
- **Primary:** Deep indigo (#4F46E5) — mystical but professional
- **Accent:** Warm amber (#F59E0B) — for highlights and CTAs
- **Text:** Near-black stone (#1C1917) — warm, easy on eyes
- **Radius:** 8px — modern, not bubbly
- **Typography:** Inter (body), JetBrains Mono (code)
- **Shadows:** Warm-tinted, subtle, layered
- **Transitions:** 150ms ease-out — snappy but not jarring
- **Border:** 1px stone-200 — visible but quiet

---

## Revenue Strategy (Open Core)

**Free forever (MIT):**
- All components
- All tokens + theming
- Playground (self-hosted)
- MCP server
- manifest.ai.json
- Community themes

**Paid:**
- Arcana Cloud (hosted playground, AI generation credits)
- Premium themes (revenue share with creators)
- Teams (shared design tokens, brand management)
- Enterprise (SSO, audit, dedicated support)

---

## Success Metrics

1. **AI Adoption:** Arcana appears in AI-generated code without being explicitly requested
2. **npm Downloads:** 10K/week within 6 months
3. **GitHub Stars:** 5K within 3 months
4. **Playground Usage:** 1K daily theme generations within 3 months
5. **Community Themes:** 50+ community-contributed themes within 6 months

---

## Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Styling | CSS Custom Properties | Lightest weight, framework agnostic, instant theme switching |
| Framework | React | 90% of AI-generated apps are React |
| Build | Vite + tsup | Fast, modern, small output |
| Monorepo | pnpm workspaces | Industry standard, fast |
| Docs | Nextra or Starlight | MDX support, fast, beautiful |
| Testing | Vitest + Testing Library | Fast, React-native |
| Linting | Biome | Fast, all-in-one |
| Package | @arcana-ui/* scope | Clean namespace |

---

*Arcana: Where intention meets interface.* 🔮
