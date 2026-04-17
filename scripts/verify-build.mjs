#!/usr/bin/env node
/**
 * verify-build.mjs
 *
 * Post-build smoke test for @arcana-ui/core. Guards against issue #119,
 * where dist/index.mjs shipped with `var <Component>_default = {};` for
 * every CSS-module import — every component rendered with `class=""`.
 *
 * Run AFTER `pnpm build` and BEFORE `npm publish`. Exit code 1 on failure.
 *
 * Three checks:
 *   1. Grep the JS bundle for any `_default = {}` patterns. Zero tolerance.
 *   2. renderToString five flagship components; assert a non-empty class
 *      attribute on the rendered root element.
 *   3. Sanity-check dist/index.css — at least 100 rules, contains the
 *      hashed selectors that the JS map references.
 */

import * as fs from 'node:fs';
import { createRequire } from 'node:module';
import * as path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const CORE_DIR = path.resolve(ROOT, 'packages/core');
const CORE_DIST = path.resolve(CORE_DIR, 'dist');
const JS_PATH = path.resolve(CORE_DIST, 'index.mjs');
const CSS_PATH = path.resolve(CORE_DIST, 'index.css');

// React is a peer dep of @arcana-ui/core and installed in its node_modules.
// The verify-build script lives at the repo root, so we resolve the dev
// copies of React through the core package.
const requireFromCore = createRequire(path.join(CORE_DIR, 'package.json'));
const React = requireFromCore('react');
const { renderToString } = requireFromCore('react-dom/server');

function fail(message) {
  console.error(`\x1b[31m✗ ${message}\x1b[0m`);
  process.exit(1);
}

function pass(message) {
  console.log(`\x1b[32m✓\x1b[0m ${message}`);
}

// ─── Precondition: built artifacts exist ─────────────────────────────────────

if (!fs.existsSync(JS_PATH)) {
  fail(`Missing ${path.relative(ROOT, JS_PATH)} — run \`pnpm build\` first.`);
}
if (!fs.existsSync(CSS_PATH)) {
  fail(`Missing ${path.relative(ROOT, CSS_PATH)} — run \`pnpm build\` first.`);
}

// ─── Check 1: no empty CSS-module maps ───────────────────────────────────────

const jsSource = fs.readFileSync(JS_PATH, 'utf8');
const emptyMapRegex = /var\s+([A-Za-z_][\w$]*_default)\s*=\s*\{\s*\}\s*;/g;
const emptyMatches = [];
for (const m of jsSource.matchAll(emptyMapRegex)) {
  emptyMatches.push(m[1]);
}

if (emptyMatches.length > 0) {
  console.error(
    `\x1b[31m✗ Found ${emptyMatches.length} empty CSS-module map(s) in dist/index.mjs:\x1b[0m`,
  );
  for (const name of emptyMatches.slice(0, 10)) {
    console.error(`    ${name}`);
  }
  if (emptyMatches.length > 10) {
    console.error(`    ... and ${emptyMatches.length - 10} more`);
  }
  console.error('\nThis is the exact bug from issue #119 — components will render with class="".');
  process.exit(1);
}
pass('No empty CSS-module maps found in dist/index.mjs');

// ─── Check 2: render five components, assert non-empty className ─────────────

const pkgUrl = pathToFileURL(JS_PATH).href;
const core = await import(pkgUrl);

const required = ['Button', 'Navbar', 'Card', 'Input', 'Container'];
const missing = required.filter((name) => {
  const v = core[name];
  return v == null || (typeof v !== 'function' && typeof v !== 'object');
});
if (missing.length > 0) {
  fail(`Missing exports from @arcana-ui/core: ${missing.join(', ')}`);
}

const cases = [
  { name: 'Button', element: React.createElement(core.Button, { variant: 'primary' }, 'Test') },
  {
    name: 'Navbar',
    element: React.createElement(core.Navbar, { sticky: true, border: true }, 'content'),
  },
  { name: 'Card', element: React.createElement(core.Card, null, 'card content') },
  {
    name: 'Input',
    element: React.createElement(core.Input, { placeholder: 'type here' }),
  },
  {
    name: 'Container',
    element: React.createElement(core.Container, null, 'container content'),
  },
];

const classAttrRegex = /^<[a-zA-Z][^>]*?\sclass="([^"]*)"/;
const failures = [];
const renderedClasses = new Set();

for (const { name, element } of cases) {
  let html;
  try {
    html = renderToString(element);
  } catch (err) {
    failures.push(`${name}: render threw — ${err.message}`);
    continue;
  }
  const classMatch = html.match(classAttrRegex);
  if (!classMatch) {
    failures.push(
      `${name}: rendered root element has no class attribute. HTML: ${html.slice(0, 200)}`,
    );
    continue;
  }
  const classList = classMatch[1].trim();
  if (classList === '') {
    failures.push(
      `${name}: rendered root element has class="" (empty). HTML: ${html.slice(0, 200)}`,
    );
    continue;
  }
  for (const cls of classList.split(/\s+/)) {
    renderedClasses.add(cls);
  }
}

if (failures.length > 0) {
  console.error('\x1b[31m✗ Render smoke test failed:\x1b[0m');
  for (const f of failures) {
    console.error(`    ${f}`);
  }
  process.exit(1);
}
pass(`${cases.length}/${cases.length} components render with non-empty class attributes`);

// ─── Check 3: CSS file sanity ────────────────────────────────────────────────

const cssSource = fs.readFileSync(CSS_PATH, 'utf8');

const ruleCount = (cssSource.match(/\{/g) || []).length;
if (ruleCount < 100) {
  fail(`dist/index.css only has ${ruleCount} rules (expected ≥ 100) — build is incomplete`);
}

const missingInCss = [];
for (const cls of renderedClasses) {
  // Skip third-party className passthroughs or className`="" parts
  if (!cls || cls.startsWith('arcana-')) continue;
  if (!cssSource.includes(`.${cls}`)) {
    missingInCss.push(cls);
  }
}
if (missingInCss.length > 0) {
  console.error(
    `\x1b[31m✗ ${missingInCss.length} class(es) referenced by components are missing from dist/index.css:\x1b[0m`,
  );
  for (const cls of missingInCss.slice(0, 10)) {
    console.error(`    .${cls}`);
  }
  process.exit(1);
}
pass(`dist/index.css contains ${ruleCount} rules and every rendered class has a matching selector`);

console.log('\n\x1b[32m✓ Build verification passed. Build is safe to publish.\x1b[0m');
