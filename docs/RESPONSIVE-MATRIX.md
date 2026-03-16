# Arcana UI — Responsive Behavior Matrix

> **Version:** 1.0 · **Last Updated:** 2026-03-16
> **Purpose:** Single reference for how every component adapts at every breakpoint.
> **Used by:** Tasks 2.2–2.10 (Phase 2: Responsive & Mobile)

---

## Breakpoint Reference

| Name | Token | Range | Shorthand |
|------|-------|-------|-----------|
| Mobile | — (default) | < 640px | `mobile` |
| Tablet | `--breakpoint-sm` | 640px – 1023px | `tablet` |
| Desktop | `--breakpoint-lg` | 1024px – 1279px | `desktop` |
| Wide | `--breakpoint-xl` | 1280px – 1535px | `wide` |
| Ultra | `--breakpoint-2xl` | ≥ 1536px | `ultra` |

All CSS is **mobile-first**: default styles target mobile, `min-width` media queries layer up.

```css
/* Mobile (default) */
.component { ... }

/* Tablet+ */
@media (min-width: 640px) { .component { ... } }

/* Desktop+ */
@media (min-width: 1024px) { .component { ... } }

/* Wide+ */
@media (min-width: 1280px) { .component { ... } }
```

---

## Global Requirements

### Touch Targets (WCAG 2.5.5 / 2.5.8)
- **Minimum:** 44 × 44px on mobile and tablet
- **Gap:** Minimum 8px between adjacent interactive elements
- Components may use a larger hit area via padding even if the visible element is smaller

### Text Overflow
- **Default:** Wrap and reflow
- **Exceptions:** Badges, button labels, table headers — truncate with ellipsis if constrained
- **Never:** Hidden overflow without a scroll or disclosure mechanism

### Hover vs. Touch
- Every `:hover` state must have a `:focus-visible` equivalent
- No functionality gated behind hover (tooltips must work on tap/focus)
- `@media (hover: hover)` gates hover-only visual enhancements

---

## Current State Summary

| Status | Count | Components |
|--------|-------|------------|
| No @media queries | 19 | All except Layout |
| Has @media queries | 1 | Layout (640px, 1024px) |
| Touch target failures (< 44px) | 8 | Checkbox, Radio, Toggle, Alert close, Toast dismiss, Modal close, Tabs, Table sort |
| Critical layout issues on mobile | 4 | Navbar, Modal, Table, Tabs |

---

## Primitives

### Button

| Breakpoint | Layout | Size | Touch Target | Notes |
|------------|--------|------|--------------|-------|
| Mobile | Full-width when inside a form or stack; inline otherwise | `min-height: 44px` enforced | 44px ✓ | `padding-x` increases; `sm` size gets mobile minimum |
| Tablet | Standard inline | Default per size prop | 44px ✓ | — |
| Desktop | Standard inline | Default per size prop | N/A (mouse) | Hover states active |
| Wide+ | Standard inline | Default per size prop | N/A | — |

**Current gaps:**
- `sm` size height is `2rem` (32px) — **below 44px on mobile**
- `white-space: nowrap` — long labels can overflow narrow containers
- No `fullWidth` responsive behavior (always full or never full)

**Responsive plan:**
- Mobile: enforce `min-height: 44px` on all sizes via `@media (max-width: 639px)` or token override
- Mobile: allow `white-space: normal` for long labels in narrow contexts (opt-in via class)
- Add responsive `fullWidth` behavior: `fullWidth="mobile"` prop makes button full-width only below 640px

**Overflow:** Text truncates with ellipsis if container is width-constrained. Wrapping is opt-in.

**Interaction change:** None — buttons work identically at all sizes. Hover enhancement gated by `@media (hover: hover)`.

---

### Input

| Breakpoint | Layout | Size | Touch Target | Notes |
|------------|--------|------|--------------|-------|
| Mobile | Full-width (100%) | `min-height: 44px` enforced | 44px ✓ | Larger font-size (16px) prevents iOS zoom |
| Tablet | Full-width or flex child | Default | 44px ✓ | — |
| Desktop | Flex child, sized by container | Default | N/A | — |
| Wide+ | Same as desktop | Default | N/A | — |

