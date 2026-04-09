# @arcana-ui/cli

Command-line tool for [Arcana UI](https://arcana-ui.com) — scaffold projects, validate themes, and activate built-in presets.

```bash
npx @arcana-ui/cli init my-app
```

That's the whole quickstart. Read on for the full surface.

---

## Install

You don't have to install it. Just run via `npx`:

```bash
npx @arcana-ui/cli <command>
# or, equivalent:
npx arcana-ui <command>
```

Or install globally if you'd rather:

```bash
npm i -g @arcana-ui/cli
arcana-ui <command>
```

---

## Commands

### `init [project-name]`

Scaffold a new Arcana UI project. Walks you through framework, theme, density, and a starter layout, then generates a working app you can `cd` into and run.

```bash
# Interactive
npx arcana-ui init

# Non-interactive (CI / scripts)
npx arcana-ui init my-app \
  --framework vite \
  --theme midnight \
  --layout dashboard \
  --density comfortable \
  --skip-install \
  --yes
```

**Options**

| Flag | Values | Description |
|---|---|---|
| `--framework <name>` | `vite` \| `next` | Vite + React + TS, or Next.js App Router |
| `--theme <id>` | any of the 14 presets | See `add-theme --list` for the full set |
| `--density <mode>` | `comfortable` \| `compact` \| `spacious` | Default `comfortable` |
| `--layout <id>` | `dashboard` \| `marketing` \| `ecommerce` \| `editorial` \| `general` | Starter content for the home page |
| `--package-manager <pm>` | `pnpm` \| `npm` \| `yarn` \| `bun` | Auto-detected from `npm_config_user_agent` |
| `--skip-install` | flag | Generate files but don't run install |
| `-y, --yes` | flag | Accept defaults for any unanswered prompt |

**Layouts**

Every layout uses real `@arcana-ui/core` imports and typechecks against the published package — there's no template-only API drift.

| Layout | What you get |
|---|---|
| `dashboard` | Sidebar nav, KPI / stat cards, sortable DataTable. Best for SaaS / admin. |
| `marketing` | Sticky Navbar, centered Hero, FeatureSection grid, PricingCard tier, CTA banner, Footer. Best for landing pages. |
| `ecommerce` | Navbar with cart badge, ProductCard grid with mocked images, Footer. Best for storefronts. |
| `editorial` | ArticleLayout with prose width, AuthorCard, PullQuote, NewsletterSignup, RelatedPosts grid. Best for blogs and journals. |
| `general` | Minimal Navbar + Hero + Footer. A blank canvas. |

### `validate <file>`

Lint a theme JSON file. Checks structure, completeness, reference resolution, and WCAG AA contrast on the key foreground / background pairs.

```bash
npx arcana-ui validate ./my-theme.json
npx arcana-ui validate ./my-theme.json --strict   # warnings → errors
```

**What it checks**

1. **Structure** — top-level `name`, `primitive`, `semantic` blocks
2. **Completeness** — required semantic groups (`background`, `foreground`, `action`, `border`)
3. **References** — every `{primitive.x.y}` token reference resolves
4. **WCAG contrast** — five key pairs against AA thresholds (4.5:1 normal, 3:1 large/UI):
   - `foreground.primary` on `background.surface`
   - `foreground.primary` on `background.page`
   - `foreground.secondary` on `background.surface`
   - `foreground.on-primary` on `action.primary.default`
   - `foreground.on-destructive` on `action.destructive.default`

Exits `1` on any error so it slots into CI pipelines.

> `--fix` is reserved for future autofix support and currently surfaces a notice for failing pairs that could be remediated.

### `add-theme [preset]`

Show how to activate one of the 14 built-in presets. Since `@arcana-ui/tokens` ships every preset pre-built into a single `arcana.css` bundle, "adding" a theme is just setting `data-theme` on `<html>`.

```bash
# Interactive picker
npx arcana-ui add-theme

# Specific preset
npx arcana-ui add-theme midnight

# List all presets
npx arcana-ui add-theme --list
```

The 14 presets: `light` · `dark` · `terminal` · `retro98` · `glass` · `brutalist` · `corporate` · `startup` · `editorial` · `commerce` · `midnight` · `nature` · `neon` · `mono`.

---

## What you get from `init`

A fully working app pinned to `@arcana-ui/core@^0.1.0-beta.2` and `@arcana-ui/tokens@^0.1.0-beta.2`, with:

- The tokens stylesheet imported once at the app root
- The core component stylesheet imported once at the app root
- `data-theme` and `data-density` set on the root element
- The chosen starter layout in `src/App.tsx` (Vite) or `app/page.tsx` (Next.js)

Switch themes by changing one attribute:

```html
<html data-theme="midnight">
```

---

## License

MIT © Arcana UI
