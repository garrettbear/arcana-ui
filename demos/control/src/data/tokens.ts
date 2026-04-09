export interface TokenEntry {
  name: string;
  category: string;
  themes: string;
  description: string;
}

export const semanticTokens: TokenEntry[] = [
  {
    name: '--color-action-primary',
    category: 'Color',
    themes: 'All 14',
    description: 'Primary action color (buttons, links, focus rings)',
  },
  { name: '--color-bg-page', category: 'Color', themes: 'All 14', description: 'Page background' },
  {
    name: '--color-bg-surface',
    category: 'Color',
    themes: 'All 14',
    description: 'Surface background (cards, panels)',
  },
  {
    name: '--color-fg-primary',
    category: 'Color',
    themes: 'All 14',
    description: 'Primary text color',
  },
  {
    name: '--color-fg-secondary',
    category: 'Color',
    themes: 'All 14',
    description: 'Secondary/muted text color',
  },
  {
    name: '--color-border-default',
    category: 'Color',
    themes: 'All 14',
    description: 'Default border color',
  },
  { name: '--radius-md', category: 'Shape', themes: 'All 14', description: 'Medium border radius' },
  { name: '--radius-lg', category: 'Shape', themes: 'All 14', description: 'Large border radius' },
  {
    name: '--shadow-md',
    category: 'Elevation',
    themes: 'All 14',
    description: 'Medium box shadow',
  },
  { name: '--shadow-lg', category: 'Elevation', themes: 'All 14', description: 'Large box shadow' },
  {
    name: '--spacing-4',
    category: 'Spacing',
    themes: 'All 14',
    description: 'Base spacing unit (16px)',
  },
  { name: '--spacing-6', category: 'Spacing', themes: 'All 14', description: '24px spacing' },
  {
    name: '--font-size-base',
    category: 'Typography',
    themes: 'All 14',
    description: 'Base font size (16px)',
  },
  {
    name: '--font-size-sm',
    category: 'Typography',
    themes: 'All 14',
    description: 'Small font size (14px)',
  },
  {
    name: '--line-height-normal',
    category: 'Typography',
    themes: 'All 14',
    description: 'Default line height',
  },
  {
    name: '--duration-fast',
    category: 'Motion',
    themes: 'All 14',
    description: 'Fast transition duration (150ms)',
  },
  {
    name: '--ease-default',
    category: 'Motion',
    themes: 'All 14',
    description: 'Default easing function',
  },
];

export const themeList = [
  { name: 'Light', colors: ['#FFFFFF', '#F4F4F5', '#3B82F6', '#18181B', '#71717A'] },
  { name: 'Dark', colors: ['#09090B', '#18181B', '#3B82F6', '#FAFAFA', '#A1A1AA'] },
  { name: 'Terminal', colors: ['#0A0A0A', '#111111', '#00FF41', '#00FF41', '#00CC33'] },
  { name: 'Retro98', colors: ['#C0C0C0', '#008080', '#000080', '#000000', '#808080'] },
  { name: 'Glass', colors: ['#F8FAFC', '#FFFFFF80', '#6366F1', '#1E293B', '#64748B'] },
  { name: 'Brutalist', colors: ['#FFFFFF', '#000000', '#FF0000', '#000000', '#666666'] },
  { name: 'Corporate', colors: ['#FAFBFC', '#FFFFFF', '#2563EB', '#111827', '#6B7280'] },
  { name: 'Startup', colors: ['#FAFAFA', '#FFFFFF', '#8B5CF6', '#18181B', '#737373'] },
  { name: 'Editorial', colors: ['#FAF9F6', '#FFFFFF', '#B45309', '#1C1917', '#78716C'] },
  { name: 'Commerce', colors: ['#FAFAF9', '#FFFFFF', '#059669', '#171717', '#737373'] },
  { name: 'Midnight', colors: ['#0C0A1A', '#14112A', '#C9A84C', '#E8E4D9', '#8B8574'] },
  { name: 'Nature', colors: ['#FEFDF8', '#FFFFFF', '#059669', '#1A2E1A', '#5C7C5C'] },
  { name: 'Neon', colors: ['#0A0A0F', '#12121A', '#FF00FF', '#F0F0FF', '#8888AA'] },
  { name: 'Mono', colors: ['#FAFAFA', '#FFFFFF', '#404040', '#171717', '#737373'] },
];

export const tokenStats = {
  primitives: 186,
  semantic: 94,
  component: 312,
  themes: 14,
};

export const tokenTimeline = [
  {
    version: 'v0.0.1',
    date: '2026-03-01',
    description: 'Initial token system — 6 presets, ~195 tokens per theme',
  },
  {
    version: 'v0.0.2',
    date: '2026-03-08',
    description: 'Full color system — 16-hue palettes, typography, spacing scale',
  },
  {
    version: 'v0.0.3',
    date: '2026-03-15',
    description: 'Elevation, motion, border/shape tokens — 2,600+ CSS variables',
  },
  {
    version: 'v0.1.0-beta.1',
    date: '2026-03-23',
    description: 'Published to npm — 14 presets, component token layer',
  },
];