**Current gaps:**
- Compact density height could drop below 44px on mobile
- Font size `--font-size-sm` (14px) causes iOS Safari to auto-zoom on focus
- No responsive padding changes

**Responsive plan:**
- Mobile: enforce `min-height: 44px` regardless of density
- Mobile: set `font-size: max(var(--input-font-size), 16px)` to prevent iOS zoom
- Prefix/suffix icons: stack vertically if input width < 200px (edge case)

**Overflow:** Text scrolls horizontally inside the input. Labels wrap above the input.

**Interaction change:** None — input works the same. Virtual keyboard triggers on mobile focus.

---

### Avatar

| Breakpoint | Layout | Size | Touch Target | Notes |
|------------|--------|------|--------------|-------|
| Mobile | Same as desktop | Same as desktop | N/A (typically non-interactive) | — |
| Tablet | Same | Same | N/A | — |
| Desktop | Same | Same | N/A | — |
| Wide+ | Same | Same | N/A | — |

**Current gaps:** None critical — Avatar is display-only. When used as a button (profile menu trigger), the wrapping button element must meet 44px.

**Responsive plan:**
- No responsive changes to Avatar itself
- AvatarGroup: limit visible count on mobile (e.g., show 3 + "+5" instead of 8)

**Overflow:** Initials truncate to 1-2 characters. Image fills container. No text overflow concern.

**Interaction change:** None. If clickable, parent element handles touch target.

---

### Badge

| Breakpoint | Layout | Size | Touch Target | Notes |
|------------|--------|------|--------------|-------|
| Mobile | Inline | Same | N/A (non-interactive) | — |
| Tablet+ | Inline | Same | N/A | — |

**Current gaps:** `white-space: nowrap` — very long badge text could push layout on narrow screens.

**Responsive plan:**
- No size changes (badges are intentionally compact)
- Add `max-width` + `text-overflow: ellipsis` for long text badges on mobile
- Removable badges: ensure dismiss button meets 44px touch target via padding

**Overflow:** Truncate with ellipsis at `max-width: 200px` on mobile. Full text via `title` attribute.

**Interaction change:** None.

---

### Checkbox

| Breakpoint | Layout | Size | Touch Target | Notes |
|------------|--------|------|--------------|-------|
| Mobile | Checkbox + label row | Visual: 16px, Hit area: 44px | 44px ✓ (via padding) | Padded hit area around the 16px visual |
| Tablet | Same | Same | 44px ✓ | — |
| Desktop | Same | Visual: 16px | N/A | Standard mouse target |
| Wide+ | Same | Same | N/A | — |

**Current gaps:**
- Checkbox input is 16px (`--checkbox-size`) — **well below 44px**
- No padding or hit area expansion on mobile
- Gap between checkbox items: 10px (`--spacing-2-5`) — below 8px min ✓ but tight

**Responsive plan:**
- Mobile: expand clickable area to 44×44px using `::before` pseudo-element or padding on the wrapper
- Mobile: increase gap between stacked checkbox items to `--spacing-3` (12px)
- Label font size: no change needed (already readable)

```
Desktop:                    Mobile:
┌──┐                        ┌──────────────────────┐
│✓ │ Accept terms            │  ┌──┐                │
└──┘                        │  │✓ │ Accept terms    │ ← 44px hit area
                            │  └──┘                │
                            └──────────────────────┘
```

**Overflow:** Label text wraps naturally. No truncation.

**Interaction change:** None — both click/tap select the checkbox via the label association.

---

### Radio

| Breakpoint | Layout | Size | Touch Target | Notes |
|------------|--------|------|--------------|-------|
| Mobile | Radio + label row | Visual: 16px, Hit area: 44px | 44px ✓ (via padding) | Same approach as Checkbox |
| Tablet+ | Same | Same | 44px ✓ | — |
| Desktop+ | Same | Visual: 16px | N/A | — |

**Current gaps:** Same as Checkbox — input is 16px with no hit area expansion.

**Responsive plan:** Same as Checkbox — expand hit area via padding/pseudo-element on mobile.

