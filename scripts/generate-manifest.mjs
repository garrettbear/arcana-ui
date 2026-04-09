#!/usr/bin/env node
/**
 * generate-manifest.mjs
 *
 * Automated manifest.ai.json generation pipeline for Arcana UI.
 *
 * Parses TypeScript source files to extract:
 *   - Component names, categories, and export paths
 *   - Prop interfaces with types, defaults, and JSDoc descriptions
 *   - Hook signatures and return types
 *   - Token metadata from preset JSON files
 *
 * Source of truth: TypeScript source → manifest.ai.json (generated output)
 *
 * Run:   node scripts/generate-manifest.mjs
 * Check: node scripts/generate-manifest.mjs --check (exits 1 if drift detected)
 */

import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const CORE_SRC = path.resolve(ROOT, 'packages/core/src');
const INDEX_PATH = path.resolve(CORE_SRC, 'index.ts');
const TOKENS_PRESETS = path.resolve(ROOT, 'packages/tokens/src/presets');
const MANIFEST_PATH = path.resolve(ROOT, 'manifest.ai.json');
const CHECK_MODE = process.argv.includes('--check');

// ── Release History ──────────────────────────────────────────────────────────
//
// Authoritative list of every published Arcana UI release. AI agents upgrading
// a consumer project from version A to version B iterate this array and apply
// each entry whose `version` is > A and <= B. For any release with breaking
// changes, set `breaking` (list of short strings) and `migration` to the path
// of a guide in `docs/migrations/` (e.g. `'docs/migrations/1.0.0.md'`).
//
// New releases: prepend a new entry at the top. Never mutate historical
// entries — they are public contract for agents doing automated upgrades.
const RELEASE_HISTORY = [
  {
    version: '0.1.0',
    date: '2026-04-09',
    breaking: [],
    migration: null,
    summary:
      'Initial stable release. 108 React components, 14 theme presets, 11 hooks, three-tier token system (2,600+ CSS variables), @arcana-ui/cli scaffolder, @arcana-ui/mcp Model Context Protocol server, Claude Code skill, llms.txt discoverability layer, and 6 demo sites.',
  },
  {
    version: '0.1.0-beta.2',
    date: '2026-04-06',
    breaking: [],
    migration: null,
    summary:
      'Consumer package audit pass. Fixed @arcana-ui/tokens exports map to allow importing ./dist/arcana.css subpath. Rebuilt @arcana-ui/core from current source so all 122 exports (previously 115 in beta.1) are present — useClickOutside, useDrag, useUndoRedo, ColorPicker, FontPicker, BottomSheet, DrawerNav, LogoCloud now ship.',
  },
  {
    version: '0.1.0-beta.1',
    date: '2026-03-24',
    breaking: [],
    migration: null,
    summary:
      'Initial beta release. Foundation phases 0-3 complete: token restructure, color/typography/spacing/elevation/motion systems, responsive mobile-first suite, and 60+ components across navigation, forms, data display, overlays, layout, media, feedback, e-commerce, editorial, and utility categories.',
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Parse an interface body from raw TypeScript source using regex + heuristics.
 * We avoid requiring the TS compiler API so this runs with zero dependencies.
 */
function extractInterfaces(source, typeAliases = {}) {
  const interfaces = {};
  // Match: export interface FooProps<T> extends ... { ... }
  const interfaceRegex =
    /export\s+(?:type|interface)\s+(\w+Props\w*)\s*(?:<[^>]*>)?\s*(?:extends\s+[^{]+)?\{/g;
  let match = interfaceRegex.exec(source);

  while (match !== null) {
    const name = match[1];
    const startBrace = match.index + match[0].length - 1;
    const body = extractBalancedBraces(source, startBrace);
    if (body) {
      interfaces[name] = parseInterfaceBody(body, typeAliases);
    }
    match = interfaceRegex.exec(source);
  }

  return interfaces;
}

/**
 * Extract content within balanced braces starting at position.
 */
function extractBalancedBraces(source, start) {
  let depth = 0;
  let i = start;
  const startInner = start + 1;

  while (i < source.length) {
    if (source[i] === '{') depth++;
    else if (source[i] === '}') {
      depth--;
      if (depth === 0) return source.slice(startInner, i);
    }
    i++;
  }
  return null;
}

/**
 * Parse interface body into prop definitions.
 * Handles JSDoc comments, optional markers, union types, and defaults from JSDoc @default.
 */
function parseInterfaceBody(body, typeAliases = {}) {
  const props = {};
  // Split by lines and process
  const lines = body.split('\n');
  let currentComment = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Accumulate JSDoc single-line comments: /** ... */
    if (line.startsWith('/**') && line.endsWith('*/')) {
      currentComment = line
        .replace(/^\/\*\*\s*/, '')
        .replace(/\s*\*\/$/, '')
        .trim();
      continue;
    }
    if (line.startsWith('/**')) {
      currentComment = '';
      continue;
    }
    if (line.startsWith('*') && !line.startsWith('*/')) {
      const commentLine = line.replace(/^\*\s?/, '').trim();
      if (commentLine) {
        currentComment = currentComment ? `${currentComment} ${commentLine}` : commentLine;
      }
      continue;
    }
    if (line.startsWith('*/')) {
      continue;
    }

    // Match prop definition: name?: type;
    const propMatch = line.match(/^(\w+)(\?)?:\s*(.+?);?\s*$/);
    if (propMatch) {
      const [, propName, optional, rawType] = propMatch;

      // Skip inherited HTML props that aren't explicitly defined
      if (['className', 'style', 'children', 'ref'].includes(propName)) {
        currentComment = '';
        continue;
      }

      const prop = parseTypeString(rawType.replace(/;$/, '').trim(), typeAliases);
      if (optional) prop.required = false;
      if (currentComment) {
        prop.description = currentComment;
      }

      props[propName] = prop;
      currentComment = '';
    } else {
      // Non-matching line — reset comment only if it's not a comment line
      if (
        !line.startsWith('//') &&
        !line.startsWith('*') &&
        !line.startsWith('/**') &&
        line !== ''
      ) {
        currentComment = '';
      }
    }
  }

  return props;
}

/**
 * Parse a TypeScript type string into a structured prop descriptor.
 * If typeAliases is provided, resolves named aliases to their underlying enum values.
 */
function parseTypeString(typeStr, typeAliases = {}) {
  const prop = {};

  // Check for union of string literals: 'a' | 'b' | 'c'
  const literalUnionMatch = typeStr.match(/^(['"][\w-]+['"](?:\s*\|\s*['"][\w-]+['"])+)$/);
  if (literalUnionMatch) {
    const values = typeStr.split('|').map((s) => s.trim().replace(/['"]/g, ''));
    prop.type = 'enum';
    prop.values = values;
    return prop;
  }

  // Check for type alias resolution
  if (typeAliases[typeStr]) {
    return { type: 'enum', values: typeAliases[typeStr] };
  }

  // Check for simple types
  if (typeStr === 'boolean') {
    prop.type = 'boolean';
  } else if (typeStr === 'string') {
    prop.type = 'string';
  } else if (typeStr === 'number') {
    prop.type = 'number';
  } else if (typeStr === 'React.ReactNode' || typeStr === 'ReactNode') {
    prop.type = 'ReactNode';
  } else if (typeStr.includes('React.') || typeStr.includes('ReactNode')) {
    prop.type = typeStr;
  } else if (typeStr.includes('|')) {
    // Mixed union (e.g., string | boolean)
    prop.type = typeStr;
  } else if (typeStr.endsWith('[]')) {
    prop.type = typeStr;
  } else {
    prop.type = typeStr;
  }

  return prop;
}

/**
 * Extract default values from the destructured forwardRef/function component body.
 */
function extractDefaults(source, componentName) {
  const defaults = {};

  // Pattern: { variant = 'primary', size = 'md', ... }
  // Look for destructuring in the component function
  const patterns = [
    // forwardRef pattern
    new RegExp(`${componentName}[\\s\\S]{0,200}?\\(\\s*\\{([^}]+)\\}`, 'm'),
    // function pattern
    new RegExp(`function\\s+${componentName}[\\s\\S]{0,200}?\\(\\s*\\{([^}]+)\\}`, 'm'),
  ];

  for (const pattern of patterns) {
    const match = source.match(pattern);
    if (match) {
      const destructured = match[1];
      // Find all prop = defaultValue patterns
      const defaultRegex =
        /(\w+)\s*=\s*(['"][\w-]+['"]|true|false|\d+(?:\.\d+)?|\[\]|\{\}|null|undefined)/g;
      let dm = defaultRegex.exec(destructured);
      while (dm !== null) {
        let val = dm[2];
        // Clean up string values
        if (val.startsWith("'") || val.startsWith('"')) {
          val = val.replace(/['"]/g, '');
        } else if (val === 'true') {
          val = true;
        } else if (val === 'false') {
          val = false;
        } else if (!Number.isNaN(Number(val))) {
          val = Number(val);
        }
        defaults[dm[1]] = val;
        dm = defaultRegex.exec(destructured);
      }
      break;
    }
  }

  return defaults;
}

/**
 * Determine the category for a component based on its file path.
 */
function categoryFromPath(filePath) {
  if (filePath.includes('/primitives/')) return 'primitives';
  if (filePath.includes('/composites/')) return 'composites';
  if (filePath.includes('/patterns/')) return 'patterns';
  if (filePath.includes('/layout/')) return 'layout';
  if (filePath.includes('/context/')) return 'context';
  if (filePath.includes('/hooks/')) return 'hooks';
  return 'other';
}

// ── Index Parser ─────────────────────────────────────────────────────────────

/**
 * Parse the barrel index.ts to get all exported components, types, and hooks
 * with their source paths.
 */
function parseIndex(indexSource) {
  const exports = [];

  // Match: export { Foo, Bar } from './path';
  const reExportRegex = /export\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
  let match = reExportRegex.exec(indexSource);

  while (match !== null) {
    const names = match[1]
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean);
    const fromPath = match[2];

    for (const name of names) {
      // Skip type-only exports (they come on separate lines with `export type`)
      exports.push({ name, fromPath });
    }
    match = reExportRegex.exec(indexSource);
  }

  // Deduplicate — types and values may share names
  const seen = new Set();
  return exports.filter((e) => {
    if (seen.has(e.name)) return false;
    seen.add(e.name);
    return true;
  });
}

// ── Component Extractor ──────────────────────────────────────────────────────

/**
 * Resolve a module path to the actual source file containing the component definition.
 * Follows barrel re-exports (index.ts) to find the real source.
 */
function resolveSourceFile(name, fromPath) {
  const resolvedPath = path.resolve(CORE_SRC, fromPath);

  // Try direct .tsx, .ts first (single-file modules)
  for (const ext of ['.tsx', '.ts']) {
    if (fs.existsSync(resolvedPath + ext)) return resolvedPath + ext;
  }

  // If it's a directory, check for barrel → follow re-export → find real source
  const dirIndex = path.join(resolvedPath, 'index.ts');
  const dirIndexTsx = path.join(resolvedPath, 'index.tsx');
  const barrelPath = fs.existsSync(dirIndex)
    ? dirIndex
    : fs.existsSync(dirIndexTsx)
      ? dirIndexTsx
      : null;

  if (barrelPath) {
    const barrelSource = fs.readFileSync(barrelPath, 'utf-8');
    // Follow re-export: export { Foo } from './Foo'
    const reExport = barrelSource.match(
      new RegExp(`export\\s+\\{[^}]*\\b${name}\\b[^}]*\\}\\s+from\\s+['"]([^'"]+)['"]`),
    );
    if (reExport) {
      const innerPath = path.resolve(path.dirname(barrelPath), reExport[1]);
      for (const ext of ['.tsx', '.ts']) {
        if (fs.existsSync(innerPath + ext)) return innerPath + ext;
      }
    }

    // If no re-export found for this name, the barrel itself might contain the code
    return barrelPath;
  }

  // Fallback: try ComponentName.tsx directly in directory
  for (const ext of ['.tsx', '.ts']) {
    const direct = path.join(resolvedPath, name + ext);
    if (fs.existsSync(direct)) return direct;
  }

  return null;
}

/**
 * Given an export entry, resolve the source file and extract component metadata.
 */
function extractComponent(entry) {
  const { name, fromPath } = entry;

  const filePath = resolveSourceFile(name, fromPath);

  if (!filePath) {
    return null;
  }

  const source = fs.readFileSync(filePath, 'utf-8');
  const category = categoryFromPath(filePath);

  // Extract type alias declarations (e.g., export type ButtonSize = 'sm' | 'md' | 'lg')
  // Handles both single-line and multi-line formats
  const typeAliases = {};
  const aliasRegex =
    /(?:export\s+)?type\s+(\w+)\s*=\s*((?:['"][\w-]+['"]\s*\|?\s*|\|\s*['"][\w-]+['"]\s*)+);/g;
  let aliasMatch = aliasRegex.exec(source);
  while (aliasMatch !== null) {
    const aliasName = aliasMatch[1];
    const rawValue = aliasMatch[2];
    const values = rawValue.match(/['"][\w-]+['"]/g);
    if (values && values.length >= 2) {
      typeAliases[aliasName] = values.map((v) => v.replace(/['"]/g, ''));
    }
    aliasMatch = aliasRegex.exec(source);
  }

  // Also resolve type aliases from imported types by scanning import sources
  const importRegex = /import\s+(?:type\s+)?\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
  let importMatch = importRegex.exec(source);
  while (importMatch !== null) {
    const importedNames = importMatch[1].split(',').map((n) => n.trim().replace(/\s+as\s+\w+/, ''));
    const importPath = importMatch[2];
    const resolvedImport = path.resolve(path.dirname(filePath), importPath);
    for (const ext of ['.tsx', '.ts']) {
      const importFile = resolvedImport + ext;
      if (fs.existsSync(importFile)) {
        const importSource = fs.readFileSync(importFile, 'utf-8');
        const innerAliasRegex =
          /(?:export\s+)?type\s+(\w+)\s*=\s*((?:['"][\w-]+['"]\s*\|?\s*|\|\s*['"][\w-]+['"]\s*)+);/g;
        let innerMatch = innerAliasRegex.exec(importSource);
        while (innerMatch !== null) {
          if (importedNames.includes(innerMatch[1]) && !typeAliases[innerMatch[1]]) {
            const vals = innerMatch[2].match(/['"][\w-]+['"]/g);
            if (vals && vals.length >= 2) {
              typeAliases[innerMatch[1]] = vals.map((v) => v.replace(/['"]/g, ''));
            }
          }
          innerMatch = innerAliasRegex.exec(importSource);
        }
        break;
      }
    }
    importMatch = importRegex.exec(source);
  }

  const interfaces = extractInterfaces(source, typeAliases);

  // Find the matching props interface for this component
  const propsInterfaceName = `${name}Props`;
  const propsInterface = interfaces[propsInterfaceName];
  const defaults = extractDefaults(source, name);

  // Merge defaults into props
  const props = {};
  if (propsInterface) {
    for (const [propName, propDef] of Object.entries(propsInterface)) {
      props[propName] = { ...propDef };
      if (defaults[propName] !== undefined) {
        props[propName].default = defaults[propName];
      }
    }
  }

  return {
    name,
    category,
    filePath: path.relative(ROOT, filePath),
    propsInterface: propsInterfaceName,
    props,
    hasProps: Object.keys(props).length > 0,
  };
}

// ── Hook Extractor ──────────────────────────────────────────────────────────

function isHook(name) {
  return name.startsWith('use');
}

function extractHookMetadata(name, fromPath) {
  const filePath = resolveSourceFile(name, fromPath);
  if (!filePath) return null;

  const source = fs.readFileSync(filePath, 'utf-8');

  // Extract ONLY the JSDoc block immediately preceding `export function hookName`
  // Use a targeted regex that captures just the last JSDoc before the function
  const jsdocRegex = new RegExp(
    `/\\*\\*\\s*\\n([\\s\\S]*?)\\*/\\s*\\n\\s*export\\s+function\\s+${name}\\b`,
  );
  const jsdocMatch = source.match(jsdocRegex);

  let description = '';
  let example = '';

  if (jsdocMatch) {
    const lines = jsdocMatch[1].split('\n').map((l) => l.replace(/^\s*\*\s?/, '').trim());

    const descLines = [];
    const exampleLines = [];
    let inExample = false;

    for (const line of lines) {
      if (line.startsWith('@example') || line.startsWith('```')) {
        inExample = true;
        if (line.startsWith('```')) exampleLines.push(line);
        continue;
      }
      if (inExample) {
        exampleLines.push(line);
        if (line === '```') inExample = false;
        continue;
      }
      if (line && !line.startsWith('@')) {
        descLines.push(line);
      }
    }

    description = descLines.join(' ').trim();
    if (exampleLines.length) {
      example = exampleLines.join('\n').trim();
    }
  }

  // Extract return type interface
  const returnInterfaces = extractInterfaces(source);
  const returnTypeName = `${name.charAt(0).toUpperCase() + name.slice(1)}Return`.replace(
    'use',
    'Use',
  );

  return {
    name,
    type: 'hook',
    description: description || undefined,
    example: example || undefined,
    returnType: returnInterfaces[returnTypeName] ? returnTypeName : undefined,
    filePath: path.relative(ROOT, filePath),
  };
}

// ── Token Metadata ──────────────────────────────────────────────────────────

function extractTokenMetadata() {
  if (!fs.existsSync(TOKENS_PRESETS)) return {};

  const presetFiles = fs.readdirSync(TOKENS_PRESETS).filter((f) => f.endsWith('.json'));
  const themes = [];

  for (const file of presetFiles) {
    const preset = JSON.parse(fs.readFileSync(path.join(TOKENS_PRESETS, file), 'utf-8'));
    themes.push({
      id: file.replace('.json', ''),
      name: preset.name || file.replace('.json', ''),
      description: preset.description || '',
    });
  }

  // Extract key token categories from a representative preset (light)
  const lightPath = path.join(TOKENS_PRESETS, 'light.json');
  let keyTokens = {};
  if (fs.existsSync(lightPath)) {
    const light = JSON.parse(fs.readFileSync(lightPath, 'utf-8'));
    keyTokens = {
      '--color-action-primary': 'Primary brand color for actions (button, link, highlight)',
      '--color-bg-page': 'Main background surface for page content',
      '--color-fg-primary': 'Primary text color (body text, labels)',
      '--radius-md': 'Medium border radius (commonly used in components)',
      '--shadow-md': 'Medium drop shadow for elevation',
      '--spacing-md': 'Medium spacing unit (used for padding, margin, gaps)',
      '--font-size-base': 'Base text size for body copy',
      '--duration-normal': 'Default animation duration for transitions',
    };
  }

  return {
    categories: ['primitive', 'semantic', 'component'],
    naming:
      'Three-tier architecture: primitives (raw values) → semantic (contextual) → component (scoped)',
    themeSwitch: `Set data-theme attribute on root element: ${themes.map((t) => `'${t.id}'`).join(' | ')}`,
    customization:
      'Override any CSS custom property in your CSS to customize. All tokens are prefixed with -- (e.g., --color-action-primary)',
    themes,
    keyTokens,
  };
}

// ── Manifest Builder ─────────────────────────────────────────────────────────

function buildManifest() {
  const indexSource = fs.readFileSync(INDEX_PATH, 'utf-8');
  const allExports = parseIndex(indexSource);

  // Read package version
  const corePkg = JSON.parse(
    fs.readFileSync(path.resolve(ROOT, 'packages/core/package.json'), 'utf-8'),
  );

  const components = [];
  const hooks = [];
  const skipped = [];

  for (const entry of allExports) {
    const { name, fromPath } = entry;

    // Skip type-only exports (Props, Options, etc.)
    if (name.endsWith('Props') || name.endsWith('Option') || name.endsWith('Options')) continue;
    // Skip utility functions (lowercase, non-hook exports like cn, rgbaToHex, clsx)
    if (/^[a-z]/.test(name) && !name.startsWith('use')) continue;
    // Skip runtime constants re-exported from './version' (e.g., VERSION).
    if (entry.fromPath === './version') continue;
    // Skip type aliases that aren't components or hooks
    if (
      name.match(/^[A-Z]/) &&
      name.match(
        /(Data|Config|State|Trend|Target|Action|Feature|Price|Rating|Social|Post|Variant|Size|Padding|Breakpoint|Placement|Alignment|Position)$/,
      )
    )
      continue;

    if (isHook(name)) {
      const hookMeta = extractHookMetadata(name, fromPath);
      if (hookMeta) {
        hooks.push(hookMeta);
      } else {
        skipped.push({ name, reason: 'hook not found' });
      }
      continue;
    }

    const component = extractComponent(entry);
    if (component) {
      components.push(component);
    } else {
      skipped.push({ name, reason: 'source file not found' });
    }
  }

  // Find the release history entry that matches the current version, if any.
  // This lets the top-level `release` object stay in sync with the changelog
  // entry for the current version (breaking changes, migration link, etc.).
  const currentReleaseEntry = RELEASE_HISTORY.find((r) => r.version === corePkg.version);

  // Build manifest
  const manifest = {
    $schema: './scripts/manifest.schema.json',
    release: {
      version: corePkg.version,
      releaseDate: currentReleaseEntry?.date || new Date().toISOString().split('T')[0],
      changelog: 'https://github.com/Arcana-UI/arcana/blob/main/CHANGELOG.md',
      breaking: currentReleaseEntry?.breaking || [],
      migration: currentReleaseEntry?.migration || null,
    },
    releaseHistory: RELEASE_HISTORY,
    name: '@arcana-ui/core',
    version: corePkg.version,
    description: corePkg.description || 'AI-first React design system with token-driven theming.',
    install: 'npm i @arcana-ui/core @arcana-ui/tokens',
    quickStart: [
      "import '@arcana-ui/tokens/dist/arcana.css'",
      "import { Button, Card, Input } from '@arcana-ui/core'",
      '',
      '// Theme switching — no JS runtime, just CSS',
      "document.documentElement.setAttribute('data-theme', 'dark')",
    ],
    themeSetup: "Set data-theme='light' or data-theme='dark' on <html> element",
    tokens: extractTokenMetadata(),
    components: components
      .filter((c) => c.category !== 'hooks')
      .map((c) => ({
        name: c.name,
        category: c.category,
        import: `import { ${c.name} } from '@arcana-ui/core'`,
        props: c.hasProps ? c.props : undefined,
      })),
    hooks: hooks.map((h) => ({
      name: h.name,
      import: `import { ${h.name} } from '@arcana-ui/core'`,
      description: h.description || undefined,
      returnType: h.returnType || undefined,
    })),
    _generated: {
      at: new Date().toISOString(),
      by: 'scripts/generate-manifest.mjs',
      componentCount: components.length,
      hookCount: hooks.length,
      skipped: skipped.length > 0 ? skipped : undefined,
    },
  };

  return manifest;
}

// ── Main ─────────────────────────────────────────────────────────────────────

function main() {
  console.log('🔮 Arcana UI — Manifest Generator\n');

  const manifest = buildManifest();

  console.log(`   Components: ${manifest._generated.componentCount}`);
  console.log(`   Hooks:      ${manifest._generated.hookCount}`);
  console.log(`   Themes:     ${manifest.tokens.themes?.length || 0}`);

  if (manifest._generated.skipped?.length) {
    console.log('\n   ⚠ Skipped:');
    for (const s of manifest._generated.skipped) {
      console.log(`     - ${s.name}: ${s.reason}`);
    }
  }

  if (CHECK_MODE) {
    // Compare with existing manifest
    if (!fs.existsSync(MANIFEST_PATH)) {
      console.error('\n   ✗ No existing manifest.ai.json found');
      process.exit(1);
    }

    const existing = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf-8'));
    const drift = detectDrift(existing, manifest);

    if (drift.length > 0) {
      console.log('\n   ✗ DRIFT DETECTED between source and manifest:\n');
      for (const d of drift) {
        console.log(`     ${d}`);
      }
      console.log('\n   Run `node scripts/generate-manifest.mjs` to regenerate.');
      process.exit(1);
    } else {
      console.log('\n   ✓ Manifest is in sync with source.');
      process.exit(0);
    }
  }

  // Write manifest
  fs.writeFileSync(MANIFEST_PATH, `${JSON.stringify(manifest, null, 2)}\n`);

  // Run biome format so the output matches repo formatting rules (prevents
  // lint failures after regeneration). We shell out to the local biome binary
  // so generate-docs + CI both produce byte-identical output.
  const biomeBin = path.resolve(ROOT, 'node_modules/.bin/biome');
  if (fs.existsSync(biomeBin)) {
    spawnSync(biomeBin, ['format', '--write', MANIFEST_PATH], {
      stdio: 'ignore',
      cwd: ROOT,
    });
  }

  console.log(`\n   ✓ Written to ${path.relative(ROOT, MANIFEST_PATH)}`);
}

// ── Drift Detection ──────────────────────────────────────────────────────────

function detectDrift(existing, generated) {
  const drift = [];

  // Compare component lists
  const existingNames = new Set((existing.components || []).map((c) => c.name));
  const generatedNames = new Set((generated.components || []).map((c) => c.name));

  for (const name of generatedNames) {
    if (!existingNames.has(name)) {
      drift.push(`+ Component "${name}" exists in source but not in manifest`);
    }
  }
  for (const name of existingNames) {
    if (!generatedNames.has(name)) {
      drift.push(`- Component "${name}" exists in manifest but not in source`);
    }
  }

  // Compare props for shared components
  const existingMap = Object.fromEntries((existing.components || []).map((c) => [c.name, c]));
  const generatedMap = Object.fromEntries((generated.components || []).map((c) => [c.name, c]));

  for (const name of generatedNames) {
    if (!existingNames.has(name)) continue;
    const ePropNames = new Set(Object.keys(existingMap[name].props || {}));
    const gPropNames = new Set(Object.keys(generatedMap[name].props || {}));

    for (const prop of gPropNames) {
      if (!ePropNames.has(prop)) {
        drift.push(`+ ${name}.${prop} — prop exists in source but not in manifest`);
      }
    }
    for (const prop of ePropNames) {
      if (!gPropNames.has(prop)) {
        drift.push(`- ${name}.${prop} — prop exists in manifest but not in source`);
      }
    }
  }

  // Compare hooks
  const existingHooks = new Set((existing.hooks || []).map((h) => h.name));
  const generatedHooks = new Set((generated.hooks || []).map((h) => h.name));

  for (const name of generatedHooks) {
    if (!existingHooks.has(name)) {
      drift.push(`+ Hook "${name}" exists in source but not in manifest`);
    }
  }
  for (const name of existingHooks) {
    if (!generatedHooks.has(name)) {
      drift.push(`- Hook "${name}" exists in manifest but not in source`);
    }
  }

  return drift;
}

main();
