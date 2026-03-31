# Playground Custom Component Audit

> **Date:** 2026-03-31
> **Purpose:** Identify custom components that should become Arcana components, use Arcana hooks, or remain playground-specific.
> **Scope:** All files in `playground/src/`

---

## Summary

| Metric | Count |
|--------|-------|
| Total custom components found | 28 |
| Should be Arcana components | 2 |
| Should use Arcana hooks | 2 |
| Playground specific (keep as-is) | 24 |
| Existing hooks not being used | 2 |
| Duplicated behavior patterns | 3 |

---

## Should Be Arcana Components

### ColorPicker

- **File:** `playground/src/components/ColorPicker.tsx` (687 lines)
- **CSS:** `playground/src/components/ColorPicker.module.css` (33 token refs, 57 hardcoded values)
- **Purpose:** HSV color selection with 2D saturation/value canvas, hue slider, alpha slider, hex/RGB inputs, recent colors, EyeDropper API, and preset palette swatches.
- **Behavior:**
  - Manages open/close state (line 193)
  - Click-outside dismissal via `document.addEventListener('mousedown')` (lines 231–239)
  - Canvas 2D rendering for saturation/value field (lines 138–157)
  - Drag interaction on canvas, hue slider, and alpha slider with `requestAnimationFrame` throttling (lines 290–404)
  - Uses `useFloating` from `@arcana-ui/core` for dropdown positioning (lines 196–205)
  - Color space conversion (HSV↔RGB↔Hex, lines 26–134)
  - EyeDropper API integration (Chrome 95+, lines 462–482)
  - Keyboard handling on hex input (Enter to commit, line 430)
- **Token usage:** Uses `--color-bg-surface`, `--color-bg-elevated`, `--color-border-default`, `--color-fg-primary`, `--color-fg-secondary`, `--color-fg-muted`, `--color-action-primary`, `--radius-md`, `--radius-sm`, `--shadow-lg`, `--font-family-mono`, `--font-size-xs`, `--spacing-*` tokens via CSS module. Also 57 hardcoded values (px dimensions, rgba colors for slider tracks, checkerboard patterns).
- **Missing tokens:** Hardcoded `12px` slider heights, `192px`/`120px` canvas dimensions, `6px` thumb sizes. Some are inherently fixed (canvas pixel dimensions) but slider track colors should use tokens.
- **Classification:** **SHOULD BE ARCANA COMPONENT** — Color pickers are needed by any theming tool, form builder, or design editor. This is a fully-featured, production-quality component.
- **Proposed props API:**
  ```tsx
  interface ColorPickerProps {
    /** Current color value (hex, rgb, rgba) */
    value: string;
    /** Called on every change with a color string */
    onChange: (color: string) => void;
    /** Color output format */
    format?: 'hex' | 'rgb' | 'rgba' | 'hsl';
    /** Show alpha/opacity slider */
    showAlpha?: boolean;
    /** Show hex/RGB text inputs */
    showInputs?: boolean;
    /** Show eyedropper button (when supported) */
    showEyeDropper?: boolean;
    /** Preset palette swatches */
    presetColors?: string[];
    /** Track recent colors */
    showRecent?: boolean;
    /** Placement of popup relative to trigger */
    placement?: 'top' | 'bottom' | 'left' | 'right';
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Disabled state */
    disabled?: boolean;
  }
  ```
- **Priority:** High — color pickers are a universally needed form control absent from the Arcana library.

### FontPicker

- **File:** `playground/src/components/TokenEditor.tsx` (lines 301–417, defined inline)
- **Purpose:** Searchable dropdown for selecting Google Fonts and locally-uploaded fonts, organized by category (Sans-Serif, Serif, Monospace).
- **Behavior:**
  - Manages open/close state (line 303)
  - Click-outside dismissal via `document.addEventListener('mousedown')` (lines 328–337)
  - Search/filter with `useMemo` (lines 307–312)
  - Auto-focus search input on open (lines 339–341)
  - Dynamic Google Font loading via `<link>` injection (lines 69–77)
  - Grouped option list with category headers (lines 385–408)
