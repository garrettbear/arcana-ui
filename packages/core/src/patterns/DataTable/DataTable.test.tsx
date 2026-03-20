import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'jest-axe';
import { describe, expect, it, vi } from 'vitest';
import { DataTable } from './DataTable';
import type { ColumnDef } from './DataTable';

interface TestRow {
  name: string;
  role: string;
  status: string;
  age: number;
}

const columns: ColumnDef<TestRow>[] = [
  { key: 'name', header: 'Name' },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status' },
  { key: 'age', header: 'Age', align: 'right' },
];

const data: TestRow[] = [
  { name: 'Alice', role: 'Developer', status: 'Active', age: 28 },
  { name: 'Bob', role: 'Designer', status: 'Inactive', age: 34 },
  { name: 'Charlie', role: 'Manager', status: 'Active', age: 42 },
  { name: 'Diana', role: 'Developer', status: 'Active', age: 31 },
  { name: 'Eve', role: 'QA', status: 'On Leave', age: 26 },
];

describe('DataTable', () => {
  // ─── Rendering ──────────────────────────────────────────────────────
  it('renders a table with header and rows', () => {
    render(<DataTable data={data} columns={columns} />);
    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getAllByRole('columnheader')).toHaveLength(4);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
  });

  it('renders column headers from column definitions', () => {
    render(<DataTable data={data} columns={columns} />);
    expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /role/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /age/i })).toBeInTheDocument();
  });

  it('passes className to wrapper div', () => {
    const { container } = render(<DataTable data={data} columns={columns} className="custom" />);
    expect(container.firstElementChild).toHaveClass('custom');
  });

  // ─── Empty state ────────────────────────────────────────────────────
  it('shows default empty state when data is empty', () => {
    render(<DataTable data={[]} columns={columns} />);
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('shows custom empty state when provided', () => {
    render(<DataTable data={[]} columns={columns} emptyState={<p>Nothing here</p>} />);
    expect(screen.getByText('Nothing here')).toBeInTheDocument();
  });

  // ─── Loading ────────────────────────────────────────────────────────
  it('shows skeleton rows when loading', () => {
    const { container } = render(<DataTable data={[]} columns={columns} loading />);
    expect(container.querySelector('[aria-busy="true"]')).toBeInTheDocument();
    // Should not show actual data cells
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });

  // ─── Sorting ────────────────────────────────────────────────────────
  it('renders sort buttons when sortable', () => {
    render(<DataTable data={data} columns={columns} sortable />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(4);
  });

  it('calls onSort callback when header is clicked', async () => {
    const onSort = vi.fn();
    render(<DataTable data={data} columns={columns} sortable onSort={onSort} />);
    const nameButton = screen.getByRole('button', { name: /name/i });
    await userEvent.click(nameButton);
    expect(onSort).toHaveBeenCalledWith('name', 'asc');
  });

  it('toggles sort direction on repeated clicks', async () => {
    const onSort = vi.fn();
    render(<DataTable data={data} columns={columns} sortable onSort={onSort} />);
    const nameButton = screen.getByRole('button', { name: /name/i });
    await userEvent.click(nameButton);
    expect(onSort).toHaveBeenCalledWith('name', 'asc');
    await userEvent.click(nameButton);
    expect(onSort).toHaveBeenCalledWith('name', 'desc');
  });

  it('sets aria-sort on sortable column headers', async () => {
    render(<DataTable data={data} columns={columns} sortable />);
    const nameHeader = screen.getByRole('columnheader', { name: /name/i });
    expect(nameHeader).toHaveAttribute('aria-sort', 'none');
    await userEvent.click(screen.getByRole('button', { name: /name/i }));
    expect(nameHeader).toHaveAttribute('aria-sort', 'ascending');
  });

  it('sorts data by column values', async () => {
    render(<DataTable data={data} columns={columns} sortable />);
    await userEvent.click(screen.getByRole('button', { name: /name/i }));
    const rows = screen.getAllByRole('row');
    // First data row after header should be Alice (asc)
    expect(within(rows[1]).getByText('Alice')).toBeInTheDocument();
  });

  // ─── Filtering ──────────────────────────────────────────────────────
  it('shows filter input when filterable', () => {
    render(<DataTable data={data} columns={columns} filterable />);
    expect(screen.getByRole('searchbox')).toBeInTheDocument();
  });

  it('filters data based on input', async () => {
    render(<DataTable data={data} columns={columns} filterable />);
    const filter = screen.getByRole('searchbox');
    await userEvent.type(filter, 'Developer');
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Diana')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();
  });

  it('calls onFilter callback', async () => {
    const onFilter = vi.fn();
    render(<DataTable data={data} columns={columns} filterable onFilter={onFilter} />);
    const filter = screen.getByRole('searchbox');
    await userEvent.type(filter, 'A');
    expect(onFilter).toHaveBeenCalledWith({ _global: 'A' });
  });

  // ─── Selection ──────────────────────────────────────────────────────
  it('shows checkboxes when selectable', () => {
    render(<DataTable data={data} columns={columns} selectable />);
    const checkboxes = screen.getAllByRole('checkbox');
    // 1 select-all + 5 row checkboxes
    expect(checkboxes).toHaveLength(6);
  });

  it('selects individual rows', async () => {
    const onSelect = vi.fn();
    render(<DataTable data={data} columns={columns} selectable onSelect={onSelect} />);
    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[1]); // first data row
    expect(onSelect).toHaveBeenCalledWith([data[0]]);
  });

  it('selects all rows with header checkbox', async () => {
    const onSelect = vi.fn();
    render(<DataTable data={data} columns={columns} selectable onSelect={onSelect} />);
    const selectAll = screen.getByLabelText('Select all rows');
    await userEvent.click(selectAll);
    expect(onSelect).toHaveBeenCalledWith(data);
  });

  it('shows selection count', async () => {
    render(<DataTable data={data} columns={columns} selectable />);
    const checkboxes = screen.getAllByRole('checkbox');
    await userEvent.click(checkboxes[1]);
    expect(screen.getByText('1 row selected')).toBeInTheDocument();
  });

  // ─── Pagination ─────────────────────────────────────────────────────
  it('renders pagination when enabled', () => {
    render(<DataTable data={data} columns={columns} pagination={{ pageSize: 2 }} />);
    expect(screen.getByText(/Page 1 of/)).toBeInTheDocument();
    expect(screen.getByLabelText('Next page')).toBeInTheDocument();
  });

  it('paginates data correctly', () => {
    render(<DataTable data={data} columns={columns} pagination={{ pageSize: 2 }} />);
    // Should only show 2 rows
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.queryByText('Charlie')).not.toBeInTheDocument();
  });

  it('navigates to next page', async () => {
    render(<DataTable data={data} columns={columns} pagination={{ pageSize: 2 }} />);
    await userEvent.click(screen.getByLabelText('Next page'));
    expect(screen.getByText('Charlie')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });

  it('disables prev button on first page', () => {
    render(<DataTable data={data} columns={columns} pagination={{ pageSize: 2 }} />);
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  // ─── Row click ──────────────────────────────────────────────────────
  it('calls onRowClick when a row is clicked', async () => {
    const onRowClick = vi.fn();
    render(<DataTable data={data} columns={columns} onRowClick={onRowClick} />);
    await userEvent.click(screen.getByText('Alice'));
    expect(onRowClick).toHaveBeenCalledWith(data[0]);
  });

  // ─── Custom render ─────────────────────────────────────────────────
  it('supports custom cell renderers', () => {
    const customColumns: ColumnDef<TestRow>[] = [
      { key: 'name', header: 'Name' },
      {
        key: 'status',
        header: 'Status',
        render: (value) => <span data-testid="custom-cell">{String(value).toUpperCase()}</span>,
      },
    ];
    render(<DataTable data={data} columns={customColumns} />);
    const cells = screen.getAllByTestId('custom-cell');
    expect(cells[0]).toHaveTextContent('ACTIVE');
  });

  // ─── Striped & hoverable ───────────────────────────────────────────
  it('renders striped rows without crashing', () => {
    const { container } = render(<DataTable data={data} columns={columns} striped />);
    expect(container.querySelector('table')).toBeInTheDocument();
  });

  // ─── Accessibility ─────────────────────────────────────────────────
  it('passes axe accessibility checks', async () => {
    const { container } = render(<DataTable data={data} columns={columns} />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('passes axe accessibility checks with all features', async () => {
    const { container } = render(
      <DataTable
        data={data}
        columns={columns}
        sortable
        filterable
        selectable
        pagination={{ pageSize: 2 }}
      />,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has filter input with aria-label', () => {
    render(<DataTable data={data} columns={columns} filterable />);
    expect(screen.getByLabelText('Filter table rows')).toBeInTheDocument();
  });

  it('has aria-busy when loading', () => {
    const { container } = render(<DataTable data={data} columns={columns} loading />);
    expect(container.firstElementChild).toHaveAttribute('aria-busy', 'true');
  });
});
