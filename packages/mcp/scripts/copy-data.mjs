#!/usr/bin/env node
/**
 * copy-data.mjs
 *
 * Pre-build script: bundles Arcana's generated data files into packages/mcp/src/data/
 * so the MCP server can be published to npm as a fully self-contained package.
 *
 * Sources (from monorepo root):
 *   manifest.ai.json                       → src/data/manifest.json
 *   docs/generated/token-component-map.json → src/data/token-map.json
 *   packages/tokens/src/presets/*.json     → src/data/presets/
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// packages/mcp/ is 2 levels up from scripts/
const PKG_ROOT = path.resolve(__dirname, '..');
const MONO_ROOT = path.resolve(PKG_ROOT, '../..');
const DATA_DIR = path.resolve(PKG_ROOT, 'src/data');
const PRESETS_DIR = path.resolve(DATA_DIR, 'presets');

// Ensure output directories exist
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(PRESETS_DIR, { recursive: true });

// Copy manifest.ai.json
const manifestSrc = path.resolve(MONO_ROOT, 'manifest.ai.json');
if (!fs.existsSync(manifestSrc)) {
  console.error('ERROR: manifest.ai.json not found. Run: pnpm generate-docs');
  process.exit(1);
}
fs.copyFileSync(manifestSrc, path.resolve(DATA_DIR, 'manifest.json'));
console.log('  Copied manifest.ai.json → src/data/manifest.json');

// Copy token-component-map.json
const tokenMapSrc = path.resolve(MONO_ROOT, 'docs/generated/token-component-map.json');
if (!fs.existsSync(tokenMapSrc)) {
  console.error('ERROR: token-component-map.json not found. Run: pnpm generate-docs');
  process.exit(1);
}
fs.copyFileSync(tokenMapSrc, path.resolve(DATA_DIR, 'token-map.json'));
console.log('  Copied token-component-map.json → src/data/token-map.json');

// Copy all preset JSON files
const presetsDir = path.resolve(MONO_ROOT, 'packages/tokens/src/presets');
if (!fs.existsSync(presetsDir)) {
  console.error('ERROR: packages/tokens/src/presets/ not found');
  process.exit(1);
}
const presets = fs.readdirSync(presetsDir).filter((f) => f.endsWith('.json'));
for (const preset of presets) {
  fs.copyFileSync(path.resolve(presetsDir, preset), path.resolve(PRESETS_DIR, preset));
}
console.log(`  Copied ${presets.length} presets → src/data/presets/`);
console.log('Data copy complete.');
