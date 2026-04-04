import { Link } from 'react-router-dom';
import type { Article } from '../data/articles';
import { getAuthor } from '../data/authors';

interface ArticleHeroProps {
  article: Article;
}

export function ArticleHero({ article }: ArticleHeroProps): React.JSX.Element {
  const author = getAuthor(article.authorSlug);

  return (
    <section className="atelier-section">
      <div className="atelier-container">
        <div className="atelier-hero">
          <Link
            to={`/article/${article.slug}`}
            style={{ textDecoration: 'none', color: 'inherit' }}
          >
            <div
              className="atelier-placeholder-image"
              style={{
                background: article.image.bg,
                color: article.image.fg,
                aspectRatio: `${article.image.width} / ${article.image.height}`,
                width: '100%',
                minHeight: '400px',
              }}
            >
              {article.title}
            </div>
          </Link>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 'var(--spacing-md, 1rem)',
            }}
          >
            <p className="atelier-smallcaps" style={{ margin: 0 }}>
              {article.category}
            </p>
            <h1 className="atelier-display atelier-display--lg" style={{ margin: 0 }}>
              <Link
                to={`/article/${article.slug}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                {article.title}
              </Link>
            </h1>
            <p
              className="atelier-body--serif"
              style={{ margin: 0, color: 'var(--color-fg-secondary)' }}
            >
              {article.excerpt}
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--spacing-sm, 0.5rem)',
                fontSize: 'var(--font-size-sm, 0.875rem)',
                color: 'var(--color-fg-secondary)',
              }}
            >
              <span>By {author?.name}</span>
              <span>&middot;</span>
              <span>{article.readTime} min read</span>
            </div>
            <Link
              to={`/article/${article.slug}`}
              className="atelier-link"
              style={{ alignSelf: 'flex-start' }}
            >
              Read
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
