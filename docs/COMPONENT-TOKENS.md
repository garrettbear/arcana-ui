# Component Tokens Reference

> Tier 3 of the Arcana UI token hierarchy. Component tokens are optional CSS custom properties that allow fine-grained visual control per component, per theme.

## How It Works

Every component's CSS uses the **fallback pattern**:

```css
property: var(--{component}-{property}, var(--semantic-fallback));
```

- If `--button-bg` is set (via a theme preset), it wins.
- If not, the semantic fallback (`--color-action-primary`) applies.
- This means component tokens are **optional** — themes work without them.

Component tokens are defined in preset JSON files under the `"component"` key and are generated as CSS custom properties by the build pipeline.

## Density-Aware Tokens

Some tokens support density modes (`compact`, `default`, `comfortable`) via the `data-density` attribute. These are marked with a **D** in the tables below. In the preset JSON, they use object syntax:

```json
{
  "height": {
    "compact": "2rem",
    "default": "2.5rem",
    "comfortable": "3rem"
  }
}
```

---

## Token Surface by Component

### Button

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| bg | `--button-bg` | `--color-action-primary` | |
| bg-hover | `--button-bg-hover` | `--color-action-primary-hover` | |
| fg | `--button-fg` | `--color-fg-on-primary` | |
| border-color | `--button-border-color` | `transparent` | |
| border-width | `--button-border-width` | `--border-width-default` | |
| radius | `--button-radius` | `--radius-md` | |
| shadow | `--button-shadow` | `--shadow-none` | |
| padding-x | `--button-padding-x` | `--spacing-md` | |
| font-size | `--button-font-size` | `--font-size-sm` | |
| font-weight | `--button-font-weight` | `--font-weight-medium` | |
| letter-spacing | `--button-letter-spacing` | `--letter-spacing-normal` | |
| height | `--button-height` | `2.5rem` | **D** |

### Input

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| bg | `--input-bg` | `--color-bg-page` | |
| fg | `--input-fg` | `--color-fg-primary` | |
| border-color | `--input-border-color` | `--color-border-default` | |
| border-focus | `--input-border-focus` | `--color-border-focus` | |
| border-error | `--input-border-error` | `--color-border-error` | |
| border-width | `--input-border-width` | `--border-width-default` | |
| radius | `--input-radius` | `--radius-md` | |
| padding-x | `--input-padding-x` | `--spacing-sm` | |
| font-size | `--input-font-size` | `--font-size-sm` | |
| placeholder-color | `--input-placeholder-color` | `--color-fg-muted` | |
| height | `--input-height` | `2.5rem` | **D** |

### Card

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| bg | `--card-bg` | `--color-bg-surface` | |
| border-color | `--card-border-color` | `--color-border-default` | |
| border-width | `--card-border-width` | `--border-width-default` | |
| radius | `--card-radius` | `--radius-md` | |
| shadow | `--card-shadow` | `--elevation-card` | |
| shadow-hover | `--card-shadow-hover` | `--elevation-card-hover` | |
| padding | `--card-padding` | `--spacing-lg` | **D** |

### Modal

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| bg | `--modal-bg` | `--color-bg-elevated` | |
| border-color | `--modal-border-color` | `--color-border-default` | |
| border-width | `--modal-border-width` | `--border-width-default` | |
| radius | `--modal-radius` | `--radius-xl` | |
| shadow | `--modal-shadow` | `--elevation-modal` | |
| padding | `--modal-padding` | `--spacing-xl` | |
| overlay-bg | `--modal-overlay-bg` | `--color-bg-overlay` | |
| max-width | `--modal-max-width` | `35rem` | |

### Toast

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| bg | `--toast-bg` | `--color-bg-elevated` | |
| border-color | `--toast-border-color` | `--color-border-default` | |
| border-width | `--toast-border-width` | `--border-width-default` | |
| radius | `--toast-radius` | `--radius-md` | |
| shadow | `--toast-shadow` | `--elevation-toast` | |
| padding | `--toast-padding` | `--spacing-md` | |
| max-width | `--toast-max-width` | `23.75rem` | |

### Navbar

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| bg | `--navbar-bg` | `--color-bg-page` | |
| border-color | `--navbar-border-color` | `--color-border-default` | |
| shadow | `--navbar-shadow` | `--elevation-navbar` | |
| backdrop-blur | `--navbar-backdrop-blur` | `--blur-none` | |
| height | `--navbar-height` | `--spacing-14` | |
| max-width | `--navbar-max-width` | `80rem` | |

### Badge

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| radius | `--badge-radius` | `--radius-full` | |
| padding-x | `--badge-padding-x` | `--spacing-2` | |
| padding-y | `--badge-padding-y` | `--spacing-0-5` | |
| font-size | `--badge-font-size` | `--font-size-xs` | |
| font-weight | `--badge-font-weight` | `--font-weight-medium` | |

### Alert

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| radius | `--alert-radius` | `--radius-md` | |
| padding | `--alert-padding` | `--spacing-md` | |
| border-width | `--alert-border-width` | `--border-width-default` | |

