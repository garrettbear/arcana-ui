/**
 * Styled terminal output for the Arcana CLI.
 *
 * Uses picocolors for ANSI styling (tiny, zero deps). Implements a small
 * spinner without pulling in ora/cli-spinners so the cold-start footprint
 * of `npx arcana-ui` stays fast.
 */
import pc from 'picocolors';

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
const CHECK = pc.green('✓');
const CROSS = pc.red('✗');
const WARN = pc.yellow('⚠');
const INFO = pc.blue('ℹ');
const DOT = pc.dim('·');

const isTTY = process.stdout.isTTY === true;

/** Arcana wordmark block — printed once at the top of each command. */
export function logo(): void {
  // Box is 49 chars wide (47 inside + 2 borders).
  const top = pc.dim('┌───────────────────────────────────────────────┐');
  const bot = pc.dim('└───────────────────────────────────────────────┘');
  const mid = pc.dim('│                                               │');
  const titleRaw = '  ✦ Arcana UI  ·  tokens in, beautiful UI out';
  const styled = `  ${pc.bold(pc.magenta('✦ Arcana UI'))}  ${pc.dim('·')}  ${pc.white('tokens in, beautiful UI out')}`;
  const padding = ' '.repeat(Math.max(0, 47 - titleRaw.length));
  const titleLine = `${pc.dim('│')}${styled}${padding}${pc.dim('│')}`;
  process.stdout.write(`\n${top}\n${mid}\n${titleLine}\n${mid}\n${bot}\n\n`);
}

/** Subtle divider between sections. */
export function divider(): void {
  process.stdout.write(`${pc.dim('─'.repeat(47))}\n`);
}

/** Blue info line with a leading icon. */
export function info(message: string): void {
  process.stdout.write(`${INFO} ${message}\n`);
}

/** Green checkmark + message. */
export function success(message: string): void {
  process.stdout.write(`${CHECK} ${message}\n`);
}

/** Red X + message. */
export function error(message: string): void {
  process.stderr.write(`${CROSS} ${pc.red(message)}\n`);
}

/** Yellow triangle + message. */
export function warn(message: string): void {
  process.stdout.write(`${WARN} ${pc.yellow(message)}\n`);
}

/** Dim bullet line (for nested listings). */
export function bullet(message: string): void {
  process.stdout.write(`  ${DOT} ${pc.dim(message)}\n`);
}

/** Section heading (bold, padded). */
export function heading(label: string): void {
  process.stdout.write(`\n${pc.bold(label)}\n`);
}

export interface Step {
  succeed(message?: string): void;
  fail(message?: string): void;
  update(message: string): void;
}

/**
 * Start a step with a rolling spinner. Returns a handle the caller must
 * resolve with `.succeed()` or `.fail()`. Elapsed time is appended
 * automatically, formatted in seconds (e.g. "(2.1s)").
 *
 * In non-TTY environments (CI, piped output) the spinner degrades to a
 * single line written on completion so we never emit 100 half-finished
 * frames into a log file.
 */
export function step(initialMessage: string): Step {
  const started = Date.now();
  let current = initialMessage;
  let frame = 0;
  let interval: NodeJS.Timeout | undefined;
  let stopped = false;

  const render = (): void => {
    if (!isTTY || stopped) return;
    process.stdout.write(`\r  ${pc.cyan(FRAMES[frame])} ${current}   `);
    frame = (frame + 1) % FRAMES.length;
  };

  if (isTTY) {
    // Hide cursor while spinning; restore on stop.
    process.stdout.write('\x1b[?25l');
    render();
    interval = setInterval(render, 80);
  }

  const finish = (icon: string, finalMessage: string): void => {
    if (stopped) return;
    stopped = true;
    if (interval) clearInterval(interval);
    const elapsed = ((Date.now() - started) / 1000).toFixed(1);
    if (isTTY) {
      // Clear the spinner line and restore cursor before writing the final state.
      process.stdout.write('\r\x1b[2K');
      process.stdout.write('\x1b[?25h');
    }
    process.stdout.write(`  ${icon} ${finalMessage} ${pc.dim(`(${elapsed}s)`)}\n`);
  };

  return {
    update(message) {
      current = message;
    },
    succeed(message) {
      finish(CHECK, message ?? current);
    },
    fail(message) {
      finish(CROSS, message ?? current);
    },
  };
}

/** Terminal "done" block with total elapsed timing and a closing rule. */
export function done(message: string, totalMs: number): void {
  const elapsed = (totalMs / 1000).toFixed(1);
  process.stdout.write(`\n${CHECK} ${pc.bold(pc.green(message))} ${pc.dim(`(${elapsed}s)`)}\n`);
}

/** Dim inline command snippet (for next-steps blocks). */
export function command(cmd: string): string {
  return pc.cyan(cmd);
}

/** Plain dim label. */
export function label(text: string): string {
  return pc.dim(text);
}

export { pc };
