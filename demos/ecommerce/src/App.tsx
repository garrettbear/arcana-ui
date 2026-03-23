import {
  Badge,
  Button,
  Input,
  Navbar,
  NavbarActions,
  NavbarBrand,
  NavbarContent,
  PriceDisplay,
  ProductCard,
  QuantitySelector,
} from '@arcana-ui/core';
import { ThemeSwitcher } from '@arcana-ui/demo-shared/theme-switcher';
import { useState } from 'react';
import './App.css';

// ─── Sample products ──────────────────────────────────────────────────────────

interface Product {
  id: number;
  title: string;
  price: number;
  salePrice?: number;
  image: string;
  badge?: string;
  rating: number;
  ratingCount: number;
}

const products: Product[] = [
  {
    id: 1,
    title: 'Arcana UI Pro License',
    price: 199,
    image: 'https://placehold.co/400x300/4f46e5/ffffff?text=Pro',
    badge: 'Popular',
    rating: 4.8,
    ratingCount: 124,
  },
  {
    id: 2,
    title: 'Design Token Starter Kit',
    price: 49,
    salePrice: 29,
    image: 'https://placehold.co/400x300/06b6d4/ffffff?text=Tokens',
    badge: 'Sale',
    rating: 4.5,
    ratingCount: 67,
  },
  {
    id: 3,
    title: 'Theme Builder Plugin',
    price: 79,
    image: 'https://placehold.co/400x300/8b5cf6/ffffff?text=Builder',
    rating: 4.2,
    ratingCount: 38,
  },
  {
    id: 4,
    title: 'Component Library Extension',
    price: 149,
    image: 'https://placehold.co/400x300/ec4899/ffffff?text=Components',
    rating: 4.9,
    ratingCount: 205,
  },
  {
    id: 5,
    title: 'AI Agent Integration Kit',
    price: 299,
    salePrice: 249,
    image: 'https://placehold.co/400x300/f59e0b/000000?text=AI+Kit',
    badge: 'New',
    rating: 4.7,
    ratingCount: 18,
  },
  {
    id: 6,
    title: 'Arcana Merch T-Shirt',
    price: 35,
    image: 'https://placehold.co/400x300/1a1a2e/ffffff?text=Merch',
    rating: 4.6,
    ratingCount: 92,
  },
];

const NAV_LINKS = ['Shop', 'Themes', 'Docs', 'Community'];

// ─── App ──────────────────────────────────────────────────────────────────────

export function App(): React.JSX.Element {
  const [cartCount, setCartCount] = useState(0);
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  const handleAddToCart = (productId: number) => {
    const qty = quantities[productId] ?? 1;
    setCartCount((prev) => prev + qty);
    setQuantities((prev) => ({ ...prev, [productId]: 1 }));
  };

  const handleQuantityChange = (productId: number, value: number) => {
    setQuantities((prev) => ({ ...prev, [productId]: value }));
  };

  return (
    <div className="store">
      <Navbar>
        <NavbarBrand>
          <span className="store__logo">Arcana Store</span>
        </NavbarBrand>
        <NavbarContent>
          {NAV_LINKS.map((link) => (
            <button key={link} type="button" className="store__nav-link">
              {link}
            </button>
          ))}
        </NavbarContent>
        <NavbarActions>
          <Input placeholder="Search products..." size="sm" className="store__search" />
          <Button variant="outline" size="sm">
            Cart {cartCount > 0 && <Badge size="sm">{cartCount}</Badge>}
          </Button>
        </NavbarActions>
      </Navbar>

      <main className="store__main">
        <section className="store__hero">
          <h1 className="store__hero-title">Arcana Merch Store</h1>
          <p className="store__hero-subtitle">
            Design tokens, tools, and merch for the AI-first design system.
          </p>
        </section>

        <section className="store__products">
          <div className="store__grid">
            {products.map((product) => (
              <div key={product.id} className="store__product-wrapper">
                <ProductCard
                  title={product.title}
                  price={
                    product.salePrice
                      ? { current: product.salePrice, original: product.price, currency: 'USD' }
                      : product.price
                  }
                  image={product.image}
                  badge={product.badge}
                  rating={{ value: product.rating, count: product.ratingCount }}
                  onAddToCart={() => handleAddToCart(product.id)}
                />
                <div className="store__quantity">
                  <span className="store__quantity-label">Qty:</span>
                  <QuantitySelector
                    value={quantities[product.id] ?? 1}
                    onChange={(v) => handleQuantityChange(product.id, v)}
                    min={1}
                    max={10}
                  />
                  <PriceDisplay value={product.salePrice ?? product.price} currency="USD" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <ThemeSwitcher defaultTheme="commerce" />
    </div>
  );
}
