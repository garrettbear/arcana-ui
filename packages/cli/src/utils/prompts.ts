/**
 * Thin wrapper around @clack/prompts. Centralises cancel handling so
 * each command can call prompts and trust that a Ctrl-C bails out
 * cleanly with a friendly message instead of a stack trace.
 */
import { cancel, isCancel, select, text } from '@clack/prompts';

export async function askText(options: {
  message: string;
  placeholder?: string;
  initialValue?: string;
  validate?: (value: string) => string | undefined;
}): Promise<string> {
  const result = await text(options);
  if (isCancel(result)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }
  return result as string;
}

export async function askSelect<T extends string>(options: {
  message: string;
  options: { value: T; label: string; hint?: string }[];
  initialValue?: T;
}): Promise<T> {
  const result = await select(options);
  if (isCancel(result)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }
  return result as T;
}

export { confirm, isCancel, cancel } from '@clack/prompts';
