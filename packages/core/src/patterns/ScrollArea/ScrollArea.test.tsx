import { render } from '@testing-library/react';
import React from 'react';
import { describe, expect, it } from 'vitest';
import { ScrollArea } from './ScrollArea';

describe('ScrollArea', () => {
  it('renders children', () => {
    const { container } = render(<ScrollArea>Content</ScrollArea>);
    expect(container.textContent).toBe('Content');
  });

  it('applies maxHeight', () => {
    const { container } = render(<ScrollArea maxHeight="200px">Content</ScrollArea>);
    expect(container.firstElementChild).toHaveStyle({ maxHeight: '200px' });
  });

  it('forwards ref', () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ScrollArea ref={ref}>Content</ScrollArea>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it('passes className', () => {
    const { container } = render(<ScrollArea className="custom">Content</ScrollArea>);
    expect(container.firstElementChild).toHaveClass('custom');
  });
});