**Overflow:** Label and description text wrap naturally.

**Interaction change:** None.

---

### Select

| Breakpoint | Layout | Size | Touch Target | Notes |
|------------|--------|------|--------------|-------|
| Mobile | Full-width (100%) | `min-height: 44px` enforced | 44px ✓ | Native `<select>` dropdown; iOS/Android render native picker |
| Tablet | Full-width or flex child | Default | 44px ✓ | — |
| Desktop+ | Flex child | Default | N/A | — |

**Current gaps:**
- Compact density height could drop below 44px
- Font size could be < 16px (iOS zoom issue)

**Responsive plan:**
- Mobile: enforce `min-height: 44px` regardless of density
- Mobile: enforce `font-size: max(var(--select-font-size), 16px)`
- Native `<select>` element handles its own mobile dropdown UI (no custom dropdown needed)

**Overflow:** Selected option text truncates if select is narrow. Options scroll in native picker.

**Interaction change:** Mobile uses native OS picker sheet. Desktop uses browser dropdown.

---

### Textarea

| Breakpoint | Layout | Size | Touch Target | Notes |
|------------|--------|------|--------------|-------|
| Mobile | Full-width (100%) | `min-height: 80px` | 80px ✓ | Consider reducing min-height on mobile |
| Tablet+ | Full-width or flex child | Default | ✓ | — |

**Current gaps:**
- `min-height: 80px` on a 320px viewport consumes significant vertical space
- Font size may be < 16px (iOS zoom)

**Responsive plan:**
- Mobile: reduce `min-height` to `60px` (still well above 44px)
- Mobile: enforce `font-size: max(var(--textarea-font-size), 16px)`
- `resize: vertical` stays — user can expand on any device

**Overflow:** Text wraps naturally. Vertical scrollbar appears when content exceeds height.

**Interaction change:** None.

---

### Toggle

| Breakpoint | Layout | Size | Touch Target | Notes |
|------------|--------|------|--------------|-------|
| Mobile | Toggle + label row | Visual: 24–28px h, Hit area: 44px | 44px ✓ (via padding) | Padded wrapper ensures 44px |
| Tablet+ | Same | Same | 44px ✓ | — |
| Desktop+ | Same | Default visual size | N/A | — |

**Current gaps:**
- Toggle track is 24–28px tall, 32–56px wide — **all below 44×44px**
- No hit area expansion

**Responsive plan:**
- Mobile: expand hit area to 44px height via padding on the toggle wrapper
- Toggle `sm` size: consider hiding on mobile or enforcing `md` minimum
- Label association ensures the full row is clickable

**Overflow:** N/A — toggle is fixed-size.

**Interaction change:** None — click/tap both toggle state.

---

## Composites

### Accordion

| Breakpoint | Layout | Size | Touch Target | Notes |
|------------|--------|------|--------------|-------|
| Mobile | Full-width stacked | Trigger: min 44px | 44px ✓ | Padding ensures height |
| Tablet+ | Same | Same | ✓ | — |

**Current gaps:**
- Trigger height is content-dependent — could be < 44px with short text and compact density
- No responsive padding changes

**Responsive plan:**
- Mobile: enforce `min-height: 44px` on trigger
- Padding: increase to `--spacing-4` minimum on mobile (already default)
- Content panel: no changes needed (content reflows naturally)

**Overflow:** Trigger text wraps. Content panel is scrollable via page scroll.

**Interaction change:** None — click/tap expands panel.

---

### Alert

| Breakpoint | Layout | Size | Touch Target | Notes |
|------------|--------|------|--------------|-------|
| Mobile | Icon + content stacked or row | Same padding | Close: 44px (expanded) | Close button area must expand |
| Tablet+ | Icon + content row | Same | Close: 32px (current) | — |
| Desktop+ | Same | Same | N/A | — |

**Current gaps:**
- Close button is 24×24px — **well below 44px on mobile**
- Icon + text + close in a row can be cramped on 320px

**Responsive plan:**
- Mobile: expand close button hit area to 44×44px via padding
- Mobile: if icon + text + close doesn't fit, stack icon above text
- Consider: on very narrow screens, alert spans full width with more padding

