import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarItem,
  SidebarSection,
} from './Sidebar';

describe('Sidebar', () => {
  it('renders as aside element', () => {
    const { container } = render(<Sidebar data-testid="sidebar">Content</Sidebar>);
    expect(container.querySelector('aside')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Sidebar ref={ref}>Content</Sidebar>);
    expect(ref).toHaveBeenCalled();
  });

  it('accepts className', () => {
    const { container } = render(<Sidebar className="custom">Content</Sidebar>);
    expect(container.querySelector('aside')?.classList.contains('custom')).toBe(true);
  });

  it('renders header, content, and footer sections', () => {
    render(
      <Sidebar>
        <SidebarHeader data-testid="header">Header</SidebarHeader>
        <SidebarContent data-testid="content">Content</SidebarContent>
        <SidebarFooter data-testid="footer">Footer</SidebarFooter>
      </Sidebar>,
    );
    expect(screen.getByTestId('header')).toBeTruthy();
    expect(screen.getByTestId('content')).toBeTruthy();
    expect(screen.getByTestId('footer')).toBeTruthy();
  });

  it('renders SidebarItem as button by default', () => {
    render(
      <Sidebar>
        <SidebarItem>Dashboard</SidebarItem>
      </Sidebar>,
    );
    expect(screen.getByRole('button', { name: 'Dashboard' })).toBeTruthy();
  });

  it('renders SidebarItem as link when href is provided', () => {
    render(
      <Sidebar>
        <SidebarItem href="/dashboard">Dashboard</SidebarItem>
      </Sidebar>,
    );
    expect(screen.getByRole('link', { name: 'Dashboard' })).toBeTruthy();
  });

  it('marks active item with aria-current', () => {
    render(
      <Sidebar>
        <SidebarItem active>Dashboard</SidebarItem>
      </Sidebar>,
    );
    expect(screen.getByRole('button', { name: 'Dashboard' }).getAttribute('aria-current')).toBe(
      'page',
    );
  });

  it('disables SidebarItem', () => {
    render(
      <Sidebar>
        <SidebarItem disabled>Settings</SidebarItem>
      </Sidebar>,
    );
    expect(screen.getByRole('button', { name: 'Settings' })).toBeDisabled();
  });

  it('fires click on SidebarItem', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Sidebar>
        <SidebarItem onClick={onClick}>Dashboard</SidebarItem>
      </Sidebar>,
    );
    await user.click(screen.getByRole('button', { name: 'Dashboard' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('renders SidebarSection with label', () => {
    render(
      <Sidebar>
        <SidebarSection label="Navigation">
          <SidebarItem>Home</SidebarItem>
        </SidebarSection>
      </Sidebar>,
    );
    expect(screen.getByText('Navigation')).toBeTruthy();
  });

  it('renders icon in SidebarItem', () => {
    render(
      <Sidebar>
        <SidebarItem icon={<span data-testid="icon">I</span>}>Dashboard</SidebarItem>
      </Sidebar>,
    );
    expect(screen.getByTestId('icon')).toBeTruthy();
  });

  it('renders badge on SidebarItem', () => {
    render(
      <Sidebar>
        <SidebarItem badge={5}>Inbox</SidebarItem>
      </Sidebar>,
    );
    expect(screen.getByText('5')).toBeTruthy();
  });

  it('hides badge when collapsed', () => {
    render(
      <Sidebar collapsed>
        <SidebarItem badge={3}>Inbox</SidebarItem>
      </Sidebar>,
    );
    expect(screen.queryByText('3')).toBeNull();
  });
});