### Checkbox

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| size | `--checkbox-size` | `--spacing-4` | |
| radius | `--checkbox-radius` | `--radius-sm` | |
| border-color | `--checkbox-border-color` | `--color-border-strong` | |
| bg | `--checkbox-bg` | `--color-bg-page` | |
| checked-bg | `--checkbox-checked-bg` | `--color-action-primary` | |
| checked-border | `--checkbox-checked-border` | `--color-action-primary` | |

### Radio

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| size | `--radio-size` | `--spacing-4` | |
| border-color | `--radio-border-color` | `--color-border-strong` | |
| bg | `--radio-bg` | `--color-bg-page` | |
| checked-border | `--radio-checked-border` | `--color-action-primary` | |

### Toggle

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| radius | `--toggle-radius` | `--radius-full` | |
| bg | `--toggle-bg` | `--color-border-strong` | |
| checked-bg | `--toggle-checked-bg` | `--color-action-primary` | |
| thumb-bg | `--toggle-thumb-bg` | `--primitive-white` | |

### Select

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| bg | `--select-bg` | `--color-bg-page` | |
| border-color | `--select-border-color` | `--color-border-default` | |
| border-focus | `--select-border-focus` | `--color-border-focus` | |
| border-width | `--select-border-width` | `--border-width-default` | |
| radius | `--select-radius` | `--radius-md` | |
| font-size | `--select-font-size` | `--font-size-sm` | |
| padding-x | `--select-padding-x` | `--spacing-sm` | |
| height | `--select-height` | `2.5rem` | **D** |

### Textarea

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| bg | `--textarea-bg` | `--color-bg-page` | |
| border-color | `--textarea-border-color` | `--color-border-default` | |
| border-focus | `--textarea-border-focus` | `--color-border-focus` | |
| border-width | `--textarea-border-width` | `--border-width-default` | |
| radius | `--textarea-radius` | `--radius-md` | |
| font-size | `--textarea-font-size` | `--font-size-sm` | |
| padding-x | `--textarea-padding-x` | `--spacing-sm` | |
| padding-y | `--textarea-padding-y` | `--spacing-2` | |
| min-height | `--textarea-min-height` | `--spacing-20` | |

### Avatar

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| radius | `--avatar-radius` | `--radius-full` | |
| bg | `--avatar-bg` | `--color-bg-subtle` | |
| border-color | `--avatar-border-color` | `--color-bg-page` | |
| border-width | `--avatar-border-width` | `--border-width-thick` | |

### Tabs

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| border-color | `--tabs-border-color` | `--color-border-default` | |
| font-size | `--tabs-font-size` | `--font-size-sm` | |
| font-weight | `--tabs-font-weight` | `--font-weight-medium` | |
| padding-x | `--tabs-padding-x` | `--spacing-3` | |
| padding-y | `--tabs-padding-y` | `--spacing-2` | |
| active-color | `--tabs-active-color` | `--color-action-primary` | |

### Accordion

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| radius | `--accordion-radius` | `--radius-md` | |
| border-color | `--accordion-border-color` | `--color-border-default` | |
| border-width | `--accordion-border-width` | `--border-width-default` | |
| padding | `--accordion-padding` | `--spacing-4` | |
| font-size | `--accordion-font-size` | `--font-size-sm` | |

### Table

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| radius | `--table-radius` | `--radius-md` | |
| border-color | `--table-border-color` | `--color-border-default` | |
| border-width | `--table-border-width` | `--border-width-default` | |
| header-bg | `--table-header-bg` | `--color-bg-surface` | |
| font-size | `--table-font-size` | `--font-size-sm` | |
| cell-padding-x | `--table-cell-padding-x` | `--spacing-4` | |
| cell-padding-y | `--table-cell-padding-y` | `--spacing-3` | **D** |

### Form

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| gap | `--form-gap` | `--spacing-4` | |
| label-font-size | `--form-label-font-size` | `--font-size-sm` | |
| label-font-weight | `--form-label-font-weight` | `--font-weight-medium` | |

### EmptyState

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| padding | `--emptystate-padding` | `--spacing-8` | |
| icon-color | `--emptystate-icon-color` | `--color-fg-muted` | |

---

### Sidebar

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| width | `--sidebar-width` | `16rem` | |
| collapsed-width | `--sidebar-collapsed-width` | `4rem` | |
| bg | `--sidebar-bg` | `--color-bg-surface` | |
| border-color | `--sidebar-border-color` | `--color-border-default` | |

### Breadcrumb

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| separator-color | `--breadcrumb-separator-color` | `--color-fg-muted` | |
| item-color | `--breadcrumb-item-color` | `--color-fg-secondary` | |
| active-color | `--breadcrumb-active-color` | `--color-fg-primary` | |

### Pagination

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| item-radius | `--pagination-item-radius` | `--radius-md` | |
| active-bg | `--pagination-active-bg` | `--color-action-primary` | |
| active-color | `--pagination-active-color` | `--color-fg-on-primary` | |

