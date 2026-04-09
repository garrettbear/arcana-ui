// ─── Product Data ────────────────────────────────────────────────────────────

export interface Product {
  id: number;
  title: string;
  slug: string;
  price: number;
  salePrice?: number;
  category: 'Apparel' | 'Accessories' | 'Home';
  badge?: 'SALE' | 'NEW';
  rating: number;
  reviewCount: number;
  image: string;
  description: string;
}

export const CATEGORIES = ['All', 'Apparel', 'Accessories', 'Home'] as const;

export type Category = (typeof CATEGORIES)[number];

export const products: Product[] = [
  {
    id: 1,
    title: 'Arcana Hoodie, Black',
    slug: 'arcana-hoodie-black',
    price: 65,
    salePrice: 49,
    category: 'Apparel',
    badge: 'SALE',
    rating: 4.9,
    reviewCount: 142,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=800&q=85',
    description:
      'Midweight fleece, 80/20 cotton-poly. The Arcana wordmark is embroidered on the chest in tonal thread — subtle enough for meetings, honest enough for a hackathon.',
  },
  {
    id: 2,
    title: 'Arcana Hoodie, Stone',
    slug: 'arcana-hoodie-stone',
    price: 65,
    category: 'Apparel',
    badge: 'NEW',
    rating: 4.8,
    reviewCount: 38,
    image: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=85',
    description:
      'Same midweight fleece as Black, in a warm stone colorway that pairs with every theme preset. Unisex fit. Pre-washed so it stays the right size.',
  },
  {
    id: 3,
    title: 'Arc Cap, Navy',
    slug: 'arc-cap-navy',
    price: 38,
    category: 'Apparel',
    rating: 4.7,
    reviewCount: 67,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=85',
    description:
      'Six-panel structured cap with a curved brim. The arc logo is embroidered in cream on navy. One size with an adjustable strap.',
  },
  {
    id: 4,
    title: 'Token Tote',
    slug: 'token-tote',
    price: 32,
    category: 'Accessories',
    rating: 4.8,
    reviewCount: 89,
    image: 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=800&q=85',
    description:
      "Heavy natural canvas. The front panel prints a fragment of the Arcana token tree. Holds a 16″ laptop flat. Double-stitched handles that won't give out.",
  },
  {
    id: 5,
    title: 'Dev Mode Desk Mat',
    slug: 'dev-mode-desk-mat',
    price: 45,
    category: 'Accessories',
    badge: 'NEW',
    rating: 4.9,
    reviewCount: 54,
    image: 'https://images.unsplash.com/photo-1593640408182-31c228b30f3b?w=800&q=85',
    description:
      '900 × 400 mm. The surface is printed with a light token-grid pattern at 10% opacity — visible up close, invisible in calls. Non-slip rubber base.',
  },
  {
    id: 6,
    title: 'Arcana Zip Pouch',
    slug: 'arcana-zip-pouch',
    price: 35,
    category: 'Accessories',
    rating: 4.6,
    reviewCount: 43,
    image: 'https://images.unsplash.com/photo-1598532163257-ae3c6b2524b6?w=800&q=85',
    description:
      'Canvas exterior with a waterproof lining. Sized for cables, adapters, and a passport. The inside has one mesh pocket and one flat slot.',
  },
  {
    id: 7,
    title: 'Component Sticker Sheet',
    slug: 'component-sticker-sheet',
    price: 12,
    category: 'Accessories',
    rating: 4.7,
    reviewCount: 211,
    image: 'https://images.unsplash.com/photo-1573152143286-0c422b4d2175?w=800&q=85',
    description:
      '18 vinyl die-cut stickers. Component names, token syntax, the Arcana arc, and a few inside jokes for anyone who has read the source code. UV-resistant, laptop-safe.',
  },
  {
    id: 8,
    title: 'The Arcana Mug',
    slug: 'the-arcana-mug',
    price: 28,
    category: 'Home',
    rating: 4.8,
    reviewCount: 176,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=85',
    description:
      '350 ml ceramic mug in matte black with the token tree printed in white. Dishwasher safe. Works equally well for coffee and for staring at a failing CI build.',
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getRelatedProducts(currentId: number, count = 4): Product[] {
  const current = products.find((p) => p.id === currentId);
  if (!current) return products.slice(0, count);
  const sameCategory = products.filter(
    (p) => p.id !== currentId && p.category === current.category,
  );
  const others = products.filter((p) => p.id !== currentId && p.category !== current.category);
  return [...sameCategory, ...others].slice(0, count);
}
