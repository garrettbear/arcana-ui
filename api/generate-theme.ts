/**
 * Vercel Edge Function: POST /api/generate-theme
 *
 * Accepts a brand description, returns a generated Arcana UI theme JSON.
 * The Anthropic API key is read from the ANTHROPIC_API_KEY env var (server-side only).
 *
 * Request:
 *   POST /api/generate-theme
 *   Content-Type: application/json
 *   {
 *     "description": "fintech dashboard, navy and gold, professional",
 *     "siteType": "dashboard",        // optional
 *     "density": "normal",            // optional: compact | normal | comfortable
 *     "count": 1                      // optional: 1-3 theme variants, default 1
 *   }
 *
 * Response:
 *   200 { "themes": [ { name, description, primitive, semantic, component } ],
 *         "meta": { model, byok, count, cached } }
 *   4xx/5xx { "error": "...", "code": "billing_error" | "authentication_error" |
 *             "overloaded_error" | "rate_limit_error" | "invalid_request_error" |
 *             "api_error" | null, "detail"?: "..." }
 *
 * Error shape: every non-2xx response carries `code`. When the failure was
 * upstream from Anthropic the edge function parses Anthropic's JSON error
 * envelope, copies `error.type` to `code`, and forwards Anthropic's HTTP
 * status unchanged. When the failure was produced locally (validation,
 * rate limit, forbidden origin, etc.) `code` is `null` and the client
 * switches on `error` or the HTTP status instead.
 *
 * Semantic cache: results are keyed on a SHA-256 hash of the normalized
 * { description, siteType, density, count, model } tuple and persisted in
 * the Supabase `theme_cache` table for 7 days. A cache hit returns with
 * `meta.cached = true` and bypasses the Anthropic call entirely (zero API
 * cost). Supabase is optional: when SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY
 * is missing (local dev without `vercel env pull`), the cache layer is
 * skipped silently and every request calls Anthropic.
 */

import { type SupabaseClient, createClient } from '@supabase/supabase-js';

export const config = {
  runtime: 'edge',
};

// --- Constants -----------------------------------------------------------

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';
const SONNET_MODEL = 'claude-sonnet-4-6';
const MAX_TOKENS = 2500;

const MAX_DESCRIPTION_LEN = 500;
const MAX_COUNT = 3;

// Simple in-memory rate limit per edge instance. Not perfect, but prevents
// trivial abuse. For production-grade limiting, move to Upstash/KV.
const RATE_LIMIT_WINDOW_MS = 60_000;
// Per-IP ceiling for shared-key requests. BYOK bypasses this.
const RATE_LIMIT_MAX = 5;
// Belt-and-suspenders: a global ceiling across all IPs on the shared key so
// a distributed attack can't compound per-IP limits into a large bill.
const GLOBAL_SHARED_RATE_MAX = 60;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();
let globalSharedBucket: { count: number; resetAt: number } = { count: 0, resetAt: 0 };

// Semantic cache. Keys are `<modelShort>:<hash16>` where modelShort is
// "haiku" or "sonnet" and hash16 is the first 16 hex chars of the SHA-256
// of the normalized prompt tuple. TTL is 7 days: long enough to make
// repeat prompts free, short enough that a prompt tweak cycles through
// within a sprint. TTL is written as an absolute `expires_at` timestamp
// so the read path can filter it in SQL; no background expiry job needed.
const CACHE_TTL_DAYS = 7;

// --- Supabase client -----------------------------------------------------

