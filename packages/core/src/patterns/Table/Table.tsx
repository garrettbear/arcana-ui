import React from 'react';
import { cn } from '../../utils/cn';
import styles from './Table.module.css';

// ─── Table Context ────────────────────────────────────────────────────────────

interface TableContextValue {
  striped: boolean;
  hoverable: boolean;
  size: 'sm' | 'md' | 'lg';
  bordered: boolean;
}

const TableContext = React.createContext<TableContextValue>({
  striped: false,
  hoverable: false,
  size: 'md',
  bordered: false,
});

// ─── Table ────────────────────────────────────────────────────────────────────

export interface TableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** Whether to alternate row background colors */
  striped?: boolean;
  /** Whether rows highlight on hover */
  hoverable?: boolean;
  /** Size variant affecting cell padding density */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show borders between all cells */
  bordered?: boolean;
  /** Table content (TableHeader, TableBody) */
  children?: React.ReactNode;
}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  (
    {
      striped = false,
      hoverable = false,
      size = 'md',
      bordered = false,
      children,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <TableContext.Provider value={{ striped, hoverable, size, bordered }}>
        <div className={cn(styles.tableWrapper, bordered && styles.bordered)}>
          <table
            ref={ref}
            className={cn(styles.table, styles[`size-${size}`], className)}
            {...props}
          >
            {children}
          </table>
        </div>
      </TableContext.Provider>
    );
  },
);
Table.displayName = 'Table';

// ─── TableHeader ──────────────────────────────────────────────────────────────

export interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  /** Table header rows (TableRow with TableHead cells) */
  children?: React.ReactNode;
}

export const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <thead ref={ref} className={cn(styles.thead, className)} {...props}>
        {children}
      </thead>
    );
  },
);
TableHeader.displayName = 'TableHeader';

// ─── TableBody ────────────────────────────────────────────────────────────────

export interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  /** Table body rows (TableRow with TableCell elements) */
  children?: React.ReactNode;
}

export const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <tbody ref={ref} className={cn(styles.tbody, className)} {...props}>
        {children}
      </tbody>
    );
  },
);
TableBody.displayName = 'TableBody';

// ─── TableRow ─────────────────────────────────────────────────────────────────

export interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  /** Row cells (TableHead or TableCell elements) */
  children?: React.ReactNode;
}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ children, className, ...props }, ref) => {
    const { hoverable, striped } = React.useContext(TableContext);
    return (
      <tr
        ref={ref}
        className={cn(
          styles.row,
          hoverable && styles.rowHoverable,
          striped && styles.rowStriped,
          className,
        )}
        {...props}
      >
        {children}
      </tr>
    );
  },
);
TableRow.displayName = 'TableRow';

// ─── TableHead ────────────────────────────────────────────────────────────────

export interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableCellElement> {
  /** Whether the column is sortable */
  sortable?: boolean;
  /** Current sort direction — null means unsorted */
  sortDirection?: 'asc' | 'desc' | null;
  /** Callback fired when the sort button is clicked */
  onSort?: () => void;
  /** Column header content */
  children?: React.ReactNode;
}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ sortable = false, sortDirection, onSort, children, className, ...props }, ref) => {
    return (
      <th
        ref={ref}
        scope="col"
        aria-sort={
          sortable
            ? sortDirection === 'asc'
              ? 'ascending'
              : sortDirection === 'desc'
                ? 'descending'
                : 'none'
            : undefined
        }
        className={cn(styles.th, sortable && styles.thSortable, className)}
        {...props}
      >
        {sortable ? (
          <button type="button" className={styles.sortButton} onClick={onSort}>
            {children}
            <span className={styles.sortIcon} aria-hidden="true">
              {sortDirection === 'asc' ? (
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
              ) : sortDirection === 'desc' ? (
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
              ) : (
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
              )}
            </span>
          </button>
        ) : (
          children
        )}
      </th>
    );
  },
);
TableHead.displayName = 'TableHead';

// ─── TableCell ────────────────────────────────────────────────────────────────

export interface TableCellProps extends React.TdHTMLAttributes<HTMLTableCellElement> {
  /** Cell content */
  children?: React.ReactNode;
}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ children, className, ...props }, ref) => {
    const { bordered } = React.useContext(TableContext);
    return (
      <td ref={ref} className={cn(styles.td, bordered && styles.tdBordered, className)} {...props}>
        {children}
      </td>
    );
  },
);
TableCell.displayName = 'TableCell';
