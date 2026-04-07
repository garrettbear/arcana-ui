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
  // Bundle dependencies so consumers get one small file with no extra
  // node_modules hop when running via `npx arcana-ui`.
  noExternal: ['@clack/prompts', 'picocolors', 'commander'],
  banner: {
    js: '#!/usr/bin/env node',
  },
});