// Initialized once at module scope. When SUPABASE_URL or
// SUPABASE_SERVICE_ROLE_KEY is missing (local dev without `vercel env
// pull`), the client stays null and the cache layer soft-fails to a
// pass-through that always calls Anthropic. The warning is logged once
// here at init; per-request code never re-logs the absence.
let supabase: SupabaseClient | null = null;
try {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (url && serviceRoleKey) {
    supabase = createClient(url, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  } else {
    console.log(
      '[generate-theme] Supabase env vars missing; theme cache disabled (local dev or unset).',
    );
  }
} catch (err) {
  supabase = null;
  const message = err instanceof Error ? err.message : String(err);
  console.log(`[generate-theme] Supabase client init failed; theme cache disabled. ${message}`);
}

// --- Handler -------------------------------------------------------------

export default async function handler(req: Request): Promise<Response> {
  // CORS. Only trusted origins receive a matching Access-Control-Allow-Origin.
  // Anything else gets the canonical production host echoed back, which will
  // make the browser reject the response.
  const origin = req.headers.get('origin') ?? '';
  const originAllowed = isAllowedOrigin(origin);
  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin': originAllowed ? origin : 'https://arcana-ui.com',
    Vary: 'Origin',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-User-API-Key',
    'Access-Control-Max-Age': '86400',
  };

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'method_not_allowed' }, 405, corsHeaders);
  }

  // BYOK: users can pass their own Anthropic key via X-User-API-Key.
  // If present, skip server rate limits and origin gating and use their key.
  // Otherwise fall back to the shared server key with rate + origin gating.
  const userKey = req.headers.get('x-user-api-key')?.trim() ?? '';
  const serverKey = process.env.ANTHROPIC_API_KEY ?? '';
  const apiKey = userKey || serverKey;
  const usingByok = Boolean(userKey);

  if (!apiKey) {
    return json(
      { error: 'server_misconfigured', code: null, detail: 'ANTHROPIC_API_KEY missing' },
      500,
      corsHeaders,
    );
  }

  // Shared-key requests MUST come from an allowed browser origin. Browsers
  // enforce CORS, but curl, server-to-server calls, and bots do not. Without
  // this check any client could burn through the shared key even though the
  // CORS header would reject the response in a real browser.
  if (!usingByok && !originAllowed) {
    return json({ error: 'forbidden_origin', code: null }, 403, corsHeaders);
  }

  // Rate limit only applies to shared-key requests.
  if (!usingByok) {
    if (!checkGlobalSharedRateLimit()) {
      return json(
        {
          error: 'rate_limited',
          code: null,
          scope: 'global',
          retryAfterMs: RATE_LIMIT_WINDOW_MS,
        },
        429,
        { ...corsHeaders, 'Retry-After': String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)) },
      );
    }
    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      return json(
        { error: 'rate_limited', code: null, scope: 'ip', retryAfterMs: RATE_LIMIT_WINDOW_MS },
        429,
        {
          ...corsHeaders,
          'Retry-After': String(Math.ceil(RATE_LIMIT_WINDOW_MS / 1000)),
        },
      );
    }
  }

  // Parse + validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid_json', code: null }, 400, corsHeaders);
  }

  const parsed = validateInput(body);
  if ('error' in parsed) {
    return json({ error: parsed.error, code: null }, 400, corsHeaders);
  }
  const { description, siteType, density, count, model } = parsed;

  // Semantic cache lookup. Keyed on the validated/normalized tuple so
  // cosmetic differences (capitalization, extra whitespace) collapse to
  // the same entry. BYOK requests bypass the cache entirely: users
  // bringing their own key expect their prompts to stay off our server,
  // and we emit Cache-Control: no-store on the response to signal that
  // intent to any intermediaries.
  const cacheHeaders: Record<string, string> = {};
  if (usingByok) {
    cacheHeaders['Cache-Control'] = 'no-store';
  }
  const cacheEnabled = supabase !== null && !usingByok;
  const cacheKey = cacheEnabled
    ? await buildCacheKey({ description, siteType, density, count, model })
    : null;
  if (cacheKey) {
    const cachedThemes = await cacheGet(cacheKey);
    if (cachedThemes) {
      console.log(`[generate-theme] cache hit key=${cacheKey} model=${model}`);
      return json(
        { themes: cachedThemes, meta: { model, byok: usingByok, count, cached: true } },
        200,
        { ...corsHeaders, ...cacheHeaders, 'X-Cache': 'HIT' },
      );
    }
    console.log(`[generate-theme] cache miss key=${cacheKey} model=${model}`);
  }

  // Call Anthropic
  try {
    const themes = await Promise.all(
      Array.from({ length: count }, (_, i) =>
        generateOne(apiKey, model, description, siteType, density, i),
      ),
    );

    // Best-effort cache write. A Supabase failure must never surface to
    // the client; the generation succeeded, that's what the user cares
    // about. Fire-and-forget so the round-trip does not delay the
    // response.
    if (cacheKey) {
      cacheSet(cacheKey, model, themes);
    }

    return json({ themes, meta: { model, byok: usingByok, count, cached: false } }, 200, {
      ...corsHeaders,
      ...cacheHeaders,
      'X-Cache': 'MISS',
    });
  } catch (err) {
    if (err instanceof AnthropicApiError) {
      // Forward Anthropic's HTTP status unchanged when it is a real 4xx/5xx
      // so the client can distinguish, e.g., our 429 (IP rate limit) from
      // Anthropic's 429 (rate_limit_error / overloaded_error) via the code
      // field. Out-of-range status codes fall back to 502 so we never turn
      // an upstream failure into a success.
      const status = err.status >= 400 && err.status < 600 ? err.status : 502;
      return json(
        { error: 'generation_failed', code: err.code, detail: err.detail },
        status,
        corsHeaders,
      );
    }
    const message = err instanceof Error ? err.message : String(err);
    return json({ error: 'generation_failed', code: null, detail: message }, 500, corsHeaders);
  }
}

