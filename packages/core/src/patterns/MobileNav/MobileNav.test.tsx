import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MobileNav } from './MobileNav';
import type { MobileNavItem } from './MobileNav';

const HomeIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true">
    <path d="M3 12l9-9 9 9" />
  </svg>
);

const items: MobileNavItem[] = [
  { key: 'home', label: 'Home', icon: <HomeIcon /> },
  { key: 'search', label: 'Search', icon: <HomeIcon /> },
  { key: 'profile', label: 'Profile', icon: <HomeIcon /> },
];

describe('MobileNav', () => {
  it('renders all items with icons and labels', () => {
    render(<MobileNav items={items} activeKey="home" onChange={() => {}} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Search')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });

  it('marks active item with aria-current="page"', () => {
    render(<MobileNav items={items} activeKey="search" onChange={() => {}} />);
    const searchBtn = screen.getByText('Search').closest('button');
    expect(searchBtn).toHaveAttribute('aria-current', 'page');

    const homeBtn = screen.getByText('Home').closest('button');
    expect(homeBtn).not.toHaveAttribute('aria-current');
  });

  it('calls onChange when an item is clicked', () => {
    const onChange = vi.fn();
    render(<MobileNav items={items} activeKey="home" onChange={onChange} />);
    fireEvent.click(screen.getByText('Search'));
    expect(onChange).toHaveBeenCalledWith('search');
  });

  it('calls item onClick when provided', () => {
    const itemClick = vi.fn();
    const onChange = vi.fn();
    const itemsWithClick: MobileNavItem[] = [
      { key: 'home', label: 'Home', icon: <HomeIcon />, onClick: itemClick },
    ];
    render(<MobileNav items={itemsWithClick} activeKey="" onChange={onChange} />);
    fireEvent.click(screen.getByText('Home'));
    expect(itemClick).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('home');
  });

  it('renders as anchor when href is provided', () => {
    const itemsWithHref: MobileNavItem[] = [
      { key: 'home', label: 'Home', icon: <HomeIcon />, href: '/home' },
    ];
    render(<MobileNav items={itemsWithHref} activeKey="home" onChange={() => {}} />);
    const link = screen.getByText('Home').closest('a');
    expect(link).toHaveAttribute('href', '/home');
  });

  it('has nav element with aria-label', () => {
    render(<MobileNav items={items} activeKey="home" onChange={() => {}} />);
    const nav = screen.getByRole('navigation');
    expect(nav).toHaveAttribute('aria-label', 'Mobile navigation');
  });

  it('limits to 5 items', () => {
    const manyItems: MobileNavItem[] = Array.from({ length: 7 }, (_, i) => ({
      key: `item-${i}`,
      label: `Item ${i}`,
      icon: <HomeIcon />,
    }));
    render(<MobileNav items={manyItems} activeKey="item-0" onChange={() => {}} />);
    const renderedItems = screen.getAllByRole('listitem');
    expect(renderedItems).toHaveLength(5);
  });

  it('warns when more than 5 items in dev mode', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const manyItems: MobileNavItem[] = Array.from({ length: 6 }, (_, i) => ({
      key: `item-${i}`,
      label: `Item ${i}`,
      icon: <HomeIcon />,
    }));
    render(<MobileNav items={manyItems} activeKey="item-0" onChange={() => {}} />);
    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Maximum 5 items'));
    warnSpy.mockRestore();
  });

  it('supports className passthrough', () => {
    render(<MobileNav items={items} activeKey="home" onChange={() => {}} className="custom" />);
    const nav = screen.getByRole('navigation');
    expect(nav.className).toContain('custom');
  });
});
