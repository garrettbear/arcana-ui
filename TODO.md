# Arcana UI — TODO

## Priority: Now
- [x] GitHub repo setup
- [x] Vercel deployment — fix absolute path in vite config
- [ ] Component testing (Vitest + Testing Library)

## Infra: Version Control & Environments
- [ ] Branch strategy: `main` (production) + `develop` (staging)
- [ ] Vercel preview deployments on PRs (automatic with Vercel + GitHub)
- [ ] Production domain: arcana-ui.dev or similar
- [ ] Staging: auto-deployed from `develop` branch
- [ ] Semantic versioning (semver) for npm packages
- [ ] Changesets for managing version bumps + changelogs

## Priority: Next Build Session
### Typography System Upgrade
- [ ] Google Fonts browser — searchable list of fonts to apply
- [ ] Multiple font slots: Display/Marketing font + Body font + Mono font
- [ ] Local font file upload — drag & drop .woff2/.ttf to test custom fonts
- [ ] Type scale editor (like typescale.com):
  - Base size slider
  - Scale ratio selector (1.067 Minor Second → 1.618 Golden Ratio)
  - Preview all heading sizes + body + small text
  - Line height per level
  - Letter spacing per level
- [ ] Spacing scale editor — visual spacing tokens with preview

### Component Testing
- [ ] Set up Vitest + React Testing Library
- [ ] Unit tests for all 22 components
- [ ] Accessibility tests (jest-axe) for every component
- [ ] Visual regression tests (optional, Phase 2)

### Research
- [ ] Study typescale.com — features, UX patterns, what to learn from
- [ ] Legal: terms of service, privacy policy, open source governance
- [ ] Non-profit vs open source foundation vs just MIT license
- [ ] Look at how shadcn/ui, Radix, Chakra handle legal/org structure

## Priority: Future
- [ ] AI chat in playground ("make it Windows 98")
- [ ] Screenshot → theme generation
- [ ] MCP server (@arcana-ui/mcp)
- [ ] Community theme gallery
- [ ] npm publish
- [ ] Figma kit
- [ ] More components (Phase 2 list in SPEC.md)
- [ ] Color blindness preview filters
- [ ] Focus order visualizer
- [ ] llms.txt
