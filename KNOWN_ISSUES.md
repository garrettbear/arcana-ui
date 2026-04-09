# Known Issues

> Issues known to the maintainers at the time of each beta. Tracked here so
> consumer-facing expectations stay honest. Each entry lists impact, who is
> affected, and the planned resolution.

---

## `@arcana-ui/core@0.1.0-beta.2`

### 1. Tree-shaking does not eliminate unused components

**Impact:** A consumer bundle that imports only `<Button>` ships the same
~278 kB minified / ~82 kB gzipped JavaScript payload as a bundle that
imports 8 components. The full component graph is inlined regardless of
what is used.

**Who is affected:** Any consumer using a tree-shaking bundler (Vite,
Rollup, webpack, esbuild, Parcel). Gzipped size is still reasonable for
design systems (compare Chakra, MUI), but the headroom to pay for only
what you use is not there yet.

**Root cause:** `packages/core` is built with tsup in single-entry mode
(`splitting: false`) because enabling code splitting with a single entry
causes Rollup to strip the top-level `"use client"` directive that
Next.js App Router consumers rely on. With one flat bundle, consumer
bundlers treat the module as an all-or-nothing side-effect unit even
though `sideEffects: ["*.css"]` is set correctly.

**Workaround:** None at the consumer side. If you need a smaller bundle
right now, only import `@arcana-ui/core/styles` selectively and skip the
components you don't use — the JS savings are small but the CSS savings
are real.

**Planned fix:** Per-component entry points in `tsup.config.ts` so the
published package has one ESM file per component, each with its own
`"use client"` directive. Targeted for `0.1.0-beta.3`. Tracked as a
follow-up to the beta.2 audit PR.

---

### 2. `Video` component is missing

**Impact:** The public roadmap lists a `Video` component under Media;
it is not yet implemented, not exported, and not on npm. Importing it
from `@arcana-ui/core` will throw a runtime error and fail TypeScript.

**Who is affected:** Anyone following the roadmap who expects Media
parity with `Image`, `Avatar`, `Carousel`.

**Planned fix:** Scheduled alongside the component gallery expansion
in Phase 5. Use a native `<video>` element for now — Arcana's tokens
(radius, shadow, spacing) work fine on it.

---

### 3. `docs/*` and `examples/quickstart/` Vite config warnings on older Node

**Impact:** Vite 6 requires Node 18.17+ (Node 20 LTS recommended). On
Node 18.0–18.16, `@arcana-ui/example-quickstart` scripts will warn or
fail to resolve modules.

**Who is affected:** Contributors running the example on outdated Node.

**Workaround:** `nvm use 20` or upgrade to Node 18.17+.

---

## `@arcana-ui/tokens@0.1.0-beta.2`

### 1. Unreferenced primitive warnings during build

**Impact:** `pnpm build` inside `packages/tokens` emits ~20 warnings of
the form `⚠ Unreferenced primitive: primitive.zIndex.modal`. These are
not errors — the tokens exist in the JSON source but no semantic token
currently maps to them. The emitted CSS is correct.

**Planned fix:** Either wire these primitives into a semantic layer or
delete the unused entries. Tracked as a token hygiene pass in Sprint 2.

---

## General

### 1. `useTheme` test suite jsdom environment

**Impact:** 16 tests in `packages/core/src/hooks/useTheme.test.tsx`
fail with `localStorage.clear is not a function`. These failures are
isolated to the test environment; the hook itself works in real
browsers.

**Planned fix:** Update the vitest jsdom environment config so
`localStorage` is fully mocked. Tracked as maintenance work.
