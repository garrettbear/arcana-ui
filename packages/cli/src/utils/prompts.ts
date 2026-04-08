/**
 * Thin wrapper around @clack/prompts. Centralises cancel handling so
 * each command can call prompts and trust that a Ctrl-C bails out
 * cleanly with a friendly message instead of a stack trace.
 */
import {
  type SelectOptions,
  type TextOptions,
  cancel,
  isCancel,
  select,
  text,
} from '@clack/prompts';

export async function askText(options: TextOptions): Promise<string> {
  const result = await text(options);
  if (isCancel(result)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }
  return result as string;
}

export async function askSelect<T extends string>(options: SelectOptions<T>): Promise<T> {
  const result = await select(options);
  if (isCancel(result)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }
  return result as T;
}

export { confirm, isCancel, cancel } from '@clack/prompts';
