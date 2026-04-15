# Contributing to Arcana UI

Arcana welcomes contributions from humans and AI agents alike. This project is built collaboratively with AI tools — that's by design. Whether you're writing code in your editor or generating it with Claude Code, the standards are the same.

Read [ROADMAP.md Section 1](./ROADMAP.md#1-design-philosophy) for the project vision: a token-driven design system where machines compose and humans enjoy.

---

## Getting Started

**Prerequisites:** Node.js 20+, pnpm 10+

```bash
# Fork and clone the repo
git clone https://github.com/<your-username>/arcana-ui.git
cd arcana-ui

# Install dependencies
pnpm install

# Build everything (tokens + components)
pnpm build

# Run tests
pnpm test

# Start the dev server (playground)
pnpm dev
```

Verify all three pass before making changes: `pnpm lint && pnpm test && pnpm build`

---

## Project Orientation

| Document | Purpose |
|----------|---------|
| [CLAUDE.md](./CLAUDE.md) | AI agent instructions, code standards, and current project state |
| [ROADMAP.md](./ROADMAP.md) | Full architecture, token spec, component standards, and phased plan |
| [AI_OPS.md](./AI_OPS.md) | Prompt library and workflow for AI-assisted development |
| [PROGRESS.md](./PROGRESS.md) | Task tracker — what's done, what's next |

For deeper reference:

- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) — Technical overview (monorepo structure, token pipeline, testing)
- [docs/COMPONENT-INVENTORY.md](./docs/COMPONENT-INVENTORY.md) — Full component registry with props and status
- [templates/component-test-template.tsx](./templates/component-test-template.tsx) — Test patterns for new components

---

## How to Contribute

### Picking a Task

