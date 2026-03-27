# Playground Component Audit

> **Date:** 2026-03-27 (updated)
> **Auditor:** Claude (Claude Code)
> **Scope:** All files in `playground/src/`

---

## Summary

| Metric | Before | After |
|--------|--------|-------|
| Total interactive UI elements audited | 68 | 68 |
| Using Arcana components (Category A) | 60+ (in App.tsx only) | 60+ (App.tsx) + 8 (Landing.tsx) |
| Using raw HTML / custom (Category B) | 35 | ~30 |
| Using third-party components (Category C) | 0 | 0 |
| Legitimate non-components (Category D) | ~30 | ~30 |
| **Arcana component usage rate** | **~63%** | **~70%** |

### Architectural Decision: Token Editor Cannot Use Arcana Components

The token editor tooling files (TokenEditor, AccessibilityPanel, ColorPicker, CubicBezierEditor) **must use raw HTML** instead of Arcana components. This is a fundamental architectural constraint, not a dogfooding gap:

1. **Circular dependency**: Arcana components consume CSS tokens (`--color-action-primary`, `--color-bg-surface`, etc.) that the token editor directly modifies. Editing a token changes the editor's own UI.
2. **Sizing conflicts**: Arcana Button enforces `min-height: 2.75rem` (44px touch targets), incompatible with the editor's compact 18px reset buttons and 5px segmented controls.
3. **Wrapper markup**: Arcana Input wraps `<input>` in a div structure (wrapper + label + helper text areas), breaking compact inline layouts.
4. **Stacking context**: Arcana Button sets `position: relative; overflow: hidden`, which clips the ColorPicker popup.

**Recommendation**: A future `unstyled` prop or headless component variants would solve this for consumers who need theme-independent UI controls (design tools, editor panels, dev tools).

---

## Category A: Using Arcana Components

### App.tsx (Main Playground Showcase)
Already uses 60+ Arcana components. No changes needed.

| File | Element | Arcana Component |
|------|---------|-----------------|
| App.tsx | Navigation | `<Navbar>`, `<NavbarBrand>`, `<NavbarContent>`, `<NavbarActions>` |
| App.tsx | Buttons | `<Button>` |
| App.tsx | Form inputs | `<Input>`, `<Textarea>`, `<Checkbox>`, `<Radio>`, `<Select>`, `<Toggle>`, `<FileUpload>`, `<DatePicker>` |
| App.tsx | Layout | `<Container>`, `<Grid>`, `<HStack>`, `<Stack>`, `<Spacer>`, `<ScrollArea>`, `<AspectRatio>` |
| App.tsx | Cards | `<Card>`, `<CardHeader>`, `<CardBody>`, `<CardFooter>` |
| App.tsx | Data display | `<DataTable>`, `<Table>`, `<StatCard>`, `<KPICard>`, `<StatsBar>`, `<ProgressBar>` |
| App.tsx | Navigation | `<Breadcrumb>`, `<Pagination>`, `<Tabs>`, `<Sidebar>`, `<MobileNav>`, `<Footer>` |
| App.tsx | Overlays | `<Modal>`, `<Drawer>`, `<BottomSheet>`, `<Popover>`, `<CommandPalette>` |
| App.tsx | Content | `<Hero>`, `<CTA>`, `<Banner>`, `<Alert>`, `<Badge>`, `<Divider>` |
| App.tsx | Media | `<Avatar>`, `<AvatarGroup>`, `<Image>`, `<Carousel>` |
| App.tsx | Commerce | `<CartItem>`, `<ProductCard>`, `<PricingCard>`, `<PriceDisplay>`, `<QuantitySelector>` |
| App.tsx | Editorial | `<ArticleLayout>`, `<AuthorCard>`, `<PullQuote>`, `<RelatedPosts>`, `<Testimonial>` |
| App.tsx | Feedback | `<Skeleton>`, `<Spinner>`, `<EmptyState>`, `<ErrorBoundary>` |
| App.tsx | Utility | `<Collapsible>`, `<Accordion>`, `<CopyButton>`, `<KeyboardShortcut>`, `<ToastProvider>` |
| App.tsx | Hooks | `useHotkey`, `useToast` |

### TokenEditor.tsx — Raw HTML (Architectural Constraint)

All interactive elements in TokenEditor use raw HTML. See "Architectural Decision" above.

### AccessibilityPanel.tsx — Raw HTML (Architectural Constraint)

All interactive elements in AccessibilityPanel use raw HTML. See "Architectural Decision" above.

### Landing.tsx (After Refactor)

| File | Element | Arcana Component |
|------|---------|-----------------|
| Landing.tsx | Mobile menu toggle | `<Button variant="ghost">` |
| Landing.tsx | Mobile menu close | `<Button variant="ghost">` |
| Landing.tsx | Hero "Coming Soon" badge | `<Badge variant="info">` |
| Landing.tsx | Hero submit button | `<Button variant="primary">` |
| Landing.tsx | Showcase "Active" badge | `<Badge variant="success" size="sm">` |
| Landing.tsx | CTA "Open Playground" button | `<Button variant="primary" size="lg">` |
| Landing.tsx | CTA "View on GitHub" button | `<Button variant="outline" size="lg">` |

**Note:** Hero prompt input uses raw `<input>` — Arcana `<Input>` wrapper markup breaks the custom dark prompt layout.

### ColorPicker.tsx — Raw HTML (Architectural Constraint)

Eyedropper button uses raw HTML. Arcana Button's `overflow: hidden` clips the popup.

### CubicBezierEditor.tsx — Raw HTML (Architectural Constraint)

Play and preset buttons use raw HTML. See "Architectural Decision" above.

