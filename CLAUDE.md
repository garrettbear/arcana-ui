# Arcana UI — Docs Site

## Status: Build Passing ✓

The Fumadocs docs site builds successfully.
- fumadocs-core@15.8.5 / fumadocs-mdx@11.10.1 / fumadocs-ui@15.8.5 / next@15.5.12
- 26 MDX pages, all static-generated

## Running the Docs

```bash
pnpm --filter docs build   # production build
pnpm --filter docs dev     # dev server
```

## Key Implementation Notes

### `docs/source.config.ts`
Export the whole `DocsCollection` (not destructured) so fumadocs-mdx generates
a combined `_runtime.docs(...)` object with `.docs`, `.meta`, and `.toFumadocsSource()`:
```ts
export const docs = defineDocs({ dir: 'content/docs' })
```

### `docs/lib/source.ts`
`toFumadocsSource()` returns `{ files: () => array }` (lazy fn), but `loader()` needs
`{ files: array }`. Use `resolveFiles` directly:
```ts
import { resolveFiles } from 'fumadocs-mdx'
export const source = loader({
  baseUrl: '/docs',
  source: { files: resolveFiles({ docs: docs.docs, meta: docs.meta }) },
})
```

### `docs/app/docs/[[...slug]]/page.tsx`
Cast `page.data as any` to access MDX-specific fields (`body`, `toc`, `full`).

### `docs/app/api/search/route.ts`
Uses `createSearchAPI('simple', ...)` with manual page mapping (avoids orama schema issues
with the advanced search index format).
