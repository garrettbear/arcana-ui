import React, { useCallback, useId, useMemo, useState } from 'react';
import { cn } from '../../utils/cn';
import styles from './DataTable.module.css';

// ─── Types ──────────────────────────────────────────────────────────────────

/** Column definition for the DataTable */
export interface ColumnDef<T> {
  /** Maps to a property key on the data object */
  key: string;
  /** Column header text */
  header: string;
  /** Whether this column is sortable (overrides table-level sortable) */
  sortable?: boolean;
  /** Whether this column is filterable (overrides table-level filterable) */
  filterable?: boolean;
  /** Column width (e.g., "200px" or "30%") */
  width?: string;
  /** Text alignment within the column */
  align?: 'left' | 'center' | 'right';
  /** Custom cell renderer for this column */
  render?: (value: unknown, row: T) => React.ReactNode;
  /** Stick this column to the left or right edge during horizontal scroll */
  sticky?: 'left' | 'right';
}

/** Sort state for the DataTable */
export interface SortState {
  /** Column key being sorted */
  column: string;
  /** Sort direction */
  direction: 'asc' | 'desc';
}

/** Pagination configuration */
export interface PaginationConfig {
  /** Number of rows per page */
  pageSize: number;
  /** Available page size options */
  pageSizeOptions?: number[];
}

export interface DataTableProps<T> extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onSelect'> {
  /** Array of data objects to display */
  data: T[];
  /** Column definitions */
  columns: ColumnDef<T>[];
  /** Enable column header click to sort */
  sortable?: boolean;
  /** Show filter input for searching */
  filterable?: boolean;
  /** Enable row selection with checkboxes */
  selectable?: boolean;
  /** Enable pagination — true for default (10 rows), or provide config */
  pagination?: boolean | PaginationConfig;
  /** Show alternating row background colors */
  striped?: boolean;
  /** Highlight rows on hover */
  hoverable?: boolean;
  /** Keep header row fixed when scrolling table body */
  stickyHeader?: boolean;
  /** Content shown when data array is empty */
  emptyState?: React.ReactNode;
  /** Show skeleton loading rows */
  loading?: boolean;
  /** Callback fired when a column sort changes */
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  /** Callback fired when the filter value changes */
  onFilter?: (filters: Record<string, string>) => void;
  /** Callback fired when row selection changes */
  onSelect?: (selectedRows: T[]) => void;
  /** Callback fired when a row is clicked */
  onRowClick?: (row: T) => void;
  /** Additional CSS class */
  className?: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function getNestedValue(obj: unknown, key: string): unknown {
  if (obj == null || typeof obj !== 'object') return undefined;
  return (obj as Record<string, unknown>)[key];
}

function defaultSort<T>(data: T[], sort: SortState): T[] {
  return [...data].sort((a, b) => {
    const aVal = getNestedValue(a, sort.column);
    const bVal = getNestedValue(b, sort.column);
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return 1;
    if (bVal == null) return -1;

    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    const aNum = Number(aVal);
    const bNum = Number(bVal);

    let result: number;
    if (!Number.isNaN(aNum) && !Number.isNaN(bNum)) {
      result = aNum - bNum;
    } else {
      result = aStr.localeCompare(bStr);
    }

    return sort.direction === 'desc' ? -result : result;
  });
}

function defaultFilter<T>(data: T[], filter: string, columns: ColumnDef<T>[]): T[] {
  if (!filter.trim()) return data;
  const lower = filter.toLowerCase();
  return data.filter((row) =>
    columns.some((col) => {
      const val = getNestedValue(row, col.key);
      return val != null && String(val).toLowerCase().includes(lower);
    }),
  );
}

// ─── Sort Icon ──────────────────────────────────────────────────────────────

function SortIcon({ direction }: { direction: 'asc' | 'desc' | null }): React.JSX.Element {
  if (direction === 'asc') {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="18 15 12 9 6 15" />
      </svg>
    );
  }
  if (direction === 'desc') {
    return (
      <svg
        width="12"
        height="12"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    );
  }
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="18 9 12 3 6 9" />
      <polyline points="6 15 12 21 18 15" />
    </svg>
  );
}

// ─── Skeleton Row ───────────────────────────────────────────────────────────

function SkeletonRow({ columnCount }: { columnCount: number }): React.JSX.Element {
  return (
    <tr className={styles.row}>
      {Array.from({ length: columnCount }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows have no stable ID
        <td key={i} className={styles.td}>
          <span className={styles.skeleton} />
        </td>
      ))}
    </tr>
  );
}

// ─── DataTable ──────────────────────────────────────────────────────────────

