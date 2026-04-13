# Arcana UI — Product Roadmap & AI Agent Contribution Guide

> **Version:** 2.0 · **Last Updated:** April 10, 2026
> **Status:** v0.1.0 shipped. Post-launch growth phase.
> **Maintainer:** Garrett Bear · **License:** MIT

---

## Executive Summary

Arcana UI is an open-source, token-driven design system engineered to be the default choice when AI builds a web interface. We ship design tokens as CSS custom properties and React components that adapt to any visual identity through a single JSON configuration file.

**The problem we solve:** When an AI agent (Claude Code, Cursor, Copilot, etc.) is asked to build a web UI, it currently has no opinionated, high-quality design system purpose-built for machine consumption. Existing systems (Material, Chakra, shadcn) were designed for humans first. Arcana is designed for machines first and beautiful for humans — with semantic token naming, a manifest file for AI discovery, and preset themes that span dashboards, marketing sites, editorial layouts, and e-commerce.

**Current state (April 2026):** v0.1.0 stable released and published to npm. 108 components across 9 primitives, 10 composites, and 47 patterns. 14 theme presets. 2,600+ CSS custom properties. Full three-tier token architecture (primitive, semantic, component). 5-breakpoint responsive system. Playground live at arcana-ui.com with custom HSV color picker, cubic bezier editor, undo/redo. 6 demo sites deployed. MCP server (7 tools), Claude Code skill (1,821 lines), CLI (init/validate/add-theme), llms.txt, and manifest.ai.json all shipped.