```
Desktop:                              Mobile (320px):
┌──────────────────────────────┐      ┌───────────────────────┐
│ ⚠ Alert message here    [×] │      │ ⚠ Alert message       │
└──────────────────────────────┘      │   here            [×] │
                                      └───────────────────────┘
```

**Overflow:** Alert text wraps. Multiple alerts stack vertically.

**Interaction change:** Dismissible alerts work via click/tap on close button.

---

### Card

| Breakpoint | Layout | Size | Touch Target | Notes |
|------------|--------|------|--------------|-------|
| Mobile | Full-width, stacked sections | Padding: `--spacing-md` | N/A (container) | Reduced padding |
| Tablet | Same or grid child | Padding: `--spacing-lg` | N/A | — |
| Desktop | Grid child | Padding: `--card-padding` | N/A | — |
| Wide+ | Same | Same | N/A | — |

**Current gaps:**
- `padding-lg` (24px × 32px) on 320px viewport leaves only 256px content width
- No responsive padding tiers
- Card header/body/footer sections don't adjust spacing per breakpoint

**Responsive plan:**
- Mobile: use `--spacing-md` (16px) padding regardless of padding prop
- Tablet+: use `--spacing-lg` (24px) padding
- Desktop+: use `--card-padding` (density-aware default)
- Interactive cards: ensure entire card meets 44px min-height (already does with any content)

**Overflow:** Title/description wrap. Content reflows. No horizontal overflow.

**Interaction change:** Interactive cards respond to click/tap the same way. Hover transform gated by `@media (hover: hover)`.

---

### Modal

| Breakpoint | Layout | Size | Touch Target | Notes |
|------------|--------|------|--------------|-------|
| Mobile | **Full-width bottom sheet** | `width: 100%; max-height: 90vh` | Close: 44px | Slides up from bottom |
| Tablet | Centered dialog | `max-width: min(100% - 32px, size)` | Close: 44px | — |
| Desktop | Centered dialog | Size per prop (sm/md/lg/xl) | N/A | — |
| Wide+ | Same | Same | N/A | — |

**Current gaps — CRITICAL:**
- Modal max-widths (25rem–60rem) don't scale — `sm` modal (400px) overflows 320px viewport
- Close button is 32×32px — below 44px on mobile
- No bottom-sheet behavior on mobile
- Overlay padding is only 16px — modal touches screen edges

**Responsive plan:**
- Mobile (< 640px): modal becomes a bottom sheet
  - Full width, anchored to bottom
  - `max-height: 90vh`, rounded top corners only
  - Drag-to-dismiss handle (optional progressive enhancement)
  - Close button expands to 44×44px
- Tablet (640–1023px): centered dialog, `max-width: min(100% - 48px, size-value)`
- Desktop+: current behavior

```
Desktop:                    Mobile (bottom sheet):
┌─────────────────────┐     ┌───────────────────────┐
│ ┌─────────────────┐ │     │                       │
│ │  Modal Title  × │ │     │  ───── (drag handle)  │
│ │                 │ │     │  Modal Title        × │
│ │  Content here   │ │     │                       │
│ │                 │ │     │  Content here          │
│ │  [Cancel] [OK]  │ │     │                       │
│ └─────────────────┘ │     │  [Cancel]       [OK]  │
└─────────────────────┘     └───────────────────────┘
```

**Overflow:** Body scrolls vertically when content exceeds max-height. Footer is sticky at bottom.

**Interaction change:**
- Mobile: swipe down to dismiss (progressive enhancement)
- Mobile: close button must be 44×44px
- Escape key works on all devices with keyboard

---

### Tabs

| Breakpoint | Layout | Size | Touch Target | Notes |
|------------|--------|------|--------------|-------|
| Mobile | **Horizontally scrollable** | `min-height: 44px` per tab | 44px ✓ | Scroll indicators, or overflow: auto |
| Tablet | Scrollable if needed | Default | 44px ✓ | — |
| Desktop | Standard row | Default | N/A | — |
| Wide+ | Same | Same | N/A | — |

