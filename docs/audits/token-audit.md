# Arcana UI — Token Audit & Gap Analysis

> **Date:** 2026-03-02
> **Auditor:** Claude (AI Agent)
> **Scope:** All CSS files in the project; all token JSON files in `packages/tokens/`
> **Reference:** ROADMAP.md Section 2.2 (Target State) and Appendix A (Complete Token Inventory)
> **Phase:** 0.1 — Audit & document current token set

---

## Executive Summary

The current Arcana token system has a solid foundation but is architecturally misaligned with the target three-tier hierarchy defined in ROADMAP.md. Key findings:

1. **Token JSON structure is flat, not three-tier.** The `base.json` file acts as a primitive layer, and the theme files (light, dark, etc.) act as a semantic layer, but there is no explicit `primitive → semantic → component` hierarchy. Token references use raw hex values, not references to primitives.
2. **Naming convention mismatch.** Current tokens use `--arcana-{category}-{name}` format. Target uses `--{category}-{name}` (e.g., `--color-bg-page`, `--shadow-sm`). The current `--arcana-` prefix adds verbosity.
3. **Four of six presets are not built by the build pipeline.** Only `light.json` and `dark.json` are processed by `build-tokens.ts`. The `terminal`, `retro98`, `glass`, and `brutalist` presets exist as JSON but are never compiled to CSS.
4. **Component CSS is mostly well-tokenized** but contains scattered hardcoded values (see Section 5). The playground CSS has significantly more hardcoded values.
5. **Several critical token categories are completely missing** from the generated CSS output: z-index, opacity, layout/breakpoints, border widths, and focus ring tokens are defined in `base.json` but not exposed as semantic tokens per theme.

---

## 1. Files Scanned

### Token Source Files (7 files)
| File | Role |
|------|------|
| `packages/tokens/src/base.json` | Primitive/base scale tokens |
| `packages/tokens/src/light.json` | Light theme semantic tokens |
| `packages/tokens/src/dark.json` | Dark theme semantic tokens |
| `packages/tokens/src/presets/terminal.json` | Terminal theme (NOT in build pipeline) |
| `packages/tokens/src/presets/retro98.json` | Retro 98 theme (NOT in build pipeline) |
| `packages/tokens/src/presets/glass.json` | Glass theme (NOT in build pipeline) |
| `packages/tokens/src/presets/brutalist.json` | Brutalist theme (NOT in build pipeline) |

### Build Script (1 file)
| File | Role |
|------|------|
| `packages/tokens/scripts/build-tokens.ts` | JSON → CSS build (only processes light + dark) |

### Component CSS Files (21 files)
| File | Component |
|------|-----------|
| `packages/core/src/primitives/Button/Button.module.css` | Button |
| `packages/core/src/primitives/Input/Input.module.css` | Input |
| `packages/core/src/primitives/Avatar/Avatar.module.css` | Avatar |
| `packages/core/src/primitives/Badge/Badge.module.css` | Badge |
| `packages/core/src/primitives/Checkbox/Checkbox.module.css` | Checkbox |
| `packages/core/src/primitives/Radio/Radio.module.css` | Radio |
| `packages/core/src/primitives/Select/Select.module.css` | Select |
| `packages/core/src/primitives/Textarea/Textarea.module.css` | Textarea |
| `packages/core/src/primitives/Toggle/Toggle.module.css` | Toggle |
| `packages/core/src/composites/Accordion/Accordion.module.css` | Accordion |
| `packages/core/src/composites/Alert/Alert.module.css` | Alert |
| `packages/core/src/composites/Card/Card.module.css` | Card |
| `packages/core/src/composites/Modal/Modal.module.css` | Modal |
| `packages/core/src/composites/Tabs/Tabs.module.css` | Tabs |
| `packages/core/src/composites/Toast/Toast.module.css` | Toast |
| `packages/core/src/layout/Layout.module.css` | Layout (Stack, HStack, Grid, Container) |
| `packages/core/src/patterns/EmptyState/EmptyState.module.css` | EmptyState |
| `packages/core/src/patterns/Form/Form.module.css` | Form |
| `packages/core/src/patterns/Navbar/Navbar.module.css` | Navbar |
| `packages/core/src/patterns/Table/Table.module.css` | Table |

### Playground & Docs CSS Files (4 files)
| File | Role |
|------|------|
| `playground/src/App.module.css` | Playground main layout |
| `playground/src/components/AccessibilityPanel.module.css` | Accessibility panel |
| `playground/src/components/TokenEditor.module.css` | Token editor panel |
| `docs/app/global.css` | Docs global styles |

**Total files scanned: 32**

---

## 2. Current Token Inventory

### 2.1 Tokens Defined in `base.json` (Primitive Layer)

#### Color Primitives
| Hue | Steps Defined | Steps in Target (per ROADMAP) |
|-----|---------------|-------------------------------|
| white | 1 value | 1 value |
| stone | 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 (11) | 11 |
| indigo | 50, 100, 400, 500, 600, 700, 800 (7) | 11 |
| amber | 400, 500, 600 (3) | 11 |
| red | 50, 100, 400, 500, 600, 700, 800 (7) | 11 |
| green | 50, 100, 400, 500, 600, 700, 800 (7) | 11 |
| blue | 50, 100, 400, 500, 600, 700 (6) | 11 |

**Existing primitive colors: 42 values across 7 hues**
**Target primitive colors: 165+ values across 15 hues (slate, gray, zinc, stone, red, orange, amber, yellow, green, emerald, blue, indigo, violet, purple, pink) × 11 steps + utility colors**
**Gap: ~123+ missing color primitives; 8 missing hues (slate, gray, zinc, orange, yellow, emerald, violet, purple, pink)**

#### Spacing Primitives
| Token | Value |
|-------|-------|
| `spacing.0` | 0 |
| `spacing.px` | 1px |
| `spacing.0.5` | 0.125rem |
| `spacing.1` | 0.25rem |
| `spacing.1.5` | 0.375rem |
| `spacing.2` | 0.5rem |
| `spacing.2.5` | 0.625rem |
| `spacing.3` | 0.75rem |
| `spacing.3.5` | 0.875rem |
| `spacing.4` | 1rem |
| `spacing.5` | 1.25rem |
| `spacing.6` | 1.5rem |
| `spacing.7` | 1.75rem |
| `spacing.8` | 2rem |
| `spacing.10` | 2.5rem |
| `spacing.12` | 3rem |
| `spacing.14` | 3.5rem |
| `spacing.16` | 4rem |
| `spacing.20` | 5rem |
| `spacing.24` | 6rem |
| `spacing.32` | 8rem |

