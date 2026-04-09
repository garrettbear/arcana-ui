export interface ActivityEntry {
  id: string;
  message: string;
  author: string;
  time: string;
  status: 'success' | 'warning' | 'info';
}

export const activityData: ActivityEntry[] = [
  {
    id: 'a1',
    message: 'feat(core): add CommandPalette with fuzzy search',
    author: 'Sage',
    time: '2 days ago',
    status: 'success',
  },
  {
    id: 'a2',
    message: 'fix(tokens): fix glass preset backdrop-filter on Safari',
    author: 'Sage',
    time: '3 days ago',
    status: 'success',
  },
  {
    id: 'a3',
    message: 'feat(tokens): add 8 new presets (corporate, startup...)',
    author: 'Sage',
    time: '7 days ago',
    status: 'success',
  },
  {
    id: 'a4',
    message: 'chore: publish @arcana-ui/core@0.1.0-beta.2 to npm',
    author: 'Bear',
    time: '8 days ago',
    status: 'info',
  },
  {
    id: 'a5',
    message: 'feat(core): DataTable with sorting, filtering, pagination',
    author: 'Sage',
    time: '14 days ago',
    status: 'success',
  },
  {
    id: 'a6',
    message: 'test: add 5-breakpoint Playwright visual regression suite',
    author: 'Sage',
    time: '15 days ago',
    status: 'success',
  },
  {
    id: 'a7',
    message: 'feat(playground): D3 force-directed token relationship graph',
    author: 'Sage',
    time: '21 days ago',
    status: 'success',
  },
  {
    id: 'a8',
    message: 'feat(cli): add init, validate, add-theme commands',
    author: 'Sage',
    time: '22 days ago',
    status: 'success',
  },
  {
    id: 'a9',
    message: 'feat(core): 60+ components across 10 categories',
    author: 'Sage',
    time: '28 days ago',
    status: 'success',
  },
  {
    id: 'a10',
    message: 'fix(core): Button focus ring not visible in dark theme',
    author: 'Sage',
    time: '30 days ago',
    status: 'success',
  },
];
