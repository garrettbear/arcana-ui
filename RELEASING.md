# Arcana UI — Release & Branching Strategy

> **Purpose:** Defines how code flows from development to release, how versions are managed, and how npm packages get published.
> **Audience:** All contributors (human and AI agents)

---

## Branching Model

```
feature branches          develop (staging)              main (releases)
─────────────────         ─────────────────              ────────────────

feat/3.4-data-display ──→ ┐
                          │
fix/button-focus-ring ──→ ├──→ develop ──── v0.1.0-beta.1 (npm beta tag)
                          │        │
feat/3.5-forms ──────────→┘        │
                                   │
                          (accumulated work, tested, stable)
                                   │
                                   └──→ main ──── v0.1.0 (npm latest tag)
                                          │
                                          └── git tag: v0.1.0
```

### Three Branch Types

**`main`** — Production releases only
- Always stable. Every commit on main is a published release.
- Protected branch: no direct commits, no force push.
- Only receives merges from `develop` via a release PR.
- Each merge to main triggers: npm publish, git tag, GitHub Release, changelog.

**`develop`** — Staging / integration branch
- This is where all feature work accumulates.
- Must always build and pass tests (CI runs on every push).
- Beta releases are published from develop: `v0.1.0-beta.1`, `v0.1.0-beta.2`, etc.
- This is the branch Claude Code works against day-to-day.
- Think of it as "next release candidate."

**`feat/*`, `fix/*`, `refactor/*`, etc.** — Feature branches
- Created from develop (not main).
- One branch per task from the roadmap.
- PRs merge into develop (not main).
- Deleted after merge.
- Naming: `{type}/{task-number}-{short-description}`
  - `feat/3.4-data-display-components`
  - `fix/playground-theme-switching`
  - `docs/update-roadmap`

### The Flow

```
1. Developer (or AI agent) creates feature branch from develop
2. Work happens on the feature branch with conventional commits
3. PR opened against develop (not main)
4. CI runs: lint, typecheck, test, build
5. PR reviewed and merged into develop
6. develop accumulates multiple features
7. When ready for a beta release:
   → Version bump: 0.1.0-beta.X
   → npm publish --tag beta from develop
   → Testers and demo sites consume the beta
8. When ready for a stable release:
   → Create a release PR from develop → main
   → Release PR reviewed (final check)
   → Merge to main
   → Version bump to stable: 0.1.0
   → npm publish (latest tag) from main
   → Git tag: v0.1.0
   → GitHub Release with changelog
   → develop is rebased/merged from main to stay in sync
```

---

## Version Numbering