**Existing: 21 spacing primitives**
**Target (Appendix A): 17 primitive + 8 semantic aliases = 25 total**
**Status: Primitives are mostly complete. Missing semantic aliases (xs, sm, md, lg, xl, 2xl, 3xl, section).**

#### Radius Primitives
| Token | Value |
|-------|-------|
| `radius.none` | 0 |
| `radius.xs` | 2px |
| `radius.sm` | 4px |
| `radius.md` | 8px |
| `radius.lg` | 12px |
| `radius.xl` | 16px |
| `radius.2xl` | 24px |
| `radius.full` | 9999px |

**Existing: 8 values**
**Target (Appendix A): 7 values (none, sm, md, lg, xl, 2xl, full)**
**Status: Close. Has extra `xs` not in target. Values differ from target (e.g., target sm=0.25rem, current sm=4px).**

#### Typography Primitives
| Category | Tokens |
|----------|--------|
| `fontFamily.sans` | Inter, system-ui, -apple-system, sans-serif |
| `fontFamily.mono` | 'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace |
| `fontSize` | xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl (9 values) |
| `fontWeight` | normal(400), medium(500), semibold(600), bold(700) (4 values) |
| `lineHeight` | none(1), tight(1.25), snug(1.375), normal(1.5), relaxed(1.625), loose(2) (6 values) |
| `letterSpacing` | tighter(-0.05em), tight(-0.025em), normal(0), wide(0.025em), wider(0.05em), widest(0.1em) (6 values) |

**Existing: 2 font families, 9 sizes, 4 weights, 6 line heights, 6 letter spacings = 27 values**
**Target: 3 font families (display, body, mono), 9 sizes, 6 weights, 3 line heights, 3 letter spacings = 24 values**
**Gap: Missing `display` font family. Missing weights: light(300), black(900). Extra line heights (none, snug, loose) and letter spacings (tighter, wider, widest) beyond target.**

#### Shadow Primitives
| Token | Value |
|-------|-------|
| `shadow.none` | none |
| `shadow.xs` | 0 1px 2px rgba(28, 25, 23, 0.04) |
| `shadow.sm` | 0 1px 3px rgba(28, 25, 23, 0.06), 0 1px 2px rgba(28, 25, 23, 0.04) |
| `shadow.md` | 0 4px 6px rgba(28, 25, 23, 0.07), 0 2px 4px rgba(28, 25, 23, 0.05) |
| `shadow.lg` | 0 10px 15px rgba(28, 25, 23, 0.1), 0 4px 6px rgba(28, 25, 23, 0.06) |
| `shadow.xl` | 0 20px 25px rgba(28, 25, 23, 0.12), 0 8px 10px rgba(28, 25, 23, 0.06) |
| `shadow.2xl` | 0 25px 50px rgba(28, 25, 23, 0.18) |
| `shadow.inner` | inset 0 2px 4px rgba(28, 25, 23, 0.06) |

**Existing: 8 values**
**Target (Appendix A): 8 values (xs, sm, md, lg, xl, 2xl, inner, none)**
**Status: Complete at primitive level. Shadows are only in base.json, not per-theme.**

#### Motion Primitives
| Category | Tokens |
|----------|--------|
| `duration.instant` | 0ms |
| `duration.fast` | 100ms |
| `duration.normal` | 150ms |
| `duration.slow` | 250ms |
| `duration.slower` | 400ms |
| `easing.default` | cubic-bezier(0.4, 0, 0.2, 1) |
| `easing.in` | cubic-bezier(0.4, 0, 1, 1) |
| `easing.out` | cubic-bezier(0, 0, 0.2, 1) |
| `easing.spring` | cubic-bezier(0.34, 1.56, 0.64, 1) |

**Existing: 5 durations + 4 easings = 9 values**
**Target (Appendix A): 5 durations + 5 easings = 10 values**
**Gap: Missing `ease-in-out`. Duration values differ slightly from target (current normal=150ms, target normal=200ms; current slow=250ms, target slow=300ms; current slower=400ms, target slower=500ms).**

#### Z-Index Primitives
| Token | Value | Target Value |
|-------|-------|-------------|
| `zIndex.base` | 0 | 0 |
| `zIndex.raised` | 10 | (not in target) |
| `zIndex.dropdown` | 100 | 100 |
| `zIndex.sticky` | 200 | 200 |
| `zIndex.overlay` | 300 | 400 |
| `zIndex.modal` | 400 | 500 |
| `zIndex.toast` | 500 | 700 |
| `zIndex.tooltip` | 600 | 800 |

**Existing: 8 values**
**Target (Appendix A): 9 values (base, dropdown, sticky, fixed, overlay, modal, popover, toast, tooltip)**
**Gap: Missing `fixed`(300), `popover`(600). Has extra `raised`(10). Values for overlay/modal/toast/tooltip differ from target scale.**

---

### 2.2 Tokens Defined in Theme Files (Semantic Layer)

Each theme file (light, dark, terminal, retro98, glass, brutalist) defines the same structure:

| Category | Tokens | Count |
|----------|--------|-------|
| `surface` | primary, secondary, tertiary, elevated, overlay, inverse, canvas | 7 |
| `action` | primary, primaryHover, primaryActive, secondary, secondaryHover, secondaryActive, danger, dangerHover, dangerActive, ghost, ghostHover, ghostActive, outline, outlineHover | 14 |
| `text` | primary, secondary, muted, disabled, inverse, link, linkHover, onAction, onDanger | 9 |
| `border` | default, strong, stronger, focus, error, inverse | 6 |
| `feedback` | success, successBg, successBorder, successText, warning, warningBg, warningBorder, warningText, error, errorBg, errorBorder, errorText, info, infoBg, infoBorder, infoText | 16 |
| `component` | radius, borderWidth, focusRing | 3 |

**Total semantic tokens per theme: 55**

---

### 2.3 CSS Custom Properties Generated (Build Output)

The build script (`build-tokens.ts`) generates `--arcana-` prefixed variables. Based on the script logic:

**`:root` block (from base.json):**
All base tokens are flattened under `--arcana-*`:
- `--arcana-color-white`, `--arcana-color-stone-50` through `--arcana-color-stone-950`, etc.
- `--arcana-spacing-0` through `--arcana-spacing-32`
- `--arcana-radius-none` through `--arcana-radius-full`
- `--arcana-typography-font-family-sans`, `--arcana-typography-font-family-mono`
- `--arcana-typography-font-size-xs` through `--arcana-typography-font-size-5xl`
- `--arcana-typography-font-weight-normal` through `--arcana-typography-font-weight-bold`
- `--arcana-typography-line-height-none` through `--arcana-typography-line-height-loose`
- `--arcana-typography-letter-spacing-tighter` through `--arcana-typography-letter-spacing-widest`
- `--arcana-shadow-none` through `--arcana-shadow-inner`
- `--arcana-motion-duration-instant` through `--arcana-motion-duration-slower`
- `--arcana-motion-easing-default` through `--arcana-motion-easing-spring`
- `--arcana-z-index-base` through `--arcana-z-index-tooltip`

**Estimated total: ~120 CSS custom properties in `:root`**

**`:root, [data-theme="light"]` block (from light.json):**
- `--arcana-surface-*` (7)
- `--arcana-action-*` (14)
- `--arcana-text-*` (9)
- `--arcana-border-*` (6)
- `--arcana-feedback-*` (16)
- `--arcana-component-*` (3)

**Total per theme: 55 CSS custom properties**

**`[data-theme="dark"]` block (from dark.json):**
Same 55 properties with dark theme values.

**Total generated CSS custom properties: ~230 (120 base + 55 light + 55 dark)**

**NOT generated:** terminal, retro98, glass, brutalist themes (4 × 55 = 220 missing)

---

## 3. Token Naming: Current vs. Target

### 3.1 Naming Convention Differences

| Category | Current Pattern | Target Pattern (ROADMAP Appendix A) |
|----------|----------------|--------------------------------------|
| Background | `--arcana-surface-primary` | `--color-bg-page` |
| Background | `--arcana-surface-secondary` | `--color-bg-surface` |
| Background | `--arcana-surface-elevated` | `--color-bg-elevated` |
| Background | `--arcana-surface-overlay` | `--color-bg-overlay` |
| Background | (missing) | `--color-bg-sunken` |
| Background | (missing) | `--color-bg-subtle` |
| Foreground | `--arcana-text-primary` | `--color-fg-primary` |
| Foreground | `--arcana-text-secondary` | `--color-fg-secondary` |
| Foreground | `--arcana-text-muted` | `--color-fg-muted` |
| Foreground | `--arcana-text-inverse` | `--color-fg-inverse` |
| Foreground | `--arcana-text-on-action` | `--color-fg-on-primary` |
| Foreground | `--arcana-text-on-danger` | `--color-fg-on-destructive` |
| Action | `--arcana-action-primary` | `--color-action-primary` |
| Action | `--arcana-action-primary-hover` | `--color-action-primary-hover` |
| Action | `--arcana-action-primary-active` | `--color-action-primary-active` |
| Action | (missing) | `--color-action-primary-disabled` |
| Action | `--arcana-action-secondary` | `--color-action-secondary` |
| Action | `--arcana-action-secondary-hover` | `--color-action-secondary-hover` |
| Action | `--arcana-action-ghost` | `--color-action-ghost` |
| Action | `--arcana-action-ghost-hover` | `--color-action-ghost-hover` |
| Action | `--arcana-action-danger` | `--color-action-destructive` |
| Action | `--arcana-action-danger-hover` | `--color-action-destructive-hover` |
| Border | `--arcana-border-default` | `--color-border-default` |
| Border | (missing) | `--color-border-muted` |
| Border | `--arcana-border-focus` | `--color-border-focus` |
| Border | `--arcana-border-error` | `--color-border-error` |
| Border | (missing) | `--color-border-success` |
| Status | `--arcana-feedback-success-bg` | `--color-status-success-bg` |
| Status | `--arcana-feedback-success-text` | `--color-status-success-fg` |
| Status | `--arcana-feedback-success-border` | `--color-status-success-border` |
| Accent | (missing) | `--color-accent-primary` |
| Accent | (missing) | `--color-accent-secondary` |
| Typography | `--arcana-typography-font-family-sans` | `--font-family-body` |
| Typography | (missing) | `--font-family-display` |
| Typography | `--arcana-typography-font-family-mono` | `--font-family-mono` |
| Typography | `--arcana-typography-font-size-sm` | `--font-size-sm` |
| Typography | `--arcana-typography-font-weight-medium` | `--font-weight-medium` |
| Typography | `--arcana-typography-line-height-normal` | `--line-height-normal` |
| Typography | `--arcana-typography-letter-spacing-tight` | `--letter-spacing-tight` |
| Spacing | `--arcana-spacing-4` | `--spacing-4` (primitive) / `--spacing-md` (semantic) |
| Elevation | `--arcana-shadow-sm` | `--shadow-sm` |
| Motion | `--arcana-motion-duration-fast` | `--duration-fast` |
| Motion | `--arcana-motion-easing-default` | `--ease-default` |
| Z-Index | `--arcana-z-index-modal` | `--z-modal` |
| Radius | `--arcana-radius-md` | `--radius-md` |
| Border width | `--arcana-component-border-width` | `--border-default` |
| Focus ring | `--arcana-component-focus-ring` | `--focus-ring` |

### 3.2 Key Naming Issues

1. **`--arcana-` prefix adds verbosity.** Target uses shorter, more standard names.
2. **`surface` vs `color-bg`:** Current uses `surface` for backgrounds; target uses `color-bg-*`.
3. **`text` vs `color-fg`:** Current uses `text` for foreground colors; target uses `color-fg-*`.
4. **`feedback` vs `color-status`:** Current uses `feedback`; target uses `color-status-*`.
5. **`danger` vs `destructive`:** Current action tokens use `danger`; target uses `destructive`.
6. **`typography-font-family-sans` vs `font-family-body`:** Current `sans` maps to target `body`. Target also has `display`.
7. **`motion-duration-*` vs `duration-*`:** Target drops the `motion` prefix.
8. **`motion-easing-*` vs `ease-*`:** Target uses `ease-` prefix.
9. **`z-index-*` vs `z-*`:** Target uses shorter `z-` prefix.
10. **`component-border-width` and `component-focus-ring`:** These are component-tier tokens but currently live in theme JSON as `component.*`. Target promotes them to semantic tier (`--border-default`, `--focus-ring`).

