import { Button, Navbar, NavbarActions, NavbarBrand, NavbarContent } from '@arcana-ui/core';
import { Link } from 'react-router-dom';

const navLinks = [
  { label: 'Architecture', href: '/archive?category=Architecture' },
  { label: 'Interiors', href: '/archive?category=Interiors' },
  { label: 'Design', href: '/archive?category=Design' },
  { label: 'Archive', href: '/archive' },
];

export function AtelierNavbar(): React.JSX.Element {
  return (
    <Navbar
      sticky
      border
      mobileContent={
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="atelier-smallcaps"
              style={{
                padding: '0.5rem 0',
                textDecoration: 'none',
                color: 'var(--color-fg-secondary)',
              }}
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
              fontWeight: 400,
              fontSize: '1.375rem',
              letterSpacing: '0.12em',
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
            style={{
              textDecoration: 'none',
              color: 'var(--color-fg-secondary)',
              transition: 'color 150ms ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--color-fg-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--color-fg-secondary)';
            }}
          >
            {link.label}
          </Link>
        ))}
      </NavbarContent>

      <NavbarActions>
        <Link
          to="/archive"
          aria-label="Search articles"
          style={{ color: 'var(--color-fg-secondary)', display: 'flex', alignItems: 'center' }}
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
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
