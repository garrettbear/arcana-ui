/**
 * Client helper for POST /api/generate-theme.
 *
 * Responsibilities:
 *  - Shape the request body and forward BYOK header if a user key is stored.
 *  - Normalize the response into a typed shape.
 *  - Stash results in sessionStorage under a known key for the /generate route
 *    to pick up without re-fetching on navigation / refresh.
 */

export interface GeneratedTheme {
  /** kebab-case id, e.g. "ironclad" */
  name: string;
  /** One-sentence description */
  description: string;
  /** Full three-tier-light preset body (primitive + semantic + component) */
  primitive: Record<string, unknown>;
  semantic: Record<string, unknown>;
  component?: Record<string, unknown>;
}

export interface GenerateThemeRequest {
  description: string;
  siteType?: string;
  density?: 'compact' | 'normal' | 'comfortable';
  /** 1-3; anything above caps at 3 server-side */
  count?: number;
  /** Opt into Sonnet. Default Haiku. Ignored without BYOK once we enforce that in prod. */
  model?: 'haiku' | 'sonnet';
}

export interface GenerateThemeResponse {
  themes: GeneratedTheme[];
  meta: {
    model: string;
    byok: boolean;
    count: number;
    /**
     * True when the themes were served from the Vercel KV semantic cache
     * instead of hitting the Anthropic API. Present on every successful
     * response from deployments where KV is configured; may be absent
     * from responses produced before the caching layer shipped.
     */
    cached?: boolean;
  };
}

export interface GenerateThemeError {
  /** Stable string identifier for the failure class set by the edge function. */
  error: string;
  /**
   * Anthropic-specific error type copied through from the upstream response
   * when the failure came from `/v1/messages`. `null` on locally-produced
   * errors (validation, rate limit, forbidden origin, etc.). The client
   * switches on this first because it is more specific than the HTTP status
   * (e.g. Anthropic's 429 `rate_limit_error` and our 429 IP rate limit
   * share a status but need distinct messages).
   */
  code?:
    | 'billing_error'
    | 'authentication_error'
    | 'overloaded_error'
    | 'rate_limit_error'
    | 'invalid_request_error'
    | 'api_error'
    | 'permission_error'
    | 'not_found_error'
    | 'request_too_large'
    | null;
  detail?: string;
  retryAfterMs?: number;
}

// localStorage key for the user-supplied Anthropic key (BYOK).
// Only the browser ever sees this value; it is forwarded to the edge function
// via the X-User-API-Key header but never stored server-side.
export const BYOK_STORAGE_KEY = 'arcana-user-anthropic-key';

// sessionStorage key used to hand off the /generate route its data.
export const GENERATED_THEMES_SESSION_KEY = 'arcana-generated-themes';

// sessionStorage key used to hand a single picked theme into the editor.
export const PICKED_THEME_SESSION_KEY = 'arcana-picked-generated-theme';

// sessionStorage key that holds the `name` field of the currently applied
// generated theme. The picked theme JSON is cleared on mount (applyGeneratedTheme
// bakes the overrides into the DOM), but the name needs to survive so the
// topbar chip can show what the user is looking at across navigations.
export const ACTIVE_GENERATED_NAME_KEY = 'arcana-active-generated-name';

export function getStoredApiKey(): string | null {
  try {
    return localStorage.getItem(BYOK_STORAGE_KEY);
  } catch {
    return null;
  }
}

export function setStoredApiKey(key: string): void {
  try {
    localStorage.setItem(BYOK_STORAGE_KEY, key.trim());
  } catch {
    // ignore — private mode / storage disabled
  }
}

export function clearStoredApiKey(): void {
  try {
    localStorage.removeItem(BYOK_STORAGE_KEY);
  } catch {
    // ignore
  }
}

export async function generateTheme(
  req: GenerateThemeRequest,
  options?: { apiKey?: string },
): Promise<GenerateThemeResponse> {
  // Explicit override wins over stored BYOK. Used by the Settings panel
  // to test a key the user just typed without having to commit it to
  // localStorage first.
  const byokKey = options?.apiKey?.trim() || getStoredApiKey();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (byokKey) headers['X-User-API-Key'] = byokKey;

  const body: GenerateThemeRequest = {
    description: req.description,
    count: req.count ?? 3,
    ...(req.siteType ? { siteType: req.siteType } : {}),
    ...(req.density ? { density: req.density } : {}),
    ...(req.model ? { model: req.model } : {}),
  };

  const res = await fetch('/api/generate-theme', {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  const text = await res.text();
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new ThemeGenerationError(
      `Unexpected response from /api/generate-theme (status ${res.status})`,
      res.status,
    );
  }

  if (!res.ok) {
    const err = parsed as GenerateThemeError;
    const message = readableError(err, res.status);
    throw new ThemeGenerationError(message, res.status, err.error);
  }

  return parsed as GenerateThemeResponse;
}

export class ThemeGenerationError extends Error {
  status: number;
  code?: string;
  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = 'ThemeGenerationError';
    this.status = status;
    this.code = code;
  }
}

