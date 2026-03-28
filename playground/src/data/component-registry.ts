/**
 * Component Registry — metadata for every Arcana UI component.
 * Powers the component gallery, detail pages, and graph visualization.
 */

export type ComponentCategory =
  | 'Primitives'
  | 'Navigation'
  | 'Forms'
  | 'Data Display'
  | 'Overlays'
  | 'Feedback'
  | 'Layout'
  | 'Media'
  | 'Marketing'
  | 'E-commerce'
  | 'Editorial'
  | 'Utility';

export type SiteCategory = 'Dashboard' | 'Marketing' | 'E-commerce' | 'Editorial' | 'All';

export interface PropDef {
  name: string;
  type: string;
  default?: string;
  description: string;
  required?: boolean;
}

export interface ComponentMeta {
  /** URL-safe slug, e.g. "button", "pricing-card" */
  slug: string;
  /** Display name, e.g. "Button", "PricingCard" */
  name: string;
  /** Short description */
  description: string;
  /** Component category */
  category: ComponentCategory;
  /** Which site types this component is used in */
  siteCategories: SiteCategory[];
  /** Import path */
  importName: string;
  /** Available variant values */
  variants?: string[];
  /** Available size values */
  sizes?: string[];
  /** Key props for interactive demo */
  props: PropDef[];
  /** Whether this component has interactive states (hover, focus, disabled, loading) */
  hasStates?: boolean;
  /** CSS file key in token map (lowercase, no hyphens for compound names) */
  tokenMapKey: string;
}

