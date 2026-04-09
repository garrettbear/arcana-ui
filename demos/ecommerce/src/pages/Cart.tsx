import {
  Badge,
  Button,
  Card,
  CardBody,
  CartItem,
  Divider,
  EmptyState,
  Form,
  Input,
  PriceDisplay,
  ProgressBar,
} from '@arcana-ui/core';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import './Cart.css';

const FREE_SHIPPING_THRESHOLD = 200;
const FLAT_SHIPPING = 15;

export function Cart(): React.JSX.Element {
  const { cart, cartCount, cartTotal, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();
  const [promoCode, setPromoCode] = useState('');

  const shippingProgress = Math.min((cartTotal / FREE_SHIPPING_THRESHOLD) * 100, 100);
  const remainingForFreeShipping = Math.max(FREE_SHIPPING_THRESHOLD - cartTotal, 0);
  const hasFreeShipping = cartTotal >= FREE_SHIPPING_THRESHOLD;
  const orderTotal = cartTotal + (hasFreeShipping ? 0 : FLAT_SHIPPING);

  if (cart.length === 0) {
    return (
      <main className="forma-cart">
        <div className="forma-cart-container">
          <EmptyState
            title="Your cart is empty."
            description="Everything we make is designed to last."
            action={
              <Button variant="primary" onClick={() => navigate('/shop')}>
                Browse Objects
              </Button>
            }
          />
        </div>
      </main>
    );
  }

  return (
    <main className="forma-cart">
      <div className="forma-cart-container">
        <h1 className="forma-cart-title">
          Cart
          <Badge size="sm" variant="secondary" className="forma-cart-badge">
            {cartCount}
          </Badge>
        </h1>

        <div className="forma-cart-layout">
          {/* ── Cart Items ──────────────────────────────────────────── */}
          <div className="forma-cart-items">
            {cart.map((entry) => (
              <CartItem
                key={entry.product.id}
                image={entry.product.image}
                title={entry.product.title}
                variant={entry.product.category}
                price={entry.product.salePrice ?? entry.product.price}
                quantity={entry.quantity}
                onQuantityChange={(qty) => updateQuantity(entry.product.id, qty)}
                onRemove={() => removeFromCart(entry.product.id)}
                maxQuantity={10}
              />
            ))}
          </div>

          {/* ── Order Summary ───────────────────────────────────────── */}
          <div className="forma-cart-summary">
            <Card variant="outlined">
              <CardBody>
                <h2 className="forma-summary-title">Order summary</h2>

                <div className="forma-summary-row">
                  <span>Subtotal</span>
                  <PriceDisplay value={cartTotal} size="md" />
                </div>

                <div className="forma-summary-row">
                  <span>Shipping</span>
                  <span className="forma-summary-shipping">
                    {hasFreeShipping ? 'Complimentary' : `$${FLAT_SHIPPING}`}
                  </span>
                </div>

                {!hasFreeShipping && (
                  <div className="forma-shipping-progress">
                    <p className="forma-shipping-text">
                      Add ${remainingForFreeShipping.toFixed(0)} more for complimentary shipping
                    </p>
                    <ProgressBar value={shippingProgress} max={100} size="sm" color="primary" />
                  </div>
                )}

                <Divider spacing="sm" />

                <div className="forma-summary-row forma-summary-row--total">
                  <span>Total</span>
                  <PriceDisplay value={orderTotal} size="lg" />
                </div>

                <Form onSubmit={(e) => e.preventDefault()} className="forma-promo-form">
                  <div className="forma-promo-row">
                    <Input
                      placeholder="Promo code"
                      size="sm"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button variant="outline" size="sm" type="submit">
                      Apply
                    </Button>
                  </div>
                </Form>

                <Button variant="primary" fullWidth className="forma-checkout-btn">
                  Checkout
                </Button>

                <Button variant="ghost" fullWidth onClick={() => navigate('/shop')}>
                  Continue Shopping
                </Button>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