### Footer

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| bg | `--footer-bg` | `--color-bg-surface` | |
| border-color | `--footer-border-color` | `--color-border-default` | |
| text-color | `--footer-text-color` | `--color-fg-muted` | |
| link-color | `--footer-link-color` | `--color-fg-secondary` | |

### DataTable

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| header-bg | `--datatable-header-bg` | `--color-bg-surface` | |
| header-font-weight | `--datatable-header-font-weight` | `--font-weight-semibold` | |
| header-font-size | `--datatable-header-font-size` | `--font-size-xs` | |
| row-border | `--datatable-row-border` | `--color-border-default` | |
| row-hover-bg | `--datatable-row-hover-bg` | `--color-bg-surface` | |
| row-stripe-bg | `--datatable-row-stripe-bg` | `--color-bg-surface` | |
| row-selected-bg | `--datatable-row-selected-bg` | `--color-action-primary` | |
| cell-padding-x | `--datatable-cell-padding-x` | `--spacing-md` | |
| cell-padding-y | `--datatable-cell-padding-y` | `--spacing-3` | **D** |
| sort-indicator-color | `--datatable-sort-indicator-color` | `--color-fg-muted` | |
| sticky-shadow | `--datatable-sticky-shadow` | `--elevation-card` | |
| radius | `--datatable-radius` | `--radius-md` | |
| border-color | `--datatable-border-color` | `--color-border-default` | |

### StatCard

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| bg | `--statcard-bg` | `--color-bg-surface` | |
| radius | `--statcard-radius` | `--radius-lg` | |
| shadow | `--statcard-shadow` | `--elevation-card` | |
| padding | `--statcard-padding` | `--spacing-lg` | **D** |
| value-size | `--statcard-value-size` | `--font-size-fluid-3xl` | |
| value-weight | `--statcard-value-weight` | `--font-weight-bold` | |
| label-size | `--statcard-label-size` | `--font-size-sm` | |
| label-color | `--statcard-label-color` | `--color-fg-secondary` | |
| trend-up | `--statcard-trend-up` | `--color-status-success-fg` | |
| trend-down | `--statcard-trend-down` | `--color-status-error-fg` | |
| icon-color | `--statcard-icon-color` | `--color-fg-muted` | |
| icon-size | `--statcard-icon-size` | `2.5rem` | |

### ProgressBar

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| bg | `--progress-bg` | `--color-bg-surface` | |
| fill-color | `--progress-fill-color` | `--color-action-primary` | |
| radius | `--progress-radius` | `--radius-full` | |
| height-sm | `--progress-height-sm` | `0.25rem` | |
| height-md | `--progress-height-md` | `0.5rem` | |
| height-lg | `--progress-height-lg` | `0.75rem` | |

### KPICard

| Token | CSS Custom Property | Fallback | D |
|-------|-------------------|----------|---|
| bg | `--kpicard-bg` | `--color-bg-surface` | |
| radius | `--kpicard-radius` | `--radius-lg` | |
| shadow | `--kpicard-shadow` | `--elevation-card` | |
| padding | `--kpicard-padding` | `--spacing-lg` | **D** |
| sparkline-height | `--kpicard-sparkline-height` | `3rem` | |
| sparkline-stroke-width | `--kpicard-sparkline-stroke-width` | `2` | |
| target-line-color | `--kpicard-target-line-color` | `--color-fg-muted` | |

---

## Per-Preset Overrides

Each theme preset can override any component token. Here are the key differences from the `light` baseline:

| Preset | Key Overrides |
|--------|--------------|
| **light** | Baseline — all defaults |
| **dark** | `input.bg` → dark surface color |
| **terminal** | All radii → `radius-none`, no shadows, compact heights, monospace-friendly |
| **retro98** | All radii → `radius-none`, `button.border-width` → thick, pixel-style |
| **glass** | All radii → `radius-lg`/`radius-xl`, navbar backdrop-blur enabled |
| **brutalist** | All radii → `radius-none`, no shadows, heavy border-widths, bold font-weight |

## Density Modes

Set `data-density="compact|comfortable"` on any ancestor element (typically `<html>` or a section wrapper). Density-aware tokens (**D** in tables) automatically adjust:

| Mode | Button Height | Input Height | Card Padding | Table Cell Padding-Y |
|------|--------------|-------------|-------------|---------------------|
| compact | 2rem | 2rem | `--spacing-sm` | `--spacing-2` |
| default | 2.5rem | 2.5rem | `--spacing-lg` | `--spacing-3` |
| comfortable | 3rem | 3rem | `--spacing-xl` | `--spacing-4` |

## Usage Examples

### Override in a theme preset JSON

```json
{
  "component": {
    "button": {
      "radius": "{semantic.radius.none}",
      "shadow": "{primitive.shadow.md}"
    }
  }
}
```

### Override inline with CSS

```css
.my-section {
  --button-radius: 0;
  --card-shadow: none;
}
```

### Override with data-density

```html
<div data-density="compact">
  <!-- All buttons, inputs, cards, tables in here use compact sizing -->
</div>
```
