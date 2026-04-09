import {
  Badge,
  Button,
  Drawer,
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarContent,
} from '@arcana-ui/core';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './DemoNavbar.css';

const NAV_LINKS = [
  { label: 'Shop', to: '/shop' },
  { label: 'Collections', to: '/shop' },
  { label: 'About', to: '/#about' },
];

export function DemoNavbar(): React.JSX.Element {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <Navbar sticky>
        <NavbarBrand>
          <Link to="/" className="forma-logo" aria-label="Arcana Supply home">
            ARCANA SUPPLY
          </Link>
        </NavbarBrand>

        <NavbarContent>
          {NAV_LINKS.map((link) => (
            <Link key={link.label} to={link.to} className="forma-nav-link">
              {link.label}
            </Link>
          ))}
        </NavbarContent>

        <NavbarActions>
          <Button
            variant="ghost"
            size="sm"
            aria-label={`Cart with ${cartCount} items`}
            onClick={() => navigate('/cart')}
            className="forma-cart-btn"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {cartCount > 0 && (
              <Badge size="sm" variant="default" className="forma-cart-badge">
                {cartCount}
              </Badge>
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="forma-menu-btn"
            aria-label="Open menu"
            onClick={() => setMobileMenuOpen(true)}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </Button>
        </NavbarActions>
      </Navbar>

      <Drawer
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        side="right"
        title="Menu"
        size="sm"
      >
        <nav className="forma-mobile-nav">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              to={link.to}
              className="forma-mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/cart"
            className="forma-mobile-nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Cart {cartCount > 0 && `(${cartCount})`}
          </Link>
        </nav>
      </Drawer>
    </>
  );
}
