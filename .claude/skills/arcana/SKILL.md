# Arcana UI — Claude Code Skill

> Auto-generated from manifest.ai.json. Regenerate: `pnpm generate-docs`
> Version: 0.1.0-beta.1 | Components: 108 | Hooks: 11 | Themes: 14

This file is the complete reference for building with Arcana UI. An AI agent that reads
this file can build production-grade React applications without consulting any other docs.

## 1. Quick Start

### Install

```bash
npm install @arcana-ui/core @arcana-ui/tokens
# or
pnpm add @arcana-ui/core @arcana-ui/tokens
```

### Bootstrap (add once at app root)

```tsx
import '@arcana-ui/tokens/dist/arcana.css'; // Required — all CSS variables
import { ThemeProvider } from '@arcana-ui/core';
import { Button, Card, Input } from '@arcana-ui/core';

export function App() {
  return (
    <ThemeProvider defaultTheme="light">
      <Card>
        <Input label="Email" placeholder="you@example.com" />
        <Button variant="primary">Submit</Button>
      </Card>
    </ThemeProvider>
  );
}
```

### Theme switching

```tsx
// One-liner — no JS runtime, pure CSS
document.documentElement.setAttribute('data-theme', 'midnight');
// Available: brutalist commerce corporate dark editorial glass light midnight mono nature neon retro98 startup terminal
```

### Density switching

```tsx
document.documentElement.setAttribute('data-density', 'compact');
// Available: compact | normal | comfortable
```

## 2. Component Reference

All components are named exports from `@arcana-ui/core`.

### Button


```tsx
import { Button } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | 'primary' \| 'secondary' \| 'ghost' \| 'destructive' \| 'outline' | `primary` |  | Visual style variant |
| `size` | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'icon-xs' \| 'icon-sm' \| 'icon' \| 'icon-lg' \| 'icon-xl' | `md` |  | Size of the button |
| `shape` | 'default' \| 'circle' \| 'pill' | `default` |  | Shape of the button |
| `loading` | boolean | `false` |  | Whether the button is in a loading state |
| `icon` | ReactNode | — |  | Icon element displayed before the label |
| `iconRight` | ReactNode | — |  | Icon element displayed after the label |
| `fullWidth` | boolean | `false` |  | Whether the button stretches to fill its container |
| `iconOnly` | boolean | `false` |  | @deprecated Use size="icon" instead. Render as an icon-only button (square shape |

### Input


```tsx
import { Input } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `label` | string | — |  | Label text displayed above the input |
| `size` | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' | `md` |  | Size of the input |
| `error` | string | boolean | — |  | Error message string or boolean error state |
| `helperText` | string | — |  | Helper text displayed below the input |
| `prefix` | ReactNode | — |  | Element rendered before the input field |
| `suffix` | ReactNode | — |  | Element rendered after the input field |
| `fullWidth` | boolean | `false` |  | Whether the input stretches to fill its container |
| `required` | boolean | — |  | Whether the input is required (shows indicator on label) |
| `wrapperClassName` | string | — |  | Additional className for the outer wrapper containing border and focus ring |

### Textarea


```tsx
import { Textarea } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `label` | string | — |  | Label text displayed above the textarea |
| `error` | string | boolean | — |  | Error message string or boolean error state |
| `helperText` | string | — |  | Helper text displayed below the textarea |
| `autoResize` | boolean | `false` |  | Whether the textarea automatically grows to fit content |
| `showCount` | boolean | `false` |  | Whether to display a character count |
| `maxLength` | number | — |  | Maximum number of characters allowed |

### Select


```tsx
import { Select } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `label` | string | — |  | Label text displayed above the select |
| `error` | string | boolean | — |  | Error message string or boolean error state |
| `helperText` | string | — |  | Helper text displayed below the select |
| `placeholder` | string | — |  | Placeholder text when no option is selected |
| `options` | SelectOption[] | `[]` |  | Array of options to render |
| `value` | string | string[] | — |  | Controlled selected value (string for single, string[] for multiple) |
| `defaultValue` | string | string[] | — |  | Default value for uncontrolled usage |
| `onChange` | (value: string | string[]) => void | — |  | Callback fired when the selection changes |
| `multiple` | boolean | `false` |  | Allow multiple selections |
| `searchable` | boolean | `false` |  | Enable type-to-filter search in dropdown |
| `clearable` | boolean | `false` |  | Show clear button to reset selection |
| `loading` | boolean | `false` |  | Show loading spinner in dropdown |
| `size` | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' | `md` |  | Size variant |
| `fullWidth` | boolean | `false` |  | Whether the select stretches to fill its container |
| `disabled` | boolean | `false` |  | Whether the select is disabled |
| `name` | string | — |  | Form input name attribute |

### Checkbox


```tsx
import { Checkbox } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `label` | string | — |  | Label text displayed next to the checkbox |
| `description` | string | — |  | Description text displayed below the label |
| `indeterminate` | boolean | `false` |  | Whether the checkbox is in an indeterminate state |
| `error` | string | boolean | — |  | Error message string or boolean error state |

### Toggle


```tsx
import { Toggle } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `label` | string | — |  | Label text displayed next to the toggle |
| `description` | string | — |  | Description text displayed below the label |
| `checked` | boolean | — |  | Whether the toggle is in the on state |
| `onChange` | (checked: boolean) => void | — |  | Callback fired when the toggle state changes |
| `disabled` | boolean | `false` |  | Whether the toggle is disabled |
| `size` | 'sm' \| 'md' \| 'lg' | `md` |  | Size of the toggle |
| `id` | string | — |  | HTML id attribute |

### Badge


```tsx
import { Badge } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | 'default' \| 'success' \| 'warning' \| 'error' \| 'info' \| 'secondary' | `default` |  | Visual style variant |
| `size` | 'sm' \| 'md' \| 'lg' | `md` |  | Size of the badge |
| `dot` | boolean | `false` |  | Whether to display a status dot indicator |

### Avatar


```tsx
import { Avatar } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `src` | string | — |  | Image source URL |
| `alt` | string | — |  | Alt text for the avatar image |
| `name` | string | — |  | User name for generating initials and background color |
| `size` | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' | `md` |  | Size of the avatar |

### Card


```tsx
import { Card } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | 'default' \| 'outlined' \| 'elevated' | `default` |  | Visual style variant |
| `padding` | 'none' \| 'sm' \| 'md' \| 'lg' | `md` |  | Padding size applied to the card |
| `interactive` | boolean | `false` |  | Whether the card has hover and focus interactions |

### CardHeader


```tsx
import { CardHeader } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `title` | string | — |  | Header title text |
| `description` | string | — |  | Description text below the title |
| `action` | ReactNode | — |  | Action element rendered on the right side |

### CardBody


```tsx
import { CardBody } from '@arcana-ui/core'
```

### CardFooter


```tsx
import { CardFooter } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `align` | 'left' \| 'center' \| 'right' \| 'space-between' | `right` |  | Horizontal alignment of footer content |

### Modal


```tsx
import { Modal } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `open` | boolean | — |  | Whether the modal is visible |
| `onClose` | () => void | — |  | Callback fired when the modal should close |
| `title` | string | — |  | Dialog title text |
| `description` | string | — |  | Dialog description text |
| `size` | 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full' | — |  | Size of the modal dialog |
| `closeOnOverlayClick` | boolean | — |  | Whether clicking the overlay closes the modal |
| `closeOnEsc` | boolean | — |  | Whether pressing Escape closes the modal |
| `footer` | ReactNode | — |  | Footer content rendered at the bottom of the modal |

