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
    message: 'fix: resolve Button size prop type alias in manifest generator',
    author: 'Sage',
    time: '2h ago',
    status: 'success',
  },
  {
    id: 'a2',
    message: 'feat: Forma ecommerce demo — luxury objects brand MVP',
    author: 'Sage',
    time: '4h ago',
    status: 'success',
  },
  {
    id: 'a3',
    message: 'feat: improve ComponentGallery with stats bar, richer cards, and audit table',
    author: 'Sage',
    time: '7h ago',
    status: 'success',
  },
  {
    id: 'a4',
    message: 'chore: sage component audit 2026-04-03',
    author: 'Sage',
    time: '8h ago',
    status: 'info',
  },
  {
    id: 'a5',
    message: 'fix(useTheme): correct localStorage key for theme persistence',
    author: 'Sage',
    time: '1d ago',
    status: 'success',
  },
  {
    id: 'a6',
    message: 'feat: add ScrollArea pointer events fix for touch devices',
    author: 'Sage',
    time: '2d ago',
    status: 'success',
  },
  {
    id: 'a7',
    message: 'chore: regenerate manifest.ai.json',
    author: 'Sage',
    time: '2d ago',
    status: 'info',
  },
  {
    id: 'a8',
    message: 'fix: Modal focus trap on iOS Safari',
    author: 'Sage',
    time: '3d ago',
    status: 'success',
  },
  {
    id: 'a9',
    message: 'feat: DataTable sortable columns',
    author: 'Sage',
    time: '3d ago',
    status: 'success',
  },
  {
    id: 'a10',
    message: 'docs: update CLAUDE.md current state',
    author: 'Sage',
    time: '4d ago',
    status: 'info',
  },
];