// --- Upstream error envelope --------------------------------------------

/**
 * Thrown from generateOne when Anthropic returns a non-2xx. Carries the
 * upstream HTTP status, the parsed `error.type` from Anthropic's JSON body
 * (or null if the body wasn't JSON), and the human-readable `error.message`
 * so the handler can forward all three to the client.
 *
 * Anthropic's error envelope is documented at
 * https://docs.anthropic.com/en/api/errors and looks like:
 *   { "type": "error", "error": { "type": "overloaded_error", "message": "..." } }
 */
class AnthropicApiError extends Error {
  readonly status: number;
  readonly code: string | null;
  readonly detail: string;
  constructor(status: number, code: string | null, detail: string) {
    super(`anthropic ${status}${code ? ` (${code})` : ''}`);
    this.name = 'AnthropicApiError';
    this.status = status;
    this.code = code;
    this.detail = detail;
  }
}

// --- Generation ----------------------------------------------------------

async function generateOne(
  apiKey: string,
  model: string,
  description: string,
  siteType: string | undefined,
  density: string | undefined,
  variantIndex: number,
): Promise<Record<string, unknown>> {
  const variantHint =
    variantIndex === 0
      ? ''
      : `\nThis is variant ${variantIndex + 1}. Differentiate from prior variants with a distinct color direction (analogous, complementary, or triadic) while staying faithful to the brand description.`;

  const userPrompt = [
    `Brand description: ${description}`,
    siteType ? `Site type: ${siteType}` : '',
    density ? `Preferred density: ${density}` : '',
    variantHint,
  ]
    .filter(Boolean)
    .join('\n');

  // Prompt caching: the system block is identical across every request, so we
  // flag it with cache_control. Cached reads are ~10% of full input cost and
  // the 5-minute window easily covers multi-variant bursts.
  const response = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: MAX_TOKENS,
      system: [
        {
          type: 'text',
          text: SYSTEM_PROMPT,
          cache_control: { type: 'ephemeral' },
        },
      ],
      messages: [{ role: 'user', content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const text = await safeText(response);
    const { code, detail } = parseAnthropicError(text);
    throw new AnthropicApiError(response.status, code, detail);
  }

  const data = (await response.json()) as {
    content: Array<{ type: string; text: string }>;
  };
  const text = data.content.find((c) => c.type === 'text')?.text ?? '';

  const match = /\{[\s\S]*\}/.exec(text);
  if (!match) throw new Error('no_json_in_response');

  return JSON.parse(match[0]) as Record<string, unknown>;
}

// --- System prompt -------------------------------------------------------

const SYSTEM_PROMPT = `You are a senior design systems engineer. Generate one complete Arcana UI theme preset JSON from a brand description.

Arcana tokens are three-tier: primitive (raw values), semantic (contextual references), component (optional overrides).

Output MUST be a single valid JSON object with this structure (no markdown, no prose, no code fences):

{
  "name": "kebab-case-id",
  "description": "One sentence describing the mood and use case.",
  "primitive": {
    "color": {
      "brand":   { "50": "#hex", "100": "#hex", "200": "#hex", "300": "#hex", "400": "#hex", "500": "#hex", "600": "#hex", "700": "#hex", "800": "#hex", "900": "#hex" },
      "neutral": { "0": "#hex", "50": "#hex", "100": "#hex", "200": "#hex", "300": "#hex", "400": "#hex", "500": "#hex", "600": "#hex", "700": "#hex", "800": "#hex", "900": "#hex", "950": "#hex" },
      "accent":  { "50": "#hex", "100": "#hex", "200": "#hex", "300": "#hex", "400": "#hex", "500": "#hex", "600": "#hex", "700": "#hex", "800": "#hex", "900": "#hex" },
      "success": { "500": "#hex", "600": "#hex" },
      "warning": { "500": "#hex", "600": "#hex" },
      "danger":  { "500": "#hex", "600": "#hex" }
    },
    "font": {
      "display": "Font Name, sans-serif",
      "body": "Font Name, sans-serif",
      "mono": "Monospace Font, monospace"
    },
    "radius": { "sm": "0.25rem", "md": "0.5rem", "lg": "0.75rem", "xl": "1rem", "full": "9999px" }
  },
  "semantic": {
    "color": {
      "background": {
        "default":  "{primitive.color.neutral.50}",
        "surface":  "{primitive.color.neutral.100}",
        "elevated": "{primitive.color.neutral.0}"
      },
      "foreground": {
        "primary":   "{primitive.color.neutral.900}",
        "secondary": "{primitive.color.neutral.600}",
        "muted":     "{primitive.color.neutral.400}"
      },
      "action": {
        "primary":        "{primitive.color.brand.500}",
        "primaryHover":   "{primitive.color.brand.600}",
        "primaryActive":  "{primitive.color.brand.700}",
        "secondary":      "{primitive.color.neutral.200}",
        "secondaryHover": "{primitive.color.neutral.300}"
      },
      "border": {
        "default": "{primitive.color.neutral.200}",
        "strong":  "{primitive.color.neutral.300}",
        "focus":   "{primitive.color.brand.500}"
      },
      "feedback": {
        "success": "{primitive.color.success.500}",
        "warning": "{primitive.color.warning.500}",
        "danger":  "{primitive.color.danger.500}"
      }
    }
  },
  "component": {}
}

Rules:
- Colors must be 6-digit hex (#rrggbb). No rgba, no oklch, no hsl.
- Ramps must be monotonic (50 lightest, 900 darkest for brand/accent; neutral includes 0 for white-ish and 950 for near-black).
- Contrast on foreground.primary over background.default must be at least 4.5:1.
- Pick fonts that match the brand mood. Prefer fonts available on Google Fonts or system stacks.
- Name should be short, memorable, kebab-case, and NOT match an existing Arcana preset (avoid: light, dark, terminal, retro98, glass, brutalist, corporate, startup, editorial, commerce, midnight, nature, neon, mono).
- Semantic references must use the {primitive.path.to.token} string syntax exactly as shown.
- Return ONLY the JSON object. No explanation, no markdown fences, no prose.`;

// --- Input validation ----------------------------------------------------

type ValidatedInput = {
  description: string;
  siteType: string | undefined;
  density: 'compact' | 'normal' | 'comfortable' | undefined;
  count: number;
  model: string;
};

function validateInput(body: unknown): ValidatedInput | { error: string } {
  if (typeof body !== 'object' || body === null) return { error: 'body_must_be_object' };
  const b = body as Record<string, unknown>;

  const description = typeof b.description === 'string' ? b.description.trim() : '';
  if (!description) return { error: 'description_required' };
  if (description.length > MAX_DESCRIPTION_LEN) return { error: 'description_too_long' };

  const siteType =
    typeof b.siteType === 'string' && b.siteType.trim()
      ? b.siteType.trim().slice(0, 50)
      : undefined;

  const density =
    b.density === 'compact' || b.density === 'normal' || b.density === 'comfortable'
      ? b.density
      : undefined;

  let count = typeof b.count === 'number' ? Math.floor(b.count) : 1;
  if (count < 1) count = 1;
  if (count > MAX_COUNT) count = MAX_COUNT;

  // Model selection: Haiku is the default (cheapest, strong at structured JSON).
  // Power users can request sonnet for higher-fidelity generation.
  const modelRaw = typeof b.model === 'string' ? b.model.toLowerCase() : '';
  const model = modelRaw === 'sonnet' ? SONNET_MODEL : DEFAULT_MODEL;

  return { description, siteType, density, count, model };
}

// --- Helpers -------------------------------------------------------------

// Origin allowlist. Anything not on this list cannot hit the shared key.
// We explicitly do NOT allow the wildcard *.vercel.app (that would let any
// Vercel app in the world proxy through our shared key). Preview deploys for
// this project live under the team's own Vercel subdomain, which we allow.
const ALLOWED_ORIGIN_HOSTS = new Set(['arcana-ui.com', 'localhost', '127.0.0.1']);
const ALLOWED_ORIGIN_SUFFIXES = [
  '.arcana-ui.com',
  '.garrett-whistens-projects.vercel.app', // team preview deploys
];

function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;
  try {
    const { hostname } = new URL(origin);
    if (ALLOWED_ORIGIN_HOSTS.has(hostname)) return true;
    for (const suffix of ALLOWED_ORIGIN_SUFFIXES) {
      if (hostname.endsWith(suffix)) return true;
    }
    return false;
  } catch {
    return false;
  }
}