---

## 4. Gap Analysis by Category

### 4.1 Color

| Token Group | Existing | Target | Gap |
|-------------|----------|--------|-----|
| Primitive palette (per hue × steps) | 42 (7 hues, partial steps) | 165+ (15 hues × 11 steps) | **~123 missing** |
| Background (`color-bg-*`) | 7 (as `surface-*`) | 6 | Rename + add `sunken`, `subtle`; drop `canvas`, `inverse` |
| Foreground (`color-fg-*`) | 9 (as `text-*`) | 6 | Rename; add `on-primary`, `on-destructive` mapping |
| Action (`color-action-*`) | 14 (as `action-*`) | 10 | Rename; add `disabled`; drop `outline*` extras |
| Border (`color-border-*`) | 6 (as `border-*`) | 5 | Rename; add `muted`, `success`; drop `strong`, `stronger`, `inverse` |
| Status (`color-status-*`) | 16 (as `feedback-*`) | 12 | Rename; align naming (fg not text) |
| Accent (`color-accent-*`) | 0 | 2 | **2 missing** |

**Existing color tokens: ~94** (42 primitives + 52 semantic across surface/action/text/border/feedback)
**Target color tokens: ~200+** (165+ primitives + 41 semantic)
**Overall color gap: ~106+**

### 4.2 Typography

| Token Group | Existing | Target | Gap |
|-------------|----------|--------|-----|
| Font families | 2 (sans, mono) | 3 (display, body, mono) | **1 missing** (display) |
| Font sizes | 9 (xs–5xl) | 9 (xs–5xl) | 0 (values match) |
| Font weights | 4 (normal, medium, semibold, bold) | 6 (light, normal, medium, semibold, bold, black) | **2 missing** (light, black) |
| Line heights | 6 (none, tight, snug, normal, relaxed, loose) | 3 (tight, normal, relaxed) | Trim extras |
| Letter spacing | 6 (tighter, tight, normal, wide, wider, widest) | 3 (tight, normal, wide) | Trim extras |

**Existing typography tokens: 27**
**Target typography tokens: 24**
**Gap: 3 missing (display font, light weight, black weight), 6 to trim**

### 4.3 Spacing

| Token Group | Existing | Target | Gap |
|-------------|----------|--------|-----|
| Primitive scale | 21 values (0–32) | 17 values (0–32) | Has extras (0.5, 1.5, 2.5, 3.5, 7, 14) |
| Semantic aliases (xs–section) | 0 | 8 (xs, sm, md, lg, xl, 2xl, 3xl, section) | **8 missing** |
| Density modes | 0 | TBD (compact, default, comfortable) | **Entire system missing** |

**Existing spacing tokens: 21**
**Target spacing tokens: 25+**
**Gap: 8 semantic aliases missing; density system missing**

### 4.4 Layout

| Token Group | Existing | Target | Gap |
|-------------|----------|--------|-----|
| Breakpoints (sm–2xl) | 0 | 5 | **5 missing** |
| Container max-widths | 0 | 4 (sm, md, lg, xl) | **4 missing** |
| Content widths (prose, wide, full) | 0 | 3 | **3 missing** |

**Existing layout tokens: 0**
**Target layout tokens: 12**
**Gap: Entire category missing from CSS output**

### 4.5 Elevation & Depth

| Token Group | Existing | Target | Gap |
|-------------|----------|--------|-----|
| Box shadows | 8 (in base.json only) | 8 per theme | Need per-theme tuning |
| Z-index scale | 8 (in base.json only) | 9 | Missing `fixed`, `popover`; values misaligned |
| Backdrop blur | 0 | TBD (sm, md, lg, xl) | **Entire sub-category missing** |

**Existing elevation tokens: 16 (8 shadows + 8 z-index)**
**Target elevation tokens: 17+ (8 shadows + 9 z-index)**
**Gap: Per-theme shadow tuning needed. Z-index scale misaligned. Backdrop blur missing.**

### 4.6 Border & Shape

| Token Group | Existing | Target | Gap |
|-------------|----------|--------|-----|
| Radius scale | 8 | 7 | Mostly covered; values differ |
| Border widths | 1 (`component.borderWidth`) | 3 (thin, default, thick) | **2 missing** |
| Focus ring | 1 (`component.focusRing`) | 1 + offset | **Focus offset missing** |
| Divider styles | 0 | TBD | **Missing** |

**Existing border/shape tokens: 10 (8 radius + 1 border width + 1 focus ring)**
**Target border/shape tokens: 12+ (7 radius + 3 widths + 1 ring + 1 offset)**
**Gap: 2+**

### 4.7 Motion & Animation

| Token Group | Existing | Target | Gap |
|-------------|----------|--------|-----|
| Durations | 5 (instant, fast, normal, slow, slower) | 5 (instant, fast, normal, slow, slower) | Values differ |
| Easings | 4 (default, in, out, spring) | 5 (default, in, out, in-out, spring) | **1 missing** (in-out) |
| Reduced-motion | 0 | Needed | **System missing** |

**Existing motion tokens: 9**
**Target motion tokens: 10+**
**Gap: 1 easing + reduced-motion system**

### 4.8 Opacity

| Token Group | Existing | Target | Gap |
|-------------|----------|--------|-----|
| Numeric scale (0–100) | 0 | 7 (0, 5, 10, 25, 50, 75, 100) | **7 missing** |
| Semantic (disabled, hover, overlay) | 0 | 3 | **3 missing** |

**Existing opacity tokens: 0**
**Target opacity tokens: 10**
**Gap: Entire category missing**

---

## 5. Hardcoded Values in Component CSS (Violations)

### 5.1 `packages/core/` — Component CSS