/**
 * Map an error response to a human-readable message. Dispatch order is:
 *   1. `err.code` — Anthropic's upstream `error.type` forwarded by the edge
 *      function. Most specific, so it wins. Distinguishes e.g. Anthropic's
 *      429 (rate_limit_error / overloaded_error) from our 429 (IP limit).
 *   2. HTTP `status` — for locally-produced errors where `code` is null.
 *      Today only 429 (our own rate limit) has a status-specific message.
 *   3. `err.error` — the edge function's own string codes for validation,
 *      forbidden origin, misconfiguration, and generic generation failures.
 *
 * Exported so `generateTheme.test.ts` can exercise every branch without
 * having to mock `fetch`.
 */
export function readableError(err: GenerateThemeError, status: number): string {
  switch (err.code) {
    case 'billing_error':
      return 'Theme generation is temporarily unavailable (billing). Add your own Anthropic key in settings to continue.';
    case 'authentication_error':
      return 'The Anthropic key is invalid. If you set a BYOK key, check it in settings.';
    case 'overloaded_error':
      return 'Anthropic is overloaded right now. Try again in a moment.';
    case 'rate_limit_error':
      return 'Anthropic rate-limited this request. Try again in a few seconds.';
    case 'invalid_request_error':
      return 'Something about the prompt confused the model. Try rephrasing.';
    case 'api_error':
    case 'permission_error':
    case 'not_found_error':
    case 'request_too_large':
      return `Generation failed: ${err.detail ?? 'upstream error'}`;
  }

  // No upstream code. Locally-produced errors: dispatch on HTTP status for
  // cases where status alone is meaningful, then on the edge function's
  // own string code.
  if (status === 429) {
    return "You've hit the daily generation limit. Add your own Anthropic key in settings to keep going.";
  }

  switch (err.error) {
    case 'description_required':
      return 'Add a description of your brand so we know what to generate.';
    case 'description_too_long':
      return 'That description is a bit long. Try trimming to under 500 characters.';
    case 'forbidden_origin':
      return 'This origin cannot use the shared key. Add your own Anthropic API key to generate from here.';
    case 'server_misconfigured':
      return 'The generation service is not configured. Please let us know.';
    case 'generation_failed':
      return `Generation failed: ${err.detail ?? 'unknown error'}`;
    default:
      return err.detail ?? `Request failed (${status})`;
  }
}

export function stashGeneratedThemes(payload: {
  prompt: string;
  response: GenerateThemeResponse;
}): void {
  try {
    sessionStorage.setItem(
      GENERATED_THEMES_SESSION_KEY,
      JSON.stringify({ ...payload, createdAt: Date.now() }),
    );
  } catch {
    // ignore
  }
}

export function readGeneratedThemes(): {
  prompt: string;
  response: GenerateThemeResponse;
  createdAt: number;
} | null {
  try {
    const raw = sessionStorage.getItem(GENERATED_THEMES_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function stashPickedTheme(theme: GeneratedTheme): void {
  try {
    sessionStorage.setItem(PICKED_THEME_SESSION_KEY, JSON.stringify(theme));
  } catch {
    // ignore
  }
}

export function readPickedTheme(): GeneratedTheme | null {
  try {
    const raw = sessionStorage.getItem(PICKED_THEME_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as GeneratedTheme;
  } catch {
    return null;
  }
}

export function clearPickedTheme(): void {
  try {
    sessionStorage.removeItem(PICKED_THEME_SESSION_KEY);
  } catch {
    // ignore
  }
}

export function setActiveGeneratedName(name: string): void {
  try {
    sessionStorage.setItem(ACTIVE_GENERATED_NAME_KEY, name);
  } catch {
    // ignore
  }
}

export function getActiveGeneratedName(): string | null {
  try {
    return sessionStorage.getItem(ACTIVE_GENERATED_NAME_KEY);
  } catch {
    return null;
  }
}

export function clearActiveGeneratedName(): void {
  try {
    sessionStorage.removeItem(ACTIVE_GENERATED_NAME_KEY);
  } catch {
    // ignore
  }
}