function getClientIp(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const bucket = rateLimitBuckets.get(ip);
  if (!bucket || bucket.resetAt < now) {
    rateLimitBuckets.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (bucket.count >= RATE_LIMIT_MAX) return false;
  bucket.count += 1;
  return true;
}

// Global per-instance ceiling for shared-key requests. Caps total Anthropic
// spend regardless of how many unique IPs are calling. Enforced in addition
// to (not instead of) the per-IP bucket.
function checkGlobalSharedRateLimit(): boolean {
  const now = Date.now();
  if (globalSharedBucket.resetAt < now) {
    globalSharedBucket = { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS };
    return true;
  }
  if (globalSharedBucket.count >= GLOBAL_SHARED_RATE_MAX) return false;
  globalSharedBucket.count += 1;
  return true;
}

/**
 * Parse the Anthropic error envelope into a `{ code, detail }` pair.
 * Anthropic returns JSON like `{ "type": "error", "error": { "type": "...", "message": "..." } }`
 * on failure. We narrow the `type` to the set documented in
 * https://docs.anthropic.com/en/api/errors so downstream consumers can
 * switch on it safely; anything unknown becomes `null` and the client
 * falls back to the HTTP status.
 */
function parseAnthropicError(rawText: string): { code: string | null; detail: string } {
  const fallbackDetail = rawText.slice(0, 200);
  let parsed: unknown;
  try {
    parsed = JSON.parse(rawText);
  } catch {
    return { code: null, detail: fallbackDetail };
  }
  if (!parsed || typeof parsed !== 'object') {
    return { code: null, detail: fallbackDetail };
  }
  const inner = (parsed as { error?: unknown }).error;
  if (!inner || typeof inner !== 'object') {
    return { code: null, detail: fallbackDetail };
  }
  const innerObj = inner as { type?: unknown; message?: unknown };
  const rawType = typeof innerObj.type === 'string' ? innerObj.type : null;
  const message = typeof innerObj.message === 'string' ? innerObj.message : fallbackDetail;
  return { code: isKnownAnthropicErrorType(rawType) ? rawType : null, detail: message };
}

const ANTHROPIC_ERROR_TYPES = new Set([
  'invalid_request_error',
  'authentication_error',
  'permission_error',
  'not_found_error',
  'request_too_large',
  'rate_limit_error',
  'api_error',
  'overloaded_error',
  'billing_error',
]);

function isKnownAnthropicErrorType(type: string | null): type is string {
  return typeof type === 'string' && ANTHROPIC_ERROR_TYPES.has(type);
}

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text();
  } catch {
    return '';
  }
}

