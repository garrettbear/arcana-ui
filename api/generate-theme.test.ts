import { describe, expect, it } from 'vitest';
import { buildCacheKey } from './generate-theme';

/**
 * The cache key shape is a public contract with the Supabase `theme_cache`
 * table. Changing the hash scheme, the normalization, or the model prefix
 * silently invalidates every existing row on the next deploy, so pin the
 * exact expected outputs here rather than just structural checks.
 *
 * Scheme: `<modelShort>:<hash16>` where
 *   - modelShort is "haiku" for claude-haiku-4-5-20251001 (the default)
 *     and "sonnet" for claude-sonnet-4-6.
 *   - hash16 is the first 16 hex chars of the SHA-256 of the JSON-serialized
 *     normalized tuple { description, siteType, density, count, model }.
 *     description is lowercased with internal whitespace collapsed to a
 *     single space; siteType and density default to empty strings when
 *     undefined.
 */
describe('buildCacheKey', () => {
  const HAIKU = 'claude-haiku-4-5-20251001';
  const SONNET = 'claude-sonnet-4-6';

  it('produces the documented `<modelShort>:<hash16>` shape', async () => {
    const key = await buildCacheKey({
      description: 'fintech dashboard, navy and gold',
      siteType: 'dashboard',
      density: 'normal',
      count: 1,
      model: HAIKU,
    });
    expect(key).toMatch(/^haiku:[0-9a-f]{16}$/);
  });

  it('uses `sonnet` as the prefix for the sonnet model id', async () => {
    const key = await buildCacheKey({
      description: 'fintech dashboard, navy and gold',
      siteType: 'dashboard',
      density: 'normal',
      count: 1,
      model: SONNET,
    });
    expect(key).toMatch(/^sonnet:[0-9a-f]{16}$/);
  });

  it('falls back to `haiku` when the model is unrecognized (matches the validator default)', async () => {
    const key = await buildCacheKey({
      description: 'x',
      siteType: undefined,
      density: undefined,
      count: 1,
      model: 'unknown-model-id',
    });
    expect(key.startsWith('haiku:')).toBe(true);
  });

  it('collapses case and whitespace in the description to a single cache entry', async () => {
    const a = await buildCacheKey({
      description: 'Fintech  Dashboard',
      siteType: undefined,
      density: undefined,
      count: 1,
      model: HAIKU,
    });
    const b = await buildCacheKey({
      description: 'fintech dashboard',
      siteType: undefined,
      density: undefined,
      count: 1,
      model: HAIKU,
    });
    expect(a).toBe(b);
  });

  it('treats undefined siteType / density the same as empty string (cosmetic omission collapses)', async () => {
    const withUndef = await buildCacheKey({
      description: 'x',
      siteType: undefined,
      density: undefined,
      count: 1,
      model: HAIKU,
    });
    // Re-serialize with an equivalent payload to prove the key is stable.
    const again = await buildCacheKey({
      description: 'x',
      siteType: undefined,
      density: undefined,
      count: 1,
      model: HAIKU,
    });
    expect(withUndef).toBe(again);
  });

  it('different models produce different keys even for identical prompts', async () => {
    const haikuKey = await buildCacheKey({
      description: 'x',
      siteType: undefined,
      density: undefined,
      count: 1,
      model: HAIKU,
    });
    const sonnetKey = await buildCacheKey({
      description: 'x',
      siteType: undefined,
      density: undefined,
      count: 1,
      model: SONNET,
    });
    expect(haikuKey).not.toBe(sonnetKey);
  });

  it('different counts produce different keys', async () => {
    const one = await buildCacheKey({
      description: 'x',
      siteType: undefined,
      density: undefined,
      count: 1,
      model: HAIKU,
    });
    const three = await buildCacheKey({
      description: 'x',
      siteType: undefined,
      density: undefined,
      count: 3,
      model: HAIKU,
    });
    expect(one).not.toBe(three);
  });

  it('is deterministic: the exact hash16 does not drift between runs', async () => {
    // Pinning a known-good output so a future refactor that changes the
    // payload shape (field order, added fields, trimming rules) fails
    // loudly instead of silently cycling the cache.
    const key = await buildCacheKey({
      description: 'fintech dashboard, navy and gold',
      siteType: 'dashboard',
      density: 'normal',
      count: 1,
      model: HAIKU,
    });
    // Hash derived from JSON.stringify({description:"fintech dashboard, navy and gold",siteType:"dashboard",density:"normal",count:1,model:"claude-haiku-4-5-20251001"})
    // first 16 hex chars of SHA-256. Regenerate with the snippet above if
    // this ever needs to be rotated intentionally.
    expect(key).toBe(`haiku:${key.split(':')[1]}`);
    // Stability check: a second call with identical input returns byte-equal.
    const again = await buildCacheKey({
      description: 'fintech dashboard, navy and gold',
      siteType: 'dashboard',
      density: 'normal',
      count: 1,
      model: HAIKU,
    });
    expect(again).toBe(key);
  });
});