Follow [Semantic Versioning](https://semver.org/):

```
MAJOR.MINOR.PATCH-PRERELEASE

0.1.0-beta.1    First beta (current)
0.1.0-beta.2    Second beta (bug fixes)
0.1.0-beta.3    Third beta (more fixes)
0.1.0-rc.1      Release candidate (feature complete, final testing)
0.1.0           First stable release
0.1.1           Patch (bug fix, no new features)
0.2.0           Minor (new features, backward compatible)
1.0.0           Major (production ready, API stable)
```

### What Triggers Each Version Type

| Version Bump | When | Example |
|---|---|---|
| `-beta.N` | New features merged to develop, ready for testing | Added new components, token changes |
| `-rc.N` | Feature-complete, only bug fixes before stable | All Phase 3 components done, polishing |
| `PATCH` (0.1.1) | Bug fix on a stable release | Fixed Button focus ring in dark theme |
| `MINOR` (0.2.0) | New features added (backward compatible) | Added 10 new components, new presets |
| `MAJOR` (1.0.0) | API changes, breaking changes, or "we're production ready" | v1.0 launch |

### Pre-1.0 Rules

While the version is 0.x.y, minor versions MAY include breaking changes. This is standard semver practice. After 1.0.0, breaking changes require a major version bump.

---

## Release Process

### Beta Release (from develop)

Run by the maintainer when develop has accumulated enough changes to test:

```bash
# 1. Ensure develop is clean and passing
git checkout develop
git pull
pnpm lint && pnpm test && pnpm build

# 2. Bump beta version
# If current is 0.1.0-beta.1, bump to 0.1.0-beta.2
cd packages/tokens
npm version 0.1.0-beta.2 --no-git-tag-version
cd ../core
npm version 0.1.0-beta.2 --no-git-tag-version
cd ../..

# 3. Commit the version bump
git add -A
git commit -m "chore: bump version to 0.1.0-beta.2"

# 4. Publish with beta tag
cd packages/tokens && npm publish --tag beta --access public
cd ../core && npm publish --tag beta --access public

# 5. Push
git push origin develop

# 6. Update demo sites to use new beta version
# (demo sites should pin to the specific beta version)
```

### Stable Release (develop → main)

Run by the maintainer when a beta has been tested and is ready for stable:

```bash
# 1. Ensure develop is clean, passing, and fully tested
git checkout develop
git pull
pnpm lint && pnpm test && pnpm build

# 2. Create a release PR
git checkout -b release/0.1.0
# Bump to stable version
cd packages/tokens
npm version 0.1.0 --no-git-tag-version
cd ../core
npm version 0.1.0 --no-git-tag-version
cd ../..

# 3. Update CHANGELOG.md (see Changelog section below)

# 4. Commit
git add -A
git commit -m "chore: release v0.1.0"

# 5. Open PR: release/0.1.0 → main
gh pr create --base main --title "chore: release v0.1.0" --body "Release v0.1.0 — see CHANGELOG.md"

# 6. After PR is reviewed and merged to main:
git checkout main
git pull

# 7. Tag the release
git tag v0.1.0
git push origin v0.1.0

# 8. Publish to npm (latest tag — this is the default)
cd packages/tokens && npm publish --access public
cd ../core && npm publish --access public

# 9. Create GitHub Release
gh release create v0.1.0 --title "v0.1.0" --notes "See CHANGELOG.md"

# 10. Sync develop with main
git checkout develop
git merge main
git push origin develop
```

### Hotfix (urgent fix on a stable release)

For critical bugs found in a stable release:

```bash
# 1. Branch from main (not develop)
git checkout main
git checkout -b hotfix/button-crash

# 2. Fix the bug, commit
git commit -m "fix(core): prevent Button crash on undefined onClick"

# 3. Bump patch version
# 0.1.0 → 0.1.1

# 4. PR into main
# 5. Merge, tag, publish (same as stable release)
# 6. Merge main back into develop so develop gets the fix
```

---

## Changelog

Maintain a CHANGELOG.md at the project root following [Keep a Changelog](https://keepachangelog.com/) format:

```markdown
# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]
### Added
- Component-level token editor in playground
- ThemeSwitcher component for demo sites

### Fixed
- Glass theme translucency on Safari
- Toggle animation respecting reduced-motion

## [0.1.0] - 2026-XX-XX
### Added
- 60+ React components across 5 site categories
- 14 theme presets with distinct visual personalities
- Three-tier token architecture (primitive → semantic → component)
- Density modes (compact, default, comfortable)
- Responsive mobile-first design for all components
- Token validation with WCAG contrast checking
- Landing page at arcana-ui.dev
- Playground with visual token editor

### Changed
- Migrated repo to arcana-ui GitHub organization

## [0.1.0-beta.1] - 2026-XX-XX
### Added
- Initial beta release
- Core component library
- Token build pipeline
- 6 theme presets
```

Conventional commits make changelog generation semi-automatic. Each `feat` commit becomes an "Added" entry, each `fix` becomes a "Fixed" entry.

---

## CI/CD Integration

### On Push to develop
- Run: lint, typecheck, test, build
- Deploy playground to staging URL (e.g., staging.arcana-ui.dev)
- Do NOT auto-publish to npm (beta publishes are manual/intentional)

### On Push to main
- Run: lint, typecheck, test, build
- Deploy playground to production URL (arcana-ui.dev)
- Auto-publish to npm with latest tag (optional — can also be manual)
- Create GitHub Release from the git tag

### On Pull Request (any target)
- Run: lint, typecheck, test, build
- Run visual regression tests
- Post CI status checks
- Block merge if any check fails

### GitHub Actions Workflow Addition

Add to .github/workflows/release.yml:

```yaml
name: Release
on:
  push:
    tags:
      - 'v*'
jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          registry-url: 'https://registry.npmjs.org'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: cd packages/tokens && npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
      - run: cd packages/core && npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

This automates npm publish when you push a version tag. You'll need to:
1. Generate an npm access token at npmjs.com → Access Tokens → Generate
2. Add it as a GitHub secret: repo Settings → Secrets → NPM_TOKEN

---

## AI Agent Instructions

### For Claude Code and other AI agents:

- Always create feature branches from `develop`, not `main`
- PRs always target `develop`, not `main`
- Never directly commit to `main` or `develop`
- Never run npm publish (that's the maintainer's job)
- Never bump version numbers (that's part of the release process)
- Always follow the branch naming convention: `{type}/{task-number}-{description}`
- The session protocol in AI_OPS.md still applies — just remember the target branch is `develop`

### Updated Session Protocol

```
1. git checkout develop && git pull
2. git checkout -b feat/{task-number}-{description}
3. Do the work
4. PR against develop (not main)
5. After merge, develop accumulates the change
6. Maintainer decides when to beta/stable release
```

---

## Branch Protection Rules

Configure these on GitHub:

**main:**
- Require PR reviews (at least 1)
- Require CI status checks to pass
- No direct pushes
- No force pushes
- No deletions

**develop:**
- Require CI status checks to pass
- Allow direct pushes from maintainer (for version bumps)
- No force pushes
- No deletions

---

## Release Checklist

Use this checklist for every stable release:

- [ ] All planned features for this version are merged to develop
- [ ] develop passes: pnpm lint && pnpm test && pnpm build
- [ ] All demo sites work with the current develop build
- [ ] Visual regression tests pass
- [ ] WCAG contrast validation passes for all presets
- [ ] CHANGELOG.md updated with all changes since last release
- [ ] Version numbers bumped in both package.json files
- [ ] Release PR created: develop → main
- [ ] Release PR reviewed
- [ ] Merged to main
- [ ] Git tag created and pushed
- [ ] npm publish successful for both packages
- [ ] GitHub Release created
- [ ] Demo sites updated to use new stable version
- [ ] develop synced with main
- [ ] Announcement posted (if applicable)
