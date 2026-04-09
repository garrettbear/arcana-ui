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
  // Keep MCP SDK external — installed as a dependency, not bundled
  external: ['@modelcontextprotocol/sdk'],
  banner: {
    js: '#!/usr/bin/env node',
  },
});