### Alert


```tsx
import { Alert } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | 'info' \| 'success' \| 'warning' \| 'error' | `info` |  | Visual style variant indicating the alert type |
| `title` | string | — |  | Alert title text |
| `onClose` | () => void | — |  | Callback fired when the dismiss button is clicked |

### Tabs


```tsx
import { Tabs } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | string | — |  | Controlled active tab value |
| `onChange` | (value: string) => void | — |  | Callback fired when the active tab changes |
| `defaultValue` | string | — |  | Default active tab value for uncontrolled mode |
| `variant` | 'line' \| 'pills' | `line` |  | Visual style variant |

### TabList


```tsx
import { TabList } from '@arcana-ui/core'
```

### Tab


```tsx
import { Tab } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | string | — |  | Unique identifier for this tab |
| `disabled` | boolean | — |  | Whether the tab is disabled |

### TabPanels


```tsx
import { TabPanels } from '@arcana-ui/core'
```

### TabPanel


```tsx
import { TabPanel } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | string | — |  | Value matching the corresponding Tab |

### Accordion


```tsx
import { Accordion } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `type` | 'single' \| 'multiple' | `single` |  | Whether one or multiple items can be open at once |
| `defaultValue` | string | string[] | — |  | Default open item value(s) for uncontrolled mode |
| `value` | string | string[] | — |  | Controlled open item value(s) |
| `onChange` | (value: string | string[]) => void | — |  | Callback fired when the open items change |

### Stack


```tsx
import { Stack } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `direction` | 'vertical' \| 'horizontal' | `vertical` |  | Direction of the stack layout |
| `gap` | GapSize | number | string | `md` |  | Spacing between children — semantic name, number (maps to token), or raw CSS |
| `align` | 'start' \| 'center' \| 'end' \| 'stretch' | — |  | Cross-axis alignment of children |
| `justify` | 'start' \| 'center' \| 'end' \| 'between' \| 'around' | — |  | Main-axis alignment of children |
| `wrap` | boolean | — |  | Whether children should wrap to the next line |
| `as` | React.ElementType | — |  | HTML element to render as |

### HStack


