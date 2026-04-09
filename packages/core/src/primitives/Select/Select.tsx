import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './Select.module.css';

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SelectOption {
  /** Option value submitted with the form */
  value: string;
  /** Display text for the option */
  label: string;
  /** Whether this option is disabled */
  disabled?: boolean;
  /** Optional icon displayed before the label */
  icon?: React.ReactNode;
  /** Group name for grouped options */
  group?: string;
}

export interface SelectProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  /** Label text displayed above the select */
  label?: string;
  /** Error message string or boolean error state */
  error?: string | boolean;
  /** Helper text displayed below the select */
  helperText?: string;
  /** Placeholder text when no option is selected */
  placeholder?: string;
  /** Array of options to render */
  options?: SelectOption[];
  /** Controlled selected value (string for single, string[] for multiple) */
  value?: string | string[];
  /** Default value for uncontrolled usage */
  defaultValue?: string | string[];
  /** Callback fired when the selection changes */
  onChange?: (value: string | string[]) => void;
  /** Allow multiple selections */
  multiple?: boolean;
  /** Enable type-to-filter search in dropdown */
  searchable?: boolean;
  /** Show clear button to reset selection */
  clearable?: boolean;
  /** Show loading spinner in dropdown */
  loading?: boolean;
  /** Size variant */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Whether the select stretches to fill its container */
  fullWidth?: boolean;
  /** Whether the select is disabled */
  disabled?: boolean;
  /** Additional CSS class */
  className?: string;
  /** Form input name attribute */
  name?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function groupOptions(options: SelectOption[]): Map<string, SelectOption[]> {
  const groups = new Map<string, SelectOption[]>();
  for (const opt of options) {
    const key = opt.group ?? '';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)?.push(opt);
  }
  return groups;
}

// ─── Select ─────────────────────────────────────────────────────────────────