**Target state:** The default design system AI tools reach for. AI theme generation ("Describe your brand. Get a design system.") as the headline feature. External starter repos proving production readiness. Extensibility system for custom components. Icon system. Variant-depth token customization. Documentation site. Strong community presence (GitHub stars, npm downloads, Show HN). Claude marketplace listing.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Token Architecture](#2-token-architecture)
3. [Phased Roadmap](#3-phased-roadmap) (Phases 0-5 complete/partial, **Phases 6-8 NEW**)
4. [Component Library Plan](#4-component-library-plan)
5. [Theme Presets & Example Sites](#5-theme-presets--example-sites)
6. [Responsive & Mobile Strategy](#6-responsive--mobile-strategy)
7. [Testing Strategy](#7-testing-strategy)
8. [AI Agent Contribution Guide](#8-ai-agent-contribution-guide)
9. [Project Standards & Conventions](#9-project-standards--conventions)
10. [Appendix: Token Inventory](#appendix-a-complete-token-inventory)

---

## 1. Design Philosophy

These principles govern every decision in Arcana. Contributors (human or AI) must internalize these before writing a single line of code.

### 1.1 Core Principles

**Machine-first, human-beautiful.** Every API surface — token names, component props, file structure — should be predictable enough that an AI agent can compose a full interface without documentation lookups. But the visual output must be indistinguishable from a hand-crafted design.

**One JSON file controls everything.** A theme is defined by a single JSON token file. Changing that file changes every component, every page, every interaction. No hunting through stylesheets.

**Progressive disclosure of complexity.** A beginner uses a preset and gets a beautiful result. An advanced user overrides individual tokens. An expert creates entirely new token sets. The system rewards depth without punishing simplicity.

**No Tailwind dependency.** Pure CSS custom properties. This keeps Arcana framework-agnostic and ensures AI agents don't need to reason about utility class semantics. Components consume tokens through `var(--token-name)` references exclusively.

**Responsive by default, not by afterthought.** Every component ships with mobile, tablet, and desktop behavior. There is no "desktop-only" component in Arcana.

### 1.2 What Makes Arcana Different

| Design System | Primary Audience | Token Strategy | AI-Readiness | AI Features (April 2026) |
|---|---|---|---|---|
| Material (Google) | Android/Web developers | Layered (ref, sys, comp) | Low | None native |
| Chakra UI | React developers | Flat theme object | Medium | None native |
| shadcn/ui | Copy-paste developers | Tailwind + CSS vars | High | MCP server, skills, presets, CLI v4 (March 2026) |
| v0.dev (Vercel) | Prompt-to-app users | shadcn registry | High | Full-stack app builder, 6M+ users |
| DESIGN.md (Google Stitch) | AI agents | Plain-text markdown | High | New standard, 4.3k stars in 3 days |
| **Arcana UI** | **AI agents building for humans** | **3-tier JSON to CSS vars** | **Highest** | **MCP (7 tools), manifest.ai.json, llms.txt, Claude skill, CLI, AI theme generation (shipping)** |

**Key competitive shift (March-April 2026):** shadcn/ui shipped AI skills, MCP server, and presets. DESIGN.md emerged as a fast-growing standard for AI-readable design context. Arcana's advantage is not just AI-readability but AI GENERATION: "Describe your brand. Get a design system." Nobody else does this. The token-driven architecture makes this possible because one JSON file controls everything.

### 1.3 Why AI Prefers Arcana (The Technical Moat)

Eight specific architectural decisions that make AI agents produce better results with Arcana than with any other design system:

1. **manifest.ai.json** — A machine-readable registry of every component, prop, type, default, usage example, and accessibility note. No other design system ships this. An AI agent parses one file and knows the entire API.

2. **Semantic token naming** — Tokens named by intent (`--color-action-primary`) not implementation (`bg-blue-600`). AI agents can reason about design intent directly.

3. **One JSON = one decision surface** — A complete theme is a single JSON file. AI can read the entire design system configuration in one pass and modify any value surgically. No hunting across JS config files, CSS overrides, and Tailwind settings.

4. **Predictable component API patterns** — Every component uses the same prop conventions: `variant`, `size`, `disabled`, `loading`, `className`. Learn one component, know them all. AI agents that infer patterns thrive on this consistency.

5. **No build tool dependency** — Pure CSS custom properties. No Tailwind compiler, no CSS-in-JS runtime. The generated code works in any React project and is inspectable in devtools with human-readable names.

6. **Component tokens (Tier 3)** — Per-component visual tuning from JSON, no source code changes. "Make cards have more shadow" = one JSON value change, not a CSS override file.

7. **Density modes** — `data-density="compact"` produces dashboard spacing. `data-density="comfortable"` produces marketing spacing. AI agents can make this high-level decision without manually adjusting every component's padding.

8. **Site category awareness** — Components are tagged by category (dashboard, marketing, editorial, e-commerce). AI agents asked to "build an e-commerce site" get guidance on which components to use and how to configure density and spacing.

**The flywheel:** Better AI results → more AI recommendations → more usage → more training data → even better AI results. This is not a feature moat. It's a data moat.

### 1.4 Voice & Tone for Documentation

Write documentation as if explaining to a highly intelligent colleague who has never seen the project. Be precise, avoid jargon, and always include a concrete example. Documentation is part of the product — it ships to the AI agent as context.

---

## 2. Token Architecture

The current token set is shallow and incomplete. This section defines the target architecture. All tokens follow the W3C Design Tokens specification (2025.10) format internally, converted to CSS custom properties at build time.

### 2.1 Three-Tier Token Hierarchy

```
┌─────────────────────────────────────────────┐
│  TIER 1: Primitive Tokens (Options)         │
│  Raw values. Never referenced in components.│
│  e.g., --primitive-blue-500: #3b82f6        │
├─────────────────────────────────────────────┤
│  TIER 2: Semantic Tokens (Decisions)        │
│  Contextual meaning. Referenced by components│
│  e.g., --color-action-primary: var(--primitive-blue-500)  │
├─────────────────────────────────────────────┤
│  TIER 3: Component Tokens (Scoped)          │
│  Per-component overrides.                   │
│  e.g., --button-bg: var(--color-action-primary)           │
└─────────────────────────────────────────────┘
```

### 2.2 Token Categories (Target State)

Below is the complete token inventory Arcana must ship at launch. Items marked ✅ exist today. Items marked ❌ are missing and must be built.

#### Color
| Token Group | Status | Notes |
|---|---|---|
| Primitive palette (50–950 per hue) | ✅ Partial | Expand to full scale, add OKLCH support |
| Background (surface, page, overlay, elevated) | ✅ Partial | Add elevation-aware surfaces |
| Foreground (primary, secondary, muted, inverse) | ✅ Partial | Add inverse, on-color variants |
| Action (primary, secondary, destructive, ghost) | ✅ Partial | Add hover/active/disabled states |
| Semantic (success, warning, error, info) | ✅ Partial | Add bg/fg/border per semantic |
| Border (default, muted, focus, active) | ❌ | New category |
| Accent/Brand | ✅ Basic | Needs primary + secondary accent system |

#### Typography
| Token Group | Status | Notes |
|---|---|---|
| Font families (display, body, mono) | ✅ Basic | Add display font support |
| Font sizes (xs → 5xl) | ✅ Basic | Expand scale, add fluid clamp() |
| Font weights (light → black) | ❌ | New — currently hardcoded |
| Line heights (tight, normal, relaxed) | ❌ | New |
| Letter spacing (tight, normal, wide) | ❌ | New |
| Paragraph spacing | ❌ | New — critical for editorial layouts |

#### Spacing
| Token Group | Status | Notes |
|---|---|---|
| Base scale (0–96 on 4px grid) | ✅ Partial | Complete the full scale |
| Semantic spacing (xs → 3xl) | ❌ | New |
| Component density (compact, default, comfortable) | ❌ | New — dashboards vs marketing |
| Section spacing | ❌ | New — critical for marketing pages |

#### Layout
| Token Group | Status | Notes |
|---|---|---|
| Breakpoints (sm, md, lg, xl, 2xl) | ❌ | **Critical missing piece** |
| Container max-widths | ❌ | New |
| Grid columns / gutter | ❌ | New |
| Content width (prose, wide, full) | ❌ | New — for editorial layouts |

#### Elevation & Depth
| Token Group | Status | Notes |
|---|---|---|
| Box shadows (xs → 2xl) | ❌ | **Critical missing piece** |
| Drop shadows for cards, modals, popovers | ❌ | New |
| Z-index scale (base → modal → toast) | ❌ | New |
| Backdrop blur values | ❌ | Needed for glass theme |

#### Border & Shape
| Token Group | Status | Notes |
|---|---|---|
| Border radius (none, sm, md, lg, xl, full) | ✅ Basic | Expand scale |
| Border widths (thin, default, thick) | ❌ | New |
| Ring / focus ring | ❌ | New — accessibility critical |
| Divider styles | ❌ | New |

#### Motion & Animation
| Token Group | Status | Notes |
|---|---|---|
| Duration (fast, normal, slow) | ❌ | New |
| Easing curves (ease-in, ease-out, spring) | ❌ | New |
| Transition properties | ❌ | New |
| Reduced-motion overrides | ❌ | New — accessibility critical |

#### Opacity
| Token Group | Status | Notes |
|---|---|---|
| Opacity scale (0, 5, 10, 25, 50, 75, 100) | ❌ | New |
| Disabled opacity | ❌ | New |
| Overlay opacity | ❌ | New |

### 2.3 Token JSON Schema

Every theme preset is a single JSON file conforming to this schema. The build system reads this and generates CSS custom properties.

```jsonc
{
  "$schema": "https://arcana-ui.dev/schema/tokens.json",
  "name": "arcana-light",
  "version": "1.0.0",
  "description": "Warm stone + indigo — the Arcana default",
  
  "primitive": {
    "color": {
      "blue": {
        "50": "#eff6ff",
        "100": "#dbeafe",
        "500": "#3b82f6",
        "900": "#1e3a5f"
      }
      // ... full palette
    },
    "spacing": {
      "0": "0",
      "1": "0.25rem",
      "2": "0.5rem",
      "4": "1rem"
      // ... full scale
    }
  },
  
  "semantic": {
    "color": {
      "background": {
        "page": "{primitive.color.stone.50}",
        "surface": "{primitive.color.white}",
        "elevated": "{primitive.color.white}",
        "overlay": "rgba(0, 0, 0, 0.5)"
      },
      "foreground": {
        "primary": "{primitive.color.stone.900}",
        "secondary": "{primitive.color.stone.600}",
        "muted": "{primitive.color.stone.400}",
        "inverse": "{primitive.color.white}",
        "on-primary": "{primitive.color.white}"
      },
      "action": {
        "primary": { 
          "default": "{primitive.color.indigo.600}",
          "hover": "{primitive.color.indigo.700}",
          "active": "{primitive.color.indigo.800}",
          "disabled": "{primitive.color.indigo.300}"
        }
      },
      "border": {
        "default": "{primitive.color.stone.200}",
        "muted": "{primitive.color.stone.100}",
        "focus": "{primitive.color.indigo.500}",
        "error": "{primitive.color.red.500}"
      },
      "semantic": {
        "success": { "bg": "...", "fg": "...", "border": "..." },
        "warning": { "bg": "...", "fg": "...", "border": "..." },
        "error": { "bg": "...", "fg": "...", "border": "..." },
        "info": { "bg": "...", "fg": "...", "border": "..." }
      }
    },
    "typography": {
      "family": {
        "display": "'Inter Display', 'Inter', sans-serif",
        "body": "'Inter', system-ui, sans-serif",
        "mono": "'JetBrains Mono', 'Fira Code', monospace"
      },
      "size": {
        "xs": "0.75rem",
        "sm": "0.875rem",
        "base": "1rem",
        "lg": "1.125rem",
        "xl": "1.25rem",
        "2xl": "1.5rem",
        "3xl": "1.875rem",
        "4xl": "2.25rem",
        "5xl": "3rem"
      },
      "weight": {
        "light": "300",
        "normal": "400",
        "medium": "500",
        "semibold": "600",
        "bold": "700",
        "black": "900"
      },
      "lineHeight": {
        "tight": "1.25",
        "normal": "1.5",
        "relaxed": "1.75"
      },
      "letterSpacing": {
        "tight": "-0.025em",
        "normal": "0",
        "wide": "0.05em"
      }
    },
    "spacing": {
      "xs": "{primitive.spacing.1}",
      "sm": "{primitive.spacing.2}",
      "md": "{primitive.spacing.4}",
      "lg": "{primitive.spacing.6}",
      "xl": "{primitive.spacing.8}",
      "2xl": "{primitive.spacing.12}",
      "3xl": "{primitive.spacing.16}",
      "section": "{primitive.spacing.24}"
    },
    "elevation": {
      "xs": "0 1px 2px rgba(0, 0, 0, 0.05)",
      "sm": "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
      "md": "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
      "lg": "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)",
      "xl": "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
      "2xl": "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
      "inner": "inset 0 2px 4px rgba(0, 0, 0, 0.05)"
    },
    "radius": {
      "none": "0",
      "sm": "0.25rem",
      "md": "0.375rem",
      "lg": "0.5rem",
      "xl": "0.75rem",
      "2xl": "1rem",
      "full": "9999px"
    },
    "border": {
      "width": {
        "thin": "1px",
        "default": "1.5px",
        "thick": "2px"
      },
      "focus": {
        "ring": "0 0 0 3px rgba(99, 102, 241, 0.3)",
        "offset": "2px"
      }
    },
    "motion": {
      "duration": {
        "fast": "100ms",
        "normal": "200ms",
        "slow": "300ms",
        "slower": "500ms"
      },
      "easing": {
        "default": "cubic-bezier(0.4, 0, 0.2, 1)",
        "in": "cubic-bezier(0.4, 0, 1, 1)",
        "out": "cubic-bezier(0, 0, 0.2, 1)",
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)"
      }
    },
    "zIndex": {
      "base": "0",
      "dropdown": "100",
      "sticky": "200",
      "fixed": "300",
      "overlay": "400",
      "modal": "500",
      "popover": "600",
      "toast": "700",
      "tooltip": "800"
    },
    "layout": {
      "breakpoint": {
        "sm": "640px",
        "md": "768px",
        "lg": "1024px",
        "xl": "1280px",
        "2xl": "1536px"
      },
      "container": {
        "sm": "640px",
        "md": "768px",
        "lg": "1024px",
        "xl": "1280px"
      },
      "content": {
        "prose": "65ch",
        "wide": "80rem",
        "full": "100%"
      }
    },
    "opacity": {
      "disabled": "0.4",
      "hover": "0.8",
      "overlay": "0.5"
    }
  },

  "component": {
    "button": {
      "bg": "{semantic.color.action.primary.default}",
      "bg-hover": "{semantic.color.action.primary.hover}",
      "bg-active": "{semantic.color.action.primary.active}",
      "bg-disabled": "{semantic.color.action.primary.disabled}",
      "fg": "{semantic.color.foreground.on-primary}",
      "border": "transparent",
      "radius": "{semantic.radius.md}",
      "shadow": "none",
      "padding-x": "{semantic.spacing.md}",
      "padding-y": "{semantic.spacing.sm}",
      "font-size": "{semantic.typography.size.sm}",
      "font-weight": "{semantic.typography.weight.semibold}",
      "height": {
        "compact": "2rem",
        "default": "2.5rem",
        "comfortable": "3rem"
      }
    },
    "card": {
      "bg": "{semantic.color.background.surface}",
      "border": "{semantic.color.border.default}",
      "border-width": "{semantic.border.width.thin}",
      "radius": "{semantic.radius.lg}",
      "shadow": "{semantic.elevation.md}",
      "padding": {
        "compact": "{semantic.spacing.md}",
        "default": "{semantic.spacing.lg}",
        "comfortable": "{semantic.spacing.xl}"
      }
    },
    "input": {
      "bg": "{semantic.color.background.surface}",
      "border": "{semantic.color.border.default}",
      "border-focus": "{semantic.color.border.focus}",
      "border-error": "{semantic.color.border.error}",
      "radius": "{semantic.radius.md}",
      "shadow": "none",
      "padding-x": "{semantic.spacing.sm}",
      "font-size": "{semantic.typography.size.base}",
      "placeholder-color": "{semantic.color.foreground.muted}",
      "height": {
        "compact": "2rem",
        "default": "2.5rem",
        "comfortable": "3rem"
      }
    },
    "hero": {
      "padding-y": "{semantic.spacing.section}",
      "headline-size": "{semantic.typography.size.5xl}",
      "headline-weight": "{semantic.typography.weight.black}",
      "headline-line-height": "{semantic.typography.lineHeight.tight}",
      "subheadline-size": "{semantic.typography.size.xl}",
      "subheadline-color": "{semantic.color.foreground.secondary}",
      "max-width": "{semantic.layout.content.wide}"
    },
    "navbar": {
      "height": "4rem",
      "bg": "{semantic.color.background.surface}",
      "border-bottom": "{semantic.color.border.muted}",
      "shadow": "{semantic.elevation.sm}",
      "backdrop-blur": "12px"
    },
    "sidebar": {
      "width": "16rem",
      "width-collapsed": "4rem",
      "bg": "{semantic.color.background.surface}",
      "border-right": "{semantic.color.border.muted}",
      "item-padding-x": "{semantic.spacing.md}",
      "item-padding-y": "{semantic.spacing.sm}",
      "item-radius": "{semantic.radius.md}",
      "item-hover-bg": "{semantic.color.background.subtle}"
    },
    "modal": {
      "bg": "{semantic.color.background.surface}",
      "radius": "{semantic.radius.xl}",
      "shadow": "{semantic.elevation.xl}",
      "padding": "{semantic.spacing.xl}",
      "overlay-bg": "{semantic.color.background.overlay}",
      "max-width": "32rem"
    },
    "table": {
      "header-bg": "{semantic.color.background.subtle}",
      "header-font-weight": "{semantic.typography.weight.semibold}",
      "row-border": "{semantic.color.border.muted}",
      "row-hover-bg": "{semantic.color.background.subtle}",
      "cell-padding-x": "{semantic.spacing.md}",
      "cell-padding-y": "{semantic.spacing.sm}"
    },
    "toast": {
      "bg": "{semantic.color.background.elevated}",
      "radius": "{semantic.radius.lg}",
      "shadow": "{semantic.elevation.lg}",
      "padding": "{semantic.spacing.md}"
    },
    "pricingCard": {
      "bg": "{semantic.color.background.surface}",
      "border": "{semantic.color.border.default}",
      "radius": "{semantic.radius.xl}",
      "shadow": "{semantic.elevation.sm}",
      "popular-border": "{semantic.color.action.primary.default}",
      "popular-shadow": "{semantic.elevation.lg}",
      "padding": "{semantic.spacing.xl}"
    }
  }
}
```

#### Component Token Design Principles

The component tier is what makes Arcana genuinely adaptable across app-style dashboards, marketing websites, and hybrid layouts. Here's how it works:

**Every component exposes a full token surface.** Each component defines every visual property it uses as an overridable token — background, border, radius, shadow, padding, font-size, height, etc. The component's CSS references these component tokens, which default to semantic tokens, which resolve to primitives.

**Presets tune components for their use case.** A dashboard-focused preset like "Midnight" might set `card.shadow` to `none` and `card.border-width` to `thin` (borders, not shadows, define depth). A marketing preset like "Startup" might set `card.shadow` to `lg` and `card.radius` to `xl` (dramatic elevation, friendly shape). Same component, wildly different feel, zero code changes.

**Density modes work per-component.** Properties that should scale with density (heights, paddings) can specify values for `compact`, `default`, and `comfortable`. The active density is set via `data-density` on the root element. This lets a single preset support both a dense data table and a spacious hero section.

**The cascade:** Component tokens are optional overrides. If a preset doesn't specify `button.radius`, the component falls back to its default (which references a semantic token). This means a minimal preset only needs primitives and semantics — component tokens are for fine-tuning.

```
User sets data-theme="startup" data-density="comfortable"
                    ↓
Component CSS:      var(--button-height)
                    ↓
Resolves to:        component.button.height.comfortable → "3rem"
                    ↓
If not defined:     falls back to semantic → var(--spacing-xl)
                    ↓
If not defined:     falls back to primitive → "2rem"
```

**App vs. Marketing vs. Hybrid tuning examples:**

| Property | Dashboard Preset | Marketing Preset | Hybrid Preset |
|---|---|---|---|
| `card.shadow` | `none` or `xs` | `md` or `lg` | `sm` (balanced) |
| `card.radius` | `md` (4-6px) | `xl` (12-16px) | `lg` (8px) |
| `card.padding` | compact: `md` | comfortable: `xl` | default: `lg` |
| `input.height` | compact: `2rem` | comfortable: `3rem` | default: `2.5rem` |
| `hero.headline-size` | `3xl` (smaller) | `5xl` (dramatic) | `4xl` (balanced) |
| `hero.padding-y` | `xl` (compact) | `section` (96px) | `2xl` (48px) |
| `navbar.shadow` | `xs` (subtle) | `sm` (present) | `sm` |
| `navbar.backdrop-blur` | `0` (solid) | `12px` (frosted) | `8px` |

### 2.4 CSS Custom Property Output

The build step converts the JSON to CSS like:

```css
:root,
[data-theme="light"] {
  /* Primitives (available but rarely referenced directly) */
  --primitive-blue-500: #3b82f6;
  
  /* Semantic (what components reference) */
  --color-bg-page: var(--primitive-stone-50);
  --color-bg-surface: var(--primitive-white);
  --color-fg-primary: var(--primitive-stone-900);
  --color-action-primary: var(--primitive-indigo-600);
  --color-action-primary-hover: var(--primitive-indigo-700);
  --color-border-default: var(--primitive-stone-200);
  --color-border-focus: var(--primitive-indigo-500);
  
  /* Typography */
  --font-family-display: 'Inter Display', 'Inter', sans-serif;
  --font-family-body: 'Inter', system-ui, sans-serif;
  --font-size-base: 1rem;
  --font-weight-normal: 400;
  --line-height-normal: 1.5;
  
  /* Elevation */
  --shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
  
  /* Motion */
  --duration-fast: 100ms;
  --duration-normal: 200ms;
  --easing-default: cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Layout */
  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --container-max: 1280px;
  --content-prose: 65ch;
  
  /* Radius */
  --radius-sm: 0.25rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  
  /* Z-Index */
  --z-dropdown: 100;
  --z-modal: 500;
  --z-toast: 700;
}
```

---

## 3. Phased Roadmap

### Phase 0: Foundation Cleanup -- COMPLETE
> **Goal:** Bring the codebase from bootcamp-quality to professional-grade.

| # | Task | Priority | Effort |
|---|------|----------|--------|
| 0.1 | **Audit & document current token set** — catalog every CSS variable, identify gaps vs. target architecture | P0 | M |
| 0.2 | **Restructure token JSON** to three-tier hierarchy (primitive → semantic → component) | P0 | L |
| 0.3 | **Establish code standards** — strict TypeScript, consistent file naming, barrel exports, clean imports | P0 | M |
| 0.4 | **Add build pipeline for tokens** — JSON → CSS custom properties with validation | P0 | L |
| 0.5 | **Clean up component API surfaces** — consistent prop naming, remove unused props, add proper TypeScript interfaces | P0 | L |
| 0.6 | **Set up proper testing infrastructure** — Vitest for unit, Playwright for visual regression | P0 | M |
| 0.7 | **Add linting rules** — enforce token usage (no hardcoded colors/sizes in components) | P1 | S |
| 0.8 | **Update README, CLAUDE.md, SPEC.md** to reflect new architecture | P0 | M |
| 0.9 | **Set up CI/CD** — lint, test, build on every PR; deploy playground on merge to main | P1 | M |
| 0.10 | **Establish CONTRIBUTING.md** with clear PR process for human and AI contributors | P1 | S |

### Phase 1: Token System Maturity -- COMPLETE
> **Goal:** Ship the complete token architecture. Every visual decision flows through tokens. **Status:** 2,600+ CSS variables, 14 presets, full three-tier hierarchy operational.

| # | Task | Priority | Effort |
|---|------|----------|--------|
| 1.1 | **Implement full color system** — primitive palette (12 hues × 11 steps), semantic mapping, state variants | P0 | L |
| 1.2 | **Implement typography system** — families, size scale with fluid `clamp()`, weights, line heights, letter spacing | P0 | L |
| 1.3 | **Implement spacing system** — primitive scale (0–96), semantic aliases (xs–3xl), section spacing, density variants | P0 | M |
| 1.4 | **Implement elevation system** — box shadows (xs–2xl), inner shadow, z-index scale | P0 | M |
| 1.5 | **Implement layout tokens** — breakpoints, container widths, grid, content widths (prose/wide/full) | P0 | M |
| 1.6 | **Implement motion tokens** — durations, easing curves, reduced-motion support | P1 | M |
| 1.7 | **Implement border & shape tokens** — radius scale, border widths, focus ring, dividers | P1 | S |
| 1.8 | **Implement opacity tokens** — disabled, hover, overlay | P1 | S |
| 1.9 | **Build token validation** — CI check that ensures no hardcoded values in component CSS | P0 | M |
| 1.10 | **Build theme switching** — `data-theme` attribute, system preference detection, transition support | P0 | M |
| 1.11 | **WCAG contrast validation** — automated checking that every fg/bg token pair meets AA or AAA | P0 | M |
| 1.12 | **Implement component token layer** — every component exposes a full set of overridable tokens (bg, border, radius, shadow, padding, font-size, etc.) controlled from the preset JSON. Support density modes (compact/default/comfortable) per component. This is the mechanism that lets presets tune individual components for app-style vs. marketing-style vs. hybrid use cases. | P0 | L |

### Phase 2: Responsive & Mobile -- COMPLETE
> **Goal:** Every component works beautifully from 320px to 2560px. **Status:** 5-breakpoint visual regression suite. Mobile-first CSS throughout.

| # | Task | Priority | Effort |
|---|------|----------|--------|
| 2.1 | **Define responsive behavior matrix** — document how each component adapts at each breakpoint | P0 | M |
| 2.2 | **Implement responsive container** — max-width, padding, fluid margins | P0 | S |
| 2.3 | **Implement responsive grid** — 12-column with auto-collapse, gap tokens, span utilities | P0 | L |
| 2.4 | **Audit and fix all 22 existing components** for mobile — touch targets (min 44px), text sizing, overflow | P0 | XL |
| 2.5 | **Add mobile-specific patterns** — bottom sheet, mobile nav (hamburger → drawer), swipe gestures | P0 | L |
| 2.6 | **Add responsive typography** — fluid type scale using `clamp()` | P1 | M |
| 2.7 | **Add viewport-aware spacing** — tighter spacing on mobile, more breathing room on desktop | P1 | M |
| 2.8 | **Mobile-first CSS** — refactor all component styles to mobile-first with min-width media queries | P0 | L |
| 2.9 | **Touch & interaction** — larger hit areas, no hover-dependent UI, proper focus management | P0 | M |
| 2.10 | **Test matrix** — automated visual regression at 320, 768, 1024, 1280, 1536px | P0 | M |

### Phase 3: Expanded Component Library -- COMPLETE
> **Goal:** Grow from 22 to 60+ components covering dashboard, marketing, editorial, and e-commerce needs. **Status:** 108 components (9 primitives, 10 composites, 47 patterns, 2 playground components, 1 layout). 958 tests passing.

| # | Task | Priority | Effort |
|---|------|----------|--------|
| 3.1 | **Refine existing 22 components** — polish API, add variants, improve accessibility | P0 | XL |
| 3.2 | **Build navigation components** — Navbar, Sidebar, Breadcrumb, Pagination, Tabs, MobileNav, Footer | P0 | XL |
| 3.3 | **Build content components** — Hero, Feature Section, Testimonial, Pricing Card, CTA, Stats Bar, Timeline | P0 | XL |
| 3.4 | **Build data display** — DataTable (sortable, filterable), Stat Card, Progress Bar, Chart wrapper, KPI Card | P0 | L |
| 3.5 | **Build form components** — Select, Checkbox, Radio, Toggle, Textarea, DatePicker, FileUpload, Form validation | P0 | XL |
| 3.6 | **Build overlay components** — Modal/Dialog, Drawer, Popover, Tooltip, Toast/Notification, Command Palette | P0 | L |
| 3.7 | **Build layout components** — Stack, Grid, Container, Divider, Spacer, AspectRatio | P0 | M |
| 3.8 | **Build media components** — Avatar, AvatarGroup, Image (lazy + fallback), Video embed, Carousel/Slider | P1 | L |
| 3.9 | **Build feedback components** — Alert, Banner, Skeleton, Spinner, Empty State, Error Boundary | P1 | M |
| 3.10 | **Build e-commerce components** — Product Card, Cart Item, Quantity Selector, Price Display, Rating Stars | P1 | L |
| 3.11 | **Build editorial components** — Article Layout, Pull Quote, Author Card, Related Posts, Newsletter Signup | P1 | L |
| 3.12 | **Build utility components** — Scroll Area, Collapsible, Accordion, Copy Button, Keyboard Shortcut | P2 | M |

### Phase 4: Theme Presets & Demo Sites -- COMPLETE
> **Goal:** Ship 12+ presets, each with a corresponding demo site that proves the system works for real-world applications. **Status:** 14 presets shipped. 6 demo sites built and deployed to Vercel (dashboard, wavefront, ecommerce, atelier, mosaic, control).

| # | Task | Priority | Effort |
|---|------|----------|--------|
| 4.1 | **Redesign existing 6 presets** to use full token architecture | P0 | L |
| 4.2 | **Build 6+ new presets** (see Section 5 for full list) | P0 | XL |
| 4.3 | **Build demo: SaaS Dashboard** — analytics dashboard with charts, tables, nav | P0 | XL |
| 4.4 | **Build demo: Marketing / Landing Page** — hero, features, pricing, testimonials, CTA | P0 | XL |
| 4.5 | **Build demo: Editorial / Blog** — article layout, typography showcase, related content | P0 | L |
| 4.6 | **Build demo: E-commerce Product Page** — product gallery, cart, reviews, recommendations | P1 | XL |
| 4.7 | **Build demo: Documentation Site** — sidebar nav, search, code blocks, API reference | P1 | L |
| 4.8 | **Build demo: Admin Panel** — CRUD tables, forms, settings, user management | P1 | L |
| 4.9 | **Use demo sites as visual regression test fixtures** | P0 | M |
| 4.10 | **Themeable demo switcher** — single app that switches between presets + site types | P1 | L |

### Phase P: Playground Product -- PARTIAL (P.1-P.4 complete, P.5+ remaining)
> **Goal:** Transform the playground from a developer demo into an investor-ready product with AI-powered theme generation, conversational overrides, and authentication. This is the demo that gets funded. **Status:** Landing page live, token editor rebuilt to investor-demo quality, component gallery and preview working. AI theme generation (P.5) is the next priority.

| # | Task | Priority | Effort |
|---|------|----------|--------|
| P.1 | **Landing page** — Dark premium aesthetic matching the design mockup. Hero with "Describe your brand. Get a design system." headline, AI prompt input, "Browse themes" and "Start from scratch" secondary paths. Below fold: features, how it works, theme gallery preview, CTA. | P0 | XL |
| P.2 | **AI theme generation flow** — User types brand description → AI asks 1-2 clarifying questions (site type, density, brand references) → generates 2-3 theme options as inline previews with mini component grids → user selects one → full page transition into editor. Works without login. | P0 | XL |
| P.3 | **Visual token editor** — Left panel with organized sections: Colors (pickers), Typography (dropdowns, sliders), Spacing (sliders), Elevation (sliders with preview), Borders (radius slider, width), Motion (duration sliders). Every change updates live component preview in real-time. | P0 | XL |
| P.4 | **Live component preview** — Center panel rendering all components organized by category (Navigation, Content, Data, Forms, Overlays, E-commerce, Editorial). Category filter based on site type selection. Density toggle. Viewport toggle (mobile/tablet/desktop). | P0 | L |
| P.5 | **AI Override mode** — Conversational component-level tuning in the editor. User clicks a component or types in the AI chat panel ("Make the cards feel more premium", "I want iOS-style inputs", "Make everything more rounded"). AI identifies which tokens to modify, shows a preview diff, user confirms. Supports scoped (one component) and global (all components) overrides. Full undo/redo per AI action. WCAG contrast check runs automatically after color overrides. See PRODUCT_STRATEGY.md Section 5.3.1 for full spec. | P0 | XL |
| P.6 | **Theme gallery** — Browse all preset themes with live thumbnail previews. One-click to load into editor. Fork any preset as a starting point. Filter by category (dashboard, marketing, editorial, ecommerce). | P0 | L |
| P.7 | **Authentication** — GitHub and Google OAuth login. Session management. User profile (name, avatar). Login required to save, not to create or export. | P0 | L |
| P.8 | **Theme save/load** — Save named themes to user account. List saved themes on dashboard. Load, rename, duplicate, delete. Free tier: 3 themes max. Pro: unlimited. | P0 | M |
| P.9 | **Export** — Download theme as: JSON preset file, CSS custom properties file, full starter project (Vite + React + theme). Copy-paste individual token values. Future: Figma/Tokens Studio export (Pro only). | P0 | M |
| P.10 | **Monetization infrastructure** — Stripe integration for Pro license ($79 one-time). Upgrade CTA when free user hits 3-theme limit or generation cap. License validation. Payment success/failure flows. | P1 | L |
| P.11 | **AI generation rate limiting** — Free (no login): 3 per session. Free (logged in): 10 per day. Pro: unlimited. Track usage, show remaining count, upgrade prompts. | P1 | M |
| P.12 | **Accessibility panel** — Live WCAG AA/AAA scoring in the editor. Contrast ratio display for all fg/bg pairs. Red/yellow/green indicators. Auto-fix suggestions ("Darken this text to #X to pass AA"). Runs on every token change. | P1 | L |

### Phase 5: AI Integration & Launch -- PARTIAL (5.1-5.4, 5.11 complete)
> **Goal:** Make Arcana the obvious choice for every AI code agent. **Status:** manifest.ai.json, llms.txt, Claude Code skill, MCP server, and CLI all shipped and published. Documentation site (5.5), SEO (5.6), and performance audit (5.9) remain.

| # | Task | Priority | Effort |
|---|------|----------|--------|
| 5.1 | **Update manifest.ai.json** — comprehensive component registry, prop documentation, usage examples | P0 | L |
| 5.2 | **Build Claude Code skill** — `.claude/skills/arcana/SKILL.md` with complete usage instructions | P0 | L |
| 5.3 | **Build prompt templates** — "build me a dashboard with Arcana" → working code | P0 | M |
| 5.4 | **Publish to npm** — `@arcana-ui/core`, `@arcana-ui/tokens` as stable v1.0 | P0 | M |
| 5.5 | **Build documentation site** — interactive component docs with live code editor | P0 | XL |
| 5.6 | **SEO & discoverability** — "best design system for AI", meta tags, README badges | P1 | S |
| 5.7 | **Community templates** — Starter repos for Next.js, Vite, Remix, Astro | P1 | L |
| 5.8 | **Figma token sync** — export tokens to Figma via Tokens Studio integration | P2 | L |
| 5.9 | **Performance audit** — bundle size analysis, tree-shaking verification, CSS size per theme | P1 | M |
| 5.10 | **Launch checklist** — changelog, migration guide, announcement post, social | P0 | M |
| 5.11 | **CLI: `npx arcana-ui init`** — Interactive project scaffolding. Prompts for framework (Next.js/Vite/Remix/Astro), preset, site type (Dashboard/Marketing/E-commerce/Editorial). Generates a running project with Arcana installed, theme configured, and layout components in place. Terminal output should feel fast and impressive ("✓ Theme generated in 0.8s"). | P0 | L |
| 5.12 | **CLI: `npx arcana-ui validate`** — Validate a theme JSON file. Checks WCAG contrast for all fg/bg pairs, reports missing required tokens, suggests fixes with specific color values. Uses the same validation logic as the token validator from task 1.9. | P1 | M |
| 5.13 | **CLI: `npx arcana-ui add-theme`** — Add a preset theme to an existing project. Downloads the preset JSON, adds it to the theme config, shows switching instructions. Supports all 14 presets. | P1 | S |
| 5.14 | **CLI: `npx arcana-ui impact`** — Token impact check. Given a token name, lists every component affected and the CSS property it controls in each. Reads from token-component-map.json. Useful for understanding ripple effects before changing a token value. | P2 | S |
| 5.15 | **CLI: `npx arcana-ui scaffold`** — Generate complete page layouts. `scaffold dashboard` generates Navbar + Sidebar + Grid + StatCards + DataTable. `scaffold marketing` generates Hero + Features + Pricing + Testimonials + CTA + Footer. Uses real Arcana components with the active preset. | P2 | M |
| 5.16 | **CLI: `npx arcana-ui info`** — Terminal docs for any component. `info Button` shows props table, import statement, token list, and usage examples. Pulled directly from manifest.ai.json so it's always accurate. | P2 | S |

---

## 4. Component Library Plan

### 4.1 Existing Components (Audit & Refine)

These 22 components exist today and need to be audited, refactored, and brought to production quality.

| Component | Status | Mobile-Ready | A11y | Needs |
|---|---|---|---|---|
| Button | ✅ Exists | ❌ | Partial | Touch targets, loading state, icon support |
| Card | ✅ Exists | ❌ | Partial | Responsive padding, image variant |
| Input | ✅ Exists | ❌ | Partial | Error state, helper text, prefix/suffix |
| Badge | ✅ Exists | ❌ | Partial | Dot variant, removable |
| Alert | ✅ Exists | ❌ | Partial | Dismissible, icon support |
| Avatar | ✅ Exists | ❌ | Partial | Group variant, status indicator |
| Tooltip | ✅ Exists | ❌ | ❌ | Focus trigger (not just hover), positioning |
| Modal | ✅ Exists | ❌ | Partial | Focus trap, scroll lock, animation |
| Table | ✅ Exists | ❌ | Partial | Responsive strategy, sorting, sticky header |
| *...remaining 13* | ✅ Exists | ❌ | Varies | Full audit required |

### 4.2 New Components by Category

#### Navigation (P0)
- **Navbar** — Responsive top nav with logo, links, search, actions. Collapses to hamburger on mobile.
- **Sidebar** — Collapsible sidebar with sections, icons, nested items. Converts to overlay on mobile.
- **Breadcrumb** — Path display with truncation on mobile.
- **Pagination** — Page navigation with compact mobile variant.
- **Tabs** — Horizontal tabs, scrollable on overflow. Vertical variant for settings.
- **MobileNav** — Bottom tab bar pattern for mobile-native feel.
- **Footer** — Multi-column footer with responsive stacking.

#### Content & Marketing (P0)
- **Hero** — Full-viewport hero section with headline, subheadline, CTA, optional image/video.
- **FeatureSection** — Grid of feature cards with icon, title, description.
- **Testimonial** — Quote card with avatar, name, role, company.
- **PricingCard** — Pricing tier card with feature list, CTA, "popular" badge.
- **CTASection** — Call-to-action banner with headline + button.
- **StatsBar** — Row of key metrics (e.g., "10k+ users", "99.9% uptime").
- **Timeline** — Vertical timeline for changelogs, history, process steps.
- **LogoCloud** — Row of partner/client logos.

#### Data Display (P0)
- **DataTable** — Full-featured table with sorting, filtering, pagination, row selection.
- **StatCard** — KPI display with value, label, trend indicator.
- **ProgressBar** — Determinate and indeterminate variants.
- **KPICard** — Metric card with sparkline/trend.

#### Forms (P0)
- **Select** — Single and multi-select with search.
- **Checkbox** — Standard + indeterminate state.
- **Radio** — Radio group with card variant.
- **Toggle / Switch** — Boolean toggle.
- **Textarea** — Auto-growing text area.
- **DatePicker** — Calendar-based date selection.
- **FileUpload** — Drag-and-drop file upload zone.
- **FormField** — Wrapper with label, helper text, error message.

#### Overlays (P0)
- **Dialog / Modal** — Accessible modal with focus trap, backdrop.
- **Drawer** — Slide-in panel (left, right, bottom).
- **Popover** — Positioned content panel.
- **Toast** — Non-blocking notification stack.
- **CommandPalette** — ⌘K-style search/command interface.

#### Layout (P0)
- **Stack** — Vertical/horizontal stack with gap.
- **Grid** — Responsive CSS Grid wrapper.
- **Container** — Centered content with max-width.
- **Divider** — Horizontal/vertical separator.
- **Spacer** — Flexible spacer element.
- **AspectRatio** — Fixed aspect ratio container.

#### E-commerce (P1)
- **ProductCard** — Product image, title, price, rating, add-to-cart.
- **CartItem** — Line item with image, quantity controls, remove.
- **QuantitySelector** — +/- stepper input.
- **PriceDisplay** — Price with sale/original, currency formatting.
- **RatingStars** — Star rating display + input.

#### Editorial (P1)
- **ArticleLayout** — Optimal reading width, responsive typography.
- **PullQuote** — Styled blockquote for editorial content.
- **AuthorCard** — Author bio with avatar, name, role.
- **RelatedPosts** — Grid of related article cards.
- **NewsletterSignup** — Email capture with inline form.

### 4.3 Component API Standards

Every component must follow these conventions:

```tsx
// File: packages/core/src/components/Button/Button.tsx

import type { ComponentPropsWithRef, ReactNode } from 'react';

export interface ButtonProps extends ComponentPropsWithRef<'button'> {
  /** Visual style variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline';
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg';
  /** Display loading spinner and disable interaction */
  loading?: boolean;
  /** Icon before the label */
  leadingIcon?: ReactNode;
  /** Icon after the label */
  trailingIcon?: ReactNode;
  /** Full-width button */
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`arcana-button arcana-button--${variant} arcana-button--${size}`}
        disabled={loading || props.disabled}
        aria-busy={loading}
        {...props}
      >
        {loading && <Spinner size="sm" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

**Rules:**
1. Always use `forwardRef` for DOM access.
2. Always support `className` passthrough for composition.
3. Default values for all optional props.
4. JSDoc comments on every prop (these feed into AI context).
5. CSS classes follow `arcana-{component}--{variant}` BEM-like convention.
6. All interactive elements must have proper ARIA attributes.
7. Component CSS references only semantic tokens (`var(--color-action-primary)`), never primitives or hardcoded values.

---

## 5. Theme Presets & Example Sites

### 5.1 Preset ↔ Demo Site Matrix

Every preset gets a canonical demo site type that showcases its strengths. The demo site also serves as a visual regression test fixture.

| # | Preset Name | Mood / Aesthetic | Best For | Demo Site |
|---|---|---|---|---|
| 1 | **Light** (default) | Warm, clean, professional | General purpose, SaaS | SaaS Dashboard |
| 2 | **Dark** | Deep, focused, modern | Dev tools, media apps | Admin Panel |
| 3 | **Terminal** | Green phosphor, hacker | CLI tools, dev dashboards | CLI Status Dashboard |
| 4 | **Retro 98** | Windows 98 nostalgia | Novelty, games, retro apps | Retro Personal Homepage |
| 5 | **Glass** | Apple-style translucent blur | Creative portfolios, luxury | Portfolio Landing Page |
| 6 | **Brutalist** | Raw, bold, maximalist | Art, fashion, editorial | Magazine / Editorial |
| 7 | **Corporate** *(new)* | Conservative, trustworthy, navy | Enterprise, finance, legal | Corporate Landing Page |
| 8 | **Startup** *(new)* | Vibrant gradients, energetic | SaaS marketing, startups | SaaS Marketing Site |
| 9 | **Editorial** *(new)* | Elegant serif, high contrast | News, blogs, publishing | News Editorial Site |
| 10 | **Commerce** *(new)* | Clean, product-focused | E-commerce, retail | E-commerce Product Page |
| 11 | **Midnight** *(new)* | Deep navy, soft gold accents | Finance, premium apps | Finance Dashboard |
| 12 | **Nature** *(new)* | Earth tones, organic shapes | Sustainability, health, food | Wellness / Recipe Blog |
| 13 | **Neon** *(new)* | Electric, dark bg, vivid accents | Gaming, nightlife, events | Event / Music Landing |
| 14 | **Mono** *(new)* | Black and white, stark, typographic | Minimal portfolio, law, architecture | Minimal Documentation |

### 5.2 Demo Site Specifications

Each demo site is a standalone Next.js or Vite app in the `demos/` directory that:

1. Uses **only** Arcana components and tokens (no external UI libraries).
2. Is fully responsive (verified at 320, 768, 1024, 1280px).
3. Includes realistic content (not lorem ipsum).
4. Serves as a **Playwright visual regression fixture**.
5. Deploys to Vercel as `{preset}-demo.arcana-ui.dev`.
6. Includes the **Arcana Theme Switcher** (see below).

### 5.2.1 Demo Site Theme Switcher

Every demo site includes a floating theme switcher bar fixed to the bottom of the viewport. This is the most powerful proof of Arcana's theming system — visitors can see the same real-world site transform across completely different visual identities in real-time.

**UI Design:**
```
┌──────────────────────────────────────────────────────────────────┐
│  🎨 Theme: [Light ▾]  [Compact|Default|Comfortable]  [Upload ↑] │
└──────────────────────────────────────────────────────────────────┘
```

**Components:**

1. **Preset dropdown**: Lists all available presets (all 14). Selecting one switches the entire demo site instantly via `data-theme` attribute. Current preset is highlighted.

2. **Density toggle**: Switch between compact, default, and comfortable. The entire demo site adjusts spacing in real-time.

3. **Upload button**: Opens a modal that lets users upload their own preset JSON file:
   - Modal headline: "Try your own theme"
   - Description: "Built a theme in the Arcana Playground? Upload the JSON file to preview it on this demo site."
   - Drag-and-drop zone or file picker (accepts .json only)
   - After upload: validates the JSON against the token schema
   - If valid: applies the custom theme immediately, adds "Custom" to the preset dropdown
   - If invalid: shows a clear error message explaining what's wrong
   - Link to playground: "Don't have a theme yet? Build one in the Playground →"

4. **Collapse/minimize**: Small arrow to collapse the bar to just an icon, so it doesn't obstruct content when not needed.

**Why this matters:**

- **For visitors**: "I can actually see what my brand would look like as a SaaS dashboard / e-commerce store / marketing site" — this is the conversion moment.
- **For investors**: proves Arcana's core thesis live — one component library, infinite visual identities.
- **For AI agents**: the demo sites ARE the proof that AI-generated themes produce real, usable UIs.
- **For developers evaluating Arcana**: they can build a theme in the playground, export the JSON, upload it to the dashboard demo, and see it running on a real application before committing to adoption.

**Technical implementation:**
- Build as a shared component: `packages/core/src/components/ThemeSwitcher/` or a standalone package
- The switcher reads the uploaded JSON, converts to CSS custom properties in-memory (using the same logic as the build pipeline), and injects them as a `<style>` block
- Custom themes are stored in sessionStorage so they persist during the visit but not permanently
- The switcher itself should be styled to be unobtrusive — small, fixed bottom, neutral dark styling that doesn't clash with any theme

**Minimum demo page set per site type:**

| Site Type | Pages |
|---|---|
| SaaS Dashboard | Dashboard (charts, KPIs), Users table, Settings, Login |
| Marketing / Landing | Home (hero, features, pricing, testimonials, CTA, footer) |
| Editorial / Blog | Homepage (article grid), Article detail, Author page |
| E-commerce | Product listing, Product detail, Cart, Checkout |
| Admin Panel | Dashboard, CRUD table, Form, Settings |
| Documentation | Home, Component page, API reference, Search results |
| Portfolio | Home (project grid), Project detail, About/contact |

### 5.3 Preset Design Guidelines

When creating a new preset, follow this process:

1. **Define the emotional territory** — 3–5 adjectives (e.g., "warm, trustworthy, restrained").
2. **Pick a primary hue** and build the full primitive palette around it (use OKLCH for perceptual uniformity).
3. **Choose typography** — display font + body font + mono font. The display font gives the preset its personality.
4. **Set the density** — compact (dashboards), default (general), comfortable (marketing/editorial).
5. **Define elevation strategy** — shadows (light themes) vs. surface lightness shifts (dark themes) vs. borders only (minimal themes).
6. **Set the radius curve** — sharp (0–2px for brutalist), standard (4–8px for corporate), round (12–16px for friendly), pill (full for playful).
7. **Define motion personality** — snappy (100–150ms for tools), natural (200–300ms for marketing), deliberate (400ms+ for editorial).
8. **Validate WCAG contrast** — every fg/bg pair must pass AA minimum (4.5:1 normal text, 3:1 large text).

---

## 6. Responsive & Mobile Strategy

### 6.1 Breakpoint System

```
│  Mobile   │  Tablet   │  Desktop  │  Wide     │  Ultra    │
│  < 640px  │  640–1023 │ 1024–1279 │ 1280–1535 │  ≥ 1536   │
│  sm       │  md       │  lg       │  xl       │  2xl      │
```

### 6.2 Mobile-First CSS

All component styles are written mobile-first. Desktop styles are additive via `min-width` media queries.

```css
/* Mobile (default) */
.arcana-card {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
}

/* Tablet and up */
@media (min-width: 640px) {
  .arcana-card {
    padding: var(--spacing-lg);
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .arcana-card {
    padding: var(--spacing-xl);
  }
}
```

### 6.3 Touch Target Requirements

- Minimum touch target: **44 × 44px** (WCAG 2.5.8).
- Interactive elements on mobile must have adequate spacing (min 8px gap).
- No hover-only interactions. Every hover state must have a focus or tap equivalent.

### 6.4 Responsive Component Patterns

| Pattern | Mobile | Tablet | Desktop |
|---|---|---|---|
| Navigation | Hamburger → Drawer | Tab bar or compact sidebar | Full sidebar or top nav |
| Data table | Card stack or horizontal scroll | Compact table | Full table |
| Grid layout | 1 column | 2 columns | 3–4 columns |
| Modal | Full-screen bottom sheet | Centered dialog | Centered dialog |
| Sidebar | Hidden (overlay on toggle) | Collapsed icons | Expanded with labels |
| Hero section | Stacked (image below text) | Side-by-side | Side-by-side with more whitespace |
| Pricing cards | Stacked vertically | 2-up grid | 3-up grid |
| Footer | Stacked accordion sections | 2-column grid | 4-column grid |

### 6.5 Density Modes

Presets can specify a density mode that adjusts spacing globally:

| Mode | Base Unit | Use Case |
|---|---|---|
| `compact` | 4px | Data-dense dashboards, admin panels |
| `default` | 8px | General purpose |
| `comfortable` | 12px | Marketing sites, editorial, landing pages |

Density is controlled via a CSS class on the root: `data-density="compact"`.

---

## 7. Testing Strategy

### 7.1 Test Pyramid

```
          ╱ Visual Regression (Playwright) ╲
         ╱   Component tests (Vitest + RTL)  ╲
        ╱     Token validation (CI linter)     ╲
       ╱       A11y checks (axe-core)            ╲
      ╱          Type safety (TypeScript strict)    ╲
```

### 7.2 Test Requirements by Type

**Token validation (CI):**
- Every component CSS file references only `var(--*)` tokens. No hardcoded colors, sizes, or shadows.
- Every semantic token resolves to a valid primitive.
- Every fg/bg pair passes WCAG AA contrast ratio.
- All breakpoint tokens are valid CSS lengths.

**Component tests (Vitest + React Testing Library):**
- Every component renders without errors.
- Every variant renders correctly.
- Keyboard navigation works (Tab, Enter, Escape, Arrow keys).
- ARIA attributes are present and correct.
- Event handlers fire as expected.

**Visual regression (Playwright):**
- Capture screenshots of every component at 3 breakpoints (320, 768, 1280).
- Capture screenshots of every demo site page at 3 breakpoints.
- Run on every PR. Fail on unexpected pixel diff > 0.1%.
- Store baselines in the repo.

**Accessibility (axe-core + manual):**
- Run axe-core on every component story and demo page.
- Zero critical/serious violations.
- Manual screen reader testing for complex components (Modal, DataTable, Select, Tabs).

### 7.3 Demo Sites as Test Fixtures

Each demo site doubles as an integration test fixture:

```
demos/
  saas-dashboard/        → Tests dashboard components at all breakpoints
  marketing-landing/     → Tests marketing components, hero, pricing
  editorial-blog/        → Tests typography, article layout, editorial components
  ecommerce-product/     → Tests product card, cart, forms
  admin-panel/           → Tests tables, forms, settings
```

Playwright runs against each deployed demo site, comparing screenshots against baselines.

---

## 8. AI Agent Contribution Guide

This section is specifically for Claude Code, Cursor, Copilot, and other AI code agents working on Arcana UI. If you're an AI agent reading this, follow these instructions precisely.

### 8.1 Before You Start

1. **Read `CLAUDE.md`** in the project root. It contains project-specific instructions and memory.
2. **Read `SPEC.md`** for the full technical specification.
3. **Read this `ROADMAP.md`** to understand the current phase and priorities.
4. **Run `pnpm install && pnpm build`** to verify the project builds.
5. **Run `pnpm test`** to verify tests pass.

### 8.2 Working on a Task

When picking up a task from this roadmap:

```
1. Identify the task number (e.g., "3.2 — Build navigation components")
2. Create a branch: `git checkout -b feat/3.2-navigation-components`
3. Read any existing code in the relevant directory
4. Follow the Component API Standards (Section 4.3)
5. Write the component
6. Write tests
7. Update the component index/barrel export
8. Run `pnpm lint && pnpm test && pnpm build`
9. Commit with conventional commit: `feat(core): add Navbar component`
10. Open a PR with the task number in the title
```

### 8.3 File Structure Conventions

```
packages/
  tokens/
    src/
      presets/
        light.json          # Theme preset JSON
        dark.json
        terminal.json
        ...
      build.ts              # JSON → CSS build script
    dist/
      arcana.css            # All themes compiled
      themes/
        light.css           # Individual theme CSS
        dark.css
  core/
    src/
      components/
        Button/
          Button.tsx         # Component implementation
          Button.css         # Component styles (tokens only!)
          Button.test.tsx    # Unit tests
          Button.stories.tsx # Storybook stories (future)
          index.ts           # Barrel export
        Card/
          ...
      hooks/
        useTheme.ts
        useBreakpoint.ts
        useMediaQuery.ts
      utils/
        cn.ts               # Class name utility
        tokens.ts            # Token access helpers
      index.ts               # Main barrel export
demos/
  saas-dashboard/
  marketing-landing/
  editorial-blog/
  ecommerce-product/
playground/
  ...
docs/
  ...
```

### 8.4 CSS Rules for AI Agents

**NEVER do this:**
```css
/* ❌ Hardcoded values */
.arcana-button {
  background: #4f46e5;
  padding: 12px 24px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  font-size: 14px;
  transition: all 0.2s ease;
}
```

**ALWAYS do this:**
```css
/* ✅ Token references */
.arcana-button {
  background: var(--color-action-primary);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  font-size: var(--font-size-sm);
  transition: background var(--duration-fast) var(--easing-default);
}

.arcana-button:hover {
  background: var(--color-action-primary-hover);
  box-shadow: var(--shadow-md);
}

.arcana-button:focus-visible {
  outline: none;
  box-shadow: var(--border-focus-ring);
}

.arcana-button:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}
```

### 8.5 Commit Message Convention

```
type(scope): description

# Types:
feat     — new feature
fix      — bug fix  
refactor — code change that doesn't fix a bug or add a feature
style    — formatting, missing semi colons, etc.
docs     — documentation only
test     — adding or updating tests
chore    — build process, CI, dependencies
perf     — performance improvement

# Scopes:
tokens   — token system
core     — component library
docs     — documentation
playground — playground app
demo     — demo sites
ci       — CI/CD configuration

# Examples:
feat(tokens): add elevation shadow system
feat(core): add Navbar component with responsive collapse
fix(core): Button focus ring not visible in dark theme
refactor(tokens): migrate to three-tier token hierarchy
test(core): add visual regression tests for Card component
docs: update ROADMAP with Phase 2 completion status
```

### 8.6 PR Checklist for AI Agents

Before opening a PR, verify:

- [ ] Code compiles: `pnpm build` passes
- [ ] Linter passes: `pnpm lint` has no errors
- [ ] Tests pass: `pnpm test` has no failures
- [ ] No hardcoded values in CSS (only token references)
- [ ] All new components have TypeScript interfaces with JSDoc
- [ ] All interactive elements have ARIA attributes
- [ ] Component works at 320px, 768px, and 1280px viewport widths
- [ ] Component has a test file
- [ ] Barrel exports updated (`index.ts`)
- [ ] Commit messages follow conventional commits

### 8.7 How to Add a New Component

Step-by-step for AI agents:

```bash
# 1. Create the component directory
mkdir -p packages/core/src/components/Navbar

# 2. Create the files
touch packages/core/src/components/Navbar/Navbar.tsx
touch packages/core/src/components/Navbar/Navbar.css
touch packages/core/src/components/Navbar/Navbar.test.tsx
touch packages/core/src/components/Navbar/index.ts

# 3. Write the component (see Section 4.3 for API standards)
# 4. Write CSS using only token references
# 5. Write tests
# 6. Export from index.ts:
#    export { Navbar } from './Navbar';
#    export type { NavbarProps } from './Navbar';

# 7. Add to main barrel export:
#    packages/core/src/index.ts → export * from './components/Navbar';

# 8. Verify
pnpm build && pnpm test && pnpm lint
```

### 8.8 How to Add a New Theme Preset

```bash
# 1. Create the preset JSON in packages/tokens/src/presets/
cp packages/tokens/src/presets/light.json packages/tokens/src/presets/corporate.json

# 2. Edit the JSON:
#    - Change name, description
#    - Update all primitive color values
#    - Update typography (font families, if different)
#    - Adjust radius curve, shadow style, motion personality
#    - Verify WCAG contrast on all fg/bg pairs

# 3. Add to build configuration
# 4. Run token build: pnpm build:tokens
# 5. Verify in playground: toggle to new preset, check all components
# 6. Build corresponding demo site (see Section 5.2)
```

### 8.9 How to Build a Demo Site

```bash
# 1. Create the demo directory
mkdir -p demos/saas-dashboard

# 2. Initialize with Vite or Next.js
cd demos/saas-dashboard
npm create vite@latest . -- --template react-ts

# 3. Install Arcana
pnpm add @arcana-ui/core @arcana-ui/tokens

# 4. Build pages using ONLY Arcana components
# 5. Use realistic content (not lorem ipsum)
# 6. Verify responsive at 320, 768, 1024, 1280px
# 7. Add Playwright test fixtures
# 8. Deploy to Vercel
```

---

## 9. Project Standards & Conventions

### 9.1 TypeScript

- Strict mode enabled (`"strict": true`).
- No `any` types. Use `unknown` and narrow.
- Interfaces over types for component props (for declaration merging).
- Explicit return types on exported functions.

### 9.2 CSS

- Mobile-first media queries (`min-width`).
- BEM-like naming: `arcana-{component}`, `arcana-{component}--{variant}`, `arcana-{component}__part`.
- No nesting beyond 3 levels.
- No `!important`.
- All values via CSS custom properties (tokens). Zero hardcoded colors, sizes, or shadows.
- Use `prefers-reduced-motion` for all animations.

### 9.3 Accessibility

- Every interactive element must be keyboard accessible.
- Every form input must have an associated label.
- Color must never be the sole indicator of state (use icons or text too).
- Focus indicators must be visible in all themes.
- Screen reader testing for complex components.
- Minimum contrast ratios: 4.5:1 (normal text), 3:1 (large text/UI elements).

### 9.4 Naming

- Component files: PascalCase (`Button.tsx`)
- Token files: kebab-case (`light.json`)
- CSS classes: kebab-case with `arcana-` prefix (`arcana-button--primary`)
- Test files: PascalCase with `.test` suffix (`Button.test.tsx`)
- Hooks: camelCase with `use` prefix (`useTheme.ts`)
- Utility functions: camelCase (`mergeProps.ts`)

### 9.5 Dependencies

Keep dependencies minimal:
- **React** — peer dependency (user provides)
- **No runtime CSS-in-JS** — pure CSS custom properties
- **No Tailwind** — tokens via CSS vars only
- **No lodash/moment** — use native APIs
- Dev dependencies only: Vitest, Playwright, TypeScript, Biome

---

## Appendix A: Complete Token Inventory

Below is the target inventory of every CSS custom property Arcana must ship. This is the source of truth for what needs to be built.

### Colors (per theme)

```
--color-bg-page
--color-bg-surface
--color-bg-elevated
--color-bg-sunken
--color-bg-overlay
--color-bg-subtle

--color-fg-primary
--color-fg-secondary
--color-fg-muted
--color-fg-inverse
--color-fg-on-primary
--color-fg-on-destructive

--color-action-primary
--color-action-primary-hover
--color-action-primary-active
--color-action-primary-disabled
--color-action-secondary
--color-action-secondary-hover
--color-action-ghost
--color-action-ghost-hover
--color-action-destructive
--color-action-destructive-hover

--color-border-default
--color-border-muted
--color-border-focus
--color-border-error
--color-border-success

--color-status-success-bg
--color-status-success-fg
--color-status-success-border
--color-status-warning-bg
--color-status-warning-fg
--color-status-warning-border
--color-status-error-bg
--color-status-error-fg
--color-status-error-border
--color-status-info-bg
--color-status-info-fg
--color-status-info-border

--color-accent-primary
--color-accent-secondary
```

### Typography

```
--font-family-display
--font-family-body
--font-family-mono

--font-size-xs          (0.75rem / 12px)
--font-size-sm          (0.875rem / 14px)
--font-size-base        (1rem / 16px)
--font-size-lg          (1.125rem / 18px)
--font-size-xl          (1.25rem / 20px)
--font-size-2xl         (1.5rem / 24px)
--font-size-3xl         (1.875rem / 30px)
--font-size-4xl         (2.25rem / 36px)
--font-size-5xl         (3rem / 48px)

--font-weight-light     (300)
--font-weight-normal    (400)
--font-weight-medium    (500)
--font-weight-semibold  (600)
--font-weight-bold      (700)
--font-weight-black     (900)

--line-height-tight     (1.25)
--line-height-normal    (1.5)
--line-height-relaxed   (1.75)

--letter-spacing-tight  (-0.025em)
--letter-spacing-normal (0)
--letter-spacing-wide   (0.05em)
```

### Spacing

```
--spacing-0    (0)
--spacing-px   (1px)
--spacing-0.5  (0.125rem / 2px)
--spacing-1    (0.25rem / 4px)
--spacing-1.5  (0.375rem / 6px)
--spacing-2    (0.5rem / 8px)
--spacing-3    (0.75rem / 12px)
--spacing-4    (1rem / 16px)
--spacing-5    (1.25rem / 20px)
--spacing-6    (1.5rem / 24px)
--spacing-8    (2rem / 32px)
--spacing-10   (2.5rem / 40px)
--spacing-12   (3rem / 48px)
--spacing-16   (4rem / 64px)
--spacing-20   (5rem / 80px)
--spacing-24   (6rem / 96px)
--spacing-32   (8rem / 128px)

--spacing-xs   (alias → --spacing-1)
--spacing-sm   (alias → --spacing-2)
--spacing-md   (alias → --spacing-4)
--spacing-lg   (alias → --spacing-6)
--spacing-xl   (alias → --spacing-8)
--spacing-2xl  (alias → --spacing-12)
--spacing-3xl  (alias → --spacing-16)
--spacing-section (alias → --spacing-24)
```

### Elevation

```
--shadow-xs     (0 1px 2px rgba(0,0,0,0.05))
--shadow-sm     (0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06))
--shadow-md     (0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -2px rgba(0,0,0,0.1))
--shadow-lg     (0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1))
--shadow-xl     (0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1))
--shadow-2xl    (0 25px 50px -12px rgba(0,0,0,0.25))
--shadow-inner  (inset 0 2px 4px rgba(0,0,0,0.05))
--shadow-none   (none)

--z-base        (0)
--z-dropdown    (100)
--z-sticky      (200)
--z-fixed       (300)
--z-overlay     (400)
--z-modal       (500)
--z-popover     (600)
--z-toast       (700)
--z-tooltip     (800)
```

### Border & Shape

```
--radius-none   (0)
--radius-sm     (0.25rem / 4px)
--radius-md     (0.375rem / 6px)
--radius-lg     (0.5rem / 8px)
--radius-xl     (0.75rem / 12px)
--radius-2xl    (1rem / 16px)
--radius-full   (9999px)

--border-thin   (1px)
--border-default (1.5px)
--border-thick  (2px)

--focus-ring    (0 0 0 3px color-mix(in srgb, var(--color-action-primary) 30%, transparent))
--focus-offset  (2px)
```

### Motion

```
--duration-instant  (0ms)
--duration-fast     (100ms)
--duration-normal   (200ms)
--duration-slow     (300ms)
--duration-slower   (500ms)

--ease-default  (cubic-bezier(0.4, 0, 0.2, 1))
--ease-in       (cubic-bezier(0.4, 0, 1, 1))
--ease-out      (cubic-bezier(0, 0, 0.2, 1))
--ease-in-out   (cubic-bezier(0.4, 0, 0.2, 1))
--ease-spring   (cubic-bezier(0.34, 1.56, 0.64, 1))
```

### Layout

```
--breakpoint-sm   (640px)
--breakpoint-md   (768px)
--breakpoint-lg   (1024px)
--breakpoint-xl   (1280px)
--breakpoint-2xl  (1536px)

--container-sm    (640px)
--container-md    (768px)
--container-lg    (1024px)
--container-xl    (1280px)

--content-prose   (65ch)
--content-wide    (80rem)
--content-full    (100%)
```

### Opacity

```
--opacity-0         (0)
--opacity-5         (0.05)
--opacity-10        (0.1)
--opacity-25        (0.25)
--opacity-50        (0.5)
--opacity-75        (0.75)
--opacity-100       (1)
--opacity-disabled  (0.4)
--opacity-hover     (0.8)
--opacity-overlay   (0.5)
```

---

## Appendix B: Competitive Analysis Reference

These are the design systems Arcana should study, learn from, and differentiate against:

| System | Study For | URL |
|---|---|---|
| Material 3 (Google) | Token hierarchy, color system, motion | m3.material.io |
| Carbon (IBM) | Enterprise patterns, accessibility, density | carbondesignsystem.com |
| Spectrum (Adobe) | Scale, localization, responsive | spectrum.adobe.com |
| Fluent 2 (Microsoft) | Adaptive theming, cross-platform | fluent2.microsoft.design |
| Radix Themes | Token-driven components, developer DX | radix-ui.com/themes |
| shadcn/ui | AI adoption patterns, copy-paste model | ui.shadcn.com |
| Chakra UI | Theme config API, composability | chakra-ui.com |
| Mantine | Component breadth, form handling | mantine.dev |
| Ant Design | Enterprise component depth | ant.design |
| Apple HIG | Responsive patterns, density, platform feel | developer.apple.com/design |

---

## Appendix C: Glossary

| Term | Definition |
|---|---|
| **Primitive token** | A raw design value (e.g., `blue-500: #3b82f6`). Never referenced directly by components. |
| **Semantic token** | A contextual token that references a primitive (e.g., `action-primary: {blue-600}`). Components reference these. |
| **Component token** | A scoped override for a specific component (e.g., `button-bg: {action-primary}`). |
| **Preset** | A complete theme configuration (JSON file) that maps all semantic tokens to primitives. |
| **Density mode** | Spacing multiplier that controls how compact or spacious the UI feels. |
| **Manifest** | `manifest.ai.json` — machine-readable index of all components, tokens, and presets for AI discovery. |

---

## Phase 6: Extensibility & Developer Experience (NEW -- April 2026)
> **Goal:** Make Arcana easy to extend, customize at depth, and integrate into real workflows. This is the phase that turns Arcana from a library into a platform.

| # | Task | Priority | Effort | Description |
|---|------|----------|--------|-------------|
| 6.1 | **Icon system** | P0 | L | Arcana ships with a recommended default icon library (e.g., Lucide). Components that use icons (Button with leadingIcon, Alert, Toast, EmptyState, etc.) accept any ReactNode for icon slots, so users are never locked in. Three modes: (1) Use the default recommended library (zero config), (2) Use no icons (pass `null` or omit), (3) Bring your own icon library (pass any component). Documentation shows examples with Lucide, Heroicons, Phosphor, and custom SVGs. A `docs/ICONS.md` guide explains the pattern. The CLI `init` command asks which icon library to install (or none). |
| 6.2 | **Extension guidelines (EXTENDING.md)** | P0 | M | A comprehensive guide that AI agents and human developers follow to build new components that match the Arcana system. Covers: file structure, naming conventions (arcana- prefix, BEM-like), token usage rules (never hardcode), prop API patterns (variant, size, className passthrough, forwardRef), CSS rules (mobile-first, max 3 nesting levels), accessibility checklist, test requirements. Includes a component template generator in the CLI. The goal: any component built following this guide is indistinguishable from a first-party Arcana component. |
| 6.3 | **CLI enhancements** | P0 | L | Expand the CLI beyond init/validate/add-theme. New commands: `create-component` (scaffold a new component following EXTENDING.md guidelines), `add-theme --from-description "warm minimalist coffee shop"` (AI-powered theme generation from the terminal), `update` (check for newer Arcana versions and migrate), `doctor` (diagnose common setup issues), `eject-theme` (copy a preset JSON into your project for full customization). Each command should feel fast. Terminal output is minimal and purposeful. |
| 6.4 | **Variant-depth token customization** | P1 | L | Currently component tokens control the base appearance (e.g., `--button-bg`, `--button-radius`). This task extends the component token layer so variants are independently tunable from the preset JSON. Example: `component.button.primary.bg`, `component.button.ghost.bg`, `component.button.destructive.bg` each resolve independently. A preset can make primary buttons have sharp corners while ghost buttons stay rounded. Same for sizes: `component.button.sm.height`, `component.button.lg.height`. The cascade still works: variant tokens fall back to base component tokens, which fall back to semantic tokens, which fall back to primitives. |
| 6.5 | **DESIGN.md export** | P1 | M | Generate a DESIGN.md file from Arcana tokens. DESIGN.md is an emerging standard (Google Stitch, 4.3k stars in 3 days) that AI agents read to produce consistent UI. Arcana's token system is more structured than hand-written DESIGN.md files, so the export should be high quality. Command: `arcana export-design-md --preset corporate`. Output includes: visual theme description, full color palette with semantic names, typography hierarchy, component styles with states, layout principles, elevation system, and design guardrails. This positions Arcana as a DESIGN.md generator, not just a consumer. |

---

## Phase 7: External Validation (NEW -- April 2026)
> **Goal:** Prove Arcana works in production by building real apps in separate repositories that install from npm. Every pain point becomes a tracked issue.

| # | Task | Priority | Effort | Description |
|---|------|----------|--------|-------------|
| 7.1 | **arcana-starter-saas** | P0 | XL | Production-quality SaaS starter template in a standalone repo under `github.com/Arcana-UI/arcana-starter-saas`. Next.js 14+ App Router. Pages: dashboard (charts, stat cards, data table), auth (login, register, forgot password), settings (profile, billing, team), and a users table. Installs `@arcana-ui/core` and `@arcana-ui/tokens` from npm (not workspace links). Includes ThemeSwitcher with all 14 presets. README with setup instructions, screenshots, and "Built with Arcana" badge. |
| 7.2 | **arcana-starter-storefront** | P0 | XL | Marketing / ecommerce starter template under `github.com/Arcana-UI/arcana-starter-storefront`. Vite + React (proving framework flexibility). Landing page with hero, features, testimonials. Product/menu grid with filtering. Product detail page. Cart flow (local state). Contact page. Themed around a food/catering concept for authenticity. Installs from npm. ThemeSwitcher with all 14 presets. |
| 7.3 | **Website clone rebuilds** | P0 | XL | Pick 3-5 real, well-known websites and attempt to rebuild key pages using only Arcana components and tokens. Purpose: stress-test the design system's flexibility and find gaps. For each site, document: (1) which components were used, (2) which components were missing, (3) which tokens needed extension, (4) where the system felt rigid, (5) overall fidelity score. Candidates: a Stripe-style pricing page, a Linear-style dashboard, a Vercel-style marketing page, a Notion-style doc page, an Apple-style product page. Results feed directly into component and token backlog. |
| 7.4 | **DX friction tracking** | P0 | S | Establish a feedback system: every external repo gets a `FEEDBACK.md` where developers (human or AI) log friction points as they build. Each entry includes: what they tried, what went wrong or felt awkward, and a suggested fix. These entries become GitHub issues on the main Arcana repo with a `dx-friction` label. Run a retrospective after each repo is complete. |

---

## Phase 8: GTM & Distribution (NEW -- April 2026)
> **Goal:** Get Arcana in front of developers, AI tools, and investors. Distribution is the product.

| # | Task | Priority | Effort | Description |
|---|------|----------|--------|-------------|
| 8.1 | **README overhaul** | P0 | M | Rewrite the README with competitive positioning. Lead with the value prop ("Describe your brand. Get a design system."), show a GIF or screenshot of AI theme generation, include the comparison table against shadcn/MUI/Chakra, link to all demo sites, and make the quickstart dead simple. The README is the landing page for 90% of developers. |
| 8.2 | **Claude marketplace listing** | P0 | M | Submit Arcana as a skill on the Claude marketplace. Category: Design. The listing should demonstrate the AI generation flow and link to the MCP server. First-mover advantage: no design system listings currently exist. |
| 8.3 | **Show HN launch** | P1 | M | Prepare and execute a Hacker News launch. Title should emphasize the AI-native angle, not just "another design system." Include the playground link, demo sites, and the "describe your brand" flow. Time the launch for a Tuesday or Wednesday morning. |
| 8.4 | **Community onboarding** | P1 | M | Contributor guide (CONTRIBUTING.md update), good-first-issue labels, community starter templates (Remix, Astro beyond the existing Next.js and Vite), and a Discord or GitHub Discussions setup. |
| 8.5 | **Performance audit** | P1 | L | Fix tree-shaking (per-component entry points in tsup), audit bundle size per component, measure CSS size per theme, Lighthouse scores on all demo sites. Target: importing a single component should not ship 278 kB. |
| 8.6 | **Documentation site** | P0 | XL | Auto-generated from manifest.ai.json. Component pages with live examples, prop tables, token usage, and accessibility notes. Theme explorer. Token reference. Getting started guide. Search. Deployed to docs.arcana-ui.com. |

---

## Appendix D: Future Ideas & Backlog

These are ideas we want to pursue but haven't scheduled into a phase yet. They live here so they don't get lost and so contributors can see where the project is heading long-term. When an idea matures enough to have a clear scope and dependencies, promote it into a phase.

### Figma Integration

| Idea | Description | Complexity | Dependencies |
|---|---|---|---|
| **Tokens Studio export** | Add a build step that converts each preset JSON into Tokens Studio format (`*.tokens.json`). Designers import the file via the Tokens Studio Figma plugin and instantly get all variables populated. This is the lowest-friction path to Figma interop — no API keys, no plugin development. | Medium | Token build pipeline (0.4) |
| **Figma Variables API push** | CLI command (`arcana export-figma --preset corporate --file-key abc123`) that pushes semantic tokens directly into a Figma file as native Variables with modes (light/dark, density). Requires Figma API token. More powerful than Tokens Studio because it uses Figma's own variable system. | Large | Tokens Studio export, stable token names |
| **Figma plugin ("Arcana Theme Importer")** | A Figma community plugin that lets designers paste a preset JSON (or fetch from URL) and auto-creates all local variables, text/color/effect styles, and optionally a starter component library. Best end-user experience but requires maintaining a separate Figma plugin codebase. | XL | Stable v1.0 release, Figma Variables API experience |
| **Figma → Arcana reverse sync** | Pull token updates from Figma back into the JSON presets via Tokens Studio's GitHub sync or the Variables API. Enables designers to tweak tokens in Figma and have changes flow back to code automatically. | Large | Bidirectional Tokens Studio setup |

### React Native Support

| Idea | Description | Complexity | Dependencies |
|---|---|---|---|
| **`@arcana-ui/native` package** | A React Native component library that consumes the same token JSON presets but outputs `StyleSheet` objects instead of CSS custom properties. Same component APIs, same prop names, same theming model — different rendering target. | XL | Stable component APIs (post-Phase 3), settled token schema |
| **Token → StyleSheet build step** | Extend the token build pipeline to output a `tokens.native.ts` file alongside CSS, exporting all token values as a typed JavaScript object that React Native `StyleSheet.create()` can consume. | Medium | Token build pipeline (0.4) |
| **Shared token schema, divergent components** | Architecture where `@arcana-ui/tokens` remains the single source of truth and both `@arcana-ui/core` (web) and `@arcana-ui/native` (RN) read from it. Components are separate packages but share prop interfaces via a shared `@arcana-ui/types` package. | Large | Stable token schema, stable prop interfaces |
| **Expo + React Native Web bridge** | Support React Native Web so Arcana components can run in both native and web contexts from a single codebase. Would let teams use Arcana for universal apps. | XL | @arcana-ui/native package |

### Platform & Framework Expansion

| Idea | Description | Complexity | Dependencies |
|---|---|---|---|
| **Vue component library** | `@arcana-ui/vue` — same token system, Vue 3 components with Composition API. | XL | Stable token schema, stable component patterns |
| **Svelte component library** | `@arcana-ui/svelte` — Svelte 5 components consuming the same tokens. | XL | Same as Vue |
| **Web Components** | Framework-agnostic custom elements that work everywhere (vanilla JS, Angular, etc.). Built on the same token CSS. | XL | Stable CSS token output |
| **Astro integration** | First-class Astro support with an `@arcana-ui/astro` package for server-rendered components. | Medium | Stable core package |

### Developer Experience

| Idea | Description | Complexity | Dependencies |
|---|---|---|---|
| **Theme playground CLI** | `npx arcana-ui create-theme` — interactive CLI that walks through color selection, typography, density, and generates a complete preset JSON. | Medium | Stable token schema |
| **VS Code extension** | Token autocomplete, color preview swatches in the editor, theme preview panel. | Large | Stable token names |
| **Storybook integration** | Official Storybook addon for theme switching and token visualization. | Medium | Stable components |
| **AI theme generation** | "Describe your brand in 2 sentences" → AI generates a complete preset JSON. Could be a CLI tool or a web feature in the playground. | Medium | Stable token schema, LLM API integration |

### Theme Studio (Multi-Brand Workspace)

The vision: a web-based theme editor where a brand can create, name, and manage multiple themes — then switch between them in real-time to compare. Think "Figma for design tokens." This is a significant product surface that evolves in stages:

| Idea | Description | Complexity | Dependencies |
|---|---|---|---|
| **Named theme workspaces** | Upgrade the playground from a single-theme editor to a multi-theme workspace. Users can create new themes, name them (e.g., "Ritz-Carlton", "W Hotels", "Courtyard"), and switch between them instantly. Each theme is a complete preset JSON stored in the browser. Export any theme as a JSON file. | Large | Stable token schema, full component library |
| **Side-by-side theme comparison** | Split-screen or overlay mode that renders the same component/page in two themes simultaneously. Essential for brands managing light + dark + high-contrast, or parent brand + sub-brands. | Medium | Named theme workspaces |
| **Live component preview** | As you edit token values, every component updates in real-time. Organized by component category so you can see how your changes affect buttons, cards, forms, and marketing sections all at once. | Medium | Named theme workspaces, full component library |
| **Component-level token editor** | Expose the Tier 3 (component token) surface in the UI. A user can click on a Card component and directly adjust its shadow, radius, padding, and border — overriding the semantic defaults for that specific component within this theme. | Large | Component token layer (1.12), named theme workspaces |
| **Density mode preview** | Toggle between compact/default/comfortable in the theme editor and see all components adapt in real-time. Critical for brands that need both dashboard and marketing aesthetics. | Medium | Density modes (1.3), named theme workspaces |
| **Persistent storage (local)** | Themes persist in the browser via IndexedDB or localStorage so users don't lose work between sessions. Import/export as JSON for backup and sharing. | Medium | Named theme workspaces |
| **Cloud storage with accounts** | User accounts (OAuth — GitHub, Google) with cloud-saved theme workspaces. Share themes via URL. Collaborate on theme development. This is where Arcana becomes a product, not just a library. | XL | Persistent local storage, auth infrastructure, backend/database |
| **Theme version history** | Track changes to a theme over time. Diff between versions. Restore previous states. Works locally first (undo stack), then with cloud storage (full version history). | Large | Cloud storage with accounts |
| **Team collaboration** | Multiple team members can edit the same theme workspace. Real-time sync (like Figma). Role-based access: editor, viewer, admin. | XL | Cloud storage with accounts, real-time sync infrastructure |
| **Brand guidelines export** | Generate a comprehensive brand guidelines document (PDF or web page) from a theme — showing color palette, typography scale, spacing system, component examples, and usage rules. Essentially auto-generates a design system documentation site from a single JSON file. | Large | Named theme workspaces, full component library, docs infrastructure |

### Advanced Token Features

| Idea | Description | Complexity | Dependencies |
|---|---|---|---|
| **W3C Design Tokens spec export** | Output tokens in the official W3C Design Tokens Format (2025.10) for interop with any spec-compliant tool. | Medium | Token build pipeline |
| **Multi-brand token sets** | Support multiple brands within a single Arcana installation — e.g., a company with 3 sub-brands sharing components but with different color/type tokens. | Large | Stable token architecture |
| **Animation token presets** | Pre-built motion personality packs (snappy, smooth, playful, dramatic) that override the motion tokens as a group. | Small | Motion tokens (Phase 1) |
| **Dark mode auto-generation** | Given a light theme preset, automatically generate a perceptually balanced dark variant using OKLCH color space manipulation. | Medium | Full color system (Phase 1) |
| **Token diff tool** | CLI command that compares two presets and outputs the differences — useful for reviewing theme changes in PRs. | Small | Token build pipeline |
| **Light/dark mode pairing per preset** | Presets that suit both modes (Corporate, Startup, Commerce, Editorial) get hand-tuned light + dark pairs. Single-mode presets (Terminal=dark, Retro 98=light, Brutalist=light, Glass=light, Neon=dark, Midnight=dark) stay single-mode — their identity depends on it. JSON schema supports a `modes` key with `light` and `dark` sub-objects sharing the same component tokens. Theme picker shows a ☀️/🌙 toggle on presets that support both modes. System preference detection (`prefers-color-scheme`) auto-selects the right mode. This roughly doubles the design work for 5-6 presets but makes Arcana production-ready for any app that needs dark mode. | Large | Stable presets, full color system |

### AI Override System (Conversational Component Tuning)

The AI Override system lets users describe component-level design changes in plain English. The AI interprets the request, identifies the correct component tokens (Tier 3) to modify, previews the changes, and applies them on confirmation. This is the bridge between "I know what I want it to look like" and "I don't know which token to change."

It works because of the three-tier token architecture — the AI only modifies the component tier, which is isolated, revertable, and doesn't affect other components or the global theme.

| Stage | Description | Complexity | Dependencies |
|---|---|---|---|
| **Basic text-to-token override** | User types "make the cards more elevated" → AI identifies card.shadow and card.radius tokens → shows a diff preview → applies on confirm. Supports single-component changes. Requires COMPONENT-TOKENS.md as AI context + current theme JSON. | Large | Component token layer (1.12), playground editor, LLM API integration |
| **Multi-token intent mapping** | AI understands compound requests: "make it feel more like iOS" → adjusts radius (rounder), input background (sunken), shadows (inner), borders (transparent) across multiple components in one action. Maps design intent to coordinated token changes. | Large | Basic text-to-token override |
| **Scope clarification** | When intent is ambiguous, AI asks: "Do you want to increase radius globally (all components) or just on cards?" User picks → AI modifies the correct tier (semantic for global, component for scoped). | Medium | Multi-token intent mapping |
| **Undo/redo stack** | Every AI override is stored as a discrete token diff. Users can undo individual changes, redo them, or revert to any previous state. "Actually, revert the card changes" works naturally. | Medium | Basic text-to-token override |
| **Click-to-override** | User clicks a component in the live preview → it highlights and its current component tokens appear in a panel → user can describe changes scoped to that component or manually adjust tokens. Visual alternative to typing. | Large | Basic text-to-token override, playground editor |
| **Override presets** | Pre-built override packs: "Make it feel like iOS", "Add Material Design depth", "Brutalist flat", "Glassmorphism". One-click applies a curated set of component token overrides on top of any base theme. Like Instagram filters for design systems. | Medium | Multi-token intent mapping, curated override sets |
| **WCAG auto-check on override** | After any color-related AI override, automatically run contrast validation. If a change breaks accessibility, AI warns and suggests an accessible alternative before applying. | Medium | WCAG validation (1.11), basic text-to-token override |
| **Override sharing** | Export a set of component token overrides as a standalone JSON file that can be applied on top of any base theme. Users can share overrides: "Here's my iOS-style override pack." | Small | Basic text-to-token override, export functionality |

### Community & Ecosystem

| Idea | Description | Complexity | Dependencies |
|---|---|---|---|
| **Theme marketplace** | Community-contributed presets hosted on the Arcana docs site. Browse, preview, and install with one command. | Large | Docs site (Phase 5), stable preset format |
| **Component recipe library** | Curated compositions — e.g., "SaaS pricing page" = Hero + PricingCard × 3 + FAQ + CTA. Copy-paste ready, like shadcn/ui blocks. | Medium | Expanded component library (Phase 3) |
| **Accessibility audit CI action** | GitHub Action that runs axe-core + contrast checks on every PR and posts results as a comment. Publishable for other projects to use. | Medium | Testing infrastructure (Phase 0) |
| **Arcana + AI starter kits** | Pre-built project templates optimized for AI-assisted development: "Build a SaaS dashboard" prompt + Arcana + Next.js + sample data. | Medium | Community templates (Phase 5) |

---

*To propose a new idea, add it to the appropriate table above with a description, complexity estimate, and dependencies. When an idea is ready to be scheduled, move it into the relevant phase and add it to PROGRESS.md.*

---

*This roadmap is a living document. Update it as tasks are completed. Mark items with ✅ when done.*

*Arcana: Where intention meets interface.* 🔮
