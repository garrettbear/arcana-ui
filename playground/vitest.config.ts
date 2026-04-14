import { defineConfig } from 'vitest/config';

// Minimal vitest config for the playground. Only the utils currently have
// unit tests; add `environment: 'jsdom'` and a setup file if we ever need
// to test components that touch the DOM.
export default defineConfig({
  test: {
    name: 'playground',
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    environment: 'node',
  },
});
