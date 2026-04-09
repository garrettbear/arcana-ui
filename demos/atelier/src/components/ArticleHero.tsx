import { Link } from 'react-router-dom';
import type { Article } from '../data/articles';
import { getAuthor } from '../data/authors';

interface ArticleHeroProps {
  article: Article;
}

export function ArticleHero({ article }: ArticleHeroProps): React.JSX.Element {
  const author = getAuthor(article.authorSlug);

  return (
    <Link to={`/article/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <section className="atelier-hero-fullbleed">
        <img
          src={article.imageUrl}
          alt={article.imageAlt}
          className="atelier-hero-fullbleed__img"
          loading="eager"
          fetchPriority="high"
        />
        <div className="atelier-hero-fullbleed__overlay" aria-hidden="true" />
        <div className="atelier-hero-fullbleed__content">
          <p className="atelier-hero-fullbleed__category">{article.category}</p>
          <h1 className="atelier-hero-fullbleed__title">{article.title}</h1>
          <p className="atelier-hero-fullbleed__excerpt">{article.subtitle}</p>
          <div className="atelier-hero-fullbleed__meta">
            <span>By {author?.name}</span>
            <span>·</span>
            <span>{article.readTime} min read</span>
          </div>
        </div>
      </section>
    </Link>
  );
}