- **Token usage:** Styled entirely through `TokenEditor.module.css` which references 169 token vars. The FontPicker-specific styles use tokens for colors, borders, radius, spacing, fonts.
- **Missing tokens:** Minimal hardcoded values — mostly well-tokenized.
- **Classification:** **SHOULD BE ARCANA COMPONENT** — Font selectors are needed in any design tool, CMS, or document editor. The Google Fonts integration and local font upload make this genuinely reusable.
- **Proposed props API:**
  ```tsx
  interface FontPickerProps {
    /** Current font-family stack value */
    value: string;
    /** Called when a font is selected */
    onChange: (fontStack: string) => void;
    /** Label text */
    label?: string;
    /** Google Fonts to offer (defaults to curated list) */
    googleFonts?: Array<{ name: string; category: 'sans' | 'serif' | 'mono'; weights: string }>;
    /** Locally uploaded fonts */
    localFonts?: Array<{ name: string; stack: string }>;
    /** Show search input */
    searchable?: boolean;
    /** Placeholder text for search */
    searchPlaceholder?: string;
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';
    /** Disabled state */
    disabled?: boolean;
  }
  ```
- **Priority:** Medium — useful for design tools and content editors, but narrower audience than ColorPicker.

---

## Should Use Arcana Hooks

### CubicBezierEditor

- **File:** `playground/src/components/CubicBezierEditor.tsx` (387 lines)
- **CSS:** `playground/src/components/CubicBezierEditor.module.css` (39 token refs, 25 hardcoded values)
- **Purpose:** Visual cubic bezier curve editor with draggable control points on a canvas, preset buttons, animation preview, and numeric inputs.
- **Behavior:**
  - Canvas 2D rendering with grid, control lines, curve, and control points (lines 52–154)
  - Drag interaction on canvas control points via `document.addEventListener('mousemove/mouseup')` (lines 241–258)
  - Hit detection with `Math.hypot` distance check (lines 234–238)
  - Animation preview with `requestAnimationFrame` loop (lines 263–286)
  - Numeric input clamping (lines 296–302)
  - Preset matching/detection (lines 172–185)
- **Token usage:** Uses `--color-bg-surface`, `--color-bg-elevated`, `--color-fg-primary`, `--color-fg-muted`, `--color-action-primary`, `--color-border-default`, `--radius-md`, `--font-family-mono`, `--font-size-xs`, `--spacing-*` tokens. Also reads `--color-action-primary` via `getComputedStyle` for canvas rendering (lines 117–119, 131–133).
- **Missing tokens:** Hardcoded `rgba(255,255,255,0.08)` grid colors and canvas sizing (inherently requires pixel values for canvas).
- **Hooks to extract:**
  - **`useDraggable(ref, { onDrag, onDragEnd, bounds })`** — Reusable for any drag interaction (sliders, resize handles, sortable lists). Currently the drag pattern (mousedown → document.mousemove → document.mouseup with RAF throttling) is manually implemented in both CubicBezierEditor and ColorPicker.
- **Keep as:** Playground-specific component using the extracted `useDraggable` hook. Cubic bezier editing is too specialized for a general-purpose component library.

### TokenEditor (undo/redo system)

- **File:** `playground/src/components/TokenEditor.tsx` (lines 235–281, `useUndoRedo` hook)
- **Purpose:** Generic undo/redo history stack with 50-entry limit, used for tracking CSS variable changes in the token editor.
- **Behavior:**
  - Push/undo/redo operations on a ref-based history stack (lines 240–280)
  - `canUndo`/`canRedo` boolean state (lines 278–279)
  - History branch trimming on new pushes (line 243)
  - Max history limit (line 244–246)
  - Keyboard shortcut binding (Cmd+Z / Cmd+Shift+Z) is done separately in the parent (lines 778–792)
- **Hooks to extract:**
  - **`useUndoRedo<T>(options?: { maxHistory?: number })`** — A generic undo/redo hook is useful for any editor, form builder, or interactive tool. The current implementation is already hook-shaped but not exported.
