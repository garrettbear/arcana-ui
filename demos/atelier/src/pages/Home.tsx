import {
  AuthorCard,
  Banner,
  Divider,
  Footer,
  FooterBottom,
  FooterLink,
  FooterSection,
  KeyboardShortcut,
  NewsletterSignup,
  useToast,
} from '@arcana-ui/core';
import { Link } from 'react-router-dom';
import { ArticleCard } from '../components/ArticleCard';
import { ArticleHero } from '../components/ArticleHero';
import { AtelierNavbar } from '../components/AtelierNavbar';
import { articles } from '../data/articles';
import { authors, getAuthor } from '../data/authors';

export function Home(): React.JSX.Element {
  const toast = useToast();
  const featured = articles[0];
  const secondary = articles.slice(1, 4);
  const essayArticle = articles[4];
  const essayAuthor = getAuthor(essayArticle.authorSlug);
  const spotlightAuthors = authors.slice(0, 2);

  function handleNewsletterSubmit(_email: string): void {
    toast.toast({ title: 'You\u2019re on the list.', variant: 'success' });
  }

  return (
    <>
      <Banner variant="neutral" dismissible>
        Atelier is reader-supported. No advertising.
      </Banner>

      <AtelierNavbar />

      {/* Hero */}
      <ArticleHero article={featured} />

      {/* Issue strip */}
      <div className="atelier-container">
        <div className="atelier-issue-strip">
          <span className="atelier-issue-strip__line" />
          <span className="atelier-smallcaps atelier-issue-strip__text">
            Volume XXIV &mdash; Spring 2026
          </span>
          <span className="atelier-issue-strip__line" />
        </div>
      </div>

      {/* Secondary grid */}
      <section className="atelier-section">
        <div className="atelier-container">
          <div className="atelier-grid-3">
            {secondary.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        </div>
      </section>

      <div className="atelier-container">
        <Divider />
      </div>

      {/* Featured essay */}
      <section className="atelier-section">
        <div className="atelier-container">
          <Link
            to={`/article/${essayArticle.slug}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              className="atelier-placeholder-image"
              style={{
                background: essayArticle.image.bg,
                color: essayArticle.image.fg,
                aspectRatio: `${essayArticle.image.width} / ${essayArticle.image.height}`,
                width: '100%',
                minHeight: '300px',
                marginBottom: 'var(--spacing-lg, 1.5rem)',
              }}
            >
              {essayArticle.title}
            </div>
          </Link>
          <p className="atelier-smallcaps" style={{ margin: '0 0 var(--spacing-xs, 0.25rem)' }}>
            {essayArticle.category}
          </p>
          <h2
            className="atelier-display atelier-display--md"
            style={{ margin: '0 0 var(--spacing-md, 1rem)' }}
          >
            <Link
              to={`/article/${essayArticle.slug}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              {essayArticle.title}
            </Link>
          </h2>
          <p
            className="atelier-body--serif"
            style={{ maxWidth: '720px', margin: '0 0 var(--spacing-sm, 0.5rem)' }}
          >
            {essayArticle.excerpt} {essayAuthor?.name} traces the arc of a career dedicated to
            making structure disappear.
          </p>
          <Link to={`/article/${essayArticle.slug}`} className="atelier-link">
            Continue Reading
          </Link>
        </div>
      </section>

      <div className="atelier-container">
        <Divider />
      </div>

      {/* Writer spotlight */}
      <section className="atelier-section">
        <div className="atelier-container">
          <h2
            className="atelier-display atelier-display--sm"
            style={{ marginBottom: 'var(--spacing-lg, 1.5rem)' }}
          >
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
            style={{ textAlign: 'center', marginBottom: 'var(--spacing-sm, 0.5rem)' }}
          >
            The Atelier Letter
          </h2>
          <p
            style={{
              textAlign: 'center',
              color: 'var(--color-fg-secondary)',
              marginBottom: 'var(--spacing-lg, 1.5rem)',
            }}
          >
            Twice a month. No advertising. No aggregation.
          </p>
          <NewsletterSignup
            title=""
            placeholder="Your email address"
            buttonText="Subscribe"
            onSubmit={handleNewsletterSubmit}
            successMessage="You\u2019re on the list."
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
          <FooterLink href="/archive?category=Material">Material</FooterLink>
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
              marginRight: 'var(--spacing-lg, 1.5rem)',
            }}
          >
            Atelier
          </span>
          <span
            style={{
              color: 'var(--color-fg-secondary)',
              fontSize: 'var(--font-size-sm, 0.875rem)',
            }}
          >
            &copy; 2026 Atelier Publications Ltd.
          </span>
        </FooterBottom>
      </Footer>

      {/* Keyboard shortcut hint */}
      <div className="atelier-kb-hint">
        <span>Navigate articles:</span>
        <KeyboardShortcut keys={['J']} variant="inline" />
        <span>/</span>
        <KeyboardShortcut keys={['K']} variant="inline" />
      </div>
    </>
  );
}