**Current gaps — CRITICAL:**
- `white-space: nowrap` on tabs causes overflow with 5+ tabs on mobile
- No scroll behavior — tabs just overflow
- Tab padding yields ~32–40px height — below 44px
- No mobile variant (e.g., dropdown selector, scrollable strip)

**Responsive plan:**
- Mobile: tab list becomes horizontally scrollable (`overflow-x: auto; scrollbar-width: none`)
- Mobile: enforce `min-height: 44px` on each tab
- Mobile: add scroll fade indicators (gradient mask on edges) to signal more tabs
- Alternative (for many tabs): collapse to a `<select>` dropdown on mobile (opt-in)

```
Desktop:                              Mobile (scrollable):
┌─────────────────────────────┐       ┌─────────────────────┐
│ Tab1 │ Tab2 │ Tab3 │ Tab4  │       │◀ Tab1│Tab2│Tab3│Tab ▶│
├─────────────────────────────┤       ├─────────────────────┤
│ Panel content               │       │ Panel content       │
└─────────────────────────────┘       └─────────────────────┘
                                       ← swipe to scroll →
```

**Overflow:** Tab labels don't wrap (nowrap). Tab list scrolls horizontally on mobile. Panel content wraps normally.

**Interaction change:** Mobile users swipe the tab bar to reveal hidden tabs. Active tab scrolls into view automatically.

---

### Toast

| Breakpoint | Layout | Size | Touch Target | Notes |
|------------|--------|------|--------------|-------|
| Mobile | **Full-width, bottom-center** | `width: calc(100vw - 32px)` | Dismiss: 44px | Centered at bottom, not right-aligned |
| Tablet | Bottom-right | `max-width: 380px` | Dismiss: 44px | — |
| Desktop+ | Bottom-right | `max-width: 380px` | N/A | — |

**Current gaps:**
- Dismiss button is 20×20px — **well below 44px**
- Portal positioned `bottom: 24px, right: 24px` — right-aligned even on mobile
- Action button is inline text — small touch target

**Responsive plan:**
- Mobile: toast portal anchors to `bottom: 16px; left: 16px; right: 16px` (centered, full-width)
- Mobile: dismiss button expands to 44×44px hit area
- Mobile: action button gets `min-height: 44px` padding
- Mobile: swipe-to-dismiss as progressive enhancement
- Tablet+: current bottom-right position

**Overflow:** Toast text wraps. Multiple toasts stack vertically with gap.

**Interaction change:**
- Mobile: swipe right to dismiss (progressive enhancement)
- Mobile: larger tap targets for dismiss and action
- Auto-dismiss timer unchanged across breakpoints

---

## Patterns

### Navbar

| Breakpoint | Layout | Size | Touch Target | Notes |
|------------|--------|------|--------------|-------|
| Mobile | **Logo + hamburger** | Height: 56px | Hamburger: 44px ✓ | Links hidden in drawer |
| Tablet | Logo + collapsed nav + actions | Height: 56px | Links: 44px | Fewer visible items |
| Desktop | Logo + full nav + actions | Height: 56px | N/A | All items visible |
| Wide+ | Same, wider max-width | Height: 56px | N/A | — |

**Current gaps — CRITICAL:**
- No responsive behavior at all — brand, content, actions are always in a row
- On 320px mobile, nav items overflow or compress
- No hamburger menu, no drawer, no mobile navigation pattern
- Content and actions flex but don't collapse

**Responsive plan:**
- Mobile (< 640px):
  - Show: brand + hamburger button (right-aligned)
  - Hide: nav content + actions
  - Hamburger opens a full-height drawer overlay (slide from right)
  - Drawer contains nav links stacked vertically + actions at bottom
  - Each nav item: `min-height: 44px`, full-width
- Tablet (640–1023px):
  - Show: brand + primary nav links + actions
  - Hide: secondary nav items (overflow into "More" dropdown)
  - All interactive items: 44px touch targets
- Desktop+ (1024px+):
  - Full navbar: brand + all nav links + all actions
  - Current behavior