function DataTableInner<T>(
  {
    data,
    columns,
    sortable = false,
    filterable = false,
    selectable = false,
    pagination = false,
    striped = false,
    hoverable = true,
    stickyHeader = false,
    emptyState,
    loading = false,
    onSort,
    onFilter,
    onSelect,
    onRowClick,
    className,
    ...props
  }: DataTableProps<T>,
  ref: React.ForwardedRef<HTMLDivElement>,
): React.JSX.Element {
  const id = useId();

  // ─── Sort state ─────────────────────────────────────────────────────
  const [sortState, setSortState] = useState<SortState | null>(null);

  const handleSort = useCallback(
    (columnKey: string) => {
      setSortState((prev) => {
        let next: SortState;
        if (prev?.column === columnKey) {
          next =
            prev.direction === 'asc'
              ? { column: columnKey, direction: 'desc' }
              : { column: columnKey, direction: 'asc' };
        } else {
          next = { column: columnKey, direction: 'asc' };
        }
        onSort?.(next.column, next.direction);
        return next;
      });
    },
    [onSort],
  );

  // ─── Filter state ───────────────────────────────────────────────────
  const [filterValue, setFilterValue] = useState('');

  const handleFilterChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setFilterValue(val);
      onFilter?.({ _global: val });
    },
    [onFilter],
  );

  // ─── Selection state ────────────────────────────────────────────────
  const [selectedIndices, setSelectedIndices] = useState<Set<number>>(new Set());

  const handleSelectAll = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
        const allIndices = new Set(data.map((_, i) => i));
        setSelectedIndices(allIndices);
        onSelect?.(data);
      } else {
        setSelectedIndices(new Set());
        onSelect?.([]);
      }
    },
    [data, onSelect],
  );

  const handleSelectRow = useCallback(
    (index: number) => {
      setSelectedIndices((prev) => {
        const next = new Set(prev);
        if (next.has(index)) {
          next.delete(index);
        } else {
          next.add(index);
        }
        onSelect?.(data.filter((_, i) => next.has(i)));
        return next;
      });
    },
    [data, onSelect],
  );

  // ─── Pagination state ──────────────────────────────────────────────
  const paginationConfig = useMemo<PaginationConfig | null>(() => {
    if (!pagination) return null;
    if (pagination === true) return { pageSize: 10, pageSizeOptions: [5, 10, 25, 50] };
    return { pageSizeOptions: [5, 10, 25, 50], ...pagination };
  }, [pagination]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(paginationConfig?.pageSize ?? 10);

  // ─── Process data ──────────────────────────────────────────────────
  const processedData = useMemo(() => {
    let result = data;
    if (filterable && filterValue) {
      result = defaultFilter(result, filterValue, columns);
    }
    if (sortable && sortState) {
      result = defaultSort(result, sortState);
    }
    return result;
  }, [data, filterable, filterValue, columns, sortable, sortState]);

  const totalPages = paginationConfig ? Math.max(1, Math.ceil(processedData.length / pageSize)) : 1;

  const paginatedData = useMemo(() => {
    if (!paginationConfig) return processedData;
    const start = (currentPage - 1) * pageSize;
    return processedData.slice(start, start + pageSize);
  }, [processedData, paginationConfig, currentPage, pageSize]);

  // Reset page when filter changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally resets page on filter change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filterValue]);

  const isEmpty = !loading && paginatedData.length === 0;
  const isAllSelected = data.length > 0 && selectedIndices.size === data.length;
  const isSomeSelected = selectedIndices.size > 0 && selectedIndices.size < data.length;

  return (
    <div
      ref={ref}
      className={cn(styles.dataTable, className)}
      aria-busy={loading || undefined}
      {...props}
    >
      {/* Toolbar: filter + selection count */}
      {(filterable || (selectable && selectedIndices.size > 0)) && (
        <div className={styles.toolbar}>
          {filterable && (
            <input
              type="search"
              className={styles.filterInput}
              placeholder="Filter..."
              value={filterValue}
              onChange={handleFilterChange}
              aria-label="Filter table rows"
              id={`${id}-filter`}
            />
          )}
          {selectable && selectedIndices.size > 0 && (
            <span className={styles.selectionCount} aria-live="polite">
              {selectedIndices.size} row{selectedIndices.size !== 1 ? 's' : ''} selected
            </span>
          )}
        </div>
      )}

      {/* Table wrapper for horizontal scroll */}
      <div className={cn(styles.tableWrapper, stickyHeader && styles.stickyHeaderWrapper)}>
        <table className={styles.table}>
          <thead className={cn(styles.thead, stickyHeader && styles.stickyThead)}>
            <tr className={styles.row}>
              {selectable && (
                <th scope="col" className={cn(styles.th, styles.checkboxCell)}>
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    ref={(el) => {
                      if (el) el.indeterminate = isSomeSelected;
                    }}
                    onChange={handleSelectAll}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((col) => {
                const isSortable = col.sortable ?? sortable;
                const currentSort = sortState?.column === col.key ? sortState.direction : null;
                const stickyClass =
                  col.sticky === 'left'
                    ? styles.stickyLeft
                    : col.sticky === 'right'
                      ? styles.stickyRight
                      : undefined;

                return (
                  <th
                    key={col.key}
                    scope="col"
                    className={cn(styles.th, isSortable && styles.thSortable, stickyClass)}
                    style={{
                      width: col.width,
                      textAlign: col.align,
                    }}
                    aria-sort={
                      isSortable
                        ? currentSort === 'asc'
                          ? 'ascending'
                          : currentSort === 'desc'
                            ? 'descending'
                            : 'none'
                        : undefined
                    }
                  >
                    {isSortable ? (
                      <button
                        type="button"
                        className={styles.sortButton}
                        onClick={() => handleSort(col.key)}
                        style={{
                          justifyContent:
                            col.align === 'right'
                              ? 'flex-end'
                              : col.align === 'center'
                                ? 'center'
                                : undefined,
                        }}
                      >
                        {col.header}
                        <span className={styles.sortIcon}>
                          <SortIcon direction={currentSort} />
                        </span>
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody className={styles.tbody}>
            {loading ? (
              Array.from({ length: paginationConfig?.pageSize ?? 5 }, (_, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: skeleton rows have no stable ID
                <SkeletonRow key={i} columnCount={columns.length + (selectable ? 1 : 0)} />
              ))
            ) : isEmpty ? (
              <tr>
                <td colSpan={columns.length + (selectable ? 1 : 0)} className={styles.emptyCell}>
                  {emptyState || <div className={styles.emptyDefault}>No data available</div>}
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIndex) => {
                const globalIndex = paginationConfig
                  ? (currentPage - 1) * pageSize + rowIndex
                  : rowIndex;
                const isSelected = selectedIndices.has(globalIndex);

                return (
                  <tr
                    key={globalIndex}
                    className={cn(
                      styles.row,
                      hoverable && styles.rowHoverable,
                      striped && styles.rowStriped,
                      isSelected && styles.rowSelected,
                      onRowClick && styles.rowClickable,
                    )}
                    onClick={onRowClick ? () => onRowClick(row) : undefined}
                    onKeyDown={
                      onRowClick
                        ? (e) => {
                            if (e.key === 'Enter') onRowClick(row);
                          }
                        : undefined
                    }
                    tabIndex={onRowClick ? 0 : undefined}
                    aria-selected={selectable ? isSelected : undefined}
                  >
                    {selectable && (
                      <td className={cn(styles.td, styles.checkboxCell)}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectRow(globalIndex)}
                          onClick={(e) => e.stopPropagation()}
                          aria-label={`Select row ${globalIndex + 1}`}
                        />
                      </td>
                    )}
                    {columns.map((col) => {
                      const value = getNestedValue(row, col.key);
                      const stickyClass =
                        col.sticky === 'left'
                          ? styles.stickyLeft
                          : col.sticky === 'right'
                            ? styles.stickyRight
                            : undefined;

                      return (
                        <td
                          key={col.key}
                          className={cn(styles.td, stickyClass)}
                          style={{ textAlign: col.align }}
                        >
                          {col.render ? col.render(value, row) : value != null ? String(value) : ''}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {paginationConfig && !loading && !isEmpty && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            <label htmlFor={`${id}-pagesize`} className={styles.pageSizeLabel}>
              Rows per page:
            </label>
            <select
              id={`${id}-pagesize`}
              className={styles.pageSizeSelect}
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPage(1);
              }}
            >
              {(paginationConfig.pageSizeOptions ?? [10]).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <span className={styles.paginationRange}>
              {Math.min((currentPage - 1) * pageSize + 1, processedData.length)}–
              {Math.min(currentPage * pageSize, processedData.length)} of {processedData.length}
            </span>
          </div>
          <div className={styles.paginationButtons}>
            <button
              type="button"
              className={styles.pageButton}
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(1)}
              aria-label="First page"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polyline points="11 17 6 12 11 7" />
                <polyline points="18 17 13 12 18 7" />
              </svg>
            </button>
            <button
              type="button"
              className={styles.pageButton}
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              aria-label="Previous page"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <span className={styles.pageIndicator}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              className={styles.pageButton}
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              aria-label="Next page"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
            <button
              type="button"
              className={styles.pageButton}
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(totalPages)}
              aria-label="Last page"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <polyline points="13 17 18 12 13 7" />
                <polyline points="6 17 11 12 6 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export const DataTable = React.forwardRef(DataTableInner) as <T>(
  props: DataTableProps<T> & { ref?: React.Ref<HTMLDivElement> },
) => React.JSX.Element;
(DataTable as { displayName?: string }).displayName = 'DataTable';