- **Keep as:** The TokenEditor itself remains playground-specific, but `useUndoRedo` should be extracted to `packages/core/src/hooks/useUndoRedo.ts`.

---

## Playground Specific (Keep As-Is)

### TokenEditor (main component)

- **File:** `playground/src/components/TokenEditor.tsx` (1,659 lines)
- **Purpose:** Professional token editing panel with collapsible sections for colors, typography, spacing, shape, and motion. Includes search/filter, per-token modified indicators, undo/redo, export/import, and density controls.
- **Why playground-specific:** This is the core playground product — a specialized tool for editing Arcana design tokens in real time. It directly manipulates `document.documentElement.style` CSS variables. No Arcana consumer would need this exact component.

### AccessibilityPanel

- **File:** `playground/src/components/AccessibilityPanel.tsx` (450 lines)
- **Purpose:** WCAG contrast ratio checker with score card, per-pair contrast display, color blindness simulation via SVG filters, and auto-fix suggestions.
- **Why playground-specific:** Deeply coupled to Arcana's specific token variable names (`--color-fg-primary`, `--color-bg-page`, etc.). Uses `MutationObserver` on `document.documentElement` to react to theme changes. The logic (contrast checking, fix suggestion) is utility-level, not component-level.

### ComponentThumbnail

- **File:** `playground/src/components/ComponentThumbnail.tsx` (194 lines)
- **Purpose:** Renders a small visual preview of each component for the gallery grid. Contains a large `switch` statement mapping slugs to mini component renderings.
- **Why playground-specific:** A rendering utility for the playground's component gallery. The large switch statement is tightly coupled to the component registry.

### ThemeSwitcherBar

- **File:** `playground/src/pages/PlaygroundLayout.tsx` (lines 18–43)
- **Purpose:** Horizontal row of theme chip buttons for switching between presets.
- **Why playground-specific:** Renders `PRESETS` array with emoji labels. Playground layout chrome, not a reusable component. (Note: a different `ThemeSwitcher` for demos already exists in `demos/shared/`.)

### BreadcrumbNav

- **File:** `playground/src/pages/PlaygroundLayout.tsx` (lines 45–83)
- **Purpose:** Auto-generates breadcrumbs from the current URL path.
- **Why playground-specific:** Hardcoded path-to-label mappings (`playground`, `components`, `tokens`, `graph`). Uses Arcana's `Breadcrumb`/`BreadcrumbItem` components correctly.

### PlaygroundLayout

- **File:** `playground/src/pages/PlaygroundLayout.tsx` (lines 85–171)
- **Purpose:** Shared layout wrapper for all `/playground/*` routes with top nav, theme persistence, and breadcrumb navigation.
- **Why playground-specific:** Route-level layout with playground-specific navigation and theme state management.

### ComponentGallery

- **File:** `playground/src/pages/ComponentGallery.tsx` (117 lines)
- **Purpose:** Grid of component cards with search and category filter.
- **Why playground-specific:** Uses playground's `COMPONENT_REGISTRY` data and `ComponentThumbnail`. This is a playground page, not a reusable component.

### ComponentDetail

- **File:** `playground/src/pages/ComponentDetail.tsx` (~800+ lines)
- **Purpose:** Side-by-side component detail page with variant/size/state selectors, live preview, token editor, and props reference.
- **Why playground-specific:** Contains `RenderComponent` (large switch statement), `ControlsPanel`, `VariantsGallery`, `SizesGallery`, `PropsReferenceSection` — all playground-specific rendering utilities.

### RenderComponent

- **File:** `playground/src/pages/ComponentDetail.tsx` (lines 123–480+)
- **Purpose:** Large switch-case renderer that instantiates any Arcana component by slug with the right props for live preview.
- **Why playground-specific:** A rendering utility mapping slugs to JSX. Inherently playground-specific.

### ControlsPanel

- **File:** `playground/src/pages/ComponentDetail.tsx` (line 487)
- **Purpose:** Side panel with variant/size/state radio buttons for the component detail page.
- **Why playground-specific:** Controls for the playground's interactive component explorer.

