# Arcana UI — Quickstart

> Install two packages, import one CSS file, set one HTML attribute. Done.

This guide is the minimum-viable path to a themed Arcana UI app. It doubles
as the spec for `npx arcana-ui init` (the future CLI) and as the source of
truth for the test fixture at `examples/quickstart/`.

---

## 1. Install

Arcana ships as two npm packages: the CSS design tokens and the React
components. Both are currently published on the `beta` dist-tag.

```bash
npm install @arcana-ui/core@beta @arcana-ui/tokens@beta
# or
pnpm add @arcana-ui/core@beta @arcana-ui/tokens@beta
# or
yarn add @arcana-ui/core@beta @arcana-ui/tokens@beta
```

React 18 (or newer) is a peer dependency — the packages do not bring their
own copy.

---

## 2. Import the stylesheets

In your app entry file (`src/main.tsx`, `src/index.tsx`, `pages/_app.tsx`, etc.),
import the tokens first and the component stylesheet second. Order matters —
components reference variables that must exist by the time they render.

```tsx
// Design tokens: all 14 theme presets, ~2,600 CSS variables, scoped under
// [data-theme="..."] selectors.
import '@arcana-ui/tokens';

// Component styles: one stylesheet, ~190 kB, uses only variables from
// @arcana-ui/tokens. Safe to import once at the root.
import '@arcana-ui/core/styles';
```

Alternative explicit subpaths (all resolve to the same file):

```tsx
import '@arcana-ui/tokens/base';            // explicit
import '@arcana-ui/tokens/styles';          // alias added in beta.2
import '@arcana-ui/tokens/dist/arcana.css'; // direct path, added in beta.2
```

If you only need one theme instead of all 14, use a per-theme subpath:

```tsx
import '@arcana-ui/tokens/light';
import '@arcana-ui/tokens/midnight';
// ...any of: dark, terminal, retro98, glass, brutalist, corporate,
// startup, editorial, commerce, midnight, nature, neon, mono
```

---

## 3. Set the theme on `<html>`

Arcana themes switch via a single attribute on the root element. No
provider, no context plumbing required for the default theme.

```html
<html lang="en" data-theme="light" data-density="comfortable">
```

Values:

| Attribute       | Valid values                                                                                          |
|-----------------|-------------------------------------------------------------------------------------------------------|
| `data-theme`    | `light`, `dark`, `terminal`, `retro98`, `glass`, `brutalist`, `corporate`, `startup`, `editorial`, `commerce`, `midnight`, `nature`, `neon`, `mono` |
| `data-density`  | `compact`, `comfortable`, `spacious`                                                                   |

To switch at runtime, toggle the attribute directly:

```ts
document.documentElement.setAttribute('data-theme', 'midnight');
document.documentElement.setAttribute('data-density', 'compact');
```

Or use the `useTheme` hook, which persists the choice and respects the
user's system preference:

```tsx
import { useTheme } from '@arcana-ui/core';

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      Theme: {theme}
    </button>
  );
}
```

---

## 4. Render a component

```tsx
import { Button, Card, CardHeader, CardBody } from '@arcana-ui/core';

export function App() {
  return (
    <Card>
      <CardHeader>Welcome</CardHeader>
      <CardBody>
        <Button variant="primary">Get started</Button>
      </CardBody>
    </Card>
  );
}
```

That's it. No build-tool configuration, no PostCSS plugin, no Tailwind
config, no theme provider required.

---

## 5. Minimum boilerplate (Vite + React + TypeScript)

The runnable version of the snippets below lives in
[`examples/quickstart/`](../examples/quickstart/) and doubles as the
consumer test fixture for package audits.

**`index.html`**

```html
<!doctype html>
<html lang="en" data-theme="light" data-density="comfortable">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Arcana UI — Quickstart</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

**`src/main.tsx`**

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import '@arcana-ui/tokens';
import '@arcana-ui/core/styles';
import { App } from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

**`src/App.tsx`**

```tsx
import { Button, Card, CardHeader, CardBody, Stack } from '@arcana-ui/core';

export function App() {
  return (
    <Stack gap="lg" style={{ padding: '2rem' }}>
      <Card>
        <CardHeader>Hello from Arcana UI</CardHeader>
        <CardBody>
          <Button variant="primary">Click me</Button>
        </CardBody>
      </Card>
    </Stack>
  );
}
```

**`package.json`** (just the relevant bits)

```json
{
  "dependencies": {
    "@arcana-ui/core": "beta",
    "@arcana-ui/tokens": "beta",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  }
}
```

No `vite.config.ts` changes, no `tsconfig.json` changes, no extra Babel
plugins. The packages ship pre-built ESM + CJS + `.d.ts` files.

---

## 6. Server-side rendering

Both packages are SSR-safe: `require('@arcana-ui/core')` in a bare Node
process does not touch `window` or `document` at module load time. Hooks
that read from the DOM guard their side effects.

Next.js App Router: the component bundle is marked with a top-level
`"use client"` directive, so importing any component from a Server
Component automatically opts into client rendering. If you want to keep
a page as a Server Component, only import static things (types,
constants, utility functions).

---

## 7. What the CLI will automate

Once `npx arcana-ui init` ships, running it in an empty project will:

1. Add `@arcana-ui/core` and `@arcana-ui/tokens` to `dependencies` at the
   current beta dist-tag.
2. Insert the two `import` lines into the detected entry file
   (`src/main.tsx`, `src/index.tsx`, or `pages/_app.tsx`).
3. Write `data-theme="light" data-density="comfortable"` onto the
   project's `<html>` tag (`index.html`, `app/layout.tsx`, etc.).
4. Scaffold an optional `<App />` sample using `Button` + `Card`.

If you wire any of those steps by hand today, you will not need to
re-do them when the CLI lands — the final generated project matches
this document exactly.