export const COMPONENT_REGISTRY: ComponentMeta[] = [
  // ─── Primitives ──────────────────────────────────────────────
  {
    slug: 'button',
    name: 'Button',
    description: 'Interactive button with multiple variants, sizes, and loading state.',
    category: 'Primitives',
    siteCategories: ['All'],
    importName: 'Button',
    variants: ['primary', 'secondary', 'ghost', 'destructive', 'outline'],
    sizes: ['sm', 'md', 'lg'],
    hasStates: true,
    tokenMapKey: 'button',
    props: [
      {
        name: 'variant',
        type: "'primary' | 'secondary' | 'ghost' | 'destructive' | 'outline'",
        default: "'primary'",
        description: 'Visual style variant',
      },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Button size' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Shows loading spinner' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the button' },
      {
        name: 'fullWidth',
        type: 'boolean',
        default: 'false',
        description: 'Makes button full width',
      },
      { name: 'icon', type: 'ReactNode', description: 'Icon element on the left' },
      { name: 'iconRight', type: 'ReactNode', description: 'Icon element on the right' },
      {
        name: 'iconOnly',
        type: 'boolean',
        default: 'false',
        description: 'Icon-only mode (no text)',
      },
    ],
  },
  {
    slug: 'input',
    name: 'Input',
    description: 'Text input field with label, error state, and prefix/suffix slots.',
    category: 'Forms',
    siteCategories: ['All'],
    importName: 'Input',
    sizes: ['sm', 'md', 'lg'],
    hasStates: true,
    tokenMapKey: 'input',
    props: [
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Input size' },
      { name: 'label', type: 'string', description: 'Label text' },
      { name: 'error', type: 'string | boolean', description: 'Error message or state' },
      { name: 'helperText', type: 'string', description: 'Helper text below input' },
      { name: 'prefix', type: 'ReactNode', description: 'Prefix element' },
      { name: 'suffix', type: 'ReactNode', description: 'Suffix element' },
      { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Full width input' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the input' },
    ],
  },
  {
    slug: 'textarea',
    name: 'Textarea',
    description: 'Multi-line text input with auto-resize and character count.',
    category: 'Forms',
    siteCategories: ['All'],
    importName: 'Textarea',
    sizes: ['sm', 'md', 'lg'],
    hasStates: true,
    tokenMapKey: 'textarea',
    props: [
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Textarea size' },
      { name: 'label', type: 'string', description: 'Label text' },
      { name: 'error', type: 'string | boolean', description: 'Error state' },
      { name: 'rows', type: 'number', default: '3', description: 'Number of rows' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the textarea' },
    ],
  },
  {
    slug: 'select',
    name: 'Select',
    description: 'Dropdown select with label, error state, and custom styling.',
    category: 'Forms',
    siteCategories: ['All'],
    importName: 'Select',
    sizes: ['sm', 'md', 'lg'],
    hasStates: true,
    tokenMapKey: 'select',
    props: [
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Select size' },
      { name: 'label', type: 'string', description: 'Label text' },
      { name: 'error', type: 'string | boolean', description: 'Error state' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the select' },
    ],
  },
  {
    slug: 'checkbox',
    name: 'Checkbox',
    description: 'Checkbox with label and indeterminate state.',
    category: 'Forms',
    siteCategories: ['All'],
    importName: 'Checkbox',
    sizes: ['sm', 'md', 'lg'],
    hasStates: true,
    tokenMapKey: 'checkbox',
    props: [
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Checkbox size' },
      { name: 'label', type: 'string', description: 'Label text' },
      { name: 'checked', type: 'boolean', description: 'Checked state' },
      {
        name: 'indeterminate',
        type: 'boolean',
        default: 'false',
        description: 'Indeterminate state',
      },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the checkbox' },
    ],
  },
  {
    slug: 'radio',
    name: 'Radio',
    description: 'Radio button for single selection within a group.',
    category: 'Forms',
    siteCategories: ['All'],
    importName: 'Radio',
    sizes: ['sm', 'md', 'lg'],
    hasStates: true,
    tokenMapKey: 'radio',
    props: [
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Radio size' },
      { name: 'label', type: 'string', description: 'Label text' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the radio' },
    ],
  },
  {
    slug: 'toggle',
    name: 'Toggle',
    description: 'Toggle switch for boolean settings.',
    category: 'Forms',
    siteCategories: ['All'],
    importName: 'Toggle',
    sizes: ['sm', 'md', 'lg'],
    hasStates: true,
    tokenMapKey: 'toggle',
    props: [
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Toggle size' },
      { name: 'label', type: 'string', description: 'Label text' },
      { name: 'checked', type: 'boolean', description: 'Toggle state' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Disables the toggle' },
    ],
  },
  {
    slug: 'badge',
    name: 'Badge',
    description: 'Small label for status indicators, counts, and tags.',
    category: 'Primitives',
    siteCategories: ['All'],
    importName: 'Badge',
    variants: ['default', 'success', 'warning', 'error', 'info', 'secondary'],
    sizes: ['sm', 'md', 'lg'],
    tokenMapKey: 'badge',
    props: [
      {
        name: 'variant',
        type: "'default' | 'success' | 'warning' | 'error' | 'info' | 'secondary'",
        default: "'default'",
        description: 'Badge variant',
      },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Badge size' },
      { name: 'dot', type: 'boolean', default: 'false', description: 'Shows a dot indicator' },
    ],
  },
  {
    slug: 'avatar',
    name: 'Avatar',
    description: 'User avatar with image, initials, or icon fallback.',
    category: 'Primitives',
    siteCategories: ['All'],
    importName: 'Avatar',
    sizes: ['sm', 'md', 'lg', 'xl'],
    tokenMapKey: 'avatar',
    props: [
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg' | 'xl'",
        default: "'md'",
        description: 'Avatar size',
      },
      { name: 'src', type: 'string', description: 'Image URL' },
      { name: 'alt', type: 'string', description: 'Alt text' },
      { name: 'initials', type: 'string', description: 'Fallback initials' },
    ],
  },

  // ─── Composites ──────────────────────────────────────────────
  {
    slug: 'card',
    name: 'Card',
    description: 'Container with header, body, and footer sections.',
    category: 'Primitives',
    siteCategories: ['All'],
    importName: 'Card',
    variants: ['default', 'outlined', 'elevated'],
    tokenMapKey: 'card',
    props: [
      {
        name: 'variant',
        type: "'default' | 'outlined' | 'elevated'",
        default: "'default'",
        description: 'Card style variant',
      },
      {
        name: 'padding',
        type: "'none' | 'sm' | 'md' | 'lg'",
        default: "'md'",
        description: 'Content padding',
      },
      { name: 'interactive', type: 'boolean', default: 'false', description: 'Adds hover effect' },
    ],
  },
  {
    slug: 'alert',
    name: 'Alert',
    description: 'Contextual feedback message with icon and dismiss.',
    category: 'Feedback',
    siteCategories: ['All'],
    importName: 'Alert',
    variants: ['info', 'success', 'warning', 'error'],
    tokenMapKey: 'alert',
    props: [
      {
        name: 'variant',
        type: "'info' | 'success' | 'warning' | 'error'",
        default: "'info'",
        description: 'Alert type',
      },
      { name: 'title', type: 'string', description: 'Alert title' },
      { name: 'onClose', type: '() => void', description: 'Close handler' },
    ],
  },
  {
    slug: 'modal',
    name: 'Modal',
    description: 'Dialog overlay with title, content, and footer actions.',
    category: 'Overlays',
    siteCategories: ['All'],
    importName: 'Modal',
    sizes: ['sm', 'md', 'lg', 'xl', 'full'],
    tokenMapKey: 'modal',
    props: [
      { name: 'open', type: 'boolean', required: true, description: 'Controls visibility' },
      { name: 'onClose', type: '() => void', required: true, description: 'Close handler' },
      { name: 'title', type: 'string', description: 'Modal title' },
      {
        name: 'size',
        type: "'sm' | 'md' | 'lg' | 'xl' | 'full'",
        default: "'md'",
        description: 'Modal width',
      },
      {
        name: 'closeOnOverlayClick',
        type: 'boolean',
        default: 'true',
        description: 'Close on backdrop click',
      },
    ],
  },
  {
    slug: 'tabs',
    name: 'Tabs',
    description: 'Tabbed navigation with panel content switching.',
    category: 'Navigation',
    siteCategories: ['All'],
    importName: 'Tabs',
    variants: ['line', 'enclosed', 'pills'],
    sizes: ['sm', 'md', 'lg'],
    tokenMapKey: 'tabs',
    props: [
      {
        name: 'variant',
        type: "'line' | 'enclosed' | 'pills'",
        default: "'line'",
        description: 'Tab style',
      },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Tab size' },
      { name: 'defaultIndex', type: 'number', default: '0', description: 'Initially active tab' },
    ],
  },
  {
    slug: 'accordion',
    name: 'Accordion',
    description: 'Expandable content sections with toggle animation.',
    category: 'Utility',
    siteCategories: ['All'],
    importName: 'Accordion',
    tokenMapKey: 'accordion',
    props: [
      {
        name: 'type',
        type: "'single' | 'multiple'",
        default: "'single'",
        description: 'Allow one or many open',
      },
      { name: 'defaultValue', type: 'string[]', description: 'Initially open items' },
    ],
  },
  {
    slug: 'banner',
    name: 'Banner',
    description: 'Full-width notification banner with action.',
    category: 'Feedback',
    siteCategories: ['All'],
    importName: 'Banner',
    variants: ['info', 'success', 'warning', 'error'],
    tokenMapKey: 'banner',
    props: [
      {
        name: 'variant',
        type: "'info' | 'success' | 'warning' | 'error'",
        default: "'info'",
        description: 'Banner type',
      },
      { name: 'onClose', type: '() => void', description: 'Dismiss handler' },
    ],
  },
  {
    slug: 'skeleton',
    name: 'Skeleton',
    description: 'Loading placeholder with shimmer animation.',
    category: 'Feedback',
    siteCategories: ['All'],
    importName: 'Skeleton',
    tokenMapKey: 'skeleton',
    props: [
      { name: 'width', type: 'string | number', description: 'Skeleton width' },
      { name: 'height', type: 'string | number', description: 'Skeleton height' },
      {
        name: 'variant',
        type: "'text' | 'circle' | 'rect'",
        default: "'text'",
        description: 'Shape variant',
      },
    ],
  },
  {
    slug: 'spinner',
    name: 'Spinner',
    description: 'Loading spinner indicator.',
    category: 'Feedback',
    siteCategories: ['All'],
    importName: 'Spinner',
    sizes: ['sm', 'md', 'lg'],
    tokenMapKey: 'spinner',
    props: [
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Spinner size' },
    ],
  },
  {
    slug: 'toast',
    name: 'Toast',
    description: 'Temporary notification messages.',
    category: 'Feedback',
    siteCategories: ['All'],
    importName: 'ToastProvider',
    variants: ['default', 'success', 'warning', 'error'],
    tokenMapKey: 'toast',
    props: [
      { name: 'title', type: 'string', required: true, description: 'Toast title' },
      { name: 'description', type: 'string', description: 'Toast description' },
      {
        name: 'variant',
        type: "'default' | 'success' | 'warning' | 'error'",
        default: "'default'",
        description: 'Toast type',
      },
    ],
  },

  // ─── Navigation ──────────────────────────────────────────────
  {
    slug: 'navbar',
    name: 'Navbar',
    description: 'Top navigation bar with brand, links, and actions.',
    category: 'Navigation',
    siteCategories: ['All'],
    importName: 'Navbar',
    tokenMapKey: 'navbar',
    props: [
      { name: 'sticky', type: 'boolean', default: 'false', description: 'Sticks to top on scroll' },
      {
        name: 'transparent',
        type: 'boolean',
        default: 'false',
        description: 'Transparent background',
      },
    ],
  },
  {
    slug: 'sidebar',
    name: 'Sidebar',
    description: 'Vertical navigation panel with sections and items.',
    category: 'Navigation',
    siteCategories: ['Dashboard'],
    importName: 'Sidebar',
    tokenMapKey: 'sidebar',
    props: [
      {
        name: 'collapsed',
        type: 'boolean',
        default: 'false',
        description: 'Collapsed icon-only mode',
      },
    ],
  },
  {
    slug: 'breadcrumb',
    name: 'Breadcrumb',
    description: 'Hierarchical navigation trail.',
    category: 'Navigation',
    siteCategories: ['All'],
    importName: 'Breadcrumb',
    tokenMapKey: 'breadcrumb',
    props: [
      {
        name: 'separator',
        type: 'ReactNode',
        default: "'/'",
        description: 'Separator between items',
      },
    ],
  },
  {
    slug: 'pagination',
    name: 'Pagination',
    description: 'Page navigation with numbered buttons.',
    category: 'Navigation',
    siteCategories: ['All'],
    importName: 'Pagination',
    sizes: ['sm', 'md', 'lg'],
    tokenMapKey: 'pagination',
    props: [
      { name: 'totalPages', type: 'number', required: true, description: 'Total number of pages' },
      { name: 'currentPage', type: 'number', required: true, description: 'Current active page' },
      {
        name: 'onPageChange',
        type: '(page: number) => void',
        required: true,
        description: 'Page change handler',
      },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Pagination size' },
    ],
  },
  {
    slug: 'footer',
    name: 'Footer',
    description: 'Site footer with links, branding, and copyright.',
    category: 'Navigation',
    siteCategories: ['Marketing', 'Editorial'],
    importName: 'Footer',
    tokenMapKey: 'footer',
    props: [],
  },
  {
    slug: 'mobile-nav',
    name: 'MobileNav',
    description: 'Mobile-optimized bottom navigation bar.',
    category: 'Navigation',
    siteCategories: ['All'],
    importName: 'MobileNav',
    tokenMapKey: 'mobilenav',
    props: [],
  },
  {
    slug: 'drawer-nav',
    name: 'DrawerNav',
    description: 'Slide-out navigation drawer for mobile.',
    category: 'Navigation',
    siteCategories: ['All'],
    importName: 'DrawerNav',
    tokenMapKey: 'drawernav',
    props: [
      { name: 'open', type: 'boolean', required: true, description: 'Controls visibility' },
      { name: 'onClose', type: '() => void', required: true, description: 'Close handler' },
    ],
  },

  // ─── Data Display ────────────────────────────────────────────
  {
    slug: 'datatable',
    name: 'DataTable',
    description: 'Full-featured data table with sorting, filtering, and pagination.',
    category: 'Data Display',
    siteCategories: ['Dashboard'],
    importName: 'DataTable',
    tokenMapKey: 'datatable',
    props: [
      { name: 'data', type: 'T[]', required: true, description: 'Table data array' },
      {
        name: 'columns',
        type: 'ColumnDef<T>[]',
        required: true,
        description: 'Column definitions',
      },
      { name: 'searchable', type: 'boolean', default: 'false', description: 'Enable search' },
      { name: 'sortable', type: 'boolean', default: 'true', description: 'Enable sorting' },
    ],
  },
  {
    slug: 'table',
    name: 'Table',
    description: 'Basic HTML table with Arcana styling.',
    category: 'Data Display',
    siteCategories: ['Dashboard'],
    importName: 'Table',
    tokenMapKey: 'table',
    props: [],
  },
  {
    slug: 'stat-card',
    name: 'StatCard',
    description: 'Metric card displaying a value with trend indicator.',
    category: 'Data Display',
    siteCategories: ['Dashboard'],
    importName: 'StatCard',
    variants: ['default', 'compact'],
    tokenMapKey: 'statcard',
    props: [
      { name: 'value', type: 'string | number', required: true, description: 'Metric value' },
      { name: 'label', type: 'string', required: true, description: 'Metric label' },
      {
        name: 'variant',
        type: "'default' | 'compact'",
        default: "'default'",
        description: 'Card style',
      },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Loading state' },
    ],
  },
  {
    slug: 'kpi-card',
    name: 'KPICard',
    description: 'KPI dashboard card with sparkline and trend.',
    category: 'Data Display',
    siteCategories: ['Dashboard'],
    importName: 'KPICard',
    tokenMapKey: 'kpicard',
    props: [
      { name: 'value', type: 'string | number', required: true, description: 'KPI value' },
      { name: 'label', type: 'string', required: true, description: 'KPI label' },
      { name: 'data', type: 'number[]', description: 'Sparkline data points' },
    ],
  },
  {
    slug: 'progress-bar',
    name: 'ProgressBar',
    description: 'Progress indicator with variants and animated fill.',
    category: 'Data Display',
    siteCategories: ['All'],
    importName: 'ProgressBar',
    variants: ['default', 'striped', 'animated'],
    sizes: ['sm', 'md', 'lg'],
    tokenMapKey: 'progressbar',
    props: [
      { name: 'value', type: 'number', required: true, description: 'Progress value (0-100)' },
      {
        name: 'variant',
        type: "'default' | 'striped' | 'animated'",
        default: "'default'",
        description: 'Visual style',
      },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Bar height' },
      {
        name: 'color',
        type: "'primary' | 'success' | 'warning' | 'error' | 'info'",
        default: "'primary'",
        description: 'Bar color',
      },
      {
        name: 'showValue',
        type: 'boolean',
        default: 'false',
        description: 'Show percentage label',
      },
    ],
  },
  {
    slug: 'stats-bar',
    name: 'StatsBar',
    description: 'Horizontal bar of key metrics.',
    category: 'Data Display',
    siteCategories: ['Dashboard', 'Marketing'],
    importName: 'StatsBar',
    tokenMapKey: 'statsbar',
    props: [],
  },

  // ─── Overlays ────────────────────────────────────────────────
  {
    slug: 'drawer',
    name: 'Drawer',
    description: 'Slide-out panel from the edge of the screen.',
    category: 'Overlays',
    siteCategories: ['All'],
    importName: 'Drawer',
    tokenMapKey: 'drawer',
    props: [
      { name: 'open', type: 'boolean', required: true, description: 'Controls visibility' },
      { name: 'onClose', type: '() => void', required: true, description: 'Close handler' },
      {
        name: 'side',
        type: "'left' | 'right'",
        default: "'right'",
        description: 'Slide direction',
      },
      { name: 'title', type: 'string', description: 'Drawer title' },
    ],
  },
  {
    slug: 'popover',
    name: 'Popover',
    description: 'Floating content panel anchored to a trigger.',
    category: 'Overlays',
    siteCategories: ['All'],
    importName: 'Popover',
    tokenMapKey: 'popover',
    props: [
      { name: 'trigger', type: 'ReactNode', required: true, description: 'Trigger element' },
      {
        name: 'placement',
        type: "'top' | 'bottom' | 'left' | 'right'",
        default: "'bottom'",
        description: 'Popover position',
      },
    ],
  },
  {
    slug: 'command-palette',
    name: 'CommandPalette',
    description: 'Keyboard-driven command search overlay.',
    category: 'Overlays',
    siteCategories: ['Dashboard'],
    importName: 'CommandPalette',
    tokenMapKey: 'commandpalette',
    props: [
      { name: 'open', type: 'boolean', required: true, description: 'Controls visibility' },
      { name: 'onClose', type: '() => void', required: true, description: 'Close handler' },
      { name: 'items', type: 'CommandItem[]', required: true, description: 'Command items' },
    ],
  },
  {
    slug: 'bottom-sheet',
    name: 'BottomSheet',
    description: 'Mobile-friendly bottom sheet overlay.',
    category: 'Overlays',
    siteCategories: ['All'],
    importName: 'BottomSheet',
    tokenMapKey: 'bottomsheet',
    props: [
      { name: 'open', type: 'boolean', required: true, description: 'Controls visibility' },
      { name: 'onClose', type: '() => void', required: true, description: 'Close handler' },
      { name: 'title', type: 'string', description: 'Sheet title' },
    ],
  },

  // ─── Layout ──────────────────────────────────────────────────
  {
    slug: 'divider',
    name: 'Divider',
    description: 'Visual separator between content sections.',
    category: 'Layout',
    siteCategories: ['All'],
    importName: 'Divider',
    tokenMapKey: 'divider',
    props: [
      {
        name: 'orientation',
        type: "'horizontal' | 'vertical'",
        default: "'horizontal'",
        description: 'Divider direction',
      },
    ],
  },
  {
    slug: 'spacer',
    name: 'Spacer',
    description: 'Flexible space element for layout gaps.',
    category: 'Layout',
    siteCategories: ['All'],
    importName: 'Spacer',
    tokenMapKey: 'spacer',
    props: [{ name: 'size', type: 'string', description: 'Space amount (token reference)' }],
  },

  // ─── Marketing ───────────────────────────────────────────────
  {
    slug: 'hero',
    name: 'Hero',
    description: 'Full-width hero section with headline, CTA, and media.',
    category: 'Marketing',
    siteCategories: ['Marketing'],
    importName: 'Hero',
    variants: ['centered', 'split', 'fullscreen'],
    tokenMapKey: 'hero',
    props: [
      { name: 'headline', type: 'string', required: true, description: 'Main headline' },
      { name: 'subheadline', type: 'string', description: 'Supporting text' },
      {
        name: 'variant',
        type: "'centered' | 'split' | 'fullscreen'",
        default: "'centered'",
        description: 'Layout variant',
      },
      { name: 'badge', type: 'string', description: 'Top badge text' },
    ],
  },
  {
    slug: 'feature-section',
    name: 'FeatureSection',
    description: 'Feature highlight with icon, title, and description.',
    category: 'Marketing',
    siteCategories: ['Marketing'],
    importName: 'FeatureSection',
    tokenMapKey: 'featuresection',
    props: [
      { name: 'title', type: 'string', required: true, description: 'Section title' },
      { name: 'description', type: 'string', description: 'Section description' },
    ],
  },
  {
    slug: 'testimonial',
    name: 'Testimonial',
    description: 'Customer testimonial card with quote and attribution.',
    category: 'Marketing',
    siteCategories: ['Marketing'],
    importName: 'Testimonial',
    tokenMapKey: 'testimonial',
    props: [
      { name: 'quote', type: 'string', required: true, description: 'Testimonial quote' },
      { name: 'author', type: 'string', required: true, description: 'Author name' },
      { name: 'role', type: 'string', description: 'Author role' },
    ],
  },
  {
    slug: 'pricing-card',
    name: 'PricingCard',
    description: 'Pricing tier card with features and CTA.',
    category: 'Marketing',
    siteCategories: ['Marketing'],
    importName: 'PricingCard',
    variants: ['default', 'compact'],
    tokenMapKey: 'pricingcard',
    props: [
      { name: 'name', type: 'string', required: true, description: 'Plan name' },
      { name: 'price', type: 'string | number', required: true, description: 'Plan price' },
      { name: 'period', type: 'string', description: 'Billing period' },
      { name: 'popular', type: 'boolean', default: 'false', description: 'Highlight as popular' },
    ],
  },
  {
    slug: 'cta',
    name: 'CTA',
    description: 'Call-to-action section with headline and buttons.',
    category: 'Marketing',
    siteCategories: ['Marketing'],
    importName: 'CTA',
    tokenMapKey: 'cta',
    props: [
      { name: 'headline', type: 'string', required: true, description: 'CTA headline' },
      { name: 'description', type: 'string', description: 'CTA description' },
    ],
  },
  {
    slug: 'timeline',
    name: 'Timeline',
    description: 'Vertical timeline of events or milestones.',
    category: 'Marketing',
    siteCategories: ['Marketing', 'Editorial'],
    importName: 'Timeline',
    tokenMapKey: 'timeline',
    props: [],
  },
  {
    slug: 'logo-cloud',
    name: 'LogoCloud',
    description: 'Row of brand logos (partner/client showcase).',
    category: 'Marketing',
    siteCategories: ['Marketing'],
    importName: 'LogoCloud',
    tokenMapKey: 'logocloud',
    props: [{ name: 'title', type: 'string', description: 'Section title' }],
  },

  // ─── E-commerce ──────────────────────────────────────────────
  {
    slug: 'product-card',
    name: 'ProductCard',
    description: 'E-commerce product card with image, price, and action.',
    category: 'E-commerce',
    siteCategories: ['E-commerce'],
    importName: 'ProductCard',
    tokenMapKey: 'productcard',
    props: [
      { name: 'name', type: 'string', required: true, description: 'Product name' },
      { name: 'price', type: 'number', required: true, description: 'Product price' },
      { name: 'image', type: 'string', description: 'Product image URL' },
    ],
  },
  {
    slug: 'cart-item',
    name: 'CartItem',
    description: 'Shopping cart line item with quantity controls.',
    category: 'E-commerce',
    siteCategories: ['E-commerce'],
    importName: 'CartItem',
    tokenMapKey: 'cartitem',
    props: [
      { name: 'name', type: 'string', required: true, description: 'Item name' },
      { name: 'price', type: 'number', required: true, description: 'Item price' },
      { name: 'quantity', type: 'number', required: true, description: 'Item quantity' },
    ],
  },
  {
    slug: 'quantity-selector',
    name: 'QuantitySelector',
    description: 'Numeric stepper for quantity selection.',
    category: 'E-commerce',
    siteCategories: ['E-commerce'],
    importName: 'QuantitySelector',
    tokenMapKey: 'quantityselector',
    props: [
      { name: 'value', type: 'number', required: true, description: 'Current value' },
      {
        name: 'onChange',
        type: '(value: number) => void',
        required: true,
        description: 'Change handler',
      },
      { name: 'min', type: 'number', default: '1', description: 'Minimum value' },
      { name: 'max', type: 'number', default: '99', description: 'Maximum value' },
    ],
  },
  {
    slug: 'price-display',
    name: 'PriceDisplay',
    description: 'Formatted price with currency and discount.',
    category: 'E-commerce',
    siteCategories: ['E-commerce'],
    importName: 'PriceDisplay',
    tokenMapKey: 'pricedisplay',
    props: [
      { name: 'price', type: 'number', required: true, description: 'Price amount' },
      { name: 'currency', type: 'string', default: "'USD'", description: 'Currency code' },
    ],
  },
  {
    slug: 'rating-stars',
    name: 'RatingStars',
    description: 'Star rating display and input.',
    category: 'E-commerce',
    siteCategories: ['E-commerce'],
    importName: 'RatingStars',
    tokenMapKey: 'ratingstars',
    props: [
      { name: 'value', type: 'number', required: true, description: 'Rating value (0-5)' },
      { name: 'onChange', type: '(value: number) => void', description: 'Rating change handler' },
    ],
  },

  // ─── Editorial ───────────────────────────────────────────────
  {
    slug: 'article-layout',
    name: 'ArticleLayout',
    description: 'Long-form article layout with typography optimizations.',
    category: 'Editorial',
    siteCategories: ['Editorial'],
    importName: 'ArticleLayout',
    tokenMapKey: 'articlelayout',
    props: [
      { name: 'title', type: 'string', required: true, description: 'Article title' },
      { name: 'author', type: 'string', description: 'Author name' },
      { name: 'date', type: 'string', description: 'Publication date' },
    ],
  },
  {
    slug: 'pull-quote',
    name: 'PullQuote',
    description: 'Highlighted editorial quote with attribution.',
    category: 'Editorial',
    siteCategories: ['Editorial'],
    importName: 'PullQuote',
    tokenMapKey: 'pullquote',
    props: [
      { name: 'quote', type: 'string', required: true, description: 'Quote text' },
      { name: 'attribution', type: 'string', description: 'Quote source' },
    ],
  },
  {
    slug: 'author-card',
    name: 'AuthorCard',
    description: 'Author bio card with avatar and social links.',
    category: 'Editorial',
    siteCategories: ['Editorial'],
    importName: 'AuthorCard',
    tokenMapKey: 'authorcard',
    props: [
      { name: 'name', type: 'string', required: true, description: 'Author name' },
      { name: 'bio', type: 'string', description: 'Author bio' },
      { name: 'avatar', type: 'string', description: 'Avatar URL' },
    ],
  },
  {
    slug: 'related-posts',
    name: 'RelatedPosts',
    description: 'Grid of related article cards.',
    category: 'Editorial',
    siteCategories: ['Editorial'],
    importName: 'RelatedPosts',
    tokenMapKey: 'relatedposts',
    props: [],
  },
  {
    slug: 'newsletter-signup',
    name: 'NewsletterSignup',
    description: 'Email newsletter subscription form.',
    category: 'Editorial',
    siteCategories: ['Editorial', 'Marketing'],
    importName: 'NewsletterSignup',
    tokenMapKey: 'newslettersignup',
    props: [
      { name: 'title', type: 'string', description: 'Form title' },
      { name: 'description', type: 'string', description: 'Form description' },
    ],
  },

  // ─── Utility ─────────────────────────────────────────────────
  {
    slug: 'scroll-area',
    name: 'ScrollArea',
    description: 'Custom scrollbar container.',
    category: 'Utility',
    siteCategories: ['All'],
    importName: 'ScrollArea',
    tokenMapKey: 'scrollarea',
    props: [
      {
        name: 'maxHeight',
        type: 'string | number',
        description: 'Maximum height before scrolling',
      },
    ],
  },
  {
    slug: 'collapsible',
    name: 'Collapsible',
    description: 'Toggle content visibility with animation.',
    category: 'Utility',
    siteCategories: ['All'],
    importName: 'Collapsible',
    tokenMapKey: 'collapsible',
    props: [
      { name: 'open', type: 'boolean', description: 'Controlled open state' },
      { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initially open' },
    ],
  },
  {
    slug: 'copy-button',
    name: 'CopyButton',
    description: 'Button that copies text to clipboard.',
    category: 'Utility',
    siteCategories: ['All'],
    importName: 'CopyButton',
    tokenMapKey: 'copybutton',
    props: [{ name: 'text', type: 'string', required: true, description: 'Text to copy' }],
  },
  {
    slug: 'keyboard-shortcut',
    name: 'KeyboardShortcut',
    description: 'Keyboard shortcut display (e.g. ⌘K).',
    category: 'Utility',
    siteCategories: ['All'],
    importName: 'KeyboardShortcut',
    tokenMapKey: 'keyboardshortcut',
    props: [
      { name: 'keys', type: 'string[]', required: true, description: 'Key names to display' },
    ],
  },
  {
    slug: 'empty-state',
    name: 'EmptyState',
    description: 'Placeholder for empty data views.',
    category: 'Feedback',
    siteCategories: ['All'],
    importName: 'EmptyState',
    tokenMapKey: 'emptystate',
    props: [
      { name: 'title', type: 'string', required: true, description: 'Empty state title' },
      { name: 'description', type: 'string', description: 'Description text' },
    ],
  },

  // ─── Media ───────────────────────────────────────────────────
  {
    slug: 'carousel',
    name: 'Carousel',
    description: 'Image/content carousel with navigation.',
    category: 'Media',
    siteCategories: ['All'],
    importName: 'Carousel',
    tokenMapKey: 'carousel',
    props: [
      { name: 'autoPlay', type: 'boolean', default: 'false', description: 'Auto-advance slides' },
      { name: 'interval', type: 'number', default: '5000', description: 'Auto-play interval (ms)' },
    ],
  },
  {
    slug: 'image',
    name: 'Image',
    description: 'Responsive image with loading state and fallback.',
    category: 'Media',
    siteCategories: ['All'],
    importName: 'Image',
    tokenMapKey: 'image',
    props: [
      { name: 'src', type: 'string', required: true, description: 'Image source URL' },
      { name: 'alt', type: 'string', required: true, description: 'Alt text' },
      { name: 'aspectRatio', type: 'string', description: 'Aspect ratio (e.g. 16/9)' },
    ],
  },

  // ─── Forms (compound) ───────────────────────────────────────
  {
    slug: 'date-picker',
    name: 'DatePicker',
    description: 'Calendar date picker with range support.',
    category: 'Forms',
    siteCategories: ['Dashboard'],
    importName: 'DatePicker',
    tokenMapKey: 'datepicker',
    props: [
      { name: 'value', type: 'Date', description: 'Selected date' },
      { name: 'onChange', type: '(date: Date) => void', description: 'Date change handler' },
      { name: 'label', type: 'string', description: 'Label text' },
    ],
  },
  {
    slug: 'file-upload',
    name: 'FileUpload',
    description: 'Drag-and-drop file upload with preview.',
    category: 'Forms',
    siteCategories: ['Dashboard'],
    importName: 'FileUpload',
    tokenMapKey: 'fileupload',
    props: [
      { name: 'accept', type: 'string', description: 'Accepted file types' },
      { name: 'multiple', type: 'boolean', default: 'false', description: 'Allow multiple files' },
      { name: 'maxSize', type: 'number', description: 'Max file size in bytes' },
    ],
  },
];

/** Get all unique categories */
export function getCategories(): ComponentCategory[] {
  const cats = new Set<ComponentCategory>();
  for (const c of COMPONENT_REGISTRY) cats.add(c.category);
  return Array.from(cats).sort();
}

/** Find a component by slug */
export function getComponentBySlug(slug: string): ComponentMeta | undefined {
  return COMPONENT_REGISTRY.find((c) => c.slug === slug);
}

/** Filter components by category */
export function getComponentsByCategory(category: ComponentCategory): ComponentMeta[] {
  return COMPONENT_REGISTRY.filter((c) => c.category === category);
}
