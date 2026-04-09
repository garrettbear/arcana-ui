import { Link } from 'react-router-dom';
import type { Article } from '../data/articles';
import { getAuthor } from '../data/authors';

interface ArticleCardProps {
  article: Article;
  size?: 'featured' | 'standard' | 'small';
}

const aspectClassMap: Record<string, string> = {
  '16/9': 'atelier-card__image-wrap--landscape',
  '3/4': 'atelier-card__image-wrap--portrait',
  '1/1': 'atelier-card__image-wrap--square',
  '4/3': 'atelier-card__image-wrap--wide',
};

export function ArticleCard({ article, size = 'standard' }: ArticleCardProps): React.JSX.Element {
  const author = getAuthor(article.authorSlug);
  const aspectClass = aspectClassMap[article.aspectRatio] ?? 'atelier-card__image-wrap--wide';
  const sizeClass =
    size === 'featured' ? 'atelier-card--featured' : size === 'small' ? 'atelier-card--small' : '';
  const titleSize =
    size === 'featured' ? 'atelier-display--md' : size === 'small' ? '' : 'atelier-display--sm';

  return (
    <article>
      <Link to={`/article/${article.slug}`} className={`atelier-card ${sizeClass}`}>
        <div className={`atelier-card__image-wrap ${aspectClass}`}>
          <img
            src={article.imageUrl}
            alt={article.imageAlt}
            className="atelier-card__img"
            loading="lazy"
            decoding="async"
          />
        </div>
        <p className="atelier-smallcaps atelier-card__category">{article.category}</p>
        <h3 className={`atelier-display atelier-card__title ${titleSize}`}>{article.title}</h3>
        {size !== 'small' && <p className="atelier-card__subtitle">{article.subtitle}</p>}
        <p className="atelier-card__meta">
          <span>{author?.name}</span>
          <span>·</span>
          <span>{article.readTime} min read</span>
        </p>
      </Link>
    </article>
  );
}
