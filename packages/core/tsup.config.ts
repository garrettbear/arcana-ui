import { defineConfig } from 'tsup';

// NOTE on tree-shaking: we ship a single pre-bundled ESM entry. Because
// every component lives in one file, consumer bundlers (Vite/Rollup)
// cannot currently tree-shake unused components — a Button-only import
// produces nearly the same bundle size as an 8-component import. See
// docs/KNOWN_ISSUES.md. The proper fix is per-component entry points,
// which will land in a follow-up beta.
//
// We keep splitting=false so the "use client" directive banner stays
// intact at the top of the bundle; turning on splitting with a single
// entry causes Rollup to strip the directive and break Next.js RSC.
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  injectStyle: false,
  esbuildOptions(options) {
    options.banner = {
      js: '"use client"',
    };
  },
});
