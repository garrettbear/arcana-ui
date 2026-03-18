import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './CommandPalette.module.css';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CommandItem {
  /** Unique identifier */
  id: string;
  /** Display label */
  label: string;
  /** Optional description */
  description?: string;
  /** Optional icon */
  icon?: React.ReactNode;
  /** Keyboard shortcut display (e.g., "⌘S") */
  shortcut?: string;
  /** Group name (e.g., "Navigation", "Actions") */
  group?: string;
  /** Whether the item is disabled */
  disabled?: boolean;
  /** Custom select handler */
  onSelect?: () => void;
}

export interface CommandPaletteProps {
  /** Whether the palette is visible */
  open: boolean;
  /** Callback fired when the palette should close */
  onClose: () => void;
  /** Static list of command items */
  items?: CommandItem[];
  /** Callback fired when an item is selected */
  onSelect?: (item: CommandItem) => void;
  /** Async search function for dynamic results */
  onSearch?: (query: string) => CommandItem[] | Promise<CommandItem[]>;
  /** Placeholder text in the search input */
  placeholder?: string;
  /** Content shown when no results match */
  emptyState?: React.ReactNode;
  /** Whether to group items by their group property */
  groups?: boolean;
  /** Additional CSS class */
  className?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

function filterItems(items: CommandItem[], query: string): CommandItem[] {
  if (!query.trim()) return items;
  const lower = query.toLowerCase();
  return items.filter(
    (item) =>
      item.label.toLowerCase().includes(lower) || item.description?.toLowerCase().includes(lower),
  );
}

function groupItems(items: CommandItem[]): Map<string, CommandItem[]> {
  const groups = new Map<string, CommandItem[]>();
  for (const item of items) {
    const key = item.group ?? '';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)?.push(item);
  }
  return groups;
}

// ─── CommandPalette ─────────────────────────────────────────────────────────

