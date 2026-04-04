import { Button, Navbar, NavbarActions, NavbarBrand, NavbarContent } from '@arcana-ui/core';
import { Link } from 'react-router-dom';

const navLinks = [
  { label: 'Architecture', href: '/archive?category=Architecture' },
  { label: 'Interiors', href: '/archive?category=Interiors' },
  { label: 'Material', href: '/archive?category=Material' },
  { label: 'Interview', href: '/archive?category=Interview' },
  { label: 'Archive', href: '/archive' },
];

export function AtelierNavbar(): React.JSX.Element {
  return (
    <Navbar
      sticky
      border
      mobileContent={
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-sm, 0.5rem)' }}>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="atelier-link"
              style={{ padding: 'var(--spacing-xs, 0.25rem) 0', textDecoration: 'none' }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      }
    >
      <NavbarBrand>
        <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <span
            style={{
              fontFamily: 'var(--font-family-display)',
              fontWeight: 300,
              fontSize: 'var(--font-size-xl, 1.25rem)',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
            }}
          >
            Atelier
          </span>
        </Link>
      </NavbarBrand>

      <NavbarContent>
        {navLinks.map((link) => (
          <Link
            key={link.label}
            to={link.href}
            className="atelier-smallcaps"
            style={{ textDecoration: 'none', color: 'var(--color-fg-secondary)' }}
          >
            {link.label}
          </Link>
        ))}
      </NavbarContent>

      <NavbarActions>
        <Link to="/archive" aria-label="Search" style={{ color: 'var(--color-fg-secondary)' }}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            role="img"
            aria-label="Search"
          >
            <title>Search</title>
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </Link>
        <Button size="sm" variant="primary">
          Subscribe
        </Button>
      </NavbarActions>
    </Navbar>
  );
}
