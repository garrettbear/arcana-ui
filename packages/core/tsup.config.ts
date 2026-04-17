import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { type Options, defineConfig } from 'tsup';

// CSS Modules plugin — fix for issue #119.
//
// tsup 8.x registers an internal `onLoad({ filter: /\.css$/ })` handler
// (postcssPlugin in tsup/dist/index.js). Its filter is not namespace-scoped,
// so it intercepts every `.css`-suffixed load call in every namespace and
// forwards it through `loader: "css"` — which gives an ES module with no
// default export, producing the `var Component_default = {};` that every
// component bundled with in 0.1.0.
//
// Because tsup registers that plugin before user-supplied `esbuildPlugins`,
// we cannot simply beat it to onLoad. Instead we:
//   1. onResolve `.module.css` imports and rewrite the path to end in
//      `?arcana-css-module` — a suffix tsup's `/\.css$/` filter cannot
//      match — then tag it with our own `arcana-css-modules` namespace.
//   2. onLoad in that namespace reads the real file, hashes every class
//      selector to `<File>_<name>_<hash>`, and emits a JS module that
//      side-effect-imports a sibling virtual sheet and default-exports
//      the original-to-hashed name map.
//   3. onResolve the sibling sheet and tag it with
//      `arcana-css-module-sheet`. The sheet path ends in
//      `?arcana-css-module-sheet` so tsup's filter still can't steal it.
//   4. onLoad the sheet with `loader: "css"` — esbuild then bundles the
//      rewritten CSS into dist/index.css alongside the plain stylesheets.
//
// Every `<ComponentName>_<className>_<hash>` selector in dist/index.css
// now has a corresponding entry in the default export of the JS module
// that the component file imported as `styles`.
// biome-ignore lint/suspicious/noExplicitAny: esbuild's plugin build object is typed by esbuild itself
const cssModulesPlugin: any = {
  name: 'arcana-css-modules',
  // biome-ignore lint/suspicious/noExplicitAny: see above
  setup(build: any) {
    const MODULE_SUFFIX = '?arcana-css-module';
    const SHEET_SUFFIX = '?arcana-css-module-sheet';
    const sheetContents = new Map<string, string>();

    build.onResolve(
      { filter: /\.module\.css$/ },
      // biome-ignore lint/suspicious/noExplicitAny: esbuild plugin args
      (args: any) => {
        const absolute = path.isAbsolute(args.path)
          ? args.path
          : path.resolve(args.resolveDir, args.path);
        return {
          path: absolute + MODULE_SUFFIX,
          namespace: 'arcana-css-modules',
        };
      },
    );

    build.onLoad(
      { filter: /\?arcana-css-module$/, namespace: 'arcana-css-modules' },
      // biome-ignore lint/suspicious/noExplicitAny: esbuild plugin args
      async (args: any) => {
        const realPath = args.path.slice(0, -MODULE_SUFFIX.length);
        const source = await fs.promises.readFile(realPath, 'utf8');

        const classNames = new Set<string>();
        source.replace(/\.(-?[_a-zA-Z][\w-]*)/g, (match, name: string) => {
          classNames.add(name);
          return match;
        });

        const relative = path.relative(process.cwd(), realPath);
        const hash = crypto.createHash('sha256').update(relative).digest('hex').slice(0, 5);
        const base = path.basename(realPath, '.module.css');

        const mapping: Record<string, string> = {};
        let rewritten = source;
        for (const name of classNames) {
          const scoped = `${base}_${name}_${hash}`;
          mapping[name] = scoped;
          const escaped = name.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
          rewritten = rewritten.replace(new RegExp(`\\.${escaped}(?![\\w-])`, 'g'), `.${scoped}`);
        }

        const sheetPath = realPath + SHEET_SUFFIX;
        sheetContents.set(sheetPath, rewritten);

        return {
          contents: `import ${JSON.stringify(sheetPath)};\nexport default ${JSON.stringify(mapping)};\n`,
          loader: 'js',
          resolveDir: path.dirname(realPath),
        };
      },
    );

    build.onResolve(
      { filter: /\?arcana-css-module-sheet$/ },
      // biome-ignore lint/suspicious/noExplicitAny: esbuild plugin args
      (args: any) => ({
        path: args.path,
        namespace: 'arcana-css-module-sheet',
      }),
    );

    build.onLoad(
      { filter: /.*/, namespace: 'arcana-css-module-sheet' },
      // biome-ignore lint/suspicious/noExplicitAny: esbuild plugin args
      (args: any) => {
        const css = sheetContents.get(args.path) ?? '';
        const origin = args.path.slice(0, -SHEET_SUFFIX.length);
        return {
          contents: css,
          loader: 'css',
          resolveDir: path.dirname(origin),
        };
      },
    );
  },
};

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
// Copy manifest.ai.json from the repo root into dist/ so consumers and AI
// agents can read it at `@arcana-ui/core/dist/manifest.ai.json` without
// having to clone the full repo. Only a best-effort copy — if the root
// manifest is missing (fresh checkout, CI order), the build still succeeds.
async function copyManifest(): Promise<void> {
  // tsup runs with cwd = packages/core, so resolve the monorepo root relative to it.
  const src = path.resolve(process.cwd(), '../../manifest.ai.json');
  const dest = path.resolve(process.cwd(), 'dist/manifest.ai.json');
  try {
    await fs.promises.copyFile(src, dest);
  } catch (err) {
    console.warn(`[tsup] could not copy manifest.ai.json to dist: ${(err as Error).message}`);
  }
}

const config: Options = {
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
  injectStyle: false,
  esbuildPlugins: [cssModulesPlugin],
  esbuildOptions(options) {
    options.banner = {
      js: '"use client"',
    };
  },
  async onSuccess() {
    await copyManifest();
  },
};

export default defineConfig(config);