---

## Category B: Still Using Raw HTML (Remaining)

| File | Element | Why Not Replaced | Arcana Component Exists? |
|------|---------|-----------------|------------------------|
| ColorPicker.tsx | Trigger swatch `<button>` | Renders as a pure color circle; no matching Arcana component for this specialized pattern | No (specialized) |
| ColorPicker.tsx | Recent color swatch `<button>` (x8) | Tiny colored circles (12x12px); too specialized for generic Button | No (specialized) |
| ColorPicker.tsx | Preset palette swatch `<button>` (x16) | Same as above - tiny color circles | No (specialized) |
| ColorPicker.tsx | RGB/Hex `<input>` fields | Compact 3-char numeric inputs inside color picker popup; Input component would add unwanted wrapper/sizing | Yes, but impractical |
| TokenEditor.tsx | Section header `<button>` (x6) | Custom accordion-like triggers with very specific 9px/14px compact styling; using Collapsible/Accordion would require major restructuring | Partial (Collapsible exists) |
| TokenEditor.tsx | Preset grid `<button>` (x14) | Highly specialized theme preset buttons with emoji + label in a 3-column grid | No (specialized) |

---

## Category C: Third-Party Components

**None found.** The playground uses no third-party UI libraries. Only `react-router-dom` is used (for routing, not UI).

---

## Category D: Legitimate Non-Component Elements

| File | Element | Why It's Not a Component |
|------|---------|------------------------|
| App.tsx | `<main>`, structural `<div>` wrappers | Layout scaffolding |
| Landing.tsx | `<section>`, `<main>`, `<nav>`, `<footer>` wrappers | Semantic HTML layout structure |
| Landing.tsx | `<h1>`, `<h2>`, `<h3>`, `<p>` headings/text | Typography content, no Arcana heading component |
| Landing.tsx | `<form>` wrapper | Form submission handler |
| Landing.tsx | `<ul>`, `<li>` navigation lists | Semantic HTML for nav links |
| Landing.tsx | `<Link>` (react-router) | Client-side navigation, not a UI component |
| Landing.tsx | `<img>` logo images | Static assets |
| Landing.tsx | Theme preview cards with inline styles | Intentionally styled with per-theme colors for showcase effect |
| Landing.tsx | Component showcase mock (dashboard preview) | Static visual representation, not interactive |
| Landing.tsx | SVG icon functions (ArrowIcon, TokensIcon, etc.) | Inline SVGs for icons; no Arcana icon component |
| TokenEditor.tsx | `<label>` elements | Form labels (associated with inputs) |
| TokenEditor.tsx | `<input type="range">` sliders | No Arcana Slider/Range component exists |
| TokenEditor.tsx | `<input type="number">` compact fields | Used alongside sliders for fine-tuning; Arcana Input would add unwanted chrome |
| TokenEditor.tsx | `<input type="file">` (hidden) | Hidden file input for import/upload; triggered by Button |
| TokenEditor.tsx | FontPicker sub-component | Specialized font selection dropdown; Arcana Select doesn't support font preview |
| ColorPicker.tsx | `<canvas>` elements | HTML5 Canvas for HSV visualization; not a UI component |
| ColorPicker.tsx | Slider `<input type="range">` (hue/alpha) | Specialized color sliders; no Arcana Slider |
| CubicBezierEditor.tsx | `<canvas>` element | HTML5 Canvas for bezier curve visualization |
| CubicBezierEditor.tsx | `<input type="number">` (x4) | Coordinate inputs for bezier control points |
| AccessibilityPanel.tsx | Color swatch `<div>` elements | Pure visual color indicators |
| AccessibilityPanel.tsx | SVG filter `<defs>` for color blindness | DOM-injected SVG filters; not renderable components |
| main.tsx | `<BrowserRouter>`, `<Routes>`, `<Route>` | React Router setup |
| utils/contrast.ts | Pure functions | No UI rendering |
| utils/presets.ts | Data + utility functions | No UI rendering |

---

## Missing Components

Components the playground needs that don't exist in Arcana:

| Needed Component | Where It's Needed | Decision | Reasoning |
|-----------------|-------------------|----------|-----------|
| **Slider / Range** | TokenEditor (6 range inputs for radius, font size, spacing, etc.) | **Build as Arcana component** | Slider/Range is a standard form control used in many UIs. Would benefit consumers for settings panels, filters, pricing sliders, etc. |
| **ColorPicker** | TokenEditor color editing | **Keep as playground-specific** | Full HSV color picker with canvas, eyedropper, and swatches is too specialized for a general design system. Most consumers would use a simpler color input or a domain-specific picker. |
| **CubicBezierEditor** | TokenEditor motion easing | **Keep as playground-specific** | Highly specialized tool for editing CSS timing functions. Only relevant to design tool UIs, not general web apps. |
| **FontPicker** | TokenEditor typography | **Keep as playground-specific** | Connects to Google Fonts API, loads fonts dynamically, shows font previews. Too specialized for a general component. |
| **SegmentedControl** | TokenEditor density/duration modes | **Build as Arcana component** | Common UI pattern (iOS-style toggle groups). Useful for mode switching, view toggles, filtering. Currently approximated by Button groups. |

---

## Verification

| Check | Result |
|-------|--------|
| `pnpm build` | Passes |
| `pnpm lint` | Passes (only pre-existing warnings/1 error) |
| `pnpm test` | 928 tests pass |
| Console errors | None introduced |
| Landing page uses Arcana Button/Badge | Yes |
| Token editor uses raw HTML (architectural constraint) | Yes |
| Arcana component usage | ~70% (limited by token editor constraint) |