function json(body: unknown, status: number, headers: Record<string, string>): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...headers, 'Content-Type': 'application/json' },
  });
}

// --- Semantic cache ------------------------------------------------------

// Backed by the Supabase `theme_cache` table. Schema:
//   cache_key   text primary key   -- `<modelShort>:<hash16>`
//   model       text               -- resolved Anthropic model id
//   response    jsonb              -- array of generated theme objects
//   created_at  timestamptz default now()
//   expires_at  timestamptz        -- now() + 7 days on write
//   hit_count   int default 0      -- incremented fire-and-forget on read hit
//
// Soft-fails on every IO boundary: a Supabase outage, a schema mismatch,
// or a missing client all collapse to "miss" and let the request fall
// through to Anthropic. The generation succeeded is the thing that
// matters; cache IO failures never bubble to the response.

export interface CacheKeyInput {
  description: string;
  siteType: string | undefined;
  density: 'compact' | 'normal' | 'comfortable' | undefined;
  count: number;
  model: string;
}

/**
 * Build the cache key for a normalized prompt tuple. Shape is
 * `<modelShort>:<hash16>` where modelShort is `haiku` or `sonnet` and
 * hash16 is the first 16 hex chars of the SHA-256 of the normalized
 * payload. Exported for unit tests because changing the hash scheme
 * silently invalidates every existing cache entry.
 */
