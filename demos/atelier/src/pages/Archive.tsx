import {
  Badge,
  Divider,
  Footer,
  FooterBottom,
  FooterLink,
  FooterSection,
  Input,
  Pagination,
  Select,
  StatCard,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Timeline,
} from '@arcana-ui/core';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AtelierNavbar } from '../components/AtelierNavbar';
import { articles, categories } from '../data/articles';
import { getAuthor } from '../data/authors';

const ITEMS_PER_PAGE = 4;

const years = ['All', '2026', '2025', '2024', '2023', '2022', '2021', '2020', '2019'];

const timelineItems = [
  { title: '2019', description: 'First issue. 12 pages. Printed in Bologna.' },
  { title: '2021', description: 'Went digital. Kept the typesetting.' },
  { title: '2023', description: '100 issues.' },
  { title: '2024', description: 'Named publication of the year by ICON.' },
  { title: '2026', description: 'Volume XXIV.' },
];

const categoryOptions = [
  { value: '', label: 'All Categories' },
  ...categories.filter((c) => c !== 'All').map((c) => ({ value: c, label: c })),
];

const yearOptions = years.map((y) => ({ value: y === 'All' ? '' : y, label: y }));

export function Archive(): React.JSX.Element {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') ?? '';

  const [category, setCategory] = useState(initialCategory);
  const [year, setYear] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    let result = articles;
    if (category) {
      result = result.filter((a) => a.category === category);
    }
    if (year) {
      result = result.filter((a) => a.date.startsWith(year));
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          getAuthor(a.authorSlug)?.name.toLowerCase().includes(q),
      );
    }
    return result;
  }, [category, year, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      <AtelierNavbar />

      <div className="atelier-container atelier-section">
        {/* Header */}
        <h1
          className="atelier-display atelier-display--lg"
          style={{ marginBottom: 'var(--spacing-xs, 0.25rem)' }}
        >
          The Archive
        </h1>
        <p style={{ color: 'var(--color-fg-secondary)', marginBottom: 'var(--spacing-xl, 2rem)' }}>
          Every piece, from the beginning.
        </p>

        {/* Stats */}
        <div className="atelier-grid-3" style={{ marginBottom: 'var(--spacing-2xl, 3rem)' }}>
          <StatCard value={423} label="Articles" variant="compact" />
          <StatCard value={18} label="Writers" variant="compact" />
          <StatCard value={26} label="Countries" variant="compact" />
        </div>

        {/* Timeline */}
        <div style={{ marginBottom: 'var(--spacing-2xl, 3rem)' }}>
          <h2
            className="atelier-display atelier-display--sm"
            style={{ marginBottom: 'var(--spacing-md, 1rem)' }}
          >
            Milestones
          </h2>
          <Timeline items={timelineItems} variant="compact" />
        </div>

        <Divider spacing="lg" />

        {/* Filters */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'var(--spacing-md, 1rem)',
            marginBottom: 'var(--spacing-xl, 2rem)',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: 'var(--spacing-md, 1rem)',
            }}
          >
            <Select
              options={categoryOptions}
              value={category}
              onChange={(v) => {
                setCategory(v as string);
                setPage(1);
              }}
            />
            <Select
              options={yearOptions}
              value={year}
              onChange={(v) => {
                setYear(v as string);
                setPage(1);
              }}
            />
            <Input
              placeholder="Search articles\u2026"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
        </div>

        {/* Article list */}
        <div>
          {paged.map((article) => {
            const author = getAuthor(article.authorSlug);
            return (
              <div key={article.slug} className="atelier-article-list-item">
                <Badge
                  variant="secondary"
                  size="sm"
                  style={{ marginBottom: 'var(--spacing-xs, 0.25rem)' }}
                >
                  {article.category}
                </Badge>
                <h3
                  className="atelier-display--sm"
                  style={{ margin: 'var(--spacing-xs, 0.25rem) 0' }}
                >
                  <Link
                    to={`/article/${article.slug}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
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
                  {author?.name} &middot; {article.date} &middot; {article.readTime} min
                </p>
                <Divider spacing="sm" />
              </div>
            );
          })}

          {filtered.length === 0 && (
            <p
              style={{
                color: 'var(--color-fg-secondary)',
                textAlign: 'center',
                padding: 'var(--spacing-2xl, 3rem) 0',
              }}
            >
              No articles match your filters.
            </p>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              padding: 'var(--spacing-xl, 2rem) 0',
            }}
          >
            <Pagination page={currentPage} totalPages={totalPages} onPageChange={setPage} />
          </div>
        )}

        <Divider spacing="lg" />

        {/* By the numbers table */}
        <div style={{ marginTop: 'var(--spacing-xl, 2rem)' }}>
          <h2
            className="atelier-display atelier-display--sm"
            style={{ marginBottom: 'var(--spacing-md, 1rem)' }}
          >
            By the Numbers
          </h2>
          <Table size="sm">
            <TableHeader>
              <TableRow>
                <TableHead>Metric</TableHead>
                <TableHead>Count</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Articles published</TableCell>
                <TableCell>423</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Writers</TableCell>
                <TableCell>18</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Countries covered</TableCell>
                <TableCell>26</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

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
    </>
  );
}