```
Desktop:
┌─────────────────────────────────────────────────────┐
│ 🔮 Arcana   Home  Docs  Blog  Pricing    [Login]   │
└─────────────────────────────────────────────────────┘

Mobile:
┌─────────────────────┐     ┌─────────────────────┐
│ 🔮 Arcana       ☰  │ ──→ │ 🔮 Arcana       ✕  │
└─────────────────────┘     │─────────────────────│
                            │  Home               │
                            │  Docs               │
                            │  Blog               │
                            │  Pricing            │
                            │                     │
                            │  [Login]            │
                            └─────────────────────┘
```

**Overflow:** Nav items are hidden behind hamburger on mobile. On desktop, if items exceed width, they should collapse into a "More" dropdown or scroll.

**Interaction change:**
- Mobile: hamburger toggle opens/closes drawer
- Drawer: focus trapped, Escape closes, click-outside closes
- Desktop: standard link navigation with hover states

---

### Table

| Breakpoint | Layout | Size | Touch Target | Notes |
|------------|--------|------|--------------|-------|
| Mobile | **Horizontal scroll** or **card stack** | Cell padding: `--spacing-3` | Sort: 44px | Responsive variant prop |
| Tablet | Standard table, horizontal scroll if needed | Default padding | Sort: 44px | — |
| Desktop | Full table | Default padding | N/A | — |
| Wide+ | Full table, wider cells | Default padding | N/A | — |

**Current gaps — CRITICAL:**
- Only responsive behavior is `overflow-x: auto` on wrapper
- No mobile card layout variant
- Header cells use `white-space: nowrap` — forces horizontal scroll
- Sort button padding (12×16px) far below 44px
- No column prioritization or hiding

**Responsive plan:**
- Add `responsive` prop with modes:
  - `"scroll"` (default): horizontal scroll with sticky first column
  - `"stack"`: rows become cards on mobile (each cell is a label:value pair)
  - `"collapse"`: hide low-priority columns on mobile, show on wider screens
- Mobile (< 640px):
  - `"scroll"`: sticky first column + horizontal scroll + scroll shadow indicator
  - `"stack"`: each row becomes a card with header labels
  - Sort buttons: enlarge to 44px touch targets
  - Cell padding: increase vertical padding for easier row selection
- Tablet (640–1023px):
  - Show most columns, hide lowest priority via `data-priority` attribute
  - Sort buttons: 44px touch targets
- Desktop+: full table, all columns

```
Desktop (standard table):
┌──────────────────────────────────────────┐
│ Name       │ Email          │ Role       │
├──────────────────────────────────────────┤
│ Jane Doe   │ jane@acme.com  │ Admin      │
│ John Smith │ john@acme.com  │ Editor     │
└──────────────────────────────────────────┘

Mobile (card stack):
┌──────────────────────┐
│ Name:  Jane Doe      │
│ Email: jane@acme.com │
│ Role:  Admin         │
├──────────────────────┤
│ Name:  John Smith    │
│ Email: john@acme.com │
│ Role:  Editor        │
└──────────────────────┘
```

**Overflow:** Horizontal scroll (default mode). Card mode eliminates horizontal overflow.

**Interaction change:**
- Sort: tap column header (44px target)
- Row selection: tap anywhere on row/card
- Pagination: larger touch targets on mobile

---

### EmptyState

| Breakpoint | Layout | Size | Touch Target | Notes |
|------------|--------|------|--------------|-------|
| Mobile | Centered stack, reduced padding | Icon: 32px, smaller text | Action: 44px | Compact layout |
| Tablet+ | Centered stack | Icon: 48px, standard text | Action: inherits | — |

**Current gaps:**
- Two fixed sizes (md/sm) with no responsive switching
- Icon size doesn't scale per breakpoint
- Padding doesn't adjust for viewport

**Responsive plan:**
- Mobile: use `sm` dimensions (smaller icon, tighter padding)
- Tablet+: use `md` dimensions
- Action button follows Button responsive rules (44px min touch target)

**Overflow:** Title and description text wrap and center. No overflow issues.

**Interaction change:** None — action button follows standard button behavior.

---

