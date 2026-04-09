# Source of Truth Audit

Date: 2026-03-30

## manifest.ai.json
- Components in source (directories): 66
- Components in manifest: 102 (includes sub-components like CardHeader, TabPanel, etc.)
- Match: Sub-component counting is intentional and correct
- Props accuracy: 4/5 spot-checked components fully accurate
  - Button: All 7 props correct, types and defaults match
  - Card: All 3 props correct, defaults match
  - Modal: Core props correct; className/children filtered by design
  - DataTable: All props correct, defaults match
  - Navbar: All props correct, defaults match

## token-component-map.json
- Tokens mapped: 551
- Components mapped: 67
- Spot check --color-bg-surface: 32 components listed, all verified against CSS grep
- Spot check --radius-md: 27 components listed, verified against CSS grep
- Spot check --spacing-md: 28 components listed, verified against CSS grep

## COMPONENT-INVENTORY.md
- Components listed: 102
- Categories: Primitives (12), Composites (20), Layout (5), Patterns (64), Other (1)
- Accuracy: All listed components exist in source and are exported

## COMPONENT-TOKENS.md
- Components documented: 67
- Token accuracy: Verified for Button (14 component tokens, all fallbacks correct), Accordion (5 component tokens), Card, Alert
- CSS properties: Correctly extracted from multiline declarations

## Export verification
- Missing exports: 0
- All 66 component directories have corresponding exports in index.ts

## llms.txt / llms-full.txt
- llms.txt: 161 lines (concise summary)
- llms-full.txt: 1991 lines (well under 5000 limit)
- All 102 components listed
- All 14 themes listed
- All 8 hooks listed
- Usage examples present for components with variant/size props

## Version sync
- package.json: 0.1.0-beta.1
- manifest.ai.json: 0.1.0-beta.1
- Match: Yes

## Pipeline Performance
- Full generation time: 0.1s (well under 10s target)
- Idempotent: Running twice produces identical output (verified)

## Issues Found
None requiring fixes. All checks passing.

## Notes
- The manifest intentionally filters `className`, `children`, `style`, and `ref` props since they are inherited HTML attributes present on all components.
- Sub-components (CardHeader, TabPanel, AccordionItem, etc.) are counted as separate manifest entries, which is correct for AI agent discovery.
- The token-component-map includes both direct `var()` references and indirect usage via component token fallbacks.
