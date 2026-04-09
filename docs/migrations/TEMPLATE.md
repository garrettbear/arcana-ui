# Migration Guide: v{OLD} to v{NEW}

> Release date: YYYY-MM-DD
> Full changelog: [CHANGELOG.md](../../CHANGELOG.md)

This is the scaffold for every Arcana UI migration guide. Copy this file to
`{NEW}.md` in the same directory, fill in every section, and link it from
`manifest.ai.json` (`releaseHistory[n].migration`) and from the table in
`README.md`.

## Breaking Changes Summary

| Change         | Affected Components / Tokens | Action Required                                  |
| -------------- | ---------------------------- | ------------------------------------------------ |
| Prop renamed   | `Button`                     | Replace `type=` with `variant=`                  |
| Token renamed  | Global                       | Find-and-replace `--old-name` with `--new-name`  |

## Detailed Changes

### 1. {Change title}

**What changed:**

One-paragraph description of what changed and why. Include the rationale so
readers understand the trade-off, not just the mechanic.

**Before (v{OLD}):**

```tsx
<Button type="primary">Click me</Button>
```

**After (v{NEW}):**

```tsx
<Button variant="primary">Click me</Button>
```

**Automated fix:**

If the migration is mechanical, provide a command that covers it:

```bash
# Example: find and replace across all .tsx files
rg -l 'Button[^>]*type="' src | xargs sed -i 's/Button\([^>]*\)type="/Button\1variant="/'
```

If no automated fix exists, write "Manual — see detailed description above."

### 2. {Next change}

Repeat the structure for every breaking change.

## How to Upgrade

1. Update packages:
   ```bash
   npm install @arcana-ui/core@{NEW} @arcana-ui/tokens@{NEW}
   ```
2. Apply each migration step above (automated fixes first, then manual
   changes).
3. Verify types: `pnpm build` (or `npm run build`) — the TypeScript compiler
   will surface any remaining prop name mismatches.
4. Run tests: `pnpm test` (or `npm test`) — ensures no regressions.
5. Smoke-test the app visually in every theme you use, because token renames
   can change paint results even when TypeScript is happy.

## Rollback

If something goes wrong, the migration is reversible by pinning back to the
previous version:

```bash
npm install @arcana-ui/core@{OLD} @arcana-ui/tokens@{OLD}
```

Then re-apply the migration on a branch after investigating the issue.
