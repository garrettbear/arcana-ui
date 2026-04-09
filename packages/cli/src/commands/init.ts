import { spawn } from 'node:child_process';
/**
 * `arcana-ui init` — interactive (or non-interactive) project scaffolder.
 *
 * Flow:
 *   1. Resolve options (CLI flags > prompts > defaults)
 *   2. Pick directory + abort if non-empty
 *   3. Generate framework files (vite or next) + chosen layout
 *   4. Optionally install deps with the user's package manager
 *   5. Print next-steps banner
 *
 * Designed to be runnable non-interactively for tests / CI:
 *
 *   arcana-ui init my-app --framework vite --theme midnight \
 *     --layout dashboard --density comfortable --skip-install --yes
 */
import { existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { LAYOUTS, type LayoutId, getLayout } from '../templates/layouts.js';
import {
  type NextTemplateOptions,
  nextConfig,
  nextEnvDts,
  nextGitignore,
  nextLayout,
  nextPackageJson,
  nextPage,
  nextTsconfig,
} from '../templates/next.js';
import {
  type ViteTemplateOptions,
  viteApp,
  viteConfig,
  viteGitignore,
  viteIndexHtml,
  viteMain,
  vitePackageJson,
  viteTsconfig,
} from '../templates/vite.js';
import * as log from '../utils/logger.js';
import { PRESETS, isValidPreset } from '../utils/presets.js';
import { askSelect, askText } from '../utils/prompts.js';

export interface InitOptions {
  framework?: 'vite' | 'next';
  theme?: string;
  density?: 'comfortable' | 'compact' | 'spacious';
  layout?: LayoutId;
  skipInstall?: boolean;
  packageManager?: 'pnpm' | 'npm' | 'yarn' | 'bun';
  yes?: boolean;
}

const FRAMEWORKS = [
  { value: 'vite', label: 'Vite + React + TypeScript', hint: 'Fastest dev loop' },
  { value: 'next', label: 'Next.js (App Router)', hint: 'SSR + RSC' },
] as const;

const DENSITIES = [
  { value: 'comfortable', label: 'Comfortable', hint: 'Default — balanced spacing' },
  { value: 'compact', label: 'Compact', hint: 'Tighter — info-dense UIs' },
  { value: 'spacious', label: 'Spacious', hint: 'Roomier — landing pages' },
] as const;

/** Detect which package manager invoked us, falling back to pnpm. */
function detectPackageManager(): 'pnpm' | 'npm' | 'yarn' | 'bun' {
  const ua = process.env.npm_config_user_agent ?? '';
  if (ua.startsWith('pnpm')) return 'pnpm';
  if (ua.startsWith('yarn')) return 'yarn';
  if (ua.startsWith('bun')) return 'bun';
  if (ua.startsWith('npm')) return 'npm';
  return 'pnpm';
}

function writeFile(filePath: string, contents: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, contents, 'utf8');
}

function isDirEmpty(dir: string): boolean {
  if (!existsSync(dir)) return true;
  return readdirSync(dir).length === 0;
}

function runInstall(cwd: string, manager: 'pnpm' | 'npm' | 'yarn' | 'bun'): Promise<void> {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(manager, ['install'], {
      cwd,
      stdio: 'ignore',
      env: process.env,
      shell: process.platform === 'win32',
    });
    child.on('error', rejectPromise);
    child.on('exit', (code) => {
      if (code === 0) resolvePromise();
      else rejectPromise(new Error(`${manager} install exited with code ${code}`));
    });
  });
}

