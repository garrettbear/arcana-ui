import {
  Banner,
  Button,
  Card,
  CardBody,
  Divider,
  Hero,
  Image,
  NewsletterSignup,
  StatCard,
  Testimonial,
  Timeline,
} from '@arcana-ui/core';
import { Link, useNavigate } from 'react-router-dom';
import { ProductGrid } from '../components/ProductGrid';
import { products } from '../data/products';
import './Home.css';

const FEATURED = products.slice(0, 4);

export function Home(): React.JSX.Element {
  const navigate = useNavigate();

  return (
    <main className="forma-home">
      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <Hero
        headline="Gear for people who ship."
        subheadline="Official merch for the Arcana UI design system."
        primaryCTA={{ label: 'Shop Now', onClick: () => navigate('/shop') }}
        secondaryCTA={{ label: 'Our Story', href: '#about' }}
        variant="fullscreen"
        height="large"
        overlay
        media={
          <Image
            src="https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=1400&q=85"
            alt="Developer in a black Arcana hoodie at a desk with a mechanical keyboard"
            aspectRatio="video"
          />
        }
      />

      {/* ── Featured Products ─────────────────────────────────────────────── */}
      <section className="forma-section">
        <div className="forma-container">
          <div className="forma-section-header">
            <h2 className="forma-section-title">New Arrivals</h2>
            <Link to="/shop" className="forma-section-link">
              View all
            </Link>
          </div>
          <ProductGrid products={FEATURED} columns={4} />
        </div>
      </section>

      {/* ── Trust Banner ─────────────────────────────────────────────────── */}
      <section className="forma-container">
        <Banner variant="neutral">
          Free shipping on orders over $75. Easy returns within 30 days.
        </Banner>
      </section>

      {/* ── Trust Stats ───────────────────────────────────────────────────── */}
      <section className="forma-section">
        <div className="forma-container">
          <div className="forma-stats-grid">
            <StatCard
              value="4,200+"
              label="Orders shipped"
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
                </svg>
              }
            />
            <StatCard
              value="63 +"
              label="Components in the system"
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                </svg>
              }
            />
            <StatCard
              value="30 days"
              label="Free returns, no questions"
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <polyline points="1 4 1 10 7 10" />
                  <path d="M3.51 15a9 9 0 102.13-9.36L1 10" />
                </svg>
              }
            />
            <StatCard
              value="MIT"
              label="Open-source license"
              icon={
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              }
            />
          </div>
        </div>
      </section>

      <Divider spacing="lg" />

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section className="forma-section">
        <div className="forma-container">
          <h2 className="forma-section-title forma-section-title--center">From the community</h2>
          <div className="forma-testimonials">
            <Testimonial
              quote="Wore the hoodie to a conference. Got asked about Arcana three times before lunch. Comfortable too."
              author="Priya S."
              jobTitle="Frontend Engineer"
              company="Berlin"
              rating={5}
              variant="card"
            />
            <Testimonial
              quote="The desk mat is the best thing on my setup. The token-grid pattern is exactly the kind of subtle nerd joke I appreciate."
              author="Marcus L."
              jobTitle="Design Systems Lead"
              company="San Francisco"
              rating={5}
              variant="card"
            />
            <Testimonial
              quote="Bought the sticker sheet for my laptop and the tote for my commute. Both held up way better than I expected for the price."
              author="Yuki T."
              jobTitle="Staff Engineer"
              company="Tokyo"
              rating={5}
              variant="card"
            />
          </div>
        </div>
      </section>

      {/* ── About / Timeline ──────────────────────────────────────────────── */}
      <section className="forma-section" id="about">
        <div className="forma-container">
          <div className="forma-about-grid">
            <div className="forma-about-text">
              <h2 className="forma-section-title">Built by builders, for builders</h2>
              <p className="forma-about-description">
                Arcana Supply is the official merch store for Arcana UI — an open-source,
                token-driven design system built for AI agents to assemble production-grade
                interfaces. Every item here is designed by the same people who write the components.
              </p>
              <Button variant="outline" onClick={() => navigate('/shop')}>
                Shop the collection
              </Button>
            </div>
            <Card variant="outlined">
              <CardBody>
                <Timeline
                  variant="compact"
                  items={[
                    {
                      title: 'Arcana UI open-sourced',
                      description: 'Token-driven design system released on GitHub under MIT.',
                      date: '2026-03',
                      status: 'complete',
                    },
                    {
                      title: 'First beta packages published',
                      description: '@arcana-ui/tokens and @arcana-ui/core hit npm as 0.1.0-beta.1.',
                      date: '2026-03',
                      status: 'complete',
                    },
                    {
                      title: 'CLI launched',
                      description:
                        'arcana-ui init, validate, and add-theme commands. All 14 presets.',
                      date: '2026-04',
                      status: 'complete',
                    },
                    {
                      title: 'Arcana Supply opens',
                      description:
                        'Merch store for the community. Every purchase supports development.',
                      date: '2026-04',
                      status: 'active',
                    },
                  ]}
                />
              </CardBody>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Newsletter ────────────────────────────────────────────────────── */}
      <section className="forma-section forma-section--muted">
        <div className="forma-container">
          <NewsletterSignup
            title="Stay in the loop."
            description="New drops and Arcana UI releases. Low volume."
            placeholder="your@email.com"
            buttonText="Subscribe"
            variant="card"
            onSubmit={() => Promise.resolve()}
            successMessage="You're on the list."
          />
        </div>
      </section>
    </main>
  );
}