### VariantsGallery / SizesGallery

- **File:** `playground/src/pages/ComponentDetail.tsx` (lines 676, 695)
- **Purpose:** Renders all variants or sizes of a component side-by-side.
- **Why playground-specific:** Gallery views for the playground component explorer.

### PropsReferenceSection

- **File:** `playground/src/pages/ComponentDetail.tsx` (line 716)
- **Purpose:** Renders a table of component props from the registry metadata.
- **Why playground-specific:** Documentation display for the playground.

### TokenExplorer

- **File:** `playground/src/pages/TokenExplorer.tsx` (201 lines)
- **Purpose:** Browse all tokens organized by category with visual previews, search, and filter.
- **Why playground-specific:** A playground page that reads from `token-map.json`.

### TokenPreview

- **File:** `playground/src/pages/TokenExplorer.tsx` (lines 59–72)
- **Purpose:** Renders a color swatch, shadow preview, or radius preview for a single token.
- **Why playground-specific:** Visual preview helper for the token explorer page.

### TokenImpact

- **File:** `playground/src/pages/TokenImpact.tsx` (200+ lines)
- **Purpose:** Shows a single token's info, inline editor, and all affected components rendered live.
- **Why playground-specific:** Deep-dive page for token impact visualization.

### MiniComponent

- **File:** `playground/src/pages/TokenImpact.tsx` (lines 40–91)
- **Purpose:** Renders a small representative version of a component for the token impact page.
- **Why playground-specific:** Simplified component rendering for the impact visualization.

### Landing

- **File:** `playground/src/pages/Landing.tsx` (900 lines)
- **Purpose:** Marketing landing page with navbar, hero, logo cloud, features, theme showcase, pricing, and CTA sections.
- **Why playground-specific:** One-off landing page for the Arcana website. Uses hardcoded theme preview data and custom CSS.

### SVG Icon Components (ArrowIcon, TokensIcon, ComponentsIcon, AIIcon, MenuIcon, CloseIcon)

- **File:** `playground/src/pages/Landing.tsx` (lines 8–123)
- **Purpose:** Inline SVG icon components used in the landing page.
- **Why playground-specific:** Simple SVG wrappers for the landing page. An Icon component or icon library could be a future Arcana addition, but these specific icons are landing-page-specific.

### App.tsx Section Components (ToastDemo, TypographySection, OverviewSection, ComponentsSection, FormsSection, DataSection, DataTableDemo, LayoutSection, FeedbackSection, MobilePatternsSection, MarketingSection, NavigationSection, EcommerceSection, EditorialSection, UtilitiesSection, OverlaysSection, KitchenSink)

- **File:** `playground/src/App.tsx` (3,870 lines total, 17 section components)
- **Purpose:** Each renders a demo section of the playground's main editor page, showcasing Arcana components with sample data.
- **Why playground-specific:** These are demo/showcase sections, not reusable components. They compose Arcana components with hardcoded sample content. `BuggyComponent` (line 2189) intentionally throws for ErrorBoundary demo.

### Utility Functions

- **File:** `playground/src/utils/contrast.ts` (130 lines)
  - `parseColor`, `toHexString`, `toHex`, `relativeLuminance`, `contrastRatio`, `wcagLevel`, `suggestFix`
  - **Classification:** PLAYGROUND SPECIFIC — These are pure utility functions, not components. `contrastRatio` and `wcagLevel` could theoretically live in a `@arcana-ui/utils` package, but they're not component-level.

- **File:** `playground/src/utils/presets.ts` (100+ lines)
  - `applyPreset`, `getCSSVar`, `PRESETS` array
  - **Classification:** PLAYGROUND SPECIFIC — Theme preset application logic specific to the playground. `getCSSVar` is a one-liner utility.

- **File:** `playground/src/data/component-registry.ts`
  - Component metadata registry for the playground's gallery/detail pages.
  - **Classification:** PLAYGROUND SPECIFIC — Data file.

- **File:** `playground/src/data/token-map-types.ts`
  - TypeScript interfaces for the generated `token-map.json`.
  - **Classification:** PLAYGROUND SPECIFIC — Type definitions.

