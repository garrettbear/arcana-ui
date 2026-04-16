import { describe, expect, it } from 'vitest';
import { readableError } from './generateTheme';

/**
 * Every branch of `readableError` covered once. The function's dispatch
 * order (code → status → err.error) is load-bearing: Anthropic's 429
 * (`rate_limit_error`) and our 429 (IP rate limit) share an HTTP status
 * but must render different copy, so the `code`-first path has to win.
 */
describe('readableError', () => {
  describe('Anthropic upstream codes win first', () => {
    it('billing_error steers the user to BYOK', () => {
      expect(readableError({ error: 'generation_failed', code: 'billing_error' }, 402)).toBe(
        'Theme generation is temporarily unavailable (billing). Add your own Anthropic key in settings to continue.',
      );
    });

    it('authentication_error calls out an invalid key', () => {
      expect(readableError({ error: 'generation_failed', code: 'authentication_error' }, 401)).toBe(
        'The Anthropic key is invalid. If you set a BYOK key, check it in settings.',
      );
    });

    it('overloaded_error tells the user to retry', () => {
      expect(readableError({ error: 'generation_failed', code: 'overloaded_error' }, 529)).toBe(
        'Anthropic is overloaded right now. Try again in a moment.',
      );
    });

    it("Anthropic's rate_limit_error is distinct from our own 429", () => {
      expect(readableError({ error: 'generation_failed', code: 'rate_limit_error' }, 429)).toBe(
        'Anthropic rate-limited this request. Try again in a few seconds.',
      );
    });

    it('invalid_request_error suggests rephrasing', () => {
      expect(
        readableError({ error: 'generation_failed', code: 'invalid_request_error' }, 400),
      ).toBe('Something about the prompt confused the model. Try rephrasing.');
    });

    it('api_error falls back to a generic generation-failed message with detail', () => {
      expect(
        readableError(
          { error: 'generation_failed', code: 'api_error', detail: 'upstream 502' },
          502,
        ),
      ).toBe('Generation failed: upstream 502');
    });

    it('other forwarded anthropic codes (permission_error) use the generic upstream copy', () => {
      expect(readableError({ error: 'generation_failed', code: 'permission_error' }, 403)).toBe(
        'Generation failed: upstream error',
      );
    });
  });

  describe('our own 429 (IP rate limit) takes the status-based branch', () => {
    it('code-less 429 shows the daily-limit / BYOK message', () => {
      expect(readableError({ error: 'rate_limited', code: null }, 429)).toBe(
        "You've hit the daily generation limit. Add your own Anthropic key in settings to keep going.",
      );
    });

    it('status-based branch still fires when code is omitted entirely', () => {
      expect(readableError({ error: 'rate_limited' }, 429)).toBe(
        "You've hit the daily generation limit. Add your own Anthropic key in settings to keep going.",
      );
    });
  });

  describe('locally-produced errors keyed on err.error', () => {
    it('description_required', () => {
      expect(readableError({ error: 'description_required', code: null }, 400)).toBe(
        'Add a description of your brand so we know what to generate.',
      );
    });

    it('description_too_long', () => {
      expect(readableError({ error: 'description_too_long', code: null }, 400)).toBe(
        'That description is a bit long. Try trimming to under 500 characters.',
      );
    });

    it('forbidden_origin', () => {
      expect(readableError({ error: 'forbidden_origin', code: null }, 403)).toBe(
        'This origin cannot use the shared key. Add your own Anthropic API key to generate from here.',
      );
    });

    it('server_misconfigured', () => {
      expect(readableError({ error: 'server_misconfigured', code: null }, 500)).toBe(
        'The generation service is not configured. Please let us know.',
      );
    });

    it('generation_failed with no code formats the detail', () => {
      expect(
        readableError(
          { error: 'generation_failed', code: null, detail: 'no_json_in_response' },
          500,
        ),
      ).toBe('Generation failed: no_json_in_response');
    });

    it('falls through to the detail field when err.error is unknown', () => {
      expect(readableError({ error: 'mystery', code: null, detail: 'weird' }, 418)).toBe('weird');
    });

    it('falls through to a status-only message when nothing else matches', () => {
      expect(readableError({ error: 'mystery', code: null }, 418)).toBe('Request failed (418)');
    });
  });
});