### Form (FormField, FormLabel, FormHelperText, FormErrorMessage)

| Breakpoint | Layout | Size | Touch Target | Notes |
|------------|--------|------|--------------|-------|
| Mobile | Full-width stacked fields | Gap: `--spacing-5` | Inherits from inputs | Increased vertical spacing |
| Tablet | Same or 2-column grid | Gap: `--spacing-4` | Inherits | — |
| Desktop+ | 2-column or 3-column grid | Gap: `--form-gap` | N/A | — |

**Current gaps:**
- Form gap is fixed (`--form-gap: --spacing-4` = 16px)
- No responsive layout (always stacked)
- Label sizes don't adjust per breakpoint

**Responsive plan:**
- Mobile: increase gap to `--spacing-5` (20px) for easier field identification
- Mobile: labels always above inputs (stacked)
- Tablet+: allow side-by-side label+input layout (opt-in)
- Error messages: increase font-size slightly on mobile for readability

**Overflow:** Labels, helper text, and error messages all wrap naturally.

**Interaction change:** None — form fields are layout containers.

---

## Layout Components

### Layout (Container, Grid, Stack)

| Breakpoint | Layout | Size | Notes |
|------------|--------|------|-------|
| Mobile | 1-column, full-width | Padding: `--grid-margin` | Responsive columns collapse |
| Tablet (640px) | 2-column grid available | Padding: `--grid-margin` | `.arcana-col-sm-*` activate |
| Desktop (1024px) | 3-4 column grid | Padding: `--grid-margin-lg` | `.arcana-col-lg-*` activate |
| Wide (1280px) | Same + wider containers | Padding: `--grid-margin-lg` | — |

**Current state:** Layout.css is the ONLY file with existing `@media` queries (640px, 1024px). This is the best-prepared component for responsive behavior.

**Gaps:**
- Missing breakpoint at 768px (tablet portrait)
- Missing breakpoint at 1280px (wide)
- Container max-widths only use `--container-*` tokens, no responsive class variants
- Stack gap doesn't respond to breakpoints

**Responsive plan:**
- Add responsive grid columns at all 4 breakpoints: `sm-*`, `md-*`, `lg-*`, `xl-*`
- Add responsive stack gap: `--stack-gap-mobile`, `--stack-gap-desktop`
- Container: responsive padding that increases with viewport
- Content width: `--content-prose` (65ch) works at all sizes

---

## Touch Target Audit Summary

Components that need touch target fixes on mobile (< 640px):

| Component | Current Size | Target | Fix Strategy |
|-----------|-------------|--------|-------------|
| Button `sm` | 32px h | 44px | `min-height: 44px` on mobile |
| Checkbox input | 16×16px | 44×44px hit area | Expand via wrapper padding / `::before` |
| Radio input | 16×16px | 44×44px hit area | Expand via wrapper padding / `::before` |
| Toggle track | 24–28px h | 44px hit area | Expand via wrapper padding |
| Alert close | 24×24px | 44×44px | Expand via padding |
| Modal close | 32×32px | 44×44px | Expand via padding |
| Toast dismiss | 20×20px | 44×44px | Expand via padding |
| Tabs (each tab) | ~32–40px h | 44px | Increase padding |
| Table sort header | ~36px h | 44px | Increase cell padding on mobile |

---

## Density × Responsive Interaction

Density modes (compact/default/comfortable) interact with responsive breakpoints:

| Scenario | Rule |
|----------|------|
| Mobile + compact | Override: enforce 44px min touch targets. Compact density is ignored for heights on mobile. |
| Mobile + default | Standard mobile behavior with 44px touch targets |
| Mobile + comfortable | Comfortable spacing applies; touch targets are naturally met |
| Tablet + compact | Compact applies fully; 44px targets enforced |
| Desktop + compact | Compact applies fully; mouse users, no touch target minimum |
| Desktop + comfortable | Comfortable applies fully; generous spacing |

**Key rule:** On mobile viewports (< 640px), **touch target minimums override density settings**. A compact button is still 44px tall on mobile.

---

## Priority Matrix for Implementation

