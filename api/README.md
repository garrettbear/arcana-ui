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

`meta.cached` is `true` when the response was served from the Supabase semantic cache. `false` on a fresh Anthropic call. Absent on deployments where Supabase is not configured. Responses also carry an `X-Cache: HIT | MISS` header for infrastructure-level observability, and `Cache-Control: no-store` is set on BYOK responses since those bypass the cache entirely.

Runtime: Vercel Edge. Shared-key requests are gated by three independent checks (all bypassed for BYOK requests that pass `X-User-API-Key`):

- Origin allowlist. The `Origin` header must be `arcana-ui.com`, a `.arcana-ui.com` subdomain, `localhost`, `127.0.0.1`, or a team preview subdomain under `.garrett-whistens-projects.vercel.app`. Anything else (including missing origin, third-party Vercel apps, and raw `curl`) returns `403 forbidden_origin`. CORS alone cannot block non-browser clients, so this is enforced server-side.
- Per-IP limit of 5 requests per minute on the shared key. Returns `429 rate_limited` with `scope: "ip"` and a `Retry-After` header.
- Global ceiling of 60 shared-key requests per minute per edge instance across all IPs. Caps total Anthropic spend even under distributed abuse. Returns `429 rate_limited` with `scope: "global"`.

Cost controls:

- Default model is Claude Haiku 4.5 (~4x cheaper than Sonnet). Pass `"model": "sonnet"` to opt into Sonnet.
- Anthropic prompt caching is enabled on the system prompt (5-minute ephemeral cache). A burst of requests reuses the cached system prompt at ~10% of normal input cost.
- `max_tokens` is 2500, sized to fit a complete theme JSON with a small buffer.
- Semantic cache (Supabase `theme_cache` table) keyed on SHA-256 of the normalized `{description, siteType, density, count, model}` tuple, stored as `<modelShort>:<hash16>`. Description is lowercased and internal whitespace is collapsed so cosmetic edits still hit the same entry. 7-day TTL via an absolute `expires_at` column that the read path filters in SQL. Cache hits return with `meta.cached = true` and `X-Cache: HIT`, and skip Anthropic entirely. BYOK requests bypass the cache on both read and write paths.

## Environment

| Var | Where | Required | Notes |
| --- | --- | --- | --- |
| `ANTHROPIC_API_KEY` | Vercel project env (all envs) | Yes | Read server-side only. Never prefix with `VITE_`. |
| `SUPABASE_URL` | Vercel project env (all envs) | No | Project URL from the shared arcana-ops-prod Supabase project. If absent, the semantic cache layer is a no-op and every request hits Anthropic. |
| `SUPABASE_SERVICE_ROLE_KEY` | Vercel project env (all envs) | No | Service role key; never exposed to the browser. Same source as `SUPABASE_URL`. |

### Setting up Supabase

1. Provision (or reuse) a project on the shared arcana-ops Supabase org. The playground cache lives alongside arcana-ops data in `arcana-ops-prod`.
2. Run the prerequisite SQL from `KV_TO_SUPABASE_KICKOFF.md` to create the `theme_cache` table plus the `increment_theme_cache_hit` RPC.
3. Copy the project URL and service role key from Project Settings → API into the Vercel project env as `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. Attach to Production, Preview, and Development.
4. Pull the updated env down locally: `vercel env pull .env.local` from the repo root. `vercel dev` will now read and write the real cache.
5. To bust the entire cache after a prompt or schema change, bump the model-short prefix in `buildCacheKey` (currently `haiku` / `sonnet`) or truncate the `theme_cache` table directly.

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
