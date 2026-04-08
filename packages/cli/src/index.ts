/**
 * Entry point for the @arcana-ui/cli binary. Wires three commands
 * (init / validate / add-theme) onto a single commander program.
 *
 * The shebang is injected by tsup at build time (see tsup.config.ts).
 */
import { Command } from 'commander';

import { runAddTheme } from './commands/add-theme.js';
import { runInit } from './commands/init.js';
import { runValidate } from './commands/validate.js';
import * as log from './utils/logger.js';

const program = new Command();

program
  .name('arcana-ui')
  .description('Scaffold and manage Arcana UI projects')
  .version('0.1.0-beta.1');

program
  .command('init [project-name]')
  .description('Scaffold a new Arcana UI project')
  .option('--framework <name>', 'vite | next')
  .option('--theme <id>', 'preset id (light, dark, midnight, ...)')
  .option('--density <mode>', 'comfortable | compact | spacious')
  .option('--layout <id>', 'dashboard | marketing | ecommerce | editorial | general')
  .option('--package-manager <pm>', 'pnpm | npm | yarn | bun')
  .option('--skip-install', 'do not run install after scaffolding')
  .option('-y, --yes', 'accept defaults for any unanswered prompt')
  .action(async (projectName, opts) => {
    try {
      await runInit(projectName, opts);
    } catch (err) {
      log.error((err as Error).message);
      process.exit(1);
    }
  });

program
  .command('validate <file>')
  .description('Validate a theme JSON file (structure, references, WCAG)')
  .option('--fix', 'attempt to autofix issues (limited)')
  .option('--strict', 'treat warnings as errors')
  .action(async (file, opts) => {
    try {
      await runValidate(file, opts);
    } catch (err) {
      log.error((err as Error).message);
      process.exit(1);
    }
  });

program
  .command('add-theme [preset]')
  .description('Show how to activate a built-in theme preset')
  .option('--list', 'list all available presets')
  .action(async (preset, opts) => {
    try {
      await runAddTheme(preset, opts);
    } catch (err) {
      log.error((err as Error).message);
      process.exit(1);
    }
  });

program.parseAsync(process.argv).catch((err) => {
  log.error((err as Error).message);
  process.exit(1);
});