#### Button.module.css
| Line | Property | Hardcoded Value | Should Be |
|------|----------|----------------|-----------|
| 34 | `opacity` | `0.5` | `var(--opacity-disabled)` |
| 95 | `height` | `32px` | Token-based sizing |
| 100 | `height` | `40px` | Token-based sizing |
| 107 | `height` | `48px` | Token-based sizing |
| 132–133 | `width`, `height` (icon svg) | `14px` | Token-based |
| 138–139 | `width`, `height` (icon svg) | `16px` | Token-based |
| 144–145 | `width`, `height` (icon svg) | `18px` | Token-based |
| 157 | `animation` | `0.75s` | `var(--duration-slow)` or similar |
| 163–164 | `width`, `height` (spinner) | `14px` | Token-based |
| 168–169 | `width`, `height` (spinner) | `16px` | Token-based |
| 173–174 | `width`, `height` (spinner) | `18px` | Token-based |
| 178 | `opacity` | `0.25` | `var(--opacity-*)` |
| 182 | `opacity` | `0.75` | `var(--opacity-*)` |

#### Input.module.css
| Line | Property | Hardcoded Value | Should Be |
|------|----------|----------------|-----------|
| 45 | `box-shadow` | `0 0 0 3px rgba(239, 68, 68, 0.2)` | Token (error focus ring) |
| 51 | `opacity` | `0.6` | `var(--opacity-disabled)` |
| 58 | `height` | `40px` | Token-based sizing |

#### Avatar.module.css
| Line | Property | Hardcoded Value | Should Be |
|------|----------|----------------|-----------|
| 8 | `border` | `2px solid` | `var(--border-default)` for width |
| 16–17 | `width`, `height` | `24px` | Token-based |
| 21–22 | `width`, `height` | `32px` | Token-based |
| 26–27 | `width`, `height` | `40px` | Token-based |
| 31–32 | `width`, `height` | `48px` | Token-based |
| 36–37 | `width`, `height` | `64px` | Token-based |
| 49 | `color` | `#ffffff` | `var(--color-fg-on-primary)` or similar |
| 50 | `line-height` | `1` | Token |
| 55 | `font-size` | `9px` | Token-based |
| 59 | `font-size` | `11px` | Token-based |
| 63 | `font-size` | `14px` | Token-based |
| 67 | `font-size` | `16px` | Token-based |
| 71 | `font-size` | `22px` | Token-based |
| 96 | `font-size` | `12px` | Token-based |
| 107 | `margin-left` | `-8px` | Token-based |

#### Badge.module.css
| Line | Property | Hardcoded Value | Should Be |
|------|----------|----------------|-----------|
| 5 | `padding` | `2px` (vertical) | Token-based |
| 12 | `border` | `1px solid` | `var(--border-thin)` |
| 54 | `width`, `height` | `6px` | Token-based |

#### Checkbox.module.css
| Line | Property | Hardcoded Value | Should Be |
|------|----------|----------------|-----------|
| 19 | `margin-top` | `1px` | Token-based |
| 24–25 | `width`, `height` | `18px` | Token-based |
| 51 | `opacity` | `0.5` | `var(--opacity-disabled)` |
| 77–78 | `width`, `height` (indicator svg) | `10px` | Token-based |
| 84 | `gap` | `2px` | `var(--spacing-0.5)` |

#### Radio.module.css
| Line | Property | Hardcoded Value | Should Be |
|------|----------|----------------|-----------|
| 29 | `opacity` | `0.5` | `var(--opacity-disabled)` |
| 44 | `margin-top` | `1px` | Token-based |
| 45–46 | `width`, `height` | `18px` | Token-based |
| 51–52 | `width`, `height` | `18px` | Token-based |
| 65 | `border-width` | `5px` | Token-based |
| 89 | `gap` | `2px` | `var(--spacing-0.5)` |

#### Select.module.css
| Line | Property | Hardcoded Value | Should Be |
|------|----------|----------------|-----------|
| 48 | `box-shadow` | `0 0 0 3px rgba(239, 68, 68, 0.2)` | Token (error focus ring) |
| 53 | `opacity` | `0.6` | `var(--opacity-disabled)` |
| 62 | `height` | `40px` | Token-based |

#### Textarea.module.css
| Line | Property | Hardcoded Value | Should Be |
|------|----------|----------------|-----------|
| 20 | `min-height` | `80px` | Token-based |
| 51 | `box-shadow` | `0 0 0 3px rgba(239, 68, 68, 0.2)` | Token (error focus ring) |
| 58 | `opacity` | `0.6` | `var(--opacity-disabled)` |

#### Toggle.module.css
| Line | Property | Hardcoded Value | Should Be |
|------|----------|----------------|-----------|
| 28–29 | `width`, `height` | `32px`, `18px` | Token-based |
| 33–34 | `width`, `height` | `44px`, `24px` | Token-based |
| 38–39 | `width`, `height` | `56px`, `30px` | Token-based |
| 47 | `opacity` | `0.5` | `var(--opacity-disabled)` |
| 60–62 | `width`, `height`, `left` | `12px`, `12px`, `3px` | Token-based |
| 66–68 | `width`, `height`, `left` | `18px`, `18px`, `3px` | Token-based |
| 72–74 | `width`, `height`, `left` | `22px`, `22px`, `4px` | Token-based |
| 78 | `transform` | `translateX(14px)` | Token-based |
| 82 | `transform` | `translateX(20px)` | Token-based |
| 86 | `transform` | `translateX(26px)` | Token-based |
| 99 | `opacity` | `0.5` | `var(--opacity-disabled)` |

#### Accordion.module.css
| Line | Property | Hardcoded Value | Should Be |
|------|----------|----------------|-----------|
| 18 | `opacity` | `0.5` | `var(--opacity-disabled)` |

#### Alert.module.css
| Line | Property | Hardcoded Value | Should Be |
|------|----------|----------------|-----------|
| 13–14 | `width`, `height` | `20px` | Token-based |
| 15 | `margin-top` | `1px` | Token-based |
| 48–49 | `width`, `height` | `24px` | Token-based |
| 55 | `opacity` | `0.6` | `var(--opacity-*)` |

#### Card.module.css
No hardcoded values. Fully tokenized.

#### Modal.module.css
| Line | Property | Hardcoded Value | Should Be |
|------|----------|----------------|-----------|
| 40 | `transform: scale(0.96) translateY(8px)` | `8px`, `0.96` | Token-based |
| 50 | `max-width` | `400px` | Token or component token |
| 54 | `max-width` | `560px` | Token or component token |
| 58 | `max-width` | `720px` | Token or component token |
| 62 | `max-width` | `960px` | Token or component token |
| 68 | `border-radius` | `0` | Could use `var(--radius-none)` |
| 136–137 | `width`, `height` | `32px` | Token-based |

