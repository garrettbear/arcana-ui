# Arcana UI — Current Task: Fix Fumadocs Build

## Context
- Fumadocs docs site exists in /docs with full content (26 MDX pages, layouts, search API)
- Dependencies: fumadocs-core@15.8.5, fumadocs-mdx@11.10.1, fumadocs-ui@15.8.5, next@15.5.12
- The docs site does NOT build due to Fumadocs v15 API breaking changes

## Build Errors

### Error 1: Type error in page.tsx
```
./app/docs/[[...slug]]/page.tsx:21:25
Type error: Property 'body' does not exist on type 'PageData & BaseCollectionEntry'.
```
The page template accesses `page.data.body`, `page.data.toc`, `page.data.full` — but the TypeScript types from fumadocs-core's `loader()` don't expose these. The data IS there at runtime (from fumadocs-mdx), the types just don't flow through.

### Error 2: Type error in lib/source.ts
```
./lib/source.ts:7:27
Type error: Argument of type '{ docs: DocOut<...>[]; meta: MetaOut<...>[]; toFumadocsSource: () => Source<...>; }' 
is not assignable to parameter of type '(PageData & BaseCollectionEntry)[]'.
```
The `createMDXSource(docs)` call from fumadocs-mdx no longer works with fumadocs-mdx v11. The `docs` object from `@/.source` now has a `.toFumadocsSource()` method that should be used instead.

### Error 3: Runtime error in search route
```
TypeError: a.map is not a function
[Error: Failed to collect page data for /api/search]
```
The search API route `createFromSource(source)` has a runtime error — something about the source data not being iterable.

## What To Do

1. Fix `lib/source.ts` — use `docs.toFumadocsSource()` instead of `createMDXSource(docs)`:
```ts
import { docs } from '@/.source'
import { loader } from 'fumadocs-core/source'

export const source = loader({
  baseUrl: '/docs',
  source: docs.toFumadocsSource(),
})
```

2. Fix `app/docs/[[...slug]]/page.tsx` — cast `page.data` as `any` for the MDX-specific properties (body, toc, full) since TypeScript can't infer them through the loader:
```ts
const data = page.data as any
const MDX = data.body
// Use data.toc, data.full, data.title, data.description
```

3. Fix `app/api/search/route.ts` — check if `createFromSource` API changed in fumadocs-core v15. Look at fumadocs docs at https://fumadocs.dev/docs/headless/search for the current API. May need to use a different search setup.

4. Run `pnpm --filter docs build` and fix any remaining errors.

5. If the search route keeps failing, you can temporarily remove it to get the build passing, then fix it properly.

## After Build Passes

- Run `pnpm --filter docs dev` to verify pages render
- Commit all docs changes
- Push to main

## Quality Bar
- `pnpm --filter docs build` must pass
- Commit and push when done

When completely finished, run:
openclaw system event --text "Done: Fumadocs build fixed and docs site working for Arcana" --mode now
