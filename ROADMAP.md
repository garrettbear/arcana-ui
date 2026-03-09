# Arcana UI — Product Roadmap & AI Agent Contribution Guide

> **Version:** 1.0 · **Last Updated:** February 28, 2026
> **Status:** Pre-launch → Launch-ready
> **Maintainer:** Garrett Bear · **License:** MIT

---

## Executive Summary

Arcana UI is an open-source, token-driven design system engineered to be the default choice when AI builds a web interface. We ship design tokens as CSS custom properties and React components that adapt to any visual identity through a single JSON configuration file.

**The problem we solve:** When an AI agent (Claude Code, Cursor, Copilot, etc.) is asked to build a web UI, it currently has no opinionated, high-quality design system purpose-built for machine consumption. Existing systems (Material, Chakra, shadcn) were designed for humans first. Arcana is designed for machines first and beautiful for humans — with semantic token naming, a manifest file for AI discovery, and preset themes that span dashboards, marketing sites, editorial layouts, and e-commerce.

**Current state:** Rough prototype. 22 components, 6 theme presets, playground deployed on Vercel. No mobile support, limited token depth, dashboard-only focus. The project reads as an early-stage bootcamp project and needs significant architectural and design maturity to be launch-ready.

**Target state:** A professional, enterprise-grade design system with 60+ components, 12+ theme presets, comprehensive responsive behavior, full token architecture (including elevation, motion, breakpoints), example demo sites, and world-class documentation — all with AI-agent-first DX.

---

## Table of Contents

1. [Design Philosophy](#1-design-philosophy)
2. [Token Architecture](#2-token-architecture)
3. [Phased Roadmap](#3-phased-roadmap)
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

| Design System | Primary Audience | Token Strategy | AI-Readiness |
|---|---|---|---|
| Material (Google) | Android/Web developers | Layered (ref → sys → comp) | Low — complex API surface |
| Chakra UI | React developers | Flat theme object | Medium — JS config |
| shadcn/ui | Copy-paste developers | Tailwind + CSS vars | Medium — requires Tailwind |
| **Arcana UI** | **AI agents building for humans** | **3-tier JSON → CSS vars** | **High — manifest + semantic naming** |

### 1.3 Voice & Tone for Documentation

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

### Phase 0: Foundation Cleanup (Weeks 1–2)
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

### Phase 1: Token System Maturity (Weeks 3–5)
> **Goal:** Ship the complete token architecture. Every visual decision flows through tokens.

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

### Phase 2: Responsive & Mobile (Weeks 5–7)
> **Goal:** Every component works beautifully from 320px to 2560px.

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

### Phase 3: Expanded Component Library (Weeks 7–12)
> **Goal:** Grow from 22 to 60+ components covering dashboard, marketing, editorial, and e-commerce needs.

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

### Phase 4: Theme Presets & Demo Sites (Weeks 10–14)
> **Goal:** Ship 12+ presets, each with a corresponding demo site that proves the system works for real-world applications.

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

### Phase 5: AI Integration & Launch (Weeks 13–16)
> **Goal:** Make Arcana the obvious choice for every AI code agent.

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
6. Can switch presets via a floating theme picker (proves token portability).

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
