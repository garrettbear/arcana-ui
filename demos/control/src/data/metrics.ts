/** 30-day npm download data (daily) — realistic growth with organic variance */
export const downloadData: { day: number; downloads: number }[] = (() => {
  const seed = [
    128, 142, 135, 156, 148, 171, 163, 184, 177, 195, 209, 198, 224, 218, 241, 258, 247, 271, 264,
    289, 303, 318, 334, 349, 362, 378, 401, 421, 438, 462,
  ];
  return seed.map((d, i) => ({ day: i + 1, downloads: d }));
})();

export const totalDownloads30d = downloadData.reduce((s, d) => s + d.downloads, 0);

/** WCAG pass rates by category */
export const wcagData = [
  { category: 'Navigation', score: 97 },
  { category: 'Forms', score: 96 },
  { category: 'Data Display', score: 96 },
  { category: 'Overlays', score: 95 },
  { category: 'Layout', score: 100 },
  { category: 'Media', score: 95 },
  { category: 'Feedback', score: 99 },
  { category: 'E-commerce', score: 96 },
  { category: 'Editorial', score: 96 },
  { category: 'Utility', score: 100 },
];

/** Bundle size by category (kB, average per component) */
export const bundleData = [
  { category: 'Navigation', avgKB: 6.4, totalKB: 51.2 },
  { category: 'Forms', avgKB: 6.1, totalKB: 85.4 },
  { category: 'Data Display', avgKB: 6.6, totalKB: 46.2 },
  { category: 'Overlays', avgKB: 6.8, totalKB: 40.8 },
  { category: 'Layout', avgKB: 2.5, totalKB: 22.5 },
  { category: 'Media', avgKB: 6.3, totalKB: 25.2 },
  { category: 'Feedback', avgKB: 3.3, totalKB: 16.7 },
  { category: 'E-commerce', avgKB: 4.1, totalKB: 20.4 },
  { category: 'Editorial', avgKB: 3.8, totalKB: 11.5 },
  { category: 'Utility', avgKB: 1.9, totalKB: 3.8 },
];

/** Accessibility check results by criterion */
export const a11yChecks = [
  { criterion: 'Color contrast (AA)', pass: 63, total: 63 },
  { criterion: 'Keyboard navigation', pass: 62, total: 63 },
  { criterion: 'ARIA attributes', pass: 60, total: 63 },
  { criterion: 'Focus indicators', pass: 63, total: 63 },
  { criterion: 'Touch targets (44px)', pass: 58, total: 63 },
  { criterion: 'Screen reader labels', pass: 61, total: 63 },
];
