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

// ── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Parse an interface body from raw TypeScript source using regex + heuristics.
 * We avoid requiring the TS compiler API so this runs with zero dependencies.
 */
function extractInterfaces(source) {
  const interfaces = {};
  // Match: export interface FooProps<T> extends ... { ... }
  const interfaceRegex = /export\s+(?:type|interface)\s+(\w+Props\w*)\s*(?:<[^>]*>)?\s*(?:extends\s+[^{]+)?\{/g;
  let match;

  while ((match = interfaceRegex.exec(source)) !== null) {
    const name = match[1];
    const startBrace = match.index + match[0].length - 1;
    const body = extractBalancedBraces(source, startBrace);
    if (body) {
      interfaces[name] = parseInterfaceBody(body);
    }
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
function parseInterfaceBody(body) {
  const props = {};
  // Split by lines and process
  const lines = body.split('\n');
  let currentComment = '';

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Accumulate JSDoc single-line comments: /** ... */
    if (line.startsWith('/**') && line.endsWith('*/')) {
      currentComment = line.replace(/^\/\*\*\s*/, '').replace(/\s*\*\/$/, '').trim();
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

      const prop = parseTypeString(rawType.replace(/;$/, '').trim());
      if (optional) prop.required = false;
      if (currentComment) {
        prop.description = currentComment;
      }

      props[propName] = prop;
      currentComment = '';
    } else {
      // Non-matching line — reset comment only if it's not a comment line
      if (!line.startsWith('//') && !line.startsWith('*') && !line.startsWith('/**') && line !== '') {
        currentComment = '';
      }
    }
  }

  return props;
}

/**
 * Parse a TypeScript type string into a structured prop descriptor.
 */
function parseTypeString(typeStr) {
  const prop = {};

  // Check for union of string literals: 'a' | 'b' | 'c'
  const literalUnionMatch = typeStr.match(/^(['"][\w-]+['"](?:\s*\|\s*['"][\w-]+['"])+)$/);
  if (literalUnionMatch) {
    const values = typeStr
      .split('|')
      .map((s) => s.trim().replace(/['"]/g, ''));
    prop.type = 'enum';
    prop.values = values;
    return prop;
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
      const defaultRegex = /(\w+)\s*=\s*(['"][\w-]+['"]|true|false|\d+(?:\.\d+)?|\[\]|\{\}|null|undefined)/g;
      let dm;
      while ((dm = defaultRegex.exec(destructured)) !== null) {
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
  let match;

  while ((match = reExportRegex.exec(indexSource)) !== null) {
    const names = match[1].split(',').map((n) => n.trim()).filter(Boolean);
    const fromPath = match[2];

    for (const name of names) {
      // Skip type-only exports (they come on separate lines with `export type`)
      exports.push({ name, fromPath });
    }
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
  let resolvedPath = path.resolve(CORE_SRC, fromPath);

  // Try direct .tsx, .ts first (single-file modules)
  for (const ext of ['.tsx', '.ts']) {
    if (fs.existsSync(resolvedPath + ext)) return resolvedPath + ext;
  }

  // If it's a directory, check for barrel → follow re-export → find real source
  const dirIndex = path.join(resolvedPath, 'index.ts');
  const dirIndexTsx = path.join(resolvedPath, 'index.tsx');
  const barrelPath = fs.existsSync(dirIndex) ? dirIndex : fs.existsSync(dirIndexTsx) ? dirIndexTsx : null;

  if (barrelPath) {
    const barrelSource = fs.readFileSync(barrelPath, 'utf-8');
    // Follow re-export: export { Foo } from './Foo'
    const reExport = barrelSource.match(
      new RegExp(`export\\s+\\{[^}]*\\b${name}\\b[^}]*\\}\\s+from\\s+['"]([^'"]+)['"]`)
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
  const interfaces = extractInterfaces(source);

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
    `/\\*\\*\\s*\\n([\\s\\S]*?)\\*/\\s*\\n\\s*export\\s+function\\s+${name}\\b`
  );
  const jsdocMatch = source.match(jsdocRegex);

  let description = '';
  let example = '';

  if (jsdocMatch) {
    const lines = jsdocMatch[1]
      .split('\n')
      .map((l) => l.replace(/^\s*\*\s?/, '').trim());

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
  const returnTypeName = `${name.charAt(0).toUpperCase() + name.slice(1)}Return`
    .replace('use', 'Use');

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
    naming: 'Three-tier architecture: primitives (raw values) → semantic (contextual) → component (scoped)',
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
    fs.readFileSync(path.resolve(ROOT, 'packages/core/package.json'), 'utf-8')
  );

  const components = [];
  const hooks = [];
  const skipped = [];

  for (const entry of allExports) {
    const { name, fromPath } = entry;

    // Skip type-only exports (Props, Options, etc.)
    if (name.endsWith('Props') || name.endsWith('Option') || name.endsWith('Options')) continue;
    // Skip utility type exports
    if (['cn'].includes(name)) continue;
    // Skip type aliases that aren't components or hooks
    if (name.match(/^[A-Z]/) && name.match(/(Data|Config|State|Trend|Target|Action|Feature|Item|Price|Rating|Social|Post|Variant|Size|Padding|Breakpoint|Placement|Alignment|Position)$/)) continue;

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

  // Build manifest
  const manifest = {
    $schema: './scripts/manifest.schema.json',
    release: {
      version: corePkg.version,
      releaseDate: new Date().toISOString().split('T')[0],
      changelog: 'https://github.com/garrettbear/arcana-ui/blob/develop/CHANGELOG.md',
      breaking: [],
      migration: null,
    },
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
    console.log(`\n   ⚠ Skipped:`);
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
  fs.writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2) + '\n');
  console.log(`\n   ✓ Written to ${path.relative(ROOT, MANIFEST_PATH)}`);
}

// ── Drift Detection ──────────────────────────────────────────────────────────

function detectDrift(existing, generated) {
  const drift = [];

  // Compare component lists
  const existingNames = new Set(
    (existing.components || []).map((c) => c.name)
  );
  const generatedNames = new Set(
    (generated.components || []).map((c) => c.name)
  );

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
  const existingMap = Object.fromEntries(
    (existing.components || []).map((c) => [c.name, c])
  );
  const generatedMap = Object.fromEntries(
    (generated.components || []).map((c) => [c.name, c])
  );

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
  const existingHooks = new Set(
    (existing.hooks || []).map((h) => h.name)
  );
  const generatedHooks = new Set(
    (generated.hooks || []).map((h) => h.name)
  );

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
