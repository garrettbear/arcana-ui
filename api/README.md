# Playground API

Vercel serverless/edge functions that power playground features that cannot run in the browser (primarily because they need a secret API key).

## Functions

### `POST /api/generate-theme`

Proxies to the Anthropic API to generate an Arcana theme preset from a brand description.

Request:

```json
{
  "description": "fintech dashboard, navy and gold, professional",
  "siteType": "dashboard",
  "density": "normal",
  "count": 3,
  "model": "haiku"
}
```

Optional headers:

| Header | Purpose |
| --- | --- |
| `X-User-API-Key` | Bring-your-own-key. When present, this key is used instead of the server's, and the per-IP rate limit is bypassed. Stored client-side in localStorage, never logged server-side. |

Response:

```json
{
  "themes": [
    {
      "name": "ironclad",
      "description": "...",
      "primitive": { "color": { ... }, "font": { ... }, "radius": { ... } },
      "semantic":  { "color": { ... } },
      "component": {}
    }
  ],
  "meta": {
    "model": "claude-haiku-4-5-20251001",
    "byok": false,
    "count": 3,
    "cached": false
  }
}
```

`meta.cached` is `true` when the response was served from the Vercel KV semantic cache. `false` on a fresh Anthropic call. Absent on deployments where KV is not configured.

Runtime: Vercel Edge. Shared-key requests are gated by three independent checks (all bypassed for BYOK requests that pass `X-User-API-Key`):

- Origin allowlist. The `Origin` header must be `arcana-ui.com`, a `.arcana-ui.com` subdomain, `localhost`, `127.0.0.1`, or a team preview subdomain under `.garrett-whistens-projects.vercel.app`. Anything else (including missing origin, third-party Vercel apps, and raw `curl`) returns `403 forbidden_origin`. CORS alone cannot block non-browser clients, so this is enforced server-side.
- Per-IP limit of 5 requests per minute on the shared key. Returns `429 rate_limited` with `scope: "ip"` and a `Retry-After` header.
- Global ceiling of 60 shared-key requests per minute per edge instance across all IPs. Caps total Anthropic spend even under distributed abuse. Returns `429 rate_limited` with `scope: "global"`.

Cost controls:

- Default model is Claude Haiku 4.5 (~4x cheaper than Sonnet). Pass `"model": "sonnet"` to opt into Sonnet.
- Anthropic prompt caching is enabled on the system prompt (5-minute ephemeral cache). A burst of requests reuses the cached system prompt at ~10% of normal input cost.
- `max_tokens` is 2500, sized to fit a complete theme JSON with a small buffer.
- Semantic cache (Vercel KV) keyed on SHA-256 of the normalized `{description, siteType, density, count, model}` tuple. Description is lowercased and internal whitespace is collapsed so cosmetic edits still hit the same entry. 7-day TTL. Cache hits return with `meta.cached = true` and skip Anthropic entirely.

## Environment

| Var | Where | Required | Notes |
| --- | --- | --- | --- |
| `ANTHROPIC_API_KEY` | Vercel project env (all envs) | Yes | Read server-side only. Never prefix with `VITE_`. |
| `KV_REST_API_URL` | Vercel project env (all envs) | No | Provided automatically when you connect a Vercel KV store. If absent, the semantic cache layer is a no-op and every request hits Anthropic. |
| `KV_REST_API_TOKEN` | Vercel project env (all envs) | No | Same source as `KV_REST_API_URL`. |

### Setting up KV

1. In the Vercel dashboard, open the Arcana project → Storage → Create Database → KV.
2. Name it something recognizable (`arcana-theme-cache` is fine). Attach it to Production, Preview, and Development.
3. Vercel will inject `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `KV_REST_API_READ_ONLY_TOKEN`, and `KV_URL` into the environment. Only the first two are used here.
4. Pull the updated env down locally: `vercel env pull .env.local` from the repo root. `vercel dev` will now hit the real KV instance.
5. To bust the entire cache after a prompt or schema change, bump `CACHE_KEY_PREFIX` in `generate-theme.ts` (currently `theme:v1:`).

## Local development

```bash
# From the repo root after `vercel link`
vercel env pull .env.local

# Run the playground with the function locally
vercel dev
```

`vercel dev` serves both the Vite app and the `api/` functions on a single origin, matching production routing. The Vercel project's Root Directory is the repo root, so functions live in `./api/` (not `./playground/api/`).

## Notes for future functions

- Put one function per file under `./api/` at the repo root. Vercel routes them at `/api/<filename>`.
- Prefer edge runtime (`export const config = { runtime: 'edge' }`) unless the code needs a Node-only API.
- CORS: reuse the `isAllowedOrigin` helper pattern from `generate-theme.ts`.
- Rate limit: the in-memory Map approach is good enough for beta. Move to Upstash/KV if we see sustained traffic.