export const Select = React.forwardRef<HTMLDivElement, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      placeholder = 'Select...',
      options = [],
      value: controlledValue,
      defaultValue,
      onChange,
      multiple = false,
      searchable = false,
      clearable = false,
      loading = false,
      size = 'md',
      fullWidth = false,
      disabled = false,
      className,
      name,
      id,
      ...props
    },
    ref,
  ) => {
    const generatedId = React.useId();
    const selectId = id ?? generatedId;
    const labelId = `${selectId}-label`;
    const listboxId = `${selectId}-listbox`;
    const errorId = `${selectId}-error`;
    const helperId = `${selectId}-helper`;

    // ─── State ──────────────────────────────────────────────────────
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [activeIndex, setActiveIndex] = useState(-1);
    const [internalValue, setInternalValue] = useState<string[]>(() => {
      if (defaultValue) return Array.isArray(defaultValue) ? defaultValue : [defaultValue];
      return [];
    });

    const triggerRef = useRef<HTMLButtonElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchRef = useRef<HTMLInputElement>(null);

    const selected = useMemo(() => {
      if (controlledValue !== undefined) {
        return Array.isArray(controlledValue) ? controlledValue : [controlledValue];
      }
      return internalValue;
    }, [controlledValue, internalValue]);

    const hasError = Boolean(error);
    const errorMessage = typeof error === 'string' ? error : undefined;

    // ─── Filtered options ───────────────────────────────────────────
    const filteredOptions = useMemo(() => {
      if (!search.trim()) return options;
      const lower = search.toLowerCase();
      return options.filter((opt) => opt.label.toLowerCase().includes(lower));
    }, [options, search]);

    const groupedOptions = useMemo(() => groupOptions(filteredOptions), [filteredOptions]);

    // ─── Flat list for keyboard navigation ──────────────────────────
    const flatOptions = useMemo(() => {
      const flat: SelectOption[] = [];
      for (const opts of groupedOptions.values()) {
        for (const opt of opts) {
          if (!opt.disabled) flat.push(opt);
        }
      }
      return flat;
    }, [groupedOptions]);

    // ─── Selection handlers ─────────────────────────────────────────
    const updateValue = useCallback(
      (newSelected: string[]) => {
        if (controlledValue === undefined) setInternalValue(newSelected);
        onChange?.(multiple ? newSelected : (newSelected[0] ?? ''));
      },
      [controlledValue, onChange, multiple],
    );

    const handleSelect = useCallback(
      (optValue: string) => {
        if (multiple) {
          const next = selected.includes(optValue)
            ? selected.filter((v) => v !== optValue)
            : [...selected, optValue];
          updateValue(next);
        } else {
          updateValue([optValue]);
          setIsOpen(false);
          setSearch('');
          triggerRef.current?.focus();
        }
      },
      [multiple, selected, updateValue],
    );

    const handleClear = useCallback(
      (e: React.MouseEvent) => {
        e.stopPropagation();
        updateValue([]);
        setSearch('');
      },
      [updateValue],
    );

    // ─── Open/close ─────────────────────────────────────────────────
    const open = useCallback(() => {
      if (disabled) return;
      setIsOpen(true);
      setActiveIndex(-1);
      setSearch('');
    }, [disabled]);

    const close = useCallback(() => {
      setIsOpen(false);
      setSearch('');
      setActiveIndex(-1);
    }, []);

    // ─── Click outside to close ─────────────────────────────────────
    useEffect(() => {
      if (!isOpen) return;
      const handler = (e: MouseEvent) => {
        const target = e.target as Node;
        if (!triggerRef.current?.contains(target) && !dropdownRef.current?.contains(target)) {
          close();
        }
      };
      document.addEventListener('mousedown', handler);
      return () => document.removeEventListener('mousedown', handler);
    }, [isOpen, close]);

    // Focus search on open
    useEffect(() => {
      if (isOpen && searchable && searchRef.current) {
        searchRef.current.focus();
      }
    }, [isOpen, searchable]);

    // ─── Keyboard ───────────────────────────────────────────────────
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled) return;

        switch (e.key) {
          case 'Enter':
          case ' ': {
            e.preventDefault();
            if (!isOpen) {
              open();
            } else if (activeIndex >= 0 && activeIndex < flatOptions.length) {
              handleSelect(flatOptions[activeIndex].value);
            }
            break;
          }
          case 'Escape': {
            e.preventDefault();
            close();
            triggerRef.current?.focus();
            break;
          }
          case 'ArrowDown': {
            e.preventDefault();
            if (!isOpen) {
              open();
            } else {
              setActiveIndex((prev) => Math.min(prev + 1, flatOptions.length - 1));
            }
            break;
          }
          case 'ArrowUp': {
            e.preventDefault();
            if (isOpen) {
              setActiveIndex((prev) => Math.max(prev - 1, 0));
            }
            break;
          }
          case 'Home': {
            if (isOpen) {
              e.preventDefault();
              setActiveIndex(0);
            }
            break;
          }
          case 'End': {
            if (isOpen) {
              e.preventDefault();
              setActiveIndex(flatOptions.length - 1);
            }
            break;
          }
        }
      },
      [disabled, isOpen, activeIndex, flatOptions, open, close, handleSelect],
    );

    // ─── Display value ──────────────────────────────────────────────
    const displayText = useMemo(() => {
      if (selected.length === 0) return placeholder;
      if (multiple && selected.length > 1) return `${selected.length} selected`;
      const opt = options.find((o) => o.value === selected[0]);
      return opt?.label ?? selected[0];
    }, [selected, placeholder, options, multiple]);

    const isPlaceholder = selected.length === 0;

    return (
      <div
        ref={ref}
        className={cn(
          styles.wrapper,
          fullWidth && styles.fullWidth,
          styles[`size-${size}`],
          className,
        )}
        {...props}
      >
        {label && (
          <span id={labelId} className={styles.label}>
            {label}
          </span>
        )}

        {/* Hidden inputs for form submission */}
        {name && selected.map((val) => <input key={val} type="hidden" name={name} value={val} />)}

        <div className={styles.controlArea}>
          <button
            ref={triggerRef}
            type="button"
            id={selectId}
            role="combobox"
            aria-labelledby={label ? labelId : undefined}
            aria-label={label ? undefined : placeholder}
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-controls={isOpen ? listboxId : undefined}
            aria-activedescendant={
              isOpen && activeIndex >= 0
                ? `${selectId}-opt-${flatOptions[activeIndex]?.value}`
                : undefined
            }
            aria-invalid={hasError || undefined}
            aria-describedby={
              [errorMessage && errorId, helperText && helperId].filter(Boolean).join(' ') ||
              undefined
            }
            disabled={disabled}
            className={cn(
              styles.trigger,
              hasError && styles.hasError,
              disabled && styles.disabled,
              isOpen && styles.open,
            )}
            onClick={() => (isOpen ? close() : open())}
            onKeyDown={handleKeyDown}
          >
            <span className={cn(styles.triggerText, isPlaceholder && styles.placeholder)}>
              {displayText}
            </span>
            <span className={styles.triggerIcons}>
              {clearable && selected.length > 0 && !disabled && (
                <span
                  className={styles.clearButton}
                  onClick={handleClear}
                  role="button"
                  tabIndex={-1}
                  aria-label="Clear selection"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </span>
              )}
              {loading ? (
                <span className={styles.spinner} aria-hidden="true" />
              ) : (
                <span
                  className={cn(styles.chevron, isOpen && styles.chevronOpen)}
                  aria-hidden="true"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </span>
              )}
            </span>
          </button>

          {/* Dropdown */}
          {isOpen && (
            <div ref={dropdownRef} className={styles.dropdown}>
              {searchable && (
                <div className={styles.searchWrapper}>
                  <input
                    ref={searchRef}
                    type="text"
                    className={styles.searchInput}
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setActiveIndex(0);
                    }}
                    onKeyDown={handleKeyDown}
                    aria-label="Search options"
                  />
                </div>
              )}
              {/* biome-ignore lint/a11y/useFocusableInteractive: listbox is navigated via combobox trigger */}
              <div
                id={listboxId}
                role="listbox"
                aria-multiselectable={multiple || undefined}
                className={styles.listbox}
              >
                {filteredOptions.length === 0 ? (
                  <div className={styles.noResults}>No results found</div>
                ) : (
                  Array.from(groupedOptions.entries()).map(([groupName, groupOpts]) => (
                    <React.Fragment key={groupName}>
                      {groupName && (
                        <div className={styles.groupLabel} role="presentation">
                          {groupName}
                        </div>
                      )}
                      {groupOpts.map((opt) => {
                        const isSelected = selected.includes(opt.value);
                        const optIndex = flatOptions.indexOf(opt);
                        const isActive = optIndex === activeIndex;

                        return (
                          // biome-ignore lint/a11y/useFocusableInteractive: options navigated via aria-activedescendant
                          <div
                            key={opt.value}
                            id={`${selectId}-opt-${opt.value}`}
                            role="option"
                            aria-selected={isSelected}
                            aria-disabled={opt.disabled || undefined}
                            className={cn(
                              styles.option,
                              isSelected && styles.optionSelected,
                              isActive && styles.optionActive,
                              opt.disabled && styles.optionDisabled,
                            )}
                            onClick={() => {
                              if (!opt.disabled) handleSelect(opt.value);
                            }}
                          >
                            {multiple && (
                              <span className={styles.optionCheckbox} aria-hidden="true">
                                {isSelected && (
                                  <svg
                                    width="12"
                                    height="12"
                                    viewBox="0 0 12 12"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  >
                                    <path d="M2 6l3 3 5-5" />
                                  </svg>
                                )}
                              </span>
                            )}
                            {opt.icon && <span className={styles.optionIcon}>{opt.icon}</span>}
                            <span className={styles.optionLabel}>{opt.label}</span>
                            {!multiple && isSelected && (
                              <span className={styles.optionCheck} aria-hidden="true">
                                <svg
                                  width="14"
                                  height="14"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                >
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </React.Fragment>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {errorMessage && (
          <span id={errorId} className={styles.errorText} role="alert">
            {errorMessage}
          </span>
        )}
        {helperText && !errorMessage && (
          <span id={helperId} className={styles.helperText}>
            {helperText}
          </span>
        )}
      </div>
    );
  },
);

Select.displayName = 'Select';