export const CommandPalette = React.forwardRef<HTMLDivElement, CommandPaletteProps>(
  (
    {
      open,
      onClose,
      items = [],
      onSelect,
      onSearch,
      placeholder = 'Type a command or search...',
      emptyState,
      groups: showGroups = true,
      className,
    },
    ref,
  ) => {
    const paletteRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const previousFocusRef = useRef<HTMLElement | null>(null);
    const paletteId = React.useId();

    const [query, setQuery] = useState('');
    const [activeIndex, setActiveIndex] = useState(0);
    const [asyncItems, setAsyncItems] = useState<CommandItem[] | null>(null);
    const [loading, setLoading] = useState(false);

    const sourceItems = asyncItems ?? items;
    const filtered = useMemo(() => filterItems(sourceItems, query), [sourceItems, query]);
    const grouped = useMemo(
      () => (showGroups ? groupItems(filtered) : null),
      [showGroups, filtered],
    );

    // Flat list for keyboard navigation (excluding disabled)
    const flatItems = useMemo(() => filtered.filter((item) => !item.disabled), [filtered]);

    // ─── Async search ─────────────────────────────────────────────
    useEffect(() => {
      if (!onSearch || !open) return;
      setLoading(true);
      const result = onSearch(query);
      if (result instanceof Promise) {
        result.then((items) => {
          setAsyncItems(items);
          setLoading(false);
          setActiveIndex(0);
        });
      } else {
        setAsyncItems(result);
        setLoading(false);
        setActiveIndex(0);
      }
    }, [query, onSearch, open]);

    // ─── Open/close ───────────────────────────────────────────────
    useEffect(() => {
      if (open) {
        previousFocusRef.current = document.activeElement as HTMLElement;
        document.body.style.overflow = 'hidden';
        setQuery('');
        setActiveIndex(0);
        setAsyncItems(null);
        requestAnimationFrame(() => inputRef.current?.focus());
      } else {
        document.body.style.overflow = '';
        previousFocusRef.current?.focus();
      }
      return () => {
        document.body.style.overflow = '';
      };
    }, [open]);

    // ─── Keyboard ─────────────────────────────────────────────────
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        switch (e.key) {
          case 'ArrowDown': {
            e.preventDefault();
            setActiveIndex((prev) => Math.min(prev + 1, flatItems.length - 1));
            break;
          }
          case 'ArrowUp': {
            e.preventDefault();
            setActiveIndex((prev) => Math.max(prev - 1, 0));
            break;
          }
          case 'Enter': {
            e.preventDefault();
            if (flatItems[activeIndex]) {
              const item = flatItems[activeIndex];
              item.onSelect?.();
              onSelect?.(item);
              onClose();
            }
            break;
          }
          case 'Escape': {
            e.preventDefault();
            onClose();
            break;
          }
          case 'Home': {
            e.preventDefault();
            setActiveIndex(0);
            break;
          }
          case 'End': {
            e.preventDefault();
            setActiveIndex(flatItems.length - 1);
            break;
          }
        }
      },
      [flatItems, activeIndex, onSelect, onClose],
    );

    // ─── Focus trap ───────────────────────────────────────────────
    useEffect(() => {
      if (!open) return;
      const handler = (e: KeyboardEvent) => {
        if (e.key !== 'Tab' || !paletteRef.current) return;
        const focusable = Array.from(
          paletteRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS),
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      };
      document.addEventListener('keydown', handler);
      return () => document.removeEventListener('keydown', handler);
    }, [open]);

    // Scroll active item into view
    useEffect(() => {
      if (!open) return;
      const activeEl = paletteRef.current?.querySelector(`[data-index="${activeIndex}"]`);
      activeEl?.scrollIntoView?.({ block: 'nearest' });
    }, [activeIndex, open]);

    const handleSelect = useCallback(
      (item: CommandItem) => {
        if (item.disabled) return;
        item.onSelect?.();
        onSelect?.(item);
        onClose();
      },
      [onSelect, onClose],
    );

    if (!open) return null;

    const renderItems = (itemList: CommandItem[]) =>
      itemList.map((item) => {
        const flatIndex = flatItems.indexOf(item);
        const isActive = flatIndex === activeIndex;
        return (
          // biome-ignore lint/a11y/useFocusableInteractive: navigated via aria-activedescendant
          <div
            key={item.id}
            id={`${paletteId}-item-${item.id}`}
            role="option"
            aria-selected={isActive}
            aria-disabled={item.disabled || undefined}
            data-index={flatIndex}
            className={cn(
              styles.item,
              isActive && styles.itemActive,
              item.disabled && styles.itemDisabled,
            )}
            onClick={() => handleSelect(item)}
          >
            {item.icon && <span className={styles.itemIcon}>{item.icon}</span>}
            <div className={styles.itemContent}>
              <span className={styles.itemLabel}>{item.label}</span>
              {item.description && (
                <span className={styles.itemDescription}>{item.description}</span>
              )}
            </div>
            {item.shortcut && <span className={styles.itemShortcut}>{item.shortcut}</span>}
          </div>
        );
      });

    return (
      <div className={styles.wrapper}>
        <div className={styles.overlay} aria-hidden="true" onClick={onClose} />
        <div
          ref={(node) => {
            (paletteRef as React.MutableRefObject<HTMLDivElement | null>).current = node;
            if (typeof ref === 'function') ref(node);
            else if (ref) (ref as React.MutableRefObject<HTMLDivElement | null>).current = node;
          }}
          role="dialog"
          aria-label="Command palette"
          aria-modal="true"
          className={cn(styles.palette, className)}
          onKeyDown={handleKeyDown}
        >
          <div className={styles.inputWrapper}>
            <svg
              className={styles.searchIcon}
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              ref={inputRef}
              type="text"
              className={styles.input}
              placeholder={placeholder}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setActiveIndex(0);
              }}
              role="combobox"
              aria-expanded
              aria-controls={`${paletteId}-listbox`}
              aria-activedescendant={
                flatItems[activeIndex]
                  ? `${paletteId}-item-${flatItems[activeIndex].id}`
                  : undefined
              }
              aria-autocomplete="list"
            />
            {loading && <span className={styles.spinner} aria-hidden="true" />}
          </div>

          {/* biome-ignore lint/a11y/useFocusableInteractive: listbox navigated via combobox */}
          <div id={`${paletteId}-listbox`} role="listbox" className={styles.results}>
            {filtered.length === 0 ? (
              <div className={styles.empty}>{emptyState || 'No results found'}</div>
            ) : grouped ? (
              Array.from(grouped.entries()).map(([groupName, groupItems]) => (
                <div key={groupName} className={styles.group}>
                  {groupName && <div className={styles.groupLabel}>{groupName}</div>}
                  {renderItems(groupItems)}
                </div>
              ))
            ) : (
              renderItems(filtered)
            )}
          </div>
        </div>
      </div>
    );
  },
);
CommandPalette.displayName = 'CommandPalette';
