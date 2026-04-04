import { Link } from 'react-router-dom';
import type { Article } from '../data/articles';
import { getAuthor } from '../data/authors';

interface ArticleCardProps {
  article: Article;
}

export function ArticleCard({ article }: ArticleCardProps): React.JSX.Element {
  const author = getAuthor(article.authorSlug);

  return (
    <article>
      <Link to={`/article/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div
          className="atelier-placeholder-image"
          style={{
            background: article.image.bg,
            color: article.image.fg,
            aspectRatio: `${article.image.width} / ${article.image.height}`,
            width: '100%',
            marginBottom: 'var(--spacing-md, 1rem)',
          }}
        >
          {article.category}
        </div>
      </Link>
      <p className="atelier-smallcaps" style={{ margin: '0 0 var(--spacing-xs, 0.25rem)' }}>
        {article.category}
      </p>
      <h3 className="atelier-display--sm" style={{ margin: '0 0 var(--spacing-sm, 0.5rem)' }}>
        <Link to={`/article/${article.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
          {article.title}
        </Link>
      </h3>
      <p
        style={{
          margin: 0,
          fontSize: 'var(--font-size-sm, 0.875rem)',
          color: 'var(--color-fg-secondary)',
        }}
      >
        {author?.name} &middot; {article.readTime} min read
      </p>
    </article>
  );
}
