#!/usr/bin/env node
// Publish an npm package only if its package.json version is not already
// on the registry. Used by .github/workflows/release.yml so a tag that
// only bumps one package doesn't fail the whole job on "version already
// exists" from the untouched packages.
//
// Usage: node .github/scripts/publish-if-new.mjs <packageDir>
//   where <packageDir> is a path relative to the repo root, e.g. packages/core.
//
// Exits 0 on successful publish OR already-published skip.
// Exits non-zero on any other failure (missing dir, bad json, publish error
// that isn't E409/EPUBLISHCONFLICT, registry unreachable).

import { execSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const pkgDir = process.argv[2];
if (!pkgDir) {
  console.error('usage: publish-if-new.mjs <packageDir>');
  process.exit(2);
}

const pkgPath = resolve(pkgDir, 'package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf8'));
const { name, version } = pkg;

if (!name || !version) {
  console.error(`[publish-if-new] ${pkgPath} is missing name or version`);
  process.exit(2);
}

// `npm view` exits 0 + empty stdout when the version doesn't exist, or
// exits 0 + prints the version when it does. Registry errors exit non-zero.
const view = spawnSync('npm', ['view', `${name}@${version}`, 'version'], {
  encoding: 'utf8',
});

if (view.status !== 0 && !/E404/.test(view.stderr || '')) {
  console.error(`[publish-if-new] npm view failed for ${name}@${version}`);
  console.error(view.stderr);
  process.exit(view.status || 1);
}

const exists = (view.stdout || '').trim() === version;
if (exists) {
  console.log(`[publish-if-new] ${name}@${version} already published, skipping.`);
  process.exit(0);
}

console.log(`[publish-if-new] publishing ${name}@${version} from ${pkgDir}`);
execSync('npm publish --access public', {
  cwd: resolve(pkgDir),
  stdio: 'inherit',
});
