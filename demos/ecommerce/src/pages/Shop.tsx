import {
  Badge,
  Button,
  Checkbox,
  EmptyState,
  Image,
  Modal,
  Pagination,
  PriceDisplay,
  ProductCard,
  QuantitySelector,
  RatingStars,
  ScrollArea,
  Select,
  Skeleton,
  Spinner,
  useToast,
} from '@arcana-ui/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { CATEGORIES, type Category, type Product, products } from '../data/products';
import './Shop.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Best Rated' },
];

const ITEMS_PER_PAGE = 8;

function sortProducts(items: Product[], sortBy: string): Product[] {
  const sorted = [...items];
  switch (sortBy) {
    case 'price-asc':
      return sorted.sort((a, b) => (a.salePrice ?? a.price) - (b.salePrice ?? b.price));
    case 'price-desc':
      return sorted.sort((a, b) => (b.salePrice ?? b.price) - (a.salePrice ?? a.price));
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    default:
      return sorted;
  }
}

export function Shop(): React.JSX.Element {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState<Category>(
    (searchParams.get('category') as Category) ?? 'All',
  );
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [quickViewQty, setQuickViewQty] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat && CATEGORIES.includes(cat as Category)) {
      setActiveCategory(cat as Category);
    }
  }, [searchParams]);

  const handleCategoryChange = useCallback(
    (category: Category) => {
      setActiveCategory(category);
      setPage(1);
      if (category === 'All') {
        searchParams.delete('category');
      } else {
        searchParams.set('category', category);
      }
      setSearchParams(searchParams);
    },
    [searchParams, setSearchParams],
  );

  const filtered = useMemo(() => {
    const byCategory =
      activeCategory === 'All' ? products : products.filter((p) => p.category === activeCategory);
    return sortProducts(byCategory, sortBy);
  }, [activeCategory, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const handleAddToCart = useCallback(
    (product: Product) => {
      addToCart(product);
      toast({ title: `${product.title} added to cart`, variant: 'success', duration: 2500 });
    },
    [addToCart, toast],
  );

  const handleQuickViewAdd = useCallback(() => {
    if (!quickViewProduct) return;
    addToCart(quickViewProduct, quickViewQty);
    toast({
      title: `${quickViewProduct.title} added to cart`,
      variant: 'success',
      duration: 2500,
    });
    setQuickViewProduct(null);
    setQuickViewQty(1);
  }, [quickViewProduct, quickViewQty, addToCart, toast]);

  return (
    <main className="forma-shop">
      <div className="forma-shop-container">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="forma-shop-header">
          <h1 className="forma-shop-title">All Objects</h1>
          <Badge variant="secondary" size="sm">
            {filtered.length}
          </Badge>
        </div>

        {/* ── Filters ─────────────────────────────────────────────────── */}
        <div className="forma-shop-filters">
          <ScrollArea orientation="horizontal" showScrollbar="auto" className="forma-filter-scroll">
            <fieldset className="forma-category-pills" aria-label="Filter by category">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`forma-pill ${activeCategory === cat ? 'forma-pill--active' : ''}`}
                  onClick={() => handleCategoryChange(cat)}
                  aria-pressed={activeCategory === cat}
                >
                  {cat}
                </button>
              ))}
            </fieldset>
          </ScrollArea>
          <div className="forma-filter-controls">
            <Checkbox label="In stock only" checked={false} onChange={() => {}} />
            <Select
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={(v) => setSortBy(v as string)}
              size="sm"
            />
          </div>
        </div>

        {/* ── Product Grid ────────────────────────────────────────────── */}
        {loading ? (
          <div className="forma-shop-loading">
            <Spinner size="lg" label="Loading products..." />
            <div className="forma-shop-grid">
              {['s1', 's2', 's3', 's4', 's5', 's6'].map((id) => (
                <div key={id} className="forma-skeleton-card">
                  <Skeleton variant="rectangular" width="100%" height="240px" />
                  <Skeleton variant="text" width="70%" />
                  <Skeleton variant="text" width="40%" />
                </div>
              ))}
            </div>
          </div>
        ) : paged.length === 0 ? (
          <EmptyState
            title="No products found"
            description={`No objects in the "${activeCategory}" category.`}
            action={
              <Button variant="outline" onClick={() => handleCategoryChange('All')}>
                View all objects
              </Button>
            }
          />
        ) : (
          <>
            <div className="forma-shop-grid">
              {paged.map((product) => (
                <div key={product.id} className="forma-shop-card-wrapper">
                  <Link to={`/shop/${product.slug}`} className="forma-product-link">
                    <ProductCard
                      image={product.image}
                      title={product.title}
                      price={
                        product.salePrice
                          ? {
                              current: product.salePrice,
                              original: product.price,
                              currency: 'USD',
                            }
                          : product.price
                      }
                      rating={{ value: product.rating, count: product.reviewCount }}
                      badge={product.badge}
                      onAddToCart={() => handleAddToCart(product)}
                    />
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="forma-quick-view-btn"
                    onClick={() => setQuickViewProduct(product)}
                  >
                    Quick view
                  </Button>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="forma-shop-pagination">
                <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
              </div>
            )}
          </>
        )}
      </div>

      {/* ── Quick View Modal ──────────────────────────────────────────── */}
      <Modal
        open={quickViewProduct !== null}
        onClose={() => {
          setQuickViewProduct(null);
          setQuickViewQty(1);
        }}
        title={quickViewProduct?.title ?? ''}
        size="lg"
      >
        {quickViewProduct && (
          <div className="forma-quick-view">
            <Image
              src={quickViewProduct.image}
              alt={quickViewProduct.title}
              aspectRatio="square"
              radius="md"
            />
            <div className="forma-quick-view-details">
              <RatingStars value={quickViewProduct.rating} count={quickViewProduct.reviewCount} />
              <PriceDisplay
                value={quickViewProduct.salePrice ?? quickViewProduct.price}
                originalValue={quickViewProduct.salePrice ? quickViewProduct.price : undefined}
                size="lg"
              />
              <p className="forma-quick-view-desc">{quickViewProduct.description}</p>
              <div className="forma-quick-view-actions">
                <QuantitySelector
                  value={quickViewQty}
                  onChange={setQuickViewQty}
                  min={1}
                  max={10}
                />
                <Button variant="primary" fullWidth onClick={handleQuickViewAdd}>
                  Add to cart
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </main>
  );
}
