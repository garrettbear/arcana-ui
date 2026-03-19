import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { Collapsible } from './Collapsible';

describe('Collapsible', () => {
  it('renders trigger', () => {
    render(
      <Collapsible trigger="Toggle">
        <p>Content</p>
      </Collapsible>,
    );
    expect(screen.getByText('Toggle')).toBeInTheDocument();
  });

  it('hides content by default', () => {
    const { container } = render(
      <Collapsible trigger="Toggle">
        <p>Hidden</p>
      </Collapsible>,
    );
    const content = container.querySelector('[role="region"]');
    expect(content?.className).not.toContain('open');
  });

  it('shows content when defaultOpen', () => {
    const { container } = render(
      <Collapsible trigger="Toggle" defaultOpen>
        <p>Visible</p>
      </Collapsible>,
    );
    const content = container.querySelector('[role="region"]');
    expect(content?.className).toContain('open');
  });

  it('toggles on click', () => {
    const onChange = vi.fn();
    render(
      <Collapsible trigger="Toggle" onOpenChange={onChange}>
        <p>Content</p>
      </Collapsible>,
    );
    fireEvent.click(screen.getByText('Toggle'));
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('toggles on Enter key', () => {
    const onChange = vi.fn();
    render(
      <Collapsible trigger="Toggle" onOpenChange={onChange}>
        <p>Content</p>
      </Collapsible>,
    );
    fireEvent.keyDown(screen.getByText('Toggle'), { key: 'Enter' });
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('has aria-expanded on trigger', () => {
    render(
      <Collapsible trigger="Toggle">
        <p>Content</p>
      </Collapsible>,
    );
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Collapsible ref={ref} trigger="Toggle">
        <p>Content</p>
      </Collapsible>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes axe checks', async () => {
    const { container } = render(
      <Collapsible trigger="Show more">
        <p>Details</p>
      </Collapsible>,
    );
    expect(await axe(container)).toHaveNoViolations();
  });
});
