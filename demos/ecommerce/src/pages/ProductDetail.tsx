import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Badge,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  Divider,
  Image,
  PriceDisplay,
  QuantitySelector,
  RatingStars,
  ScrollArea,
  Spinner,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  useToast,
} from '@arcana-ui/core';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { type Product, getProductBySlug, getRelatedProducts } from '../data/products';
import './ProductDetail.css';

const REVIEWS: { author: string; rating: number; text: string }[] = [
  {
    author: 'A. Sørensen',
    rating: 5,
    text: 'Exactly what I expected. Nothing more, nothing less. That is praise.',
  },
  {
    author: 'R. Vasquez',
    rating: 4,
    text: 'Beautiful craftsmanship. The materials feel honest. Shipping was quick.',
  },
  {
    author: 'K. Tanaka',
    rating: 5,
    text: 'Bought this as a gift. The recipient asked where to find more Forma pieces.',
  },
];

function ProductImage({ product }: { product: Product }): React.JSX.Element {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="forma-pdp-image">
      {!loaded && (
        <div className="forma-pdp-spinner">
          <Spinner size="lg" label="Loading image" />
        </div>
      )}
      <Image
        src={product.image}
        alt={product.title}
        aspectRatio="square"
        radius="sm"
        onLoad={() => setLoaded(true)}
      />
      {product.badge && (
        <Badge variant={product.badge === 'SALE' ? 'error' : 'info'} className="forma-pdp-badge">
          {product.badge}
        </Badge>
      )}
    </div>
  );
}

export function ProductDetail(): React.JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  const product = getProductBySlug(slug ?? '');

  if (!product) {
    return (
      <main className="forma-pdp">
        <div className="forma-pdp-container">
          <p>Product not found.</p>
          <Button variant="outline" onClick={() => navigate('/shop')}>
            Back to shop
          </Button>
        </div>
      </main>
    );
  }

  const related = getRelatedProducts(product.id, 4);

  const handleAddToCart = (): void => {
    addToCart(product, quantity);
    toast({
      title: `${product.title} added to cart`,
      description: `Quantity: ${quantity}`,
      variant: 'success',
      duration: 2500,
    });
    setQuantity(1);
  };

  return (
    <main className="forma-pdp">
      <div className="forma-pdp-container">
        {/* ── Breadcrumb ───────────────────────────────────────────────── */}
        <Breadcrumb>
          <BreadcrumbItem href="/">Home</BreadcrumbItem>
          <BreadcrumbItem href="/shop">Shop</BreadcrumbItem>
          <BreadcrumbItem current>{product.title}</BreadcrumbItem>
        </Breadcrumb>

        {/* ── Product Layout ───────────────────────────────────────────── */}
        <div className="forma-pdp-grid">
          <ProductImage product={product} />

          <div className="forma-pdp-info">
            <span className="forma-pdp-category">{product.category}</span>
            <h1 className="forma-pdp-title">{product.title}</h1>

            <RatingStars value={product.rating} count={product.reviewCount} />

            <PriceDisplay
              value={product.salePrice ?? product.price}
              originalValue={product.salePrice ? product.price : undefined}
              size="xl"
            />

            <Divider spacing="sm" />

            <p className="forma-pdp-description">{product.description}</p>

            <div className="forma-pdp-actions">
              <div className="forma-pdp-qty-row">
                <span className="forma-pdp-qty-label">Quantity</span>
                <QuantitySelector value={quantity} onChange={setQuantity} min={1} max={10} />
              </div>
              <Button variant="primary" fullWidth onClick={handleAddToCart}>
                Add to cart
              </Button>
              <Button variant="ghost" fullWidth>
                Add to wishlist
              </Button>
            </div>

            <Divider spacing="sm" />

            {/* ── Accordion ─────────────────────────────────────────── */}
            <Accordion type="single" defaultValue="materials">
              <AccordionItem value="materials">
                <AccordionTrigger>Materials &amp; Care</AccordionTrigger>
                <AccordionContent>
                  <p className="forma-pdp-accordion-text">
                    Every Forma piece uses responsibly sourced materials chosen for longevity.
                    Ceramics are food-safe and dishwasher-resistant. Leathers should be conditioned
                    once per season. Textiles can be hand-washed in cool water and laid flat to dry.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="shipping">
                <AccordionTrigger>Shipping &amp; Returns</AccordionTrigger>
                <AccordionContent>
                  <p className="forma-pdp-accordion-text">
                    Complimentary shipping on orders over $200. Returns accepted within 60 days of
                    delivery. Items must be unused.
                  </p>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="about">
                <AccordionTrigger>About Forma</AccordionTrigger>
                <AccordionContent>
                  <p className="forma-pdp-accordion-text">
                    Forma was founded in 2019 with one principle: make objects worth keeping. Every
                    product is designed to last at least thirty years.
                  </p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────── */}
        <section className="forma-pdp-tabs-section">
          <Tabs defaultValue="details">
            <TabList>
              <Tab value="details">Details</Tab>
              <Tab value="reviews">Reviews ({product.reviewCount})</Tab>
            </TabList>
            <TabPanels>
              <TabPanel value="details">
                <div className="forma-pdp-tab-content">
                  <Table size="sm" striped>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Specification</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>Category</TableCell>
                        <TableCell>{product.category}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>SKU</TableCell>
                        <TableCell>FORMA-{String(product.id).padStart(4, '0')}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Rating</TableCell>
                        <TableCell>{product.rating} / 5</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Reviews</TableCell>
                        <TableCell>{product.reviewCount}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Designed in</TableCell>
                        <TableCell>Portland, Oregon</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>Warranty</TableCell>
                        <TableCell>30 years</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </TabPanel>
              <TabPanel value="reviews">
                <div className="forma-pdp-tab-content">
                  <div className="forma-pdp-reviews">
                    {REVIEWS.map((review) => (
                      <Card key={review.author} variant="outlined" padding="sm">
                        <CardBody>
                          <RatingStars value={review.rating} size="sm" />
                          <p className="forma-review-text">{review.text}</p>
                          <span className="forma-review-author">{review.author}</span>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </section>

        {/* ── Related Products ────────────────────────────────────────── */}
        <section className="forma-pdp-related">
          <h2 className="forma-pdp-related-title">You might also like</h2>
          <ScrollArea orientation="horizontal" showScrollbar="hover">
            <div className="forma-pdp-related-scroll">
              {related.map((p) => (
                <Link key={p.id} to={`/shop/${p.slug}`} className="forma-pdp-related-card">
                  <Image src={p.image} alt={p.title} aspectRatio="square" radius="sm" />
                  <span className="forma-pdp-related-name">{p.title}</span>
                  <PriceDisplay
                    value={p.salePrice ?? p.price}
                    originalValue={p.salePrice ? p.price : undefined}
                    size="sm"
                  />
                </Link>
              ))}
            </div>
          </ScrollArea>
        </section>
      </div>
    </main>
  );
}
