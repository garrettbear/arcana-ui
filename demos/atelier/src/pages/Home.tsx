import {
  AuthorCard,
  Divider,
  Footer,
  FooterBottom,
  FooterLink,
  FooterSection,
  NewsletterSignup,
  useToast,
} from '@arcana-ui/core';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArticleCard } from '../components/ArticleCard';
import { ArticleHero } from '../components/ArticleHero';
import { AtelierNavbar } from '../components/AtelierNavbar';
import { articles, categories, getArticlesByCategory } from '../data/articles';
import { authors, getAuthor } from '../data/authors';

export function Home(): React.JSX.Element {
  const toast = useToast();
  const [activeCategory, setActiveCategory] = useState('All');
  const filtered = getArticlesByCategory(activeCategory);

  // Featured = first article, rest in the grid
  const featured = articles[0];
  const gridArticles = filtered.filter((a) => a.slug !== featured.slug);

  // Secondary row: first two of grid
  const secondaryLeft = gridArticles[0];
  const secondaryRight = gridArticles[1];
  const remaining = gridArticles.slice(2);

  const spotlightAuthors = authors.slice(0, 2);

  function handleNewsletterSubmit(_email: string): void {
    toast.toast({ title: "You're on the list.", variant: 'success' });
  }

  return (
    <>
      <AtelierNavbar />

      {/* Full-bleed hero — always shows featured article */}
      <ArticleHero article={featured} />

      {/* Issue strip */}
      <div className="atelier-container">
        <div className="atelier-issue-strip">
          <span className="atelier-issue-strip__line" />
          <span className="atelier-issue-strip__text">Volume XXIV &mdash; Spring 2026</span>
          <span className="atelier-issue-strip__line" />
        </div>
      </div>

      {/* Category filter */}
      <div className="atelier-container">
        <nav className="atelier-category-filter" aria-label="Filter by category">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              className={`atelier-category-btn${activeCategory === cat ? ' atelier-category-btn--active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>
      </div>

      {/* Asymmetric article grid */}
      <section className="atelier-section" style={{ paddingTop: 0 }}>
        <div className="atelier-container">
          {secondaryLeft || secondaryRight ? (
            <div className="atelier-grid-asymmetric" style={{ marginBottom: '3rem' }}>
              {secondaryLeft && <ArticleCard article={secondaryLeft} size="featured" />}
              {secondaryRight && <ArticleCard article={secondaryRight} size="standard" />}
            </div>
          ) : null}

          {remaining.length > 0 && (
            <>
              <hr className="atelier-rule" style={{ marginBottom: '3rem' }} />
              <div className="atelier-grid-3">
                {remaining.map((article) => (
                  <ArticleCard key={article.slug} article={article} size="small" />
                ))}
              </div>
            </>
          )}

          {filtered.length === 0 && (
            <p
              style={{ color: 'var(--color-fg-secondary)', textAlign: 'center', padding: '4rem 0' }}
            >
              No articles in this category yet.
            </p>
          )}
        </div>
      </section>

      <div className="atelier-container">
        <Divider />
      </div>

      {/* Writer spotlight */}
      <section className="atelier-section">
        <div className="atelier-container">
          <h2 className="atelier-display atelier-display--sm" style={{ marginBottom: '2rem' }}>
            From the Contributors
          </h2>
          <div className="atelier-grid-2">
            {spotlightAuthors.map((author) => (
              <AuthorCard
                key={author.slug}
                name={author.name}
                role={`Based in ${author.location}`}
                bio={author.bio}
                variant="card"
              />
            ))}
          </div>
        </div>
      </section>

      <div className="atelier-container">
        <Divider />
      </div>

      {/* Newsletter */}
      <section className="atelier-section">
        <div className="atelier-container" style={{ maxWidth: '600px' }}>
          <h2
            className="atelier-display atelier-display--sm"
            style={{ textAlign: 'center', marginBottom: '0.5rem' }}
          >
            The Atelier Letter
          </h2>
          <p
            style={{
              textAlign: 'center',
              color: 'var(--color-fg-secondary)',
              marginBottom: '1.75rem',
              fontFamily: 'var(--font-family-display)',
              fontStyle: 'italic',
              fontSize: '1.0625rem',
            }}
          >
            Twice a month. No advertising. No aggregation.
          </p>
          <NewsletterSignup
            title=""
            placeholder="Your email address"
            buttonText="Subscribe"
            onSubmit={handleNewsletterSubmit}
            successMessage="You're on the list."
          />
        </div>
      </section>

      {/* Footer */}
      <Footer variant="minimal" border>
        <FooterSection title="Atelier">
          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="/archive">Archive</FooterLink>
        </FooterSection>
        <FooterSection title="Categories">
          <FooterLink href="/archive?category=Architecture">Architecture</FooterLink>
          <FooterLink href="/archive?category=Interiors">Interiors</FooterLink>
          <FooterLink href="/archive?category=Design">Design</FooterLink>
        </FooterSection>
        <FooterSection title="About">
          <FooterLink href="/archive">Contributors</FooterLink>
          <FooterLink href="/archive">Contact</FooterLink>
        </FooterSection>
        <FooterBottom>
          <span
            style={{
              fontFamily: 'var(--font-family-display)',
              fontWeight: 300,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginRight: '1.5rem',
            }}
          >
            Atelier
          </span>
          <span style={{ color: 'var(--color-fg-secondary)', fontSize: '0.875rem' }}>
            &copy; 2026 Atelier Publications Ltd.
          </span>
        </FooterBottom>
      </Footer>
    </>
  );
}
