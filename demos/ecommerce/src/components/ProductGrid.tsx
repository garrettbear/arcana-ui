import { ProductCard } from '@arcana-ui/core';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Product } from '../data/products';
import './ProductGrid.css';

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
}

export function ProductGrid({ products, columns = 4 }: ProductGridProps): React.JSX.Element {
  const { addToCart } = useCart();

  return (
    <div className={`forma-product-grid forma-product-grid--cols-${columns}`}>
      {products.map((product) => (
        <Link key={product.id} to={`/shop/${product.slug}`} className="forma-product-link">
          <ProductCard
            image={product.image}
            title={product.title}
            price={
              product.salePrice
                ? { current: product.salePrice, original: product.price, currency: 'USD' }
                : product.price
            }
            rating={{ value: product.rating, count: product.reviewCount }}
            badge={product.badge}
            onAddToCart={() => addToCart(product)}
          />
        </Link>
      ))}
    </div>
  );
}
