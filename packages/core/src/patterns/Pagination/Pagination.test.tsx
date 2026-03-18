import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Pagination } from './Pagination';

describe('Pagination', () => {
  it('renders as nav with Pagination aria-label', () => {
    render(<Pagination page={1} totalPages={10} onPageChange={vi.fn()} />);
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Pagination ref={ref} page={1} totalPages={5} onPageChange={vi.fn()} />);
    expect(ref).toHaveBeenCalled();
  });

  it('marks current page with aria-current', () => {
    render(<Pagination page={3} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByLabelText('Go to page 3').getAttribute('aria-current')).toBe('page');
  });

  it('disables previous on first page', () => {
    render(<Pagination page={1} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByLabelText('Go to previous page')).toBeDisabled();
  });

  it('disables next on last page', () => {
    render(<Pagination page={5} totalPages={5} onPageChange={vi.fn()} />);
    expect(screen.getByLabelText('Go to next page')).toBeDisabled();
  });

  it('calls onPageChange when clicking a page', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination page={1} totalPages={5} onPageChange={onChange} />);
    await user.click(screen.getByLabelText('Go to page 3'));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange for next button', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination page={2} totalPages={5} onPageChange={onChange} />);
    await user.click(screen.getByLabelText('Go to next page'));
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('calls onPageChange for previous button', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Pagination page={3} totalPages={5} onPageChange={onChange} />);
    await user.click(screen.getByLabelText('Go to previous page'));
    expect(onChange).toHaveBeenCalledWith(2);
  });

  it('renders all pages when totalPages is small', () => {
    render(<Pagination page={1} totalPages={5} onPageChange={vi.fn()} />);
    for (let i = 1; i <= 5; i++) {
      expect(screen.getByLabelText(`Go to page ${i}`)).toBeTruthy();
    }
  });

  it('shows edge buttons when showEdges is true', () => {
    render(<Pagination page={5} totalPages={10} onPageChange={vi.fn()} showEdges />);
    expect(screen.getByLabelText('Go to first page')).toBeTruthy();
    expect(screen.getByLabelText('Go to last page')).toBeTruthy();
  });

  it('hides edge buttons when showEdges is false', () => {
    render(<Pagination page={5} totalPages={10} onPageChange={vi.fn()} showEdges={false} />);
    expect(screen.queryByLabelText('Go to first page')).toBeNull();
    expect(screen.queryByLabelText('Go to last page')).toBeNull();
  });

  it('accepts className', () => {
    const { container } = render(
      <Pagination page={1} totalPages={5} onPageChange={vi.fn()} className="custom" />,
    );
    expect(container.querySelector('nav')?.classList.contains('custom')).toBe(true);
  });

  it('renders compact variant with page label', () => {
    render(<Pagination page={3} totalPages={10} onPageChange={vi.fn()} variant="compact" />);
    expect(screen.getByText('Page 3 of 10')).toBeTruthy();
  });

  it('compact variant still has prev/next buttons', () => {
    render(<Pagination page={3} totalPages={10} onPageChange={vi.fn()} variant="compact" />);
    expect(screen.getByLabelText('Go to previous page')).toBeTruthy();
    expect(screen.getByLabelText('Go to next page')).toBeTruthy();
  });
});
