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
 *   200 { "themes": [ { name, description, primitive, semantic, component } ] }
 *   400 { "error": "..." }            // bad input
 *   429 { "error": "rate_limited" }   // abuse protection
 *   500 { "error": "..." }            // upstream / parsing failure
 */

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
const RATE_LIMIT_MAX = 10;
const rateLimitBuckets = new Map<string, { count: number; resetAt: number }>();

// --- Handler -------------------------------------------------------------

export default async function handler(req: Request): Promise<Response> {
  // CORS — allow playground subdomains and localhost during dev
  const origin = req.headers.get('origin') ?? '';
  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin': isAllowedOrigin(origin) ? origin : 'https://arcana-ui.com',
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
  // If present, skip server rate limit and use their key. Otherwise fall back
  // to the shared server key with a rate limit.
  const userKey = req.headers.get('x-user-api-key')?.trim() ?? '';
  const serverKey = process.env.ANTHROPIC_API_KEY ?? '';
  const apiKey = userKey || serverKey;
  const usingByok = Boolean(userKey);

  if (!apiKey) {
    return json({ error: 'server_misconfigured', detail: 'ANTHROPIC_API_KEY missing' }, 500, corsHeaders);
  }

  // Rate limit per client IP only when using the shared key.
  if (!usingByok) {
    const ip = getClientIp(req);
    if (!checkRateLimit(ip)) {
      return json({ error: 'rate_limited', retryAfterMs: RATE_LIMIT_WINDOW_MS }, 429, corsHeaders);
    }
  }

  // Parse + validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'invalid_json' }, 400, corsHeaders);
  }

  const parsed = validateInput(body);
  if ('error' in parsed) {
    return json({ error: parsed.error }, 400, corsHeaders);
  }
  const { description, siteType, density, count, model } = parsed;

  // Call Anthropic
  try {
    const themes = await Promise.all(
      Array.from({ length: count }, (_, i) => generateOne(apiKey, model, description, siteType, density, i)),
    );

    return json({ themes, meta: { model, byok: usingByok, count } }, 200, corsHeaders);
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return json({ error: 'generation_failed', detail: message }, 500, corsHeaders);
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
    throw new Error(`anthropic ${response.status}: ${text.slice(0, 200)}`);
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

  const siteType = typeof b.siteType === 'string' && b.siteType.trim() ? b.siteType.trim().slice(0, 50) : undefined;

  const density =
    b.density === 'compact' || b.density === 'normal' || b.density === 'comfortable' ? b.density : undefined;

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

function isAllowedOrigin(origin: string): boolean {
  if (!origin) return false;
  try {
    const { hostname } = new URL(origin);
    if (hostname === 'localhost' || hostname === '127.0.0.1') return true;
    if (hostname === 'arcana-ui.com') return true;
    if (hostname.endsWith('.arcana-ui.com')) return true;
    if (hostname.endsWith('.vercel.app')) return true; // preview deploys
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
