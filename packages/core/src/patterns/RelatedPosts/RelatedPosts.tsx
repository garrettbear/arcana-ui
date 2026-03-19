import React from 'react';
import { cn } from '../../utils/cn';
import styles from './RelatedPosts.module.css';

export interface RelatedPost {
  /** Post title */
  title: string;
  /** Short excerpt */
  excerpt?: string;
  /** Featured image URL */
  image?: string;
  /** Link to post */
  href: string;
  /** Publication date */
  date?: string;
  /** Author name */
  author?: string;
  /** Category tag */
  category?: string;
}

export interface RelatedPostsProps extends React.HTMLAttributes<HTMLElement> {
  /** Section title */
  title?: string;
  /** Array of related posts */
  posts: RelatedPost[];
  /** Number of columns */
  columns?: 2 | 3 | 4;
  /** Layout variant */
  variant?: 'card' | 'list';
  /** Additional CSS class */
  className?: string;
}

export const RelatedPosts = React.forwardRef<HTMLElement, RelatedPostsProps>(
  ({ title = 'Related Posts', posts, columns = 3, variant = 'card', className, ...props }, ref) => (
    <nav ref={ref} aria-label={title} className={cn(styles.related, className)} {...props}>
      <h2 className={styles.heading}>{title}</h2>
      <div
        className={cn(styles.grid, variant === 'list' && styles.list)}
        style={
          variant === 'card' ? ({ '--related-cols': columns } as React.CSSProperties) : undefined
        }
      >
        {posts.map((post) => (
          <a
            key={post.href}
            href={post.href}
            className={cn(styles.post, variant === 'list' && styles.postList)}
          >
            {variant === 'card' && post.image && (
              <div className={styles.imageWrapper}>
                {/* biome-ignore lint/a11y/useAltText: decorative post image */}
                <img src={post.image} alt="" className={styles.image} loading="lazy" />
              </div>
            )}
            <div className={styles.postBody}>
              {post.category && <span className={styles.category}>{post.category}</span>}
              <h3 className={styles.postTitle}>{post.title}</h3>
              {variant === 'card' && post.excerpt && (
                <p className={styles.excerpt}>{post.excerpt}</p>
              )}
              {(post.date || post.author) && (
                <span className={styles.meta}>
                  {post.author && <span>{post.author}</span>}
                  {post.author && post.date && <span> · </span>}
                  {post.date && <time>{post.date}</time>}
                </span>
              )}
            </div>
          </a>
        ))}
      </div>
    </nav>
  ),
);
RelatedPosts.displayName = 'RelatedPosts';