#### Tabs.module.css
| Line | Property | Hardcoded Value | Should Be |
|------|----------|----------------|-----------|
| 10 | `border-bottom` | `1px solid` | `var(--border-thin)` for width |
| 50 | `border-bottom` | `2px solid` | `var(--border-thick)` |
| 51 | `margin-bottom` | `-1px` | Calculated value |
| 83 | `opacity` | `0.4` | `var(--opacity-disabled)` |

#### Toast.module.css
| Line | Property | Hardcoded Value | Should Be |
|------|----------|----------------|-----------|
| 10 | `max-width` | `380px` | Token-based |
| 43–44 | `width`, `height` | `16px` | Token-based |
| 44 | `margin-top` | `2px` | Token-based |
| 86 | `text-underline-offset` | `2px` | Token-based |
| 98–99 | `width`, `height` | `20px` | Token-based |
| 119 | `border-left` | `3px solid` | `var(--border-thick)` |
| 127 | `border-left` | `3px solid` | `var(--border-thick)` |
| 135 | `border-left` | `3px solid` | `var(--border-thick)` |

#### Layout.module.css
| Line | Property | Hardcoded Value | Should Be |
|------|----------|----------------|-----------|
| 23 | `@media (max-width: 640px)` | `640px` | `var(--breakpoint-sm)` or token reference |

#### Navbar.module.css
| Line | Property | Hardcoded Value | Should Be |
|------|----------|----------------|-----------|
| 20 | `height` | `56px` | Token-based |
| 22 | `max-width` | `1280px` | `var(--container-xl)` |

#### EmptyState.module.css
| Line | Property | Hardcoded Value | Should Be |
|------|----------|----------------|-----------|
| 29 | `width`, `height` | `48px` | Token-based |
| 34 | `width`, `height` | `32px` | Token-based |

#### Table.module.css
No hardcoded color/spacing values. Fully tokenized.

#### Form.module.css
No hardcoded values. Fully tokenized.

### 5.2 Hardcoded Value Summary — Component CSS

| Type of Hardcoded Value | Count |
|------------------------|-------|
| `px` sizes (heights, widths, icon sizes) | ~55 |
| `opacity` values (0.25, 0.4, 0.5, 0.6, 0.75) | ~13 |
| Hardcoded `box-shadow` (error focus ring) | 3 |
| Hardcoded color (`#ffffff`) | 1 |
| Hardcoded `border-width` (1px, 2px, 3px) | ~8 |
| Hardcoded `max-width` | ~6 |
| Hardcoded `animation-duration` | 1 |
| Hardcoded media query breakpoint | 1 |
| **Total hardcoded violations** | **~88** |

### 5.3 Playground CSS — Hardcoded Values

The playground CSS files (`App.module.css`, `AccessibilityPanel.module.css`, `TokenEditor.module.css`) contain **extensive** hardcoded values. These are developer tool UI, not shipped components, but they should still follow token conventions for consistency.

Key issues in playground CSS:
- **190+ hardcoded `px` values** for sizing, padding, gaps, font-sizes
- **Hardcoded font sizes** (`9px`, `10px`, `11px`, `12px`, `13px`, `15px`, `18px`, `20px`, `28px`, `36px`)
- **Hardcoded font weights** (`500`, `600`, `700`)
- **Hardcoded `border-radius`** (`2px`, `3px`, `4px`, `9999px`, `50%`)
- **3 uses of `!important`** (in `App.module.css` line 94/96, `AccessibilityPanel.module.css` line 247/248/249, `TokenEditor.module.css` line 157/158/622)
- **Hardcoded `z-index`** values (`10`, `50`, `100`, `200`)
- **Hardcoded box-shadow** (`0 8px 24px rgba(0, 0, 0, 0.12)` in TokenEditor.module.css:342)
- **Hardcoded transition durations** (`120ms`, `80ms`, `300ms`) — should use `var(--arcana-motion-duration-*)` tokens
- **Hardcoded font families** (`'JetBrains Mono', monospace` and `'JetBrains Mono', 'Fira Code', monospace`)
- **`max-width: 640px`** media query — should reference breakpoint token
- **Desktop-first media query** (`max-width: 1100px`, `max-width: 900px`) — violates mobile-first rule

### 5.4 Docs CSS
- `docs/app/global.css` — Contains `--fd-primary: 79 70 229;` which is a non-Arcana custom property (fumadocs framework). Not a violation per se, but worth noting.

---

## 6. Structural Issues

### 6.1 Build Pipeline Gaps

1. **Only 2 of 6 themes are compiled.** The build script only processes `light.json` and `dark.json`. The `terminal`, `retro98`, `glass`, and `brutalist` presets are orphaned JSON files.
2. **No token reference resolution.** The target architecture uses references like `"{primitive.color.blue.500}"` in semantic tokens. Current theme JSONs use raw hex values.
3. **No JSON Schema validation.** No `tokens.schema.json` exists for validation.
4. **No WCAG contrast checking** in the build pipeline.
5. **No `dist/` output exists** (the directory is not committed and may not have been built).

### 6.2 Architecture Gaps

1. **No three-tier hierarchy.** Primitives and semantics are separate files, but there's no reference chain between them. Theme files contain raw hex values, not references to base primitives.
2. **No component-tier tokens.** The `component` key in theme files only contains `radius`, `borderWidth`, and `focusRing`. The target envisions per-component overrides like `--button-bg`, `--card-shadow`, etc.
3. **CSS custom property naming doesn't match target.** The `--arcana-` prefix and nested category naming (`--arcana-typography-font-family-sans`) differs significantly from the target (`--font-family-body`).
4. **No semantic spacing aliases.** Components reference primitive spacing directly (`--arcana-spacing-4`), not semantic spacing (`--spacing-md`).
5. **Extra theme tokens not in target.** Current themes define `surface.canvas`, `surface.inverse`, `text.link`, `text.linkHover`, `text.disabled`, `text.onDanger`, `border.strong`, `border.stronger`, `border.inverse`, `action.outline`, `action.outlineHover` — these are useful but not in the Appendix A target list. They should either be added to the target spec or mapped to target tokens.

