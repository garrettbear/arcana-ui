/**
 * Utility for composing CSS class names.
 * Filters out falsy values and joins with spaces.
 *
 * @example
 * cn('btn', isActive && 'btn--active', className)
 */
export function cn(...classes: (string | undefined | null | false | 0)[]): string {
  return classes.filter(Boolean).join(' ')
}
