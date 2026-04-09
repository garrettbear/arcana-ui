import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Product } from '../data/products';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface CartEntry {
  product: Product;
  quantity: number;
}

interface CartContextValue {
  cart: CartEntry[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

// ─── Context ─────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [cart, setCart] = useState<CartEntry[]>([]);

  const addToCart = useCallback((product: Product, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((e) => e.product.id === product.id);
      if (existing) {
        return prev.map((e) =>
          e.product.id === product.id ? { ...e, quantity: e.quantity + quantity } : e,
        );
      }
      return [...prev, { product, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((productId: number) => {
    setCart((prev) => prev.filter((e) => e.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((e) => e.product.id !== productId));
      return;
    }
    setCart((prev) => prev.map((e) => (e.product.id === productId ? { ...e, quantity } : e)));
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = useMemo(() => cart.reduce((sum, e) => sum + e.quantity, 0), [cart]);

  const cartTotal = useMemo(
    () =>
      cart.reduce((sum, e) => {
        const price = e.product.salePrice ?? e.product.price;
        return sum + price * e.quantity;
      }, 0),
    [cart],
  );

  const value = useMemo<CartContextValue>(
    () => ({ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }),
    [cart, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return ctx;
}