### 6.3 CSS Module Pattern

Components use CSS Modules (`.module.css`) with local class names (`.button`, `.primary`), not BEM naming with `arcana-` prefix as CLAUDE.md specifies. This is a potential mismatch:
- **Current:** `.button`, `.primary`, `.sm` (CSS Modules — scoped by tooling)
- **Target (CLAUDE.md):** `.arcana-button`, `.arcana-button--primary`, `.arcana-button--sm` (BEM)

This may be an intentional choice (CSS Modules provide scoping without BEM) but should be documented as a decision.

---

## 7. Summary Table

| Category | Existing Count | Target Count | Gap | Priority |
|----------|---------------|--------------|-----|----------|
| **Color — Primitives** | 42 | 165+ | ~123 | P0 |
| **Color — Semantic** | 52 | 41 | Rename all; add 2 accent, 2 bg variants | P0 |
| **Typography** | 27 | 24 | +3 missing, -6 trim | P0 |
| **Spacing — Primitive** | 21 | 17 | Trim extras | P0 |
| **Spacing — Semantic** | 0 | 8 | 8 missing | P0 |
| **Layout** | 0 | 12 | **12 missing (entire category)** | P0 |
| **Elevation — Shadows** | 8 | 8 per theme | Per-theme tuning needed | P0 |
| **Elevation — Z-Index** | 8 | 9 | 2 missing, values misaligned | P0 |
| **Elevation — Backdrop Blur** | 0 | 4 | **4 missing** | P1 |
| **Border & Shape — Radius** | 8 | 7 | Values differ; trim 1 extra | P1 |
| **Border & Shape — Widths** | 1 | 3 | **2 missing** | P1 |
| **Border & Shape — Focus** | 1 | 2 | **1 missing** (offset) | P1 |
| **Motion — Durations** | 5 | 5 | Values differ | P1 |
| **Motion — Easings** | 4 | 5 | **1 missing** (in-out) | P1 |
| **Opacity** | 0 | 10 | **10 missing (entire category)** | P1 |
| **Hardcoded violations (core)** | 88 | 0 | **88 to fix** | P0 |
| **Themes in build pipeline** | 2 | 6 | **4 themes not compiled** | P0 |

**Total existing tokens: ~176** (120 base + 55 per-theme × 2 themes built)
**Total target tokens: ~250+** per theme (primitives shared, semantics per theme)
**Overall gap: ~74+ missing tokens + 88 hardcoded violations + 4 unbuilt themes + full naming migration**

---

## 8. Recommendations for Phase 1

Based on this audit, Phase 1 tasks should address these gaps in order:

1. **Task 0.2 (Restructure):** Migrate to three-tier JSON format. Establish reference chain (semantic → primitive). Adopt target naming convention.
2. **Task 0.4 (Build Pipeline):** Update build script to process all 6 themes. Add schema validation. Add reference resolution.
3. **Task 1.1 (Color):** Expand primitive palette to 15 hues × 11 steps. Map all semantic tokens.
4. **Task 1.2 (Typography):** Add display font family. Add missing weights. Trim extras.
5. **Task 1.3 (Spacing):** Add semantic aliases (xs–section). Consider density modes.
6. **Task 1.4 (Elevation):** Per-theme shadow tuning. Fix z-index scale. Add backdrop blur.
7. **Task 1.5 (Layout):** Add breakpoints, containers, content widths as tokens.
8. **Task 1.6 (Motion):** Add missing easing. Align duration values with target. Add reduced-motion.
9. **Task 1.7 (Border & Shape):** Add border widths. Add focus offset. Align radius values.
10. **Task 1.8 (Opacity):** Create entire opacity token category.
11. **Hardcoded fixes:** After tokens exist, sweep all component CSS to replace hardcoded values.

---

## Appendix: All Token References Used in Component CSS

Below is every `var(--arcana-*)` reference found in component CSS files, confirming which tokens are actively consumed:

### Surface/Background Tokens (used)
- `--arcana-surface-primary` — Input, Checkbox, Radio, Select, Textarea, Toggle, Navbar, Card, Table, Tabs, Layout
- `--arcana-surface-secondary` — Input, Select, Textarea, Accordion, Table, Tabs
- `--arcana-surface-tertiary` — Avatar, Badge
- `--arcana-surface-elevated` — Modal, Toast, Card
- `--arcana-surface-overlay` — Modal

### Text/Foreground Tokens (used)
- `--arcana-text-primary` — Button, Input, Checkbox, Radio, Select, Textarea, Toggle, Accordion, Card, Modal, Tabs, Toast, EmptyState, Form, Navbar, Table
- `--arcana-text-secondary` — Input, Checkbox, Radio, Select, Textarea, Avatar, Card, Modal, Tabs, Toast, EmptyState, Form, Table
- `--arcana-text-muted` — Input, Checkbox, Avatar, Textarea, Accordion, Card, Alert, Modal, Toast, Tabs, EmptyState, Table, Form
- `--arcana-text-disabled` — Input, Select, Textarea
- `--arcana-text-inverse` — Checkbox
- `--arcana-text-on-action` — Button

### Action Tokens (used)
- `--arcana-action-primary` — Button, Checkbox, Radio, Tabs, Toggle, Toast
- `--arcana-action-primary-hover` — Button, Toast
- `--arcana-action-secondary` — Button
- `--arcana-action-secondary-hover` — Button
- `--arcana-action-ghost` — Button
- `--arcana-action-ghost-hover` — Button, Modal, Accordion
- `--arcana-action-danger` — Button
- `--arcana-action-danger-hover` — Button
- `--arcana-action-outline` — Button
- `--arcana-action-outline-hover` — Button

### Border Tokens (used)
- `--arcana-border-default` — Input, Button, Select, Textarea, Badge, Accordion, Card, Modal, Tabs, Toast, Navbar, Table, Form
- `--arcana-border-strong` — Button, Checkbox, Radio, Card, Toggle
- `--arcana-border-focus` — Input, Select, Textarea, Checkbox
- `--arcana-border-error` — Input, Select, Textarea, Checkbox