1. Check [PROGRESS.md](./PROGRESS.md) for the next unchecked task in the current phase
2. Browse [GitHub Issues](https://github.com/Arcana-UI/arcana/issues) for open work
3. Comment on the issue before starting so others know it's claimed
4. Want to propose something not on the roadmap? Open an issue first to discuss

### Branching Model

This project uses a two-branch model:

- **`develop`** — The integration branch. All feature work merges here. Beta releases are published from `develop`.
- **`main`** — Production releases only. Never commit directly to `main`. Only receives merges from `develop` via release PRs.
- **Feature branches** — Created from `develop`, merged back into `develop`.

See [RELEASING.md](./RELEASING.md) for the full release strategy.

### Branch and PR Workflow

1. Create a branch from `develop` (not `main`) with a descriptive name:
   ```bash
   git checkout develop && git pull
   git checkout -b feat/1.4-elevation-system
   ```
   - `feat/1.4-elevation-system`
   - `fix/button-focus-ring`
2. Make your changes following the [code standards](#code-standards) below
3. Run the full check: `pnpm lint && pnpm test && pnpm build`
4. Push and open a PR **targeting `develop`** (not `main`)
5. **PR title must follow conventional commits:** `type(scope): description`
6. Link the relevant PROGRESS.md task or GitHub Issue in the PR description
7. One task per PR — do not bundle unrelated changes

### PR Review Process

- Maintainer ([Garrett Bear](https://github.com/garrettbear)) reviews all PRs
- CI must pass: lint, typecheck, test, build
- Visual changes should include before/after screenshots
- Expect feedback — iteration is normal and welcome

---

## Code Standards

These are the key rules. For full details, see [CLAUDE.md](./CLAUDE.md) and [ROADMAP.md Section 9](./ROADMAP.md#9-project-standards--conventions).

**TypeScript:**
- Strict mode enabled. No `any` types — use `unknown` and narrow.
- Explicit return types on exported functions.
- JSDoc comments on every component prop.

**CSS:**
- Tokens only — no hardcoded colors, sizes, shadows, or durations. Use `var(--token-name)`.
- Mobile-first: default styles for mobile, `@media (min-width: ...)` for larger screens.
- BEM-like naming with `arcana-` prefix: `arcana-button`, `arcana-button--primary`.
- No `!important`. Ever.
- Landing and playground pages must use motion tokens (`var(--duration-*)`, `var(--ease-*)`); hardcoded `ms` / `s` values and literal `ease` / `cubic-bezier(...)` functions are not permitted. This is what makes the per-preset motion personalities in `packages/tokens/src/presets/*.json` flow through to every surface instead of being overridden by page-local timings.

**Components:**
- `forwardRef` on every component with `displayName` set.
- Typed props interface with JSDoc on every prop.
- Defaults for all optional props. Support `className` passthrough.
- Consistent prop names: `variant`, `size`, `disabled`, `loading`.

**Accessibility:**
- Keyboard navigation (Tab, Enter, Escape, Arrow keys).
- ARIA attributes on all interactive elements.
- Visible focus indicators in every theme.
- Minimum 44x44px touch targets on mobile.
- WCAG AA contrast: 4.5:1 for text, 3:1 for UI elements.

**Naming:**
- Components: PascalCase (`Button.tsx`)
- CSS classes: kebab-case with `arcana-` prefix (`arcana-button--primary`)
- Hooks: camelCase with `use` prefix (`useTheme.ts`)
- Token files: kebab-case (`light.json`)

---

## Adding a New Component

1. Create the directory: `packages/core/src/components/ComponentName/`
2. Create files:
   - `ComponentName.tsx` — implementation with `forwardRef`, typed props, JSDoc
   - `ComponentName.css` — styles using only token variables (`var(--token-name)`)
   - `ComponentName.test.tsx` — tests (use [the template](./templates/component-test-template.tsx))
   - `index.ts` — barrel export
3. Export from `packages/core/src/index.ts`
4. Run: `pnpm lint && pnpm test && pnpm build`
5. Commit: `feat(core): add ComponentName component`

See [ROADMAP.md Section 8.7](./ROADMAP.md#87-step-by-step-adding-a-component) for the full walkthrough.

---

## Adding a New Theme Preset

1. Copy an existing preset: `cp packages/tokens/src/presets/light.json packages/tokens/src/presets/my-theme.json`
2. Edit the JSON — update name, primitives, semantic mappings (see [ROADMAP.md Section 5.3](./ROADMAP.md#53-preset-design-guidelines))
3. Validate WCAG contrast on all foreground/background pairs
4. Build: `pnpm build:tokens`
5. Test in the playground with all existing components
6. Commit: `feat(tokens): add my-theme preset`

See [ROADMAP.md Section 8.8](./ROADMAP.md#88-step-by-step-adding-a-preset) for the full walkthrough.

---

## For AI Agents

If you are Claude Code, Cursor, Copilot, or another AI agent:

1. **Read [CLAUDE.md](./CLAUDE.md) first** — it contains the session protocol, code standards, and current project state
2. **Follow the session protocol:** read CLAUDE.md, PROGRESS.md, ROADMAP.md, AI_OPS.md in order, then `pnpm install && pnpm build`
3. **Use prompts from [AI_OPS.md](./AI_OPS.md)** for specific tasks
4. **Update [PROGRESS.md](./PROGRESS.md)** when completing a roadmap task
5. **Update CLAUDE.md "Current State"** at the end of every session
6. **Run the full check** before committing: `pnpm lint && pnpm test && pnpm build`

---

## Commit Convention

Format: `type(scope): description`

**Types:** `feat`, `fix`, `refactor`, `style`, `docs`, `test`, `chore`, `perf`

**Scopes:** `tokens`, `core`, `docs`, `playground`, `demo`, `ci`

**Examples:**
```
feat(core): add Navbar component with responsive collapse
feat(tokens): add elevation shadow system
fix(core): Button focus ring not visible in dark theme
test(core): add visual regression tests for Card
```

PR titles are validated against this format by CI.

---

## Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone.

- **Be kind and constructive.** Critique code, not people.
- **Be inclusive.** Welcome newcomers. Respect different perspectives and experience levels.
- **No harassment, discrimination, or personal attacks.** This is non-negotiable.
- **Assume good intent.** Misunderstandings happen — seek clarification before reacting.
- **Maintainer has final say** on project direction and design decisions.

This project follows the spirit of the [Contributor Covenant](https://www.contributor-covenant.org/version/2/1/code_of_conduct/). For the full text, see the link.

---

## Getting Help

- **Bugs or feature requests:** [Open a GitHub Issue](https://github.com/Arcana-UI/arcana/issues/new)
- **Questions:** Open a GitHub Issue tagged with `question`
- **Blocked on something:** Tag [@garrettbear](https://github.com/garrettbear) in the issue or PR

---

<p align="center">
  <sub>Thank you for helping build the design system for the AI era.</sub>
</p>