export async function buildCacheKey(input: CacheKeyInput): Promise<string> {
  // Normalize description so whitespace and case do not cause cache misses
  // on semantically identical prompts. The validator has already trimmed,
  // we additionally lowercase and collapse internal runs of whitespace.
  const normalized = {
    description: input.description.toLowerCase().replace(/\s+/g, ' '),
    siteType: input.siteType ?? '',
    density: input.density ?? '',
    count: input.count,
    model: input.model,
  };
  const payload = JSON.stringify(normalized);
  const bytes = new TextEncoder().encode(payload);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  const hex = Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
  const modelShort = input.model === SONNET_MODEL ? 'sonnet' : 'haiku';
  return `${modelShort}:${hex.slice(0, 16)}`;
}

async function cacheGet(key: string): Promise<Record<string, unknown>[] | null> {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('theme_cache')
      .select('response, expires_at')
      .eq('cache_key', key)
      .gt('expires_at', new Date().toISOString())
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;

    // Fire-and-forget hit_count bump. Explicitly detached from the
    // response path: we never await it and we swallow any rejection.
    // Uses a Supabase RPC-style update rather than an atomic counter
    // because the table lives behind the service role key and a stale
    // read is harmless for this metric.
    void supabase.rpc('increment_theme_cache_hit', { p_cache_key: key }).then(
      () => undefined,
      () => undefined,
    );

    const response = (data as { response: unknown }).response;
    return Array.isArray(response) ? (response as Record<string, unknown>[]) : null;
  } catch {
    // Supabase unavailable; treat as miss. Never fail the request on cache IO.
    return null;
  }
}

function cacheSet(key: string, model: string, themes: Record<string, unknown>[]): void {
  if (!supabase) return;
  const expiresAt = new Date(Date.now() + CACHE_TTL_DAYS * 24 * 60 * 60 * 1000).toISOString();
  // Fire-and-forget upsert. The response has already been sent by the
  // time Supabase acks; a write failure is logged and dropped.
  void supabase
    .from('theme_cache')
    .upsert(
      {
        cache_key: key,
        model,
        response: themes,
        expires_at: expiresAt,
        created_at: new Date().toISOString(),
        hit_count: 0,
      },
      { onConflict: 'cache_key' },
    )
    .then(
      ({ error }) => {
        if (error) {
          console.log(`[generate-theme] cache write failed key=${key} ${error.message}`);
        }
      },
      () => undefined,
    );
}