### Feedback/Status Tokens (used)
- `--arcana-feedback-success` — Badge, Toast
- `--arcana-feedback-success-bg` — Badge, Alert
- `--arcana-feedback-success-border` — Badge, Alert
- `--arcana-feedback-success-text` — Badge, Alert
- `--arcana-feedback-warning` — Toast
- `--arcana-feedback-warning-bg` — Badge, Alert
- `--arcana-feedback-warning-border` — Badge, Alert
- `--arcana-feedback-warning-text` — Badge, Alert
- `--arcana-feedback-error` — Badge, Toast, Checkbox, Form
- `--arcana-feedback-error-bg` — Badge, Alert
- `--arcana-feedback-error-border` — Badge, Alert
- `--arcana-feedback-error-text` — Badge, Alert, Input, Select, Textarea
- `--arcana-feedback-info-bg` — Badge, Alert
- `--arcana-feedback-info-border` — Badge, Alert
- `--arcana-feedback-info-text` — Badge, Alert

### Component Tokens (used)
- `--arcana-component-border-width` — Button, Input, Select, Textarea, Checkbox, Radio, Accordion, Card, Modal, Toast, Navbar, Table
- `--arcana-component-radius` — Button, Input, Select, Textarea, Accordion, Card, Tabs, Toast, Navbar, Table
- `--arcana-component-focus-ring` — Button, Input, Select, Textarea, Checkbox, Radio, Toggle, Accordion, Alert, Modal, Tabs, Toast, Table

### Shadow Tokens (used)
- `--arcana-shadow-sm` — Card, Tabs, Toggle
- `--arcana-shadow-md` — Card
- `--arcana-shadow-lg` — Card, Toast
- `--arcana-shadow-xl` — Modal

### Spacing Tokens (used)
- `--arcana-spacing-1` — Input, Checkbox, Badge, Form, Tabs, Card, Modal, Toast, EmptyState
- `--arcana-spacing-1-5` — Form
- `--arcana-spacing-2` — Button, Input, Checkbox, Radio, Textarea, Toggle, Badge, Toast, Table, Tabs
- `--arcana-spacing-2-5` — Checkbox, Radio, Toggle
- `--arcana-spacing-3` — Input, Select, Textarea, Alert, Badge, Card, Modal, Toast, Table, EmptyState, Tabs
- `--arcana-spacing-4` — Accordion, EmptyState, Card, Modal, Toast, Form, Navbar, Layout, Table, Tabs
- `--arcana-spacing-5` — Card, Modal
- `--arcana-spacing-6` — Card, Layout, Toast, Navbar, Button
- `--arcana-spacing-8` — Card, EmptyState, Modal
- `--arcana-spacing-12` — Toast

### Typography Tokens (used)
- `--arcana-typography-font-family-sans` — nearly every component
- `--arcana-typography-font-size-xs` — Badge, Checkbox, Radio, Input, Select, Textarea, Form, Table, Toast, EmptyState
- `--arcana-typography-font-size-sm` — Button, Input, Checkbox, Radio, Select, Textarea, Accordion, Alert, Card, Modal, Tabs, Toast, Form, EmptyState, Table
- `--arcana-typography-font-size-base` — Button, Modal, Tabs, EmptyState
- `--arcana-typography-font-size-lg` — Card
- `--arcana-typography-font-size-xl` — Modal
- `--arcana-typography-font-weight-medium` — Button, Input, Checkbox, Radio, Select, Textarea, Toggle, Badge, Tabs, Form
- `--arcana-typography-font-weight-semibold` — Avatar, Accordion, Alert, Card, Modal, Toast, EmptyState, Form, Radio, Table
- `--arcana-typography-font-weight-bold` — (not directly used in components; used in playground)
- `--arcana-typography-line-height-tight` — Button, Input, Checkbox, Radio, Select, Badge, Alert, Card, Modal, Toast, Form
- `--arcana-typography-line-height-normal` — Input, Textarea, Select, Checkbox, Radio, Accordion, Alert, Card, Modal, Toast, EmptyState, Form
- `--arcana-typography-line-height-relaxed` — Accordion
- `--arcana-typography-letter-spacing-wide` — Table

### Motion Tokens (used)
- `--arcana-motion-duration-fast` — Checkbox, Radio, Accordion, Alert, Modal, Tabs, Toast
- `--arcana-motion-duration-normal` — Button, Input, Select, Textarea, Toggle, Card, Modal, Accordion, Toast
- `--arcana-motion-duration-slow` — Toast
- `--arcana-motion-easing-default` — Button, Input, Select, Textarea, Checkbox, Radio, Toggle, Accordion, Alert, Card, Modal, Tabs, Toast, Table
- `--arcana-motion-easing-out` — Toast

### Z-Index Tokens (used)
- `--arcana-z-index-overlay` — Modal
- `--arcana-z-index-modal` — Modal
- `--arcana-z-index-toast` — Toast
- `--arcana-z-index-sticky` — Navbar

### Other Tokens (used)
- `--arcana-radius-full` — Avatar, Badge, Toggle, Checkbox (dot)
- `--arcana-radius-sm` — Alert, Modal, Tabs, Toast
- `--arcana-radius-lg` — Modal
- `--arcana-color-white` — Toggle (thumb)

### Tokens Defined But Never Used in Component CSS
- `--arcana-surface-inverse`
- `--arcana-surface-canvas`
- `--arcana-text-link`
- `--arcana-text-link-hover`
- `--arcana-text-on-danger`
- `--arcana-action-primary-active`
- `--arcana-action-secondary-active`
- `--arcana-action-danger-active`
- `--arcana-action-ghost-active`
- `--arcana-border-stronger`
- `--arcana-border-inverse`
- `--arcana-feedback-success` (main, not bg/border/text) — used in Toast
- `--arcana-feedback-warning` (main) — used in Toast
- `--arcana-feedback-info` (main) — not used
- `--arcana-shadow-none`
- `--arcana-shadow-xs`
- `--arcana-shadow-2xl`
- `--arcana-shadow-inner`
- All z-index tokens except overlay, modal, toast, sticky
- All motion tokens except fast, normal, slow, easing-default, easing-out
- All letter-spacing tokens except `wide`
- All line-height tokens except tight, normal, relaxed
- Most typography-font-size tokens beyond xs, sm, base, lg, xl
- Most spacing tokens beyond 1–8, 12

---

*End of audit. This document should be used as the reference for Phase 0, Task 0.2 (Restructure token hierarchy) and all Phase 1 token implementation tasks.*
