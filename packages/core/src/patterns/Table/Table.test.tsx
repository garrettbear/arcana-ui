import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { axe } from 'jest-axe'
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from './Table'

function BasicTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Role</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Alice</TableCell>
          <TableCell>Developer</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bob</TableCell>
          <TableCell>Designer</TableCell>
          <TableCell>Inactive</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

describe('Table', () => {
  it('renders table element', () => {
    const { container } = render(<BasicTable />)
    expect(container.querySelector('table')).toBeInTheDocument()
  })

  it('renders header cells', () => {
    render(<BasicTable />)
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Role' })).toBeInTheDocument()
  })

  it('renders cell data', () => {
    render(<BasicTable />)
    expect(screen.getByText('Alice')).toBeInTheDocument()
    expect(screen.getByText('Bob')).toBeInTheDocument()
  })

  it('renders striped variant without crashing', () => {
    const { container } = render(
      <Table striped>
        <TableBody>
          <TableRow><TableCell>Row 1</TableCell></TableRow>
        </TableBody>
      </Table>
    )
    expect(container.querySelector('table')).toBeInTheDocument()
  })

  it('renders hoverable variant without crashing', () => {
    const { container } = render(
      <Table hoverable>
        <TableBody>
          <TableRow><TableCell>Row 1</TableCell></TableRow>
        </TableBody>
      </Table>
    )
    expect(container.querySelector('table')).toBeInTheDocument()
  })

  it('renders sortable column header', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable onSort={vi.fn()}>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow><TableCell>Alice</TableCell></TableRow>
        </TableBody>
      </Table>
    )
    expect(screen.getByRole('button', { name: 'Name' })).toBeInTheDocument()
  })

  it('calls onSort when sortable header is clicked', () => {
    const onSort = vi.fn()
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable onSort={onSort}>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow><TableCell>Alice</TableCell></TableRow>
        </TableBody>
      </Table>
    )
    fireEvent.click(screen.getByRole('button', { name: 'Name' }))
    expect(onSort).toHaveBeenCalledTimes(1)
  })

  it('applies aria-sort="ascending" when sortDirection is asc', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="asc" onSort={vi.fn()}>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow><TableCell>Alice</TableCell></TableRow>
        </TableBody>
      </Table>
    )
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('aria-sort', 'ascending')
  })

  it('applies aria-sort="descending" when sortDirection is desc', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="desc" onSort={vi.fn()}>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow><TableCell>Alice</TableCell></TableRow>
        </TableBody>
      </Table>
    )
    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute('aria-sort', 'descending')
  })

  it('passes axe accessibility checks', async () => {
    const { container } = render(<BasicTable />)
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })

  it('passes axe accessibility checks with sortable headers', async () => {
    const { container } = render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead sortable sortDirection="asc" onSort={vi.fn()}>Name</TableHead>
            <TableHead sortable sortDirection={null} onSort={vi.fn()}>Role</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Alice</TableCell>
            <TableCell>Developer</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    const results = await axe(container)
    expect(results).toHaveNoViolations()
  })
})