export async function runInit(projectArg: string | undefined, opts: InitOptions): Promise<void> {
  const startedAt = Date.now();
  log.logo();

  // 1. Project name -------------------------------------------------------
  const projectName =
    projectArg ??
    (opts.yes
      ? 'arcana-app'
      : await askText({
          message: 'Project name',
          placeholder: 'my-arcana-app',
          initialValue: 'my-arcana-app',
          validate: (v) => {
            if (!v.trim()) return 'Project name is required';
            if (!/^[a-z0-9][a-z0-9-_]*$/i.test(v))
              return 'Use letters, numbers, dashes, and underscores only';
            return undefined;
          },
        }));

  const targetDir = resolve(process.cwd(), projectName);
  if (!isDirEmpty(targetDir)) {
    log.error(`Directory "${projectName}" already exists and is not empty.`);
    process.exit(1);
  }

  // 2. Framework ----------------------------------------------------------
  const framework =
    opts.framework ??
    (opts.yes
      ? 'vite'
      : await askSelect<'vite' | 'next'>({
          message: 'Framework',
          options: FRAMEWORKS.map((f) => ({ ...f })),
          initialValue: 'vite',
        }));

  // 3. Theme --------------------------------------------------------------
  let theme = opts.theme ?? 'light';
  if (opts.theme && !isValidPreset(opts.theme)) {
    log.error(`Unknown theme "${opts.theme}". Run \`arcana-ui add-theme --list\` to see options.`);
    process.exit(1);
  }
  if (!opts.theme && !opts.yes) {
    theme = await askSelect<string>({
      message: 'Theme preset',
      options: PRESETS.map((p) => ({
        value: p.id,
        label: p.label,
        hint: p.description,
      })),
      initialValue: 'light',
    });
  }

  // 4. Density ------------------------------------------------------------
  const density =
    opts.density ??
    (opts.yes
      ? 'comfortable'
      : await askSelect<'comfortable' | 'compact' | 'spacious'>({
          message: 'Density',
          options: DENSITIES.map((d) => ({ ...d })),
          initialValue: 'comfortable',
        }));

  // 5. Layout -------------------------------------------------------------
  const layout =
    opts.layout ??
    (opts.yes
      ? 'general'
      : await askSelect<LayoutId>({
          message: 'Starter layout',
          options: LAYOUTS.map((l) => ({
            value: l.id,
            label: l.label,
            hint: l.description,
          })),
          initialValue: 'general',
        }));

  // 6. Scaffold -----------------------------------------------------------
  log.heading('Scaffolding');
  const scaffoldStep = log.step(`Creating ${projectName}/`);
  try {
    mkdirSync(targetDir, { recursive: true });
    const layoutSource = getLayout(layout);

    if (framework === 'vite') {
      const tplOpts: ViteTemplateOptions = {
        projectName,
        theme,
        density,
        appBody: layoutSource.body,
        appImports: layoutSource.imports,
      };
      writeFile(`${targetDir}/package.json`, vitePackageJson(tplOpts));
      writeFile(`${targetDir}/vite.config.ts`, viteConfig());
      writeFile(`${targetDir}/tsconfig.json`, viteTsconfig());
      writeFile(`${targetDir}/index.html`, viteIndexHtml(tplOpts));
      writeFile(`${targetDir}/src/main.tsx`, viteMain());
      writeFile(`${targetDir}/src/App.tsx`, viteApp(tplOpts));
      writeFile(`${targetDir}/.gitignore`, viteGitignore());
    } else {
      const tplOpts: NextTemplateOptions = {
        projectName,
        theme,
        density,
        appBody: layoutSource.body,
        appImports: layoutSource.imports,
      };
      writeFile(`${targetDir}/package.json`, nextPackageJson(tplOpts));
      writeFile(`${targetDir}/next.config.mjs`, nextConfig());
      writeFile(`${targetDir}/tsconfig.json`, nextTsconfig());
      writeFile(`${targetDir}/next-env.d.ts`, nextEnvDts());
      writeFile(`${targetDir}/app/layout.tsx`, nextLayout(tplOpts));
      writeFile(`${targetDir}/app/page.tsx`, nextPage(tplOpts));
      writeFile(`${targetDir}/.gitignore`, nextGitignore());
    }

    scaffoldStep.succeed(`Created ${projectName}/`);
  } catch (err) {
    scaffoldStep.fail(`Failed to create ${projectName}/`);
    log.error((err as Error).message);
    process.exit(1);
  }

  // 7. Install ------------------------------------------------------------
  const manager = opts.packageManager ?? detectPackageManager();
  if (!opts.skipInstall) {
    const installStep = log.step(`Installing dependencies with ${manager}`);
    try {
      await runInstall(targetDir, manager);
      installStep.succeed(`Installed dependencies with ${manager}`);
    } catch (err) {
      installStep.fail(`${manager} install failed`);
      log.warn((err as Error).message);
      log.warn(`Run \`${manager} install\` manually inside ${projectName}/`);
    }
  } else {
    log.bullet(`Skipped install — run \`${manager} install\` when ready.`);
  }

  // 8. Next steps ---------------------------------------------------------
  log.heading('Next steps');
  log.bullet(`cd ${projectName}`);
  if (opts.skipInstall) log.bullet(`${manager} install`);
  log.bullet(framework === 'vite' ? `${manager} run dev` : `${manager} run dev`);
  log.bullet(
    `Open the app and try changing data-theme on <${framework === 'vite' ? 'html' : 'html'}>`,
  );

  log.done(`Project ready in ${projectName}/`, Date.now() - startedAt);
}