---

## Raw HTML Where Arcana Components Should Be Used

These are not custom components per se, but places where raw `<input>`, `<button>`, `<nav>`, or `<div>` elements are used with custom CSS instead of importing the equivalent Arcana component.

### Landing Page Navbar

- **File:** `playground/src/pages/Landing.tsx` (lines 346–386)
- **Element:** Raw `<nav className={styles.nav}>` with `<ul className={styles.navLinks}>`, `<li>`, `<a className={styles.navLink}>`, and a mobile menu toggle
- **What it should use:** Arcana `<Navbar>`, `<NavbarBrand>`, `<NavbarContent>`, `<NavbarActions>` — which handle responsive collapse, ARIA attributes, and consistent styling out of the box
- **Issues:**
  - ~50 lines of custom CSS for `.nav`, `.navInner`, `.navLinks`, `.navLink`, `.navActions`, `.navMobileToggle`
  - Custom mobile menu implementation (`.mobileMenu`, `.mobileMenuOpen`, `.mobileMenuPanel`) with raw `<div onClick>` instead of Arcana's `<DrawerNav>` or `<Drawer>`
  - No `aria-label="Main navigation"` on the `<nav>` element
  - Link hover/active states use hardcoded `--landing-*` vars instead of Arcana tokens

### PlaygroundLayout Top Navigation

- **File:** `playground/src/pages/PlaygroundLayout.tsx` (lines 133–155)
- **Element:** Raw `<header className={styles.topbar}>` with `<nav className={styles.nav}>` and `<Link className={styles.navLink}>` elements
- **What it should use:** Arcana `<Navbar>`, `<NavbarBrand>`, `<NavbarContent>` — the playground's own component pages showcase Navbar but the playground itself doesn't use it
- **Issues:**
  - Custom `.topbar`, `.nav`, `.navLink`, `.navLinkActive`, `.brand` CSS classes
  - Active link styling manually computed with `className` string concatenation
  - No responsive collapse behavior (nav items may overflow on narrow screens)

### Landing Page Prompt Input

- **File:** `playground/src/pages/Landing.tsx` (lines 458–474)
- **Element:** Raw `<input type="text" className={styles.promptInput}>` inside a `<form>`
- **What it should use:** Arcana `<Input>` with custom `className` for any visual overrides
- **Issues:**
  - Hardcoded `border-radius: 14px` in CSS (should use `--radius-*` token)
  - Custom focus ring (`box-shadow: 0 0 0 3px var(--landing-accent-glow)`) instead of `--focus-ring` token
  - Entire landing page uses its own `--landing-*` CSS variable namespace (20+ custom variables at line 8–20 of `Landing.module.css`) instead of Arcana semantic tokens
  - The submit button next to it DOES correctly use `<Button variant="primary">`, making the raw input inconsistent

### TokenEditor Search Input

- **File:** `playground/src/components/TokenEditor.tsx` (lines 1029–1043)
- **Element:** Raw `<input type="text" className={styles.searchInput}>` with a Unicode `⌕` icon and a raw `<button>` clear (`×`) button
- **What it should use:** Arcana `<Input>` with `prefix` prop for the search icon (exactly how `ComponentGallery.tsx` line 46 and `TokenExplorer.tsx` line 134 do it correctly)
- **Issues:**
  - Hardcoded `6px` gap, `12px` font-size in CSS
  - Custom clear button instead of a proper Arcana `<Button variant="ghost" size="sm">`
  - Inconsistent with the rest of the playground — ComponentGallery and TokenExplorer both use Arcana `<Input>` for their search bars

### Token Reset Buttons

- **File:** `playground/src/components/TokenEditor.tsx` (lines 1145–1152)
- **Element:** Raw `<button className={styles.tokenResetBtn}>↺</button>` for per-token reset
- **What it should use:** Arcana `<Button variant="ghost" size="sm" iconOnly>` with a proper icon
- **Issues:**
  - Hardcoded `18×18px` dimensions in CSS (`.tokenResetBtn`)
  - Uses a Unicode character (`↺`) instead of an SVG icon
  - Custom hover style instead of using Button's built-in ghost hover

