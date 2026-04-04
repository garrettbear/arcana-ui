export interface Article {
  slug: string;
  title: string;
  authorSlug: string;
  category: string;
  readTime: number;
  excerpt: string;
  date: string;
  image: {
    bg: string;
    fg: string;
    width: number;
    height: number;
  };
}

export const articles: Article[] = [
  {
    slug: 'the-weight-of-silence',
    title: 'The Weight of Silence: Tadao Ando\u2019s New Chapel in Kagawa',
    authorSlug: 'elena-marchetti',
    category: 'Architecture',
    readTime: 12,
    excerpt: 'The building does not ask for your attention. It assumes it.',
    date: '2026-03-15',
    image: { bg: '#1C1C1C', fg: '#F8F6F1', width: 600, height: 800 },
  },
  {
    slug: 'the-most-honest-apartment-in-berlin',
    title: 'Inside the Most Honest Apartment in Berlin',
    authorSlug: 'jonas-brandt',
    category: 'Interiors',
    readTime: 8,
    excerpt:
      'When Katrin M\u00FCller moved in, she removed the ceilings. What remained was the truth of the building.',
    date: '2026-03-10',
    image: { bg: '#E8E4DC', fg: '#1C1C1C', width: 800, height: 500 },
  },
  {
    slug: 'concrete-revisited',
    title:
      'Concrete, Revisited: How a Generation of Architects Learned to Love What They\u2019d Been Taught to Hate',
    authorSlug: 'sophie-laurent',
    category: 'Material',
    readTime: 15,
    excerpt: 'The rehabilitation of concrete is not aesthetic. It is moral.',
    date: '2026-02-28',
    image: { bg: '#9C9488', fg: '#F8F6F1', width: 600, height: 600 },
  },
  {
    slug: 'the-invisible-house',
    title: 'The Invisible House: A Conversation with Bijoy Jain',
    authorSlug: 'elena-marchetti',
    category: 'Interview',
    readTime: 10,
    excerpt: 'Studio Mumbai builds nothing that the site does not already know.',
    date: '2026-02-20',
    image: { bg: '#C8C4BC', fg: '#1C1C1C', width: 800, height: 450 },
  },
  {
    slug: 'renzo-pianos-last-work',
    title: 'Renzo Piano\u2019s Last Work',
    authorSlug: 'marcus-webb',
    category: 'Architecture',
    readTime: 18,
    excerpt: 'He has always been interested in lightness. His late buildings have achieved it.',
    date: '2026-02-10',
    image: { bg: '#4C4840', fg: '#F8F6F1', width: 500, height: 700 },
  },
  {
    slug: 'the-archive-ten-spaces',
    title: 'The Archive: Ten Spaces That Changed How We Live',
    authorSlug: 'elena-marchetti',
    category: 'Archive',
    readTime: 22,
    excerpt: 'From Maison de Verre to the Kimbell, the rooms we return to.',
    date: '2026-01-15',
    image: { bg: '#D8D0C4', fg: '#1C1C1C', width: 900, height: 500 },
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: string): Article[] {
  return articles.filter((a) => a.category === category);
}

export const categories = ['Architecture', 'Interiors', 'Material', 'Interview', 'Archive'];
