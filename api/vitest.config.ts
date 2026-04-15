import { defineConfig } from 'vitest/config';

// Edge function tests. The api/ directory only ships one file today; we
// pin the cache-key derivation here because the hash scheme is a public
// contract (changing it silently invalidates every existing cache entry).
export default defineConfig({
  test: {
    name: 'api',
    include: ['*.test.ts'],
    environment: 'node',
  },
});