### Modified Dot Indicators

- **File:** `playground/src/components/TokenEditor.tsx` (line 1132)
- **Element:** `<span className={styles.modifiedDot}>` — a 5×5px colored circle next to modified tokens
- **What it should use:** Arcana `<Badge>` with a `dot` variant, or keep as-is since it's a 5px indicator dot (too small to warrant a full component). However, the hardcoded `5px` width/height and `background: var(--color-action-primary)` should at least use `--spacing-1` for sizing.

### Section Toggle Buttons (Collapsible Headers)

- **File:** `playground/src/components/TokenEditor.tsx` (lines 1048–1055, and throughout)
- **Element:** Raw `<button className={styles.sectionHeader}>` with Unicode `▾`/`▸` chevrons for collapsible sections
- **What it should use:** Arcana `<Collapsible>` or `<Accordion>` components, which already handle expand/collapse state, keyboard accessibility, and ARIA attributes. The TokenEditor manually manages `openSections` state with a `Set<string>`.
- **Issues:**
  - No ARIA attributes (`aria-expanded`, `aria-controls`) on the toggle buttons
  - Unicode chevrons instead of SVG icons
  - Duplicated toggle pattern across 5+ sections in the editor
  - Also duplicated in `AccessibilityPanel.tsx` (lines 260–266) with the same pattern

---

## Duplicated Behavior Patterns

### 1. Click-Outside Detection

- **Used in:** ColorPicker (line 231), FontPicker (line 328)
- **Current implementation:** Each creates a `useEffect` with `document.addEventListener('mousedown')`, checks `ref.current.contains(e.target)`, and removes the listener on cleanup.
- **Recommendation:** Extract `useClickOutside(ref, callback, enabled)` hook. This is a well-known pattern. Note: the Arcana `useFloating` hook handles positioning but does NOT handle click-outside — that's left to the consumer. A `useClickOutside` hook would complement `useFloating`.

### 2. Canvas Drag Interaction

- **Used in:** ColorPicker (3 drag handlers: saturation/value canvas, hue slider, alpha slider — lines 290–404), CubicBezierEditor (control point drag — lines 217–258)
- **Current implementation:** Both follow the exact same pattern:
  1. `onMouseDown` on element — start drag
  2. Add `document.addEventListener('mousemove', onMove)` and `document.addEventListener('mouseup', onUp)`
  3. Use `requestAnimationFrame` for throttling in ColorPicker
  4. Get coordinates relative to element via `getBoundingClientRect()`
  5. Clean up listeners on mouseup
- **Recommendation:** Extract `useDrag(options: { onDragStart, onDrag, onDragEnd, ref })` hook. Returns `{ isDragging, position }`. Should handle RAF throttling, touch events, and coordinate normalization. This is the strongest candidate for hook extraction — 4 separate implementations of the same pattern across 2 files.

### 3. getCSSVarValue / getCSSVar Utility

- **Duplicated in:** `playground/src/pages/ComponentDetail.tsx` (line 109), `playground/src/pages/TokenExplorer.tsx` (line 54), `playground/src/pages/TokenImpact.tsx` (line 34), `playground/src/components/AccessibilityPanel.tsx` (line 5), `playground/src/utils/presets.ts` (line 74)
- **Current implementation:** All are identical one-liners: `getComputedStyle(document.documentElement).getPropertyValue(varName).trim()`
- **Recommendation:** Consolidate into a single shared utility imported from `playground/src/utils/presets.ts` where `getCSSVar` already exists. Not an Arcana hook candidate — this is a trivial utility.

---

## Existing Hooks Analysis