```tsx
import { HStack } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `gap` | GapSize | number | string | `md` |  | Spacing between children — semantic name, number (maps to token), or raw CSS |
| `align` | 'start' \| 'center' \| 'end' \| 'stretch' | `center` |  | Cross-axis alignment of children |
| `justify` | 'start' \| 'center' \| 'end' \| 'between' \| 'around' | — |  | Main-axis alignment of children |
| `wrap` | boolean | — |  | Whether children should wrap to the next line |
| `as` | React.ElementType | — |  | HTML element to render as |

### Grid


```tsx
import { Grid } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `columns` | number | ResponsiveColumns | `12` |  | Number of columns or responsive column object. Default: auto-collapses (1 mobile |
| `gap` | GapSize | number | string | `md` |  | Gap between grid items — semantic name, number, or raw CSS |
| `rowGap` | GapSize | number | string | — |  | Vertical gap between grid rows |
| `colGap` | GapSize | number | string | — |  | Horizontal gap between grid columns |
| `align` | 'start' \| 'center' \| 'end' \| 'stretch' | — |  | Vertical alignment of grid items |
| `justify` | 'start' \| 'center' \| 'end' \| 'stretch' \| 'between' | — |  | Horizontal alignment of grid items |
| `as` | React.ElementType | — |  | HTML element to render as |

### GridColumn


```tsx
import { GridColumn } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `span` | number | ResponsiveSpan | `12` |  | Number of columns to span, or responsive span object |
| `start` | number | — |  | Grid column start position |
| `as` | React.ElementType | — |  | HTML element to render as |

### Container


```tsx
import { Container } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `size` | 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| 'full' | `xl` |  | Maximum width of the container |
| `prose` | boolean | `false` |  | When true, sets max-width to optimal reading width (65ch). Overrides size. |
| `padding` | 'none' \| 'sm' \| 'md' \| 'lg' | `md` |  | Horizontal edge padding. Responsive by default. |
| `center` | boolean | `true` |  | Centers the container with auto margins |
| `as` | React.ElementType | — |  | HTML element to render as |

### Navbar


```tsx
import { Navbar } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `sticky` | boolean | `false` |  | Whether the navbar sticks to the top of the viewport |
| `border` | boolean | `false` |  | Whether to show a bottom border |
| `mobileContent` | ReactNode | — |  | Content for the mobile drawer (rendered in a DrawerNav on mobile) |
| `mobileMenuTitle` | string | `Menu` |  | Title for the mobile drawer header |

### Sidebar


```tsx
import { Sidebar } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `collapsed` | boolean | — |  | Whether the sidebar is collapsed to icon-only mode |
| `position` | 'left' \| 'right' | — |  | Position of the sidebar |

### SidebarItem


```tsx
import { SidebarItem } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `icon` | ReactNode | — |  | Icon element displayed before the label |
| `active` | boolean | `false` |  | Whether this item is currently active |
| `disabled` | boolean | `false` |  | Whether this item is disabled |
| `href` | string | — |  | Render as an anchor element instead of button |
| `badge` | string | number | — |  | Badge count or text displayed on the right |

### Form


```tsx
import { Form } from '@arcana-ui/core'
```

### FormField


```tsx
import { FormField } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `isRequired` | boolean | — |  | Whether the field is required |
| `isInvalid` | boolean | — |  | Whether the field has a validation error |

### BottomSheet


```tsx
import { BottomSheet } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `open` | boolean | — |  | Whether the bottom sheet is visible |
| `onClose` | () => void | — |  | Callback fired when the sheet should close |
| `title` | string | — |  | Optional header title |
| `description` | string | — |  | Optional header description |
| `snapPoints` | number[] | — |  | Snap points as fractions of viewport height |
| `dismissible` | boolean | `true` |  | Whether the sheet can be dismissed by tapping the overlay |
| `showHandle` | boolean | `true` |  | Whether to show the drag handle bar |

### MobileNav


```tsx
import { MobileNav } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `items` | MobileNavItem[] | — |  | Navigation items (maximum 5) |
| `activeKey` | string | — |  | Key of the currently active item |
| `onChange` | (key: string) => void | — |  | Callback fired when an item is selected |

### DrawerNav


```tsx
import { DrawerNav } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `open` | boolean | — |  | Whether the drawer is visible |
| `onClose` | () => void | — |  | Callback fired when the drawer should close |
| `side` | 'left' \| 'right' | `left` |  | Which side the drawer slides in from |
| `width` | string | — |  | Drawer width (CSS value) |
| `title` | string | — |  | Optional title shown at top of drawer |
| `overlay` | boolean | — |  | Whether to show the backdrop overlay |

### Table


```tsx
import { Table } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `striped` | boolean | — |  | Whether to alternate row background colors |
| `hoverable` | boolean | — |  | Whether rows highlight on hover |
| `size` | 'sm' \| 'md' \| 'lg' | — |  | Size variant affecting cell padding density |
| `bordered` | boolean | — |  | Whether to show borders between all cells |

### TableHeader


```tsx
import { TableHeader } from '@arcana-ui/core'
```

### TableBody


```tsx
import { TableBody } from '@arcana-ui/core'
```

### TableRow


```tsx
import { TableRow } from '@arcana-ui/core'
```

### TableHead


```tsx
import { TableHead } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `sortable` | boolean | — |  | Whether the column is sortable |
| `sortDirection` | 'asc' | 'desc' | null | — |  | Current sort direction — null means unsorted |
| `onSort` | () => void | — |  | Callback fired when the sort button is clicked |

### TableCell


```tsx
import { TableCell } from '@arcana-ui/core'
```

### Breadcrumb


```tsx
import { Breadcrumb } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `separator` | ReactNode | — |  | Custom separator element between items |
| `maxItems` | number | — |  | Maximum items to display before truncating with ellipsis |

### Pagination


```tsx
import { Pagination } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `page` | number | — |  | Current active page (1-indexed) |
| `totalPages` | number | — |  | Total number of pages |
| `onPageChange` | (page: number) => void | — |  | Callback fired when the page changes |
| `siblingCount` | number | `1` |  | Number of sibling pages to show on each side of the current page |
| `showEdges` | boolean | `true` |  | Whether to show first/last page buttons |
| `variant` | 'default' \| 'compact' | `default` |  | Display variant — "default" shows page buttons, "compact" shows "Page X of Y" |

### Footer


```tsx
import { Footer } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `border` | boolean | `true` |  | Whether to show a top border |
| `variant` | 'standard' \| 'minimal' | `standard` |  | Layout variant |

### Hero


```tsx
import { Hero } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `headline` | string | — |  | Main headline text (rendered as h1) |
| `subheadline` | string | — |  | Supporting text below the headline |
| `primaryCTA` | HeroCTAAction | — |  | Primary call-to-action button/link |
| `secondaryCTA` | HeroCTAAction | — |  | Secondary call-to-action button/link |
| `media` | ReactNode | — |  | Media element (image, video, or illustration) for split/fullscreen variants |
| `variant` | 'centered' \| 'split' \| 'fullscreen' | `centered` |  | Layout variant |
| `align` | 'left' \| 'center' | `center` |  | Text alignment (only applies to centered variant) |
| `height` | 'viewport' \| 'large' \| 'auto' | `auto` |  | Height behavior |
| `overlay` | boolean | `false` |  | Adds a semi-transparent dark overlay for text readability over media |
| `badge` | string | — |  | Small announcement badge displayed above the headline |

### FeatureSection


```tsx
import { FeatureSection } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `title` | string | — |  | Section heading |
| `subtitle` | string | — |  | Section description displayed below the title |
| `features` | FeatureItemData[] | — |  | Array of feature items to display |
| `columns` | 2 | 3 | 4 | `3` |  | Number of columns in the grid layout (desktop) |
| `variant` | 'grid' \| 'list' \| 'alternating' | `grid` |  | Layout variant |

### Testimonial


```tsx
import { Testimonial } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `quote` | string | — |  | The testimonial quote text |
| `author` | string | — |  | Author's full name |
| `jobTitle` | string | — |  | Author's job title or role |
| `company` | string | — |  | Author's company or organization |
| `avatar` | string | — |  | URL of the author's avatar image |
| `variant` | 'card' \| 'inline' \| 'featured' | `card` |  | Layout variant |
| `rating` | number | — |  | Star rating from 1 to 5 |

### PricingCard


```tsx
import { PricingCard } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `name` | string | — |  | Plan/tier name (e.g., "Pro", "Enterprise") |
| `price` | string | number | — |  | Price amount — displayed as-is if string, or formatted as number |
| `period` | string | — |  | Billing period text (e.g., "/month", "/year", "one-time") |
| `description` | string | — |  | Short plan description |
| `features` | PricingFeature[] | — |  | List of features with included/excluded status |
| `cta` | PricingCTAAction | — |  | Call-to-action button/link |
| `popular` | boolean | `false` |  | Highlights this tier as recommended (badge + elevated styling) |
| `variant` | 'default' \| 'compact' | `default` |  | Visual density variant |

### CTA


```tsx
import { CTA } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `headline` | string | — |  | Main headline text |
| `description` | string | — |  | Supporting description text |
| `primaryCTA` | CTAAction | — |  | Primary call-to-action button/link |
| `secondaryCTA` | CTAAction | — |  | Secondary call-to-action button/link |
| `variant` | 'banner' \| 'card' \| 'minimal' | `banner` |  | Visual variant |

### StatsBar


```tsx
import { StatsBar } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `stats` | StatItemData[] | — |  | Array of stat items to display |
| `variant` | 'inline' \| 'card' | `inline` |  | Layout variant |

### LogoCloud


```tsx
import { LogoCloud } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `logos` | LogoItem[] | — |  | Array of logo items to display |
| `title` | string | — |  | Optional section title (e.g., "Trusted by") |
| `variant` | 'grid' \| 'marquee' \| 'fade' | `grid` |  | Layout variant |

### DataTable


```tsx
import { DataTable } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `data` | T[] | — |  | Array of data objects to display |
| `columns` | ColumnDef<T>[] | — |  | Column definitions |
| `sortable` | boolean | `false` |  | Enable column header click to sort |
| `filterable` | boolean | `false` |  | Show filter input for searching |
| `selectable` | boolean | `false` |  | Enable row selection with checkboxes |
| `pagination` | boolean | PaginationConfig | `false` |  | Enable pagination — true for default (10 rows), or provide config |
| `striped` | boolean | `false` |  | Show alternating row background colors |
| `hoverable` | boolean | `true` |  | Highlight rows on hover |
| `stickyHeader` | boolean | `false` |  | Keep header row fixed when scrolling table body |
| `emptyState` | ReactNode | — |  | Content shown when data array is empty |
| `loading` | boolean | `false` |  | Show skeleton loading rows |
| `onSort` | (column: string, direction: 'asc' | 'desc') => void | — |  | Callback fired when a column sort changes |
| `onFilter` | (filters: Record<string, string>) => void | — |  | Callback fired when the filter value changes |
| `onSelect` | (selectedRows: T[]) => void | — |  | Callback fired when row selection changes |
| `onRowClick` | (row: T) => void | — |  | Callback fired when a row is clicked |

### StatCard


```tsx
import { StatCard } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | string | number | — |  | The main metric value |
| `label` | string | — |  | Label describing the metric |
| `prefix` | string | — |  | Prefix displayed before the value (e.g., "$", "€") |
| `suffix` | string | — |  | Suffix displayed after the value (e.g., "%", "+", "users") |
| `trend` | StatTrend | — |  | Trend indicator with direction and percentage |
| `comparison` | string | — |  | Comparison text (e.g., "vs last month") |
| `icon` | ReactNode | — |  | Icon displayed in the card |
| `variant` | 'default' \| 'compact' | `default` |  | Visual variant — "compact" uses smaller spacing and no icon |
| `loading` | boolean | `false` |  | Show skeleton loading state |

### ProgressBar


```tsx
import { ProgressBar } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | number | — |  | Current progress value (0-100 by default, or 0-max) |
| `max` | number | `100` |  | Maximum value (default 100) |
| `variant` | 'default' \| 'striped' \| 'animated' | `default` |  | Visual variant |
| `size` | 'sm' \| 'md' \| 'lg' | `md` |  | Bar height size |
| `color` | 'primary' \| 'success' \| 'warning' \| 'error' \| 'info' | `primary` |  | Color mapped to semantic status colors |
| `label` | string | — |  | Accessible label for the progress bar |
| `showValue` | boolean | `false` |  | Display percentage text alongside the bar |
| `indeterminate` | boolean | `false` |  | Indeterminate mode — shows infinite loading animation |

### KPICard


```tsx
import { KPICard } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | string | number | — |  | The main metric value |
| `label` | string | — |  | Label describing the metric |
| `prefix` | string | — |  | Prefix displayed before the value (e.g., "$", "€") |
| `suffix` | string | — |  | Suffix displayed after the value (e.g., "%", "ms") |
| `trend` | KPITrend | — |  | Trend indicator with direction and percentage |
| `data` | number[] | — |  | Array of recent values for the sparkline chart |
| `sparklineColor` | string | — |  | Custom sparkline color (defaults to trend color) |
| `target` | KPITarget | — |  | Target line on the sparkline |
| `period` | string | — |  | Time period label (e.g., "Last 7 days") |
| `variant` | 'default' \| 'compact' | `default` |  | Visual variant — "compact" uses smaller spacing |
| `loading` | boolean | `false` |  | Show skeleton loading state |

### DatePicker


```tsx
import { DatePicker } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | Date | null | — |  | Controlled selected date |
| `defaultValue` | Date | null | `null` |  | Default date for uncontrolled usage |
| `onChange` | (date: Date | null) => void | — |  | Callback fired when date changes |
| `label` | string | — |  | Label text |
| `placeholder` | string | — |  | Placeholder text |
| `error` | string | boolean | — |  | Error message or boolean |
| `helperText` | string | — |  | Helper text |
| `disabled` | boolean | `false` |  | Whether the picker is disabled |
| `min` | Date | — |  | Earliest selectable date |
| `max` | Date | — |  | Latest selectable date |
| `format` | string | — |  | Display format (default "MM/DD/YYYY") |
| `clearable` | boolean | `true` |  | Show clear button |
| `size` | 'sm' \| 'md' \| 'lg' | `md` |  | Size variant |

### FileUpload


```tsx
import { FileUpload } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `accept` | string | — |  | File type filter (e.g., "image/*,.pdf") |
| `multiple` | boolean | `false` |  | Allow multiple file selection |
| `maxSize` | number | — |  | Maximum file size in bytes |
| `maxFiles` | number | — |  | Maximum number of files when multiple |
| `onChange` | (files: File[]) => void | — |  | Callback fired when files are selected |
| `onError` | (error: string) => void | — |  | Callback fired on validation errors |
| `label` | string | — |  | Label text |
| `description` | string | — |  | Description text (e.g., "PNG, JPG, PDF up to 10MB") |
| `disabled` | boolean | `false` |  | Whether the uploader is disabled |
| `variant` | 'dropzone' \| 'button' | `dropzone` |  | Visual variant |

### Drawer


```tsx
import { Drawer } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `open` | boolean | — |  | Whether the drawer is visible |
| `onClose` | () => void | — |  | Callback fired when the drawer should close |
| `side` | 'left' \| 'right' \| 'top' \| 'bottom' | `right` |  | Which side the drawer slides in from |
| `size` | 'sm' \| 'md' \| 'lg' \| 'full' | `md` |  | Size preset — sm: 320px, md: 420px, lg: 640px, full: 100% |
| `title` | string | — |  | Optional title in the header |
| `description` | string | — |  | Optional description below title |
| `overlay` | boolean | — |  | Whether to show the backdrop overlay |
| `closeOnOverlayClick` | boolean | `true` |  | Close when clicking the overlay backdrop |
| `closeOnEsc` | boolean | `true` |  | Close when pressing Escape |
| `showClose` | boolean | `true` |  | Show close button in header |
| `footer` | ReactNode | — |  | Optional sticky footer content |

### Popover


```tsx
import { Popover } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `trigger` | ReactNode | — |  | The trigger element that opens the popover |
| `content` | ReactNode | — |  | Popover content |
| `open` | boolean | — |  | Controlled open state |
| `defaultOpen` | boolean | `false` |  | Default open state for uncontrolled usage |
| `onOpenChange` | (open: boolean) => void | — |  | Callback fired when open state changes |
| `side` | 'top' \| 'right' \| 'bottom' \| 'left' | `bottom` |  | Preferred side relative to trigger |
| `align` | 'start' \| 'center' \| 'end' | `center` |  | Alignment along the side axis |
| `sideOffset` | number | `8` |  | Pixel gap between trigger and popover |
| `triggerOn` | 'click' \| 'hover' | `click` |  | What interaction opens the popover |
| `closeOnOutsideClick` | boolean | `true` |  | Close when clicking outside |
| `closeOnEsc` | boolean | `true` |  | Close when pressing Escape |
| `showArrow` | boolean | `false` |  | Show arrow pointing to trigger |

### CommandPalette


```tsx
import { CommandPalette } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `open` | boolean | — |  | Whether the palette is visible |
| `onClose` | () => void | — |  | Callback fired when the palette should close |
| `items` | CommandItem[] | `[]` |  | Static list of command items |
| `onSelect` | (item: CommandItem) => void | — |  | Callback fired when an item is selected |
| `onSearch` | (query: string) => CommandItem[] | Promise<CommandItem[]> | — |  | Async search function for dynamic results |
| `placeholder` | string | — |  | Placeholder text in the search input |
| `emptyState` | ReactNode | — |  | Content shown when no results match |
| `groups` | boolean | — |  | Whether to group items by their group property |

### Divider


```tsx
import { Divider } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `orientation` | 'horizontal' \| 'vertical' | `horizontal` |  | Divider direction |
| `variant` | 'solid' \| 'dashed' \| 'dotted' | `solid` |  | Line style |
| `label` | string | React.ReactNode | — |  | Text or element displayed in the middle of the divider |
| `spacing` | 'none' \| 'sm' \| 'md' \| 'lg' | `md` |  | Spacing above and below (or left/right for vertical) |

### Spacer


```tsx
import { Spacer } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `size` | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| '2xl' \| '3xl' \| 'section' | `md` |  | Spacing size mapped to spacing tokens |
| `axis` | 'vertical' \| 'horizontal' | `vertical` |  | Direction of spacing |

### AspectRatio


```tsx
import { AspectRatio } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `ratio` | number | 'square' | 'video' | 'portrait' | 'wide' | `video` |  | Aspect ratio — preset name or numeric width/height ratio |

### Image


```tsx
import { Image } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `src` | string | — |  | Image source URL |
| `alt` | string | — |  | Alt text (required for accessibility — use "" for decorative images) |
| `fallback` | ReactNode | — |  | Fallback content shown while loading or on error |
| `aspectRatio` | number | 'square' | 'video' | 'portrait' | — |  | Aspect ratio constraint |
| `objectFit` | 'cover' \| 'contain' \| 'fill' \| 'none' | `cover` |  | How the image fills its container |
| `lazy` | boolean | `true` |  | Use native lazy loading |
| `radius` | 'none' \| 'sm' \| 'md' \| 'lg' \| 'xl' \| 'full' | `none` |  | Border radius |

### Carousel


```tsx
import { Carousel } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `autoPlay` | boolean | `false` |  | Auto-advance slides |
| `autoPlayInterval` | number | `5000` |  | Auto-play interval in ms |
| `loop` | boolean | `true` |  | Wrap around when reaching the end |
| `showArrows` | boolean | `true` |  | Show prev/next arrow buttons |
| `showDots` | boolean | `true` |  | Show dot indicators |
| `gap` | 'none' \| 'sm' \| 'md' \| 'lg' | `md` |  | Gap between slides |
| `label` | string | `Carousel` |  | Accessible label |

### Banner


```tsx
import { Banner } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | 'info' \| 'success' \| 'warning' \| 'error' \| 'neutral' | `info` |  | Visual variant |
| `title` | string | — |  | Optional title |
| `icon` | ReactNode | — |  | Custom icon (defaults to variant icon) |
| `action` | ReactNode | — |  | Action element (button or link) |
| `dismissible` | boolean | `false` |  | Whether the banner can be dismissed |
| `onDismiss` | () => void | — |  | Callback fired when dismissed |
| `sticky` | boolean | `false` |  | Stick to top of page |

### Skeleton


```tsx
import { Skeleton } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `variant` | 'text' \| 'circular' \| 'rectangular' | `text` |  | Shape variant |
| `width` | string | — |  | Width (CSS value) |
| `height` | string | — |  | Height (CSS value) |
| `lines` | number | `1` |  | Number of text lines to render |
| `animate` | boolean | `true` |  | Whether to animate the pulse effect |
| `radius` | 'none' \| 'sm' \| 'md' \| 'lg' \| 'full' | — |  | Border radius override |

### Spinner


```tsx
import { Spinner } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `size` | 'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl' | `md` |  | Spinner size |
| `color` | 'primary' \| 'current' \| 'white' | `primary` |  | Color variant — "current" inherits parent text color |
| `label` | string | `Loading` |  | Accessible label (visually hidden) |

### ProductCard


```tsx
import { ProductCard } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `image` | string | — |  | Product image URL |
| `title` | string | — |  | Product title |
| `price` | number | ProductPrice | — |  | Price as number or object with current/original |
| `rating` | ProductRating | — |  | Star rating with optional review count |
| `badge` | string | — |  | Badge text ("New", "Sale", "-20%", "Sold Out") |
| `variant` | 'default' \| 'compact' \| 'horizontal' | `default` |  | Layout variant |
| `onAddToCart` | () => void | — |  | Add to cart handler — shows button when provided |
| `onFavorite` | () => void | — |  | Favorite handler — shows heart when provided |
| `href` | string | — |  | Link URL — makes card clickable |
| `loading` | boolean | `false` |  | Show skeleton loading state |

### CartItem


```tsx
import { CartItem } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `image` | string | — |  | URL of the product image |
| `title` | string | — |  | Product title |
| `variant` | string | — |  | Product variant description (e.g., "Size M, Blue") |
| `price` | number | — |  | Price as a number |
| `quantity` | number | — |  | Current quantity |
| `currency` | string | — |  | Currency symbol or code |
| `onQuantityChange` | (quantity: number) => void | — |  | Callback fired when quantity changes |
| `onRemove` | () => void | — |  | Callback fired when the remove button is clicked |
| `maxQuantity` | number | `99` |  | Maximum allowed quantity |

### QuantitySelector


```tsx
import { QuantitySelector } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | number | — |  | Current quantity value |
| `onChange` | (value: number) => void | — |  | Callback fired when the value changes |
| `min` | number | `1` |  | Minimum allowed value |
| `max` | number | `99` |  | Maximum allowed value |
| `size` | 'sm' \| 'md' | `md` |  | Size variant |
| `disabled` | boolean | `false` |  | Whether the selector is disabled |

### PriceDisplay


```tsx
import { PriceDisplay } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | number | — |  | Price value to display |
| `originalValue` | number | — |  | Original price before discount (renders struck-through when provided) |
| `currency` | string | `USD` |  | ISO 4217 currency code |
| `locale` | string | `en-US` |  | BCP 47 locale string for formatting |
| `size` | 'sm' \| 'md' \| 'lg' \| 'xl' | `md` |  | Size of the price text |

### RatingStars


```tsx
import { RatingStars } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | number | — |  | Current rating value (0 to max, supports 0.5 increments) |
| `max` | number | `5` |  | Maximum number of stars |
| `count` | number | — |  | Number of reviews to display after stars (e.g., 128 renders "(128)") |
| `size` | 'sm' \| 'md' \| 'lg' | `md` |  | Size of the star icons |
| `interactive` | boolean | `false` |  | Enable interactive clicking and keyboard navigation |
| `onChange` | (value: number) => void | — |  | Callback when rating changes (interactive mode only) |

### ArticleLayout


```tsx
import { ArticleLayout } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `maxWidth` | 'prose' \| 'wide' \| 'full' | `prose` |  | Maximum content width |
| `sidebar` | ReactNode | — |  | Sidebar content (TOC, author info, related) |
| `sidebarPosition` | 'left' \| 'right' | `right` |  | Sidebar position |
| `sidebarSticky` | boolean | `true` |  | Whether sidebar sticks while scrolling |

### PullQuote


```tsx
import { PullQuote } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `quote` | string | — |  | Quote text |
| `attribution` | string | — |  | Attribution text |
| `variant` | 'default' \| 'accent' \| 'large' | `default` |  | Visual variant |

### AuthorCard


```tsx
import { AuthorCard } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `name` | string | — |  | Author name |
| `role` | string | — |  | Role or title |
| `avatar` | string | — |  | Avatar image URL |
| `bio` | string | — |  | Short bio |
| `social` | AuthorSocial[] | — |  | Social media links |
| `variant` | 'inline' \| 'card' | `inline` |  | Layout variant |

### RelatedPosts


```tsx
import { RelatedPosts } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `title` | string | — |  | Section title |
| `posts` | RelatedPost[] | — |  | Array of related posts |
| `columns` | 2 | 3 | 4 | `3` |  | Number of columns |
| `variant` | 'card' \| 'list' | `card` |  | Layout variant |

### NewsletterSignup


```tsx
import { NewsletterSignup } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `title` | string | — |  | Section title |
| `description` | string | — |  | Description text |
| `placeholder` | string | — |  | Input placeholder |
| `buttonText` | string | `Subscribe` |  | Button label |
| `onSubmit` | (email: string) => void | Promise<void> | — |  | Submit handler — receives validated email |
| `variant` | 'inline' \| 'card' \| 'banner' | `inline` |  | Layout variant |
| `successMessage` | string | — |  | Message after successful submit |

### ScrollArea


```tsx
import { ScrollArea } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `maxHeight` | string | — |  | Maximum height constraint |
| `orientation` | 'vertical' \| 'horizontal' \| 'both' | `vertical` |  | Scroll direction |
| `showScrollbar` | 'auto' \| 'always' \| 'hover' | `auto` |  | Scrollbar visibility |

### Collapsible


```tsx
import { Collapsible } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `open` | boolean | — |  | Controlled open state |
| `defaultOpen` | boolean | `false` |  | Default open state |
| `onOpenChange` | (open: boolean) => void | — |  | Callback when open state changes |
| `trigger` | ReactNode | — |  | Clickable trigger element |
| `animateHeight` | boolean | `true` |  | Animate height transition |

### CopyButton


```tsx
import { CopyButton } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | string | — |  | Text to copy to clipboard |
| `label` | string | `Copy` |  | Button label |
| `copiedLabel` | string | — |  | Label shown after copying |
| `copiedDuration` | number | `2000` |  | How long "Copied!" stays visible (ms) |
| `variant` | 'default' \| 'ghost' \| 'icon' | `default` |  | Visual variant |
| `size` | 'sm' \| 'md' | `sm` |  | Size |

### ThemeProvider


```tsx
import { ThemeProvider } from '@arcana-ui/core'
```

| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `defaultTheme` | 'brutalist' \| 'commerce' \| 'corporate' \| 'dark' \| 'editorial' \| 'glass' \| 'light' \| 'midnight' \| 'mono' \| 'nature' \| 'neon' \| 'retro98' \| 'startup' \| 'terminal' | `light` |  | Default theme to use when no stored preference exists and system detection is no |
| `storageKey` | string | `arcana-theme` |  | localStorage key for persisting theme preference. |
| `enableTransitions` | boolean | `false` |  | When `true`, add smooth CSS transitions during theme changes. |

### Additional Components

All available, see manifest.ai.json for full props:

- **`CheckboxGroup`** (primitives) — options, value, onChange, orientation
- **`Radio`** (primitives) — label, description
- **`RadioGroup`** (primitives) — name, label, value, onChange
- **`AvatarGroup`** (primitives) — max
- **`ModalClose`** (composites) — onClick
- **`ToastProvider`** (composites)
- **`AccordionItem`** (composites) — value, disabled
- **`AccordionTrigger`** (composites)
- **`AccordionContent`** (composites)
- **`NavbarBrand`** (patterns)
- **`NavbarContent`** (patterns)
- **`NavbarActions`** (patterns)
- **`SidebarHeader`** (patterns)
- **`SidebarContent`** (patterns)
- **`SidebarFooter`** (patterns)
- **`SidebarSection`** (patterns) — label
- **`FormLabel`** (patterns)
- **`FormHelperText`** (patterns)
- **`FormErrorMessage`** (patterns)
- **`BreadcrumbItem`** (patterns) — href, current
- **`FooterSection`** (patterns) — title
- **`FooterLink`** (patterns) — external
- **`FooterBottom`** (patterns)
- **`Timeline`** (patterns) — items, variant
- **`ErrorBoundary`** (composites) — fallback, onError
- **`KeyboardShortcut`** (patterns) — keys, variant
- **`ColorPicker`** (other) — value, onChange, format, showAlpha
- **`FontPicker`** (other) — value, onChange, label, googleFonts

## 3. Hooks Reference

### `useToast`

```tsx
import { useToast } from '@arcana-ui/core'
```

### `useMediaQuery`

```tsx
import { useMediaQuery } from '@arcana-ui/core'
```
Reactively matches a CSS media query string. SSR-safe: returns `false` when `window` is unavailable.

### `useBreakpoint`

```tsx
import { useBreakpoint } from '@arcana-ui/core'
```
Returns the current active breakpoint and convenience booleans. SSR-safe: defaults to `"lg"` (desktop) when `window` is unavailable. Breakpoint values match the layout token system: - sm: < 640px - md: 640px – 1023px - lg: 1024px – 1279px - xl: 1280px – 1535px - 2xl: >= 1536px

### `usePrefersReducedMotion`

```tsx
import { usePrefersReducedMotion } from '@arcana-ui/core'
```
Returns `true` when the user has enabled "Prefer reduced motion" in their OS or browser settings. SSR-safe: returns `false` when `window` is unavailable. Note: CSS-level reduced motion is already handled by the Arcana token system (all `--duration-*` tokens are zeroed out via a `prefers-reduced-moti...

### `useHotkey`

```tsx
import { useHotkey } from '@arcana-ui/core'
```
Hook to listen for keyboard shortcuts. Automatically handles Cmd (Mac) vs Ctrl (Windows/Linux) when modifier includes "meta". Does not fire when user is typing in an input, textarea, or contenteditable.

### `useFloating`

```tsx
import { useFloating } from '@arcana-ui/core'
```
Positions a floating element relative to a trigger, with smart flip and viewport clamping. Zero dependencies — a lightweight alternative to Floating UI / Popper.js.

### `useClickOutside`

```tsx
import { useClickOutside } from '@arcana-ui/core'
```
Fires a callback when a click (mousedown) occurs outside of the referenced element. SSR-safe: does nothing when `document` is unavailable.

### `useDrag`

```tsx
import { useDrag } from '@arcana-ui/core'
```
Generic drag interaction hook. Handles mousedown/touchstart → document mousemove/touchmove → mouseup/touchend with optional RAF throttling and coordinate normalization.

### `useUndoRedo`

```tsx
import { useUndoRedo } from '@arcana-ui/core'
```
Generic undo/redo history stack. New pushes after an undo clear the forward (redo) history. Stack size is bounded by `maxHistory`.

### `useTheme`

```tsx
import { useTheme } from '@arcana-ui/core'
```
Reads the persisted theme from localStorage. Returns `null` if no preference is stored or if running on the server. / function getStoredTheme(): ThemeId | null { if (typeof window === 'undefined') return null; try { const stored = localStorage.getItem(STORAGE_KEY); if (stored && THEME_IDS.includes(s...

### `useThemeContext`

```tsx
import { useThemeContext } from '@arcana-ui/core'
```
Reads the persisted theme from localStorage. / function getStoredTheme(key: string): ThemeId | null { if (typeof window === 'undefined') return null; try { const stored = localStorage.getItem(key); if (stored && THEME_IDS.includes(stored as ThemeId)) { return stored as ThemeId; } } catch { // localS...

## 4. Token System

Three-tier architecture: **Primitive → Semantic → Component**

- **Primitive** — Raw values. `--primitive-blue-500: #3b82f6`. Never use in custom CSS.
- **Semantic** — Contextual meaning. `--color-action-primary: var(--primitive-blue-500)`. Use these in your CSS.
- **Component** — Per-component overrides. `--button-bg: var(--color-action-primary)`. Scoped to one component.

### Key Semantic Tokens

```css
/* Backgrounds */
--color-bg-page         /* Main page background */
--color-bg-surface      /* Cards, panels, sidebars */
--color-bg-elevated     /* Modals, dropdowns, tooltips */
--color-bg-subtle       /* Zebra rows, hover states */

/* Foreground / Text */
--color-fg-primary      /* Body text */
--color-fg-secondary    /* Labels, captions */
--color-fg-muted        /* Placeholder, disabled */
--color-fg-inverse      /* Text on dark/colored bg */

/* Actions */
--color-action-primary        /* Primary button background */
--color-action-primary-hover  /* Hover state */
--color-action-ghost-hover    /* Ghost button hover */

/* Borders */
--color-border-default  /* Default border */
--color-border-focus    /* Focus ring */

/* Status */
--color-status-success  /* Green */
--color-status-warning  /* Amber */
--color-status-error    /* Red */
--color-status-info     /* Blue */

/* Spacing */
--spacing-1  /* 4px */    --spacing-2  /* 8px */
--spacing-3  /* 12px */   --spacing-4  /* 16px */
--spacing-6  /* 24px */   --spacing-8  /* 32px */
--spacing-12 /* 48px */   --spacing-16 /* 64px */

/* Typography */
--font-display          /* Heading font */
--font-body             /* Body font */
--font-mono             /* Code/mono font */
--font-size-xs  /* 12px */  --font-size-sm  /* 14px */
--font-size-md  /* 16px */  --font-size-lg  /* 18px */
--font-size-xl  /* 20px */  --font-size-2xl /* 24px */
--font-size-3xl /* 30px */  --font-size-4xl /* 36px */

/* Radius */
--radius-sm  /* 4px */  --radius-md  /* 8px */
--radius-lg  /* 12px */ --radius-xl  /* 16px */
--radius-full /* 9999px */

/* Shadows */
--shadow-sm  --shadow-md  --shadow-lg  --shadow-xl

/* Z-index */
--z-dropdown /* 1000 */  --z-sticky /* 1100 */
--z-modal /* 1300 */     --z-toast /* 1500 */
```

### Custom CSS with Tokens

```css
/* ✓ Correct — uses semantic tokens */
.my-card {
  background: var(--color-bg-surface);
  padding: var(--spacing-6);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
}

/* ✗ Wrong — hardcoded values */
.my-card {
  background: #ffffff;
  padding: 24px;
}
```

### Custom Theme JSON

```json
{
  "name": "my-brand",
  "description": "Custom brand theme",
  "primitive": {
    "color": {
      "brand": { "500": "#6366f1", "600": "#4f46e5" },
      "neutral": { "0": "#fff", "50": "#f9fafb", "900": "#111827" }
    },
    "font": {
      "display": "Inter, sans-serif",
      "body": "Inter, sans-serif",
      "mono": "JetBrains Mono, monospace"
    }
  },
  "semantic": {
    "color": {
      "background": {
        "default": "{primitive.color.neutral.50}",
        "surface": "{primitive.color.neutral.0}"
      },
      "action": {
        "primary": "{primitive.color.brand.500}",
        "primaryHover": "{primitive.color.brand.600}"
      }
    }
  },
  "component": {}
}
```

## 5. Layout Patterns

Complete, working code examples. Copy-paste to build full pages.

### Dashboard Layout

```tsx
import '@arcana-ui/tokens/dist/arcana.css';
import {
  Navbar, NavbarBrand, NavbarContent, NavbarActions,
  Sidebar, SidebarContent, SidebarItem, SidebarSection,
  StatCard, DataTable, Tabs, TabList, Tab, TabPanels, TabPanel,
  Badge, Button, Card, ProgressBar,
} from '@arcana-ui/core';
import type { ColumnDef } from '@arcana-ui/core';
import { useState } from 'react';

interface User { id: number; name: string; email: string; role: string; }
const users: User[] = [
  { id: 1, name: 'Alice Chen', email: 'alice@example.com', role: 'Admin' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'Developer' },
];
const columns: ColumnDef<User>[] = [
  { key: 'name', header: 'Name', sortable: true },
  { key: 'email', header: 'Email', sortable: true },
  { key: 'role', header: 'Role', render: (_, row) => <Badge variant="secondary">{row.role}</Badge> },
];

export function Dashboard() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--color-bg-page)" }}>
      <Navbar sticky border>
        <NavbarBrand>Arcana Dashboard</NavbarBrand>
        <NavbarActions><Button variant="ghost" size="sm">Log Out</Button></NavbarActions>
      </Navbar>
      <div style={{ display: "flex" }}>
        <Sidebar style={{ width: 240, minHeight: "calc(100vh - 64px)" }}>
          <SidebarContent>
            <SidebarSection label="Main">
              <SidebarItem href="/" active>Dashboard</SidebarItem>
              <SidebarItem href="/users">Users</SidebarItem>
              <SidebarItem href="/settings">Settings</SidebarItem>
            </SidebarSection>
          </SidebarContent>
        </Sidebar>
        <main style={{ flex: 1, padding: "var(--spacing-6)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "var(--spacing-4)", marginBottom: "var(--spacing-6)" }}>
            <StatCard label="Total Users" value="1,284" trend={{ direction: 'up', value: 12.5 }} comparison="vs last month" />
            <StatCard label="Revenue" value="$48,290" trend={{ direction: 'up', value: 8.2 }} comparison="vs last month" />
            <StatCard label="Sessions" value="342" trend={{ direction: 'down', value: 3.1 }} comparison="vs last week" />
            <StatCard label="Conversion" value="3.6%" trend={{ direction: 'up', value: 0.4 }} comparison="vs last month" />
          </div>
          <Tabs defaultValue="users">
            <TabList>
              <Tab value="users">Users</Tab>
              <Tab value="metrics">Metrics</Tab>
            </TabList>
            <TabPanels>
              <TabPanel value="users">
                <Card><DataTable data={users} columns={columns} sortable filterable pagination={{ pageSize: 10 }} /></Card>
              </TabPanel>
              <TabPanel value="metrics">
                <Card>
                  <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-4)" }}>
                    <div><h4>Server Uptime</h4><ProgressBar value={99.9} showValue color="success" /></div>
                    <div><h4>CPU Usage</h4><ProgressBar value={67} showValue color="warning" /></div>
                  </div>
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
```

### Marketing Landing Page

```tsx
import '@arcana-ui/tokens/dist/arcana.css';
import {
  Navbar, NavbarBrand, NavbarContent, NavbarActions,
  Hero, FeatureSection, Testimonial, PricingCard, CTA, StatsBar,
  Footer, FooterSection, FooterLink, FooterBottom,
  Button, Badge, LogoCloud,
} from '@arcana-ui/core';

export function Landing() {
  return (
    <>
      <Navbar sticky>
        <NavbarBrand>Acme Inc</NavbarBrand>
        <NavbarContent>
          <a href="/features">Features</a>
          <a href="/pricing">Pricing</a>
        </NavbarContent>
        <NavbarActions>
          <Button variant="ghost" size="sm">Sign in</Button>
          <Button variant="primary" size="sm">Get started</Button>
        </NavbarActions>
      </Navbar>

      <Hero
        headline="Build AI-native interfaces, faster"
        subheadline="Token-driven React components that adapt to any brand in seconds."
        primaryCTA={{ label: 'Start free', href: '/signup' }}
        secondaryCTA={{ label: 'View docs', href: '/docs' }}
        variant="centered"
      />

      <StatsBar stats={[
        { value: '108', label: 'Components' },
        { value: '14', label: 'Themes' },
        { value: '2.6K+', label: 'CSS variables' },
        { value: '100%', label: 'TypeScript' },
      ]} />

      <FeatureSection
        title="Everything you need"
        subtitle="Built for AI agents. Beautiful for humans."
        features={[
          { title: 'Token-driven', description: 'Every visual property is a CSS variable. Change one JSON file, change everything.' },
          { title: '14 themes', description: 'Light, dark, midnight, terminal, brutalist, and 9 more.' },
          { title: 'WCAG AA', description: '100% accessible. Keyboard nav, ARIA labels, 4.5:1 contrast.' },
        ]}
      />

      <PricingCard
        name="Pro"
        price="$49"
        period="/month"
        description="For teams building production apps"
        features={['Unlimited components', 'All themes', 'MCP server access', 'Priority support']}
        primaryCTA={{ label: 'Start Pro trial', href: '/signup' }}
        highlighted
      />

      <CTA
        headline="Ready to ship?"
        description="Join 10,000+ developers using Arcana UI."
        primaryCTA={{ label: 'Get started free', href: '/signup' }}
      />

      <Footer>
        <FooterSection title="Product">
          <FooterLink href="/docs">Documentation</FooterLink>
          <FooterLink href="/changelog">Changelog</FooterLink>
        </FooterSection>
        <FooterBottom>&copy; 2026 Acme Inc. All rights reserved.</FooterBottom>
      </Footer>
    </>
  );
}
```

### E-commerce Store

```tsx
import '@arcana-ui/tokens/dist/arcana.css';
import {
  Navbar, NavbarBrand, NavbarContent, NavbarActions,
  ProductCard, PriceDisplay, RatingStars, Badge, Button, Grid, Container,
} from '@arcana-ui/core';

const products = [
  { id: 1, title: 'Arcana Hoodie', price: 79, originalPrice: 99, rating: 4.8, reviews: 124, image: '/hoodie.jpg', badge: 'Sale' },
  { id: 2, title: 'Dev Mug', price: 24, rating: 4.9, reviews: 88, image: '/mug.jpg' },
  { id: 3, title: 'Sticker Pack', price: 12, rating: 5.0, reviews: 203, image: '/stickers.jpg', badge: 'Popular' },
];

export function Shop() {
  return (
    <>
      <Navbar sticky border>
        <NavbarBrand>Arcana Supply</NavbarBrand>
        <NavbarActions><Button variant="ghost" size="sm">Cart (0)</Button></NavbarActions>
      </Navbar>
      <Container size="xl" style={{ paddingTop: 'var(--spacing-8)' }}>
        <Grid columns={3} gap={6}>
          {products.map(p => (
            <ProductCard
              key={p.id}
              image={p.image}
              title={p.title}
              price={p.price}
              originalPrice={p.originalPrice}
              badge={p.badge}
              actions={<Button variant="primary" size="sm">Add to cart</Button>}
            />
          ))}
        </Grid>
      </Container>
    </>
  );
}
```

### Editorial Article Page

```tsx
import '@arcana-ui/tokens/dist/arcana.css';
import {
  Navbar, NavbarBrand, NavbarActions,
  ArticleLayout, AuthorCard, PullQuote, RelatedPosts, Badge, Button,
} from '@arcana-ui/core';

export function Article() {
  return (
    <>
      <Navbar sticky border>
        <NavbarBrand>The Journal</NavbarBrand>
        <NavbarActions><Button variant="ghost" size="sm">Subscribe</Button></NavbarActions>
      </Navbar>
      <ArticleLayout
        sidebar={
          <AuthorCard
            name="Sarah Chen"
            role="Senior Editor"
            avatar="/sarah.jpg"
            bio="Covering design systems and developer tooling for 8 years."
          />
        }
      >
        <Badge variant="primary" size="sm">Design Systems</Badge>
        <h1>Why token-driven design is the future of AI interfaces</h1>
        <p>When every visual property is a CSS variable, AI agents can assemble beautiful, on-brand interfaces without being designers...</p>
        <PullQuote
          quote="Design tokens are the API between design and code."
          attribution="Sarah Chen"
        />
        <p>The three-tier token architecture...</p>
        <RelatedPosts
          title="More on design systems"
          posts={[
            { title: 'Building with CSS custom properties', href: '/css-vars', category: 'Tutorial' },
            { title: 'WCAG AA in practice', href: '/wcag', category: 'Accessibility' },
          ]}
        />
      </ArticleLayout>
    </>
  );
}
```

## 6. Theme Presets

- **`brutalist`** — Bloomberg Terminal meets Swiss poster — bold red accent, dramatic typography, thick structural borders
- **`commerce`** — Clean product-focused design — warm neutrals with green accent, Shopify-inspired
- **`corporate`** — Conservative navy/slate palette — trustworthy, enterprise-grade, Stripe-inspired
- **`dark`** — Deep slate dark with vibrant indigo accent — focused, rich, Linear-inspired
- **`editorial`** — Elegant serif typography, high contrast — publishing, NYT-inspired
- **`glass`** — Apple iOS glassmorphism — frosted translucent surfaces on gradient, elegant light typography
- **`light`** — Warm stone palette with indigo accent — clean, precise, Notion-inspired
- **`midnight`** — Deep navy with soft gold accents — premium, finance-grade, Bloomberg-inspired
- **`mono`** — Pure black and white — stark typographic minimalism, portfolio/architecture-inspired
- **`nature`** — Earth tones with warm greens — organic, wellness, sustainability-inspired
- **`neon`** — Electric neon on dark — vivid cyan/pink accents, cyberpunk, gaming-inspired
- **`retro98`** — Authentic Windows 98 recreation — pixel-perfect bevels, navy blue title bars, silver surfaces
- **`startup`** — Vibrant purple-to-pink gradient energy — modern SaaS, Vercel/Linear-inspired
- **`terminal`** — Premium terminal emulator — green phosphor on black, monospace everything, Warp/Hyper-inspired

### Preset Best-Use Guide

| Preset | Best For | Mode |
|--------|----------|------|
| `light` | General apps, docs, productivity | Light |
| `dark` | Dev tools, code editors, dashboards | Dark |
| `midnight` | Finance, trading, premium SaaS | Dark |
| `corporate` | Enterprise, B2B, compliance apps | Light |
| `startup` | Modern SaaS, landing pages, marketing | Light |
| `editorial` | Blogs, news, content platforms | Light |
| `commerce` | E-commerce, marketplaces | Light |
| `glass` | Mobile apps, portfolios | Light |
| `brutalist` | Creative agencies, art sites | Dark |
| `terminal` | CLI tools, developer portals | Dark |
| `retro98` | Nostalgia, game sites | Light |
| `nature` | Wellness, sustainability brands | Light |
| `neon` | Gaming, entertainment, creative | Dark |
| `mono` | Architecture portfolios, minimalism | Light |

## 7. Responsive Design

### Breakpoints

```
Mobile  < 640px   (sm)
Tablet  640–1023  (md)
Desktop 1024–1279 (lg)  ← default for SSR
Wide    1280–1535 (xl)
Ultra   ≥ 1536    (2xl)
```

### Mobile-first CSS

```css
/* Always write mobile defaults first */
.layout {
  flex-direction: column; /* mobile */
}
@media (min-width: 1024px) {
  .layout {
    flex-direction: row; /* desktop */
  }
}
```

### Responsive Hooks

```tsx
import { useBreakpoint, useMediaQuery } from '@arcana-ui/core';

function ResponsiveNav() {
  const { isMobile, isTablet } = useBreakpoint();
  const prefersDark = useMediaQuery('(prefers-color-scheme: dark)');
  return isMobile ? <MobileNav /> : <Navbar />;
}
```

### Mobile Behavior

| Desktop | Mobile |
|---------|--------|
| `Navbar` with links | Collapses to hamburger + `DrawerNav` |
| `Modal` centered | Becomes `BottomSheet` |
| `Sidebar` visible | Hidden by default, toggle with `DrawerNav` |
| `Grid columns={3}` | Auto-stacks to 1 column |
| Touch targets | Minimum 44×44px |

## 8. Rules

1. **Always import CSS** — `import "@arcana-ui/tokens/dist/arcana.css"` at app root
2. **Never hardcode values** — Use `var(--color-action-primary)` not `#6366f1`
3. **Use semantic tokens** — Not primitive tokens, in custom CSS
4. **forwardRef pattern** — When wrapping Arcana components, use `forwardRef`
5. **Component tokens for overrides** — `--button-bg: #ff6600` not `.arcana-button { background: #ff6600 }`
6. **ARIA on custom interactive elements** — `role`, `aria-label`, `aria-expanded` etc.
7. **Mobile-first CSS** — Default styles target mobile; use `min-width` queries to scale up
8. **data-theme on html element** — Not on a child div, to ensure tokens cascade correctly
9. **ThemeProvider for React apps** — Wrap app root for SSR-safe theme management
10. **Use `useToast()` hook** — Not direct DOM manipulation for notifications

## Resources

- **MCP server**: `npx @arcana-ui/mcp` — programmatic access from AI agents
- **Playground**: https://arcana-ui.dev — live theme editor with 14 presets
- **GitHub**: https://github.com/Arcana-UI/arcana
- **npm**: https://www.npmjs.com/package/@arcana-ui/core
- **Full manifest**: manifest.ai.json at repo root — machine-readable component registry
- **Token map**: docs/generated/token-component-map.json — token blast-radius data
