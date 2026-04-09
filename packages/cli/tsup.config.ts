import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  target: 'node18',
  clean: true,
  sourcemap: false,
  minify: false,
  dts: false,
  shims: false,
  splitting: false,
  // Keep deps external. Bundling commander (a CJS package) into ESM
  // breaks its internal `require('events')` calls because esbuild's
  // dynamic-require shim is not allowed in ESM mode. `npx` will install
  // the runtime deps from package.json before invoking the binary.
  external: ['@clack/prompts', 'picocolors', 'commander'],
  banner: {
    js: '#!/usr/bin/env node',
  },
});
