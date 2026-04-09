export interface Article {
  slug: string;
  title: string;
  subtitle: string;
  authorSlug: string;
  category: string;
  readTime: number;
  excerpt: string;
  date: string;
  imageUrl: string;
  imageAlt: string;
  /** aspect ratio w/h for layout hints */
  aspectRatio: '16/9' | '3/4' | '1/1' | '4/3';
}

export const articles: Article[] = [
  {
    slug: 'the-quiet-power-of-concrete',
    title: 'The Quiet Power of Concrete: A Brutalist Revival in Lisbon',
    subtitle: "How a new generation of architects is reclaiming brutalism's emotional depth",
    authorSlug: 'elena-marchetti',
    category: 'Architecture',
    readTime: 12,
    excerpt:
      "In the winding streets of Lisbon's Mouraria district, a former textile factory has been reborn as something quietly radical. Architect Paulo Mendes has stripped the building to its structural bones, exposing the raw concrete that previous renovators had spent decades hiding. The result is an ode to honesty — a building that wears its age and its materials with pride.",
    date: '2026-01-15',
    imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1400&q=85',
    imageAlt: 'Raw concrete architectural facade with deep shadows',
    aspectRatio: '16/9',
  },
  {
    slug: 'living-light-norwegian-fjords',
    title: 'Living Light: Floor-to-Ceiling Glass in the Norwegian Fjords',
    subtitle: 'A family retreat dissolves the boundary between inside and out',
    authorSlug: 'james-holbrook',
    category: 'Interiors',
    readTime: 8,
    excerpt:
      'The brief was simple: wake up to the fjord. The execution, however, required a structural engineering feat that took two years to resolve. The result is a 240-square-meter retreat where every room opens to a panorama of water and stone, light and absence.',
    date: '2026-02-03',
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85',
    imageAlt: 'Norwegian fjord landscape with dramatic mountains and still water',
    aspectRatio: '3/4',
  },
  {
    slug: 'wabi-sabi-interiors',
    title: 'Wabi-Sabi Interiors: Finding Beauty in Imperfection',
    subtitle: 'The Japanese philosophy of impermanence is transforming Western interior design',
    authorSlug: 'yuki-tanaka',
    category: 'Design',
    readTime: 10,
    excerpt:
      'Cracked plaster walls. Mismatched ceramics. A wooden table worn smooth by decades of use. These are not accidents to be corrected — they are the point. Wabi-sabi, the Japanese aesthetic philosophy that finds beauty in imperfection and transience, is quietly reshaping how designers think about the lived-in home.',
    date: '2026-02-18',
    imageUrl: 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=1400&q=85',
    imageAlt: 'Minimalist Japanese-inspired interior with natural materials',
    aspectRatio: '1/1',
  },
  {
    slug: 'new-desert-modernism',
    title: 'The New Desert Modernism: Palm Springs Reimagined',
    subtitle:
      "A new cohort of architects is redefining the California desert's iconic residential style",
    authorSlug: 'sarah-chen',
    category: 'Architecture',
    readTime: 9,
    excerpt:
      "The mid-century modern homes of Palm Springs have always been about the dialogue between indoor and outdoor living. Now, a generation of architects is pushing that dialogue further — using passive cooling strategies, rammed earth walls, and native landscaping to create homes that don't just reference the desert but emerge from it.",
    date: '2026-03-02',
    imageUrl: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1400&q=85',
    imageAlt: 'Desert modernist home with clean lines and open sky',
    aspectRatio: '4/3',
  },
  {
    slug: 'material-conversations',
    title: 'Material Conversations: When Wood Meets Steel',
    subtitle:
      'The tension between organic warmth and industrial strength drives a new design vocabulary',
    authorSlug: 'olivier-beaumont',
    category: 'Design',
    readTime: 7,
    excerpt:
      'There is something inherently tense about pairing wood and steel. One is warm, organic, shaped by centuries of growth. The other is cold, precise, wrought in furnaces. When skilled hands bring them together, that tension becomes a kind of poetry.',
    date: '2026-03-14',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85',
    imageAlt: 'Architectural detail of wood and steel joinery',
    aspectRatio: '3/4',
  },
  {
    slug: 'tokyo-micro-living',
    title: 'Tokyo Micro-Living: 28 Square Meters of Genius',
    subtitle: 'Inside the ultra-compact apartments redefining urban domesticity',
    authorSlug: 'kenji-watanabe',
    category: 'Interiors',
    readTime: 11,
    excerpt:
      "In a city where space has always been a luxury, Tokyo's architects have spent decades perfecting the art of compression. The result is a body of residential work that is, paradoxically, one of the most liberating in the world — because when you have nothing to hide, you design with total honesty.",
    date: '2026-04-01',
    imageUrl: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1400&q=85',
    imageAlt: 'Compact Tokyo apartment interior with clever storage solutions',
    aspectRatio: '1/1',
  },
];

export function getArticle(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getArticlesByCategory(category: string): Article[] {
  if (category === 'All') return articles;
  return articles.filter((a) => a.category === category);
}

export const categories = ['All', 'Architecture', 'Interiors', 'Design'];
