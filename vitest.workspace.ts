import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'packages/core/vitest.config.ts',
  'playground/vitest.config.ts',
  'api/vitest.config.ts',
]);
