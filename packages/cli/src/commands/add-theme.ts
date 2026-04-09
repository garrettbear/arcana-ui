/**
 * `arcana-ui add-theme` — show a preset and how to activate it.
 *
 * Since @arcana-ui/tokens ships every preset pre-built into a single
 * arcana.css bundle, "adding" a theme is really just printing the
 * data-theme value the consumer needs to set on <html>. We surface a
 * menu of presets, then echo the activation snippet.
 *
 *   arcana-ui add-theme              # interactive picker
 *   arcana-ui add-theme midnight     # specific preset
 *   arcana-ui add-theme --list       # print all preset ids
 */
import * as log from '../utils/logger.js';
import { PRESETS, isValidPreset } from '../utils/presets.js';
import { askSelect } from '../utils/prompts.js';

export interface AddThemeOptions {
  list?: boolean;
}

export async function runAddTheme(
  themeArg: string | undefined,
  opts: AddThemeOptions,
): Promise<void> {
  log.logo();

  if (opts.list) {
    log.heading('Available presets');
    for (const preset of PRESETS) {
      process.stdout.write(
        `  ${log.pc.cyan(preset.id.padEnd(12))} ${log.pc.dim(preset.description)}\n`,
      );
    }
    process.exit(0);
  }

  let id = themeArg;
  if (id && !isValidPreset(id)) {
    log.error(`Unknown preset "${id}". Run \`arcana-ui add-theme --list\` to see options.`);
    process.exit(1);
  }

  if (!id) {
    id = await askSelect<string>({
      message: 'Pick a preset',
      options: PRESETS.map((p) => ({
        value: p.id,
        label: p.label,
        hint: p.description,
      })),
      initialValue: 'light',
    });
  }

  const preset = PRESETS.find((p) => p.id === id);
  if (!preset) {
    log.error(`Preset "${id}" not found.`);
    process.exit(1);
  }

  log.heading(`Theme: ${preset.label}`);
  log.bullet(preset.description);

  log.heading('Activate it');
  process.stdout.write(
    `\n  ${log.pc.dim('1.')} Make sure the tokens stylesheet is imported once at your app root:\n`,
  );
  process.stdout.write(`     ${log.command("import '@arcana-ui/tokens/dist/arcana.css';")}\n\n`);
  process.stdout.write(
    `  ${log.pc.dim('2.')} Set ${log.pc.bold('data-theme')} on the root element:\n`,
  );
  process.stdout.write(`     ${log.command(`<html data-theme="${preset.id}">`)}\n\n`);
  process.stdout.write(
    `  ${log.pc.dim('3.')} (Optional) Set density: ${log.command('data-density="comfortable"')}\n\n`,
  );

  log.success(`${preset.label} ready to use.`);
}