Tasks 2.2–2.10 should address components in this order based on impact and usage:

### P0 — Critical (Tasks 2.2–2.4)
1. **Navbar** — Most visible responsive failure. Needs hamburger + drawer.
2. **Modal** — Unusable on mobile without bottom-sheet behavior.
3. **Table** — Core data component; horizontal scroll is minimum, card stack is ideal.
4. **Tabs** — Needs scrollable tab bar at minimum.
5. **Button** — Touch target fix + full-width mobile option.
6. **Input / Select / Textarea** — Touch target + iOS zoom prevention.

### P1 — Important (Tasks 2.5–2.8)
7. **Checkbox / Radio / Toggle** — Touch target expansion.
8. **Alert / Toast** — Close button touch targets.
9. **Card** — Responsive padding.
10. **Form** — Responsive gap and layout.

### P2 — Polish (Tasks 2.9–2.10)
11. **Accordion** — Trigger min-height.
12. **EmptyState** — Responsive size switching.
13. **Avatar / Badge** — Minor adjustments.
14. **Layout** — Additional breakpoints.

---

## CSS Strategy Reference

All responsive fixes should follow this pattern:

```css
/* Mobile-first default */
.arcana-button {
  min-height: 44px;  /* Touch target */
  padding: var(--button-padding-y) var(--button-padding-x);
}

/* Tablet+ — relax touch target requirement */
@media (min-width: 640px) {
  .arcana-button {
    min-height: var(--button-height);  /* Density-aware */
  }
}

/* Hover — only on devices that support it */
@media (hover: hover) {
  .arcana-button:hover {
    background: var(--button-bg-hover);
  }
}
```

Token usage for responsive values:
```css
/* Use clamp() for fluid responsive values */
.arcana-modal__dialog {
  max-width: clamp(100% - 32px, var(--modal-max-width), 100%);
}
```

---

## Appendix: Component File Locations

| Component | CSS | TSX |
|-----------|-----|-----|
| Button | `primitives/Button/Button.module.css` | `primitives/Button/Button.tsx` |
| Input | `primitives/Input/Input.module.css` | `primitives/Input/Input.tsx` |
| Avatar | `primitives/Avatar/Avatar.module.css` | `primitives/Avatar/Avatar.tsx` |
| Badge | `primitives/Badge/Badge.module.css` | `primitives/Badge/Badge.tsx` |
| Checkbox | `primitives/Checkbox/Checkbox.module.css` | `primitives/Checkbox/Checkbox.tsx` |
| Radio | `primitives/Radio/Radio.module.css` | `primitives/Radio/Radio.tsx` |
| Select | `primitives/Select/Select.module.css` | `primitives/Select/Select.tsx` |
| Textarea | `primitives/Textarea/Textarea.module.css` | `primitives/Textarea/Textarea.tsx` |
| Toggle | `primitives/Toggle/Toggle.module.css` | `primitives/Toggle/Toggle.tsx` |
| Accordion | `composites/Accordion/Accordion.module.css` | `composites/Accordion/Accordion.tsx` |
| Alert | `composites/Alert/Alert.module.css` | `composites/Alert/Alert.tsx` |
| Card | `composites/Card/Card.module.css` | `composites/Card/Card.tsx` |
| Modal | `composites/Modal/Modal.module.css` | `composites/Modal/Modal.tsx` |
| Tabs | `composites/Tabs/Tabs.module.css` | `composites/Tabs/Tabs.tsx` |
| Toast | `composites/Toast/Toast.module.css` | `composites/Toast/Toast.tsx` |
| EmptyState | `patterns/EmptyState/EmptyState.module.css` | `patterns/EmptyState/EmptyState.tsx` |
| Form | `patterns/Form/Form.module.css` | `patterns/Form/Form.tsx` |
| Navbar | `patterns/Navbar/Navbar.module.css` | `patterns/Navbar/Navbar.tsx` |
| Table | `patterns/Table/Table.module.css` | `patterns/Table/Table.tsx` |
| Layout | `layout/Layout.module.css` + `styles/layout.css` | `layout/Layout.tsx` |

All paths relative to `packages/core/src/`.