| Hook | Location | Exported? | Used by playground? | Notes |
|------|----------|-----------|---------------------|-------|
| `useFloating` | `packages/core/src/hooks/useFloating.ts` | Yes | **Yes** — ColorPicker (line 18) | Correctly used for popup positioning |
| `useHotkey` | `packages/core/src/hooks/useHotkey.ts` | Yes | **No** — should be | TokenEditor manually implements Cmd+Z/Cmd+Shift+Z keyboard shortcuts (lines 778–792) instead of using `useHotkey` |
| `useBreakpoint` | `packages/core/src/hooks/useBreakpoint.ts` | Yes | **No** | Landing page handles responsive behavior via CSS media queries, which is appropriate |
| `useMediaQuery` | `packages/core/src/hooks/useMediaQuery.ts` | Yes | **No** | CubicBezierEditor uses `window.matchMedia('(prefers-color-scheme: dark)')` directly (line 166) instead of `useMediaQuery` |
| `usePrefersReducedMotion` | `packages/core/src/hooks/usePrefersReducedMotion.ts` | Yes | **No** | CubicBezierEditor's animation preview does not check for reduced motion |
| `useTheme` | `packages/core/src/hooks/useTheme.ts` | Yes | **No** | Playground implements its own theme state management via `presets.ts` |

---

## Recommendations Summary

### New Arcana Components to Build

| Priority | Component | Source | Rationale |
|----------|-----------|--------|-----------|
| **High** | `ColorPicker` | `playground/src/components/ColorPicker.tsx` | Universally needed form control. Full-featured (HSV canvas, hex/RGB inputs, alpha, eyedropper, presets). Already uses `useFloating`. |
| **Medium** | `FontPicker` | Inline in `TokenEditor.tsx` (lines 301–417) | Useful for design tools, CMS, document editors. Google Fonts integration + local upload. |

### Hooks to Extract from Existing Code

| Priority | Hook | Source | Rationale |
|----------|------|--------|-----------|
| **High** | `useClickOutside(ref, callback, enabled?)` | ColorPicker, FontPicker | Duplicated across 2+ components. Universally needed for dropdowns, modals, popovers. Complements `useFloating`. |
| **High** | `useDrag({ onDrag, onDragEnd, ref })` | ColorPicker (×3), CubicBezierEditor (×1) | 4 identical implementations of mousedown→mousemove→mouseup+RAF. Needed for sliders, resize handles, drag-and-drop. |
| **Medium** | `useUndoRedo<T>(maxHistory?)` | TokenEditor (lines 235–281) | Already implemented as a hook shape. Useful for any editor or form builder. |

### Existing Hooks That Should Be Used

| Hook | Where it should be used | Current workaround |
|------|------------------------|--------------------|
| `useHotkey` | TokenEditor undo/redo shortcuts | Manual `document.addEventListener('keydown')` (lines 778–792) |
| `useMediaQuery` or `usePrefersReducedMotion` | CubicBezierEditor dark mode detection | Direct `window.matchMedia` call (line 166) — not reactive, only reads once |

### Quick Wins (No New Components Needed)

1. **Replace raw `<input>` in TokenEditor search** with Arcana `<Input prefix={...}>` — matches how ComponentGallery and TokenExplorer already do it.
2. **Replace raw `<input>` in Landing page prompt** with Arcana `<Input>` — the adjacent submit button already uses Arcana `<Button>`.
3. **Replace raw `<button>` reset buttons** in TokenEditor with Arcana `<Button variant="ghost" size="sm" iconOnly>`.
4. **Replace manual collapsible sections** in TokenEditor (and AccessibilityPanel) with Arcana `<Collapsible>` or `<Accordion>` — adds ARIA attributes for free.
5. **Replace Landing page `--landing-*` CSS variables** with Arcana semantic tokens where possible (at minimum `--color-fg-primary`, `--radius-md`, `--font-family-body`).
6. **Deduplicate `getCSSVarValue`** — 5 copies of the same one-liner across playground files. Import from `utils/presets.ts`.
7. **Use `useHotkey`** in TokenEditor for undo/redo instead of manual event listener.
8. **Use `usePrefersReducedMotion`** in CubicBezierEditor to disable animation preview when reduced motion is preferred.
9. **Make CubicBezierEditor dark mode reactive** — currently reads `prefers-color-scheme` once on render; should use `useMediaQuery` to react to changes.
