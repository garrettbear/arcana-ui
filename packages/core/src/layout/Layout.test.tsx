import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';
import { Container, Grid, GridColumn, HStack, Stack } from './Layout';

// ─── Stack ──────────────────────────────────────────────────────────────────

describe('Stack', () => {
  it('renders children', () => {
    render(
      <Stack>
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>,
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
    expect(screen.getByText('Item 2')).toBeInTheDocument();
  });

  it('renders as column direction by default', () => {
    const { container } = render(
      <Stack>
        <div>Item</div>
      </Stack>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('stack');
    expect(el.className).not.toContain('stackRow');
  });

  it('renders as row when direction is horizontal', () => {
    const { container } = render(
      <Stack direction="horizontal">
        <div>Item</div>
      </Stack>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('stackRow');
  });

  it('applies semantic gap tokens', () => {
    const { container } = render(
      <Stack gap="lg">
        <div>Item</div>
      </Stack>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.gap).toBe('var(--spacing-lg)');
  });

  it('applies numeric gap as spacing token', () => {
    const { container } = render(
      <Stack gap={4}>
        <div>Item</div>
      </Stack>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.gap).toBe('var(--spacing-4)');
  });

  it('applies raw string gap', () => {
    const { container } = render(
      <Stack gap="16px">
        <div>Item</div>
      </Stack>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.gap).toBe('16px');
  });

  it('applies align and justify', () => {
    const { container } = render(
      <Stack align="center" justify="between">
        <div>Item</div>
      </Stack>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.alignItems).toBe('center');
    expect(el.style.justifyContent).toBe('space-between');
  });

  it('supports wrap prop', () => {
    const { container } = render(
      <Stack wrap>
        <div>Item</div>
      </Stack>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.flexWrap).toBe('wrap');
  });

  it('renders as custom element via as prop', () => {
    render(
      <Stack as="section" data-testid="custom">
        <div>Item</div>
      </Stack>,
    );
    const el = screen.getByTestId('custom');
    expect(el.tagName).toBe('SECTION');
  });

  it('forwards className', () => {
    const { container } = render(
      <Stack className="my-stack">
        <div>Item</div>
      </Stack>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('my-stack');
  });

  it('forwards HTML attributes', () => {
    render(
      <Stack data-testid="my-stack">
        <div>Item</div>
      </Stack>,
    );
    expect(screen.getByTestId('my-stack')).toBeInTheDocument();
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(
      <Stack>
        <div>Item 1</div>
        <div>Item 2</div>
      </Stack>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── HStack ─────────────────────────────────────────────────────────────────

describe('HStack', () => {
  it('renders children', () => {
    render(
      <HStack>
        <div>A</div>
        <div>B</div>
      </HStack>,
    );
    expect(screen.getByText('A')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('has default align center', () => {
    const { container } = render(
      <HStack>
        <div>Item</div>
      </HStack>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.alignItems).toBe('center');
  });

  it('applies semantic gap', () => {
    const { container } = render(
      <HStack gap="sm">
        <div>Item</div>
      </HStack>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.gap).toBe('var(--spacing-sm)');
  });

  it('applies numeric gap', () => {
    const { container } = render(
      <HStack gap={2}>
        <div>Item</div>
      </HStack>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.gap).toBe('var(--spacing-2)');
  });

  it('renders as custom element via as prop', () => {
    render(
      <HStack as="nav" data-testid="nav">
        <div>Item</div>
      </HStack>,
    );
    expect(screen.getByTestId('nav').tagName).toBe('NAV');
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(
      <HStack>
        <div>Item 1</div>
        <div>Item 2</div>
      </HStack>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── Container ──────────────────────────────────────────────────────────────

describe('Container', () => {
  it('renders children', () => {
    render(<Container>Content</Container>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies size class for each size option', () => {
    const sizes = ['sm', 'md', 'lg', 'xl', '2xl', 'full'] as const;
    for (const size of sizes) {
      const { container, unmount } = render(<Container size={size}>Content</Container>);
      const el = container.firstChild as HTMLElement;
      expect(el.className).toContain('container');
      expect(screen.getByText('Content')).toBeInTheDocument();
      unmount();
    }
  });

  it('defaults to xl size', () => {
    const { container } = render(<Container>Content</Container>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('containerXl');
  });

  it('applies prose mode overriding size', () => {
    const { container } = render(
      <Container prose size="xl">
        Content
      </Container>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('containerProse');
    expect(el.className).not.toContain('containerXl');
  });

  it('applies padding classes', () => {
    const paddings = ['none', 'sm', 'md', 'lg'] as const;
    for (const padding of paddings) {
      const { container, unmount } = render(<Container padding={padding}>Content</Container>);
      const el = container.firstChild as HTMLElement;
      expect(el.className).toContain('padding');
      unmount();
    }
  });

  it('defaults to md padding', () => {
    const { container } = render(<Container>Content</Container>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('paddingMd');
  });

  it('applies noCenter class when center is false', () => {
    const { container } = render(<Container center={false}>Content</Container>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('noCenter');
  });

  it('renders as custom element via as prop', () => {
    render(
      <Container as="main" data-testid="main">
        Content
      </Container>,
    );
    expect(screen.getByTestId('main').tagName).toBe('MAIN');
  });

  it('renders as section element', () => {
    render(
      <Container as="section" data-testid="section">
        Content
      </Container>,
    );
    expect(screen.getByTestId('section').tagName).toBe('SECTION');
  });

  it('forwards className', () => {
    const { container } = render(<Container className="my-container">Content</Container>);
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('my-container');
    expect(el.className).toContain('container');
  });

  it('forwards HTML attributes', () => {
    render(<Container data-testid="container">Content</Container>);
    expect(screen.getByTestId('container')).toBeInTheDocument();
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(<Container>Content</Container>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── Grid ───────────────────────────────────────────────────────────────────

describe('Grid', () => {
  it('renders children', () => {
    render(
      <Grid>
        <div>Cell 1</div>
        <div>Cell 2</div>
      </Grid>,
    );
    expect(screen.getByText('Cell 1')).toBeInTheDocument();
    expect(screen.getByText('Cell 2')).toBeInTheDocument();
  });

  it('sets numeric columns via CSS custom property', () => {
    const { container } = render(
      <Grid columns={3}>
        <div>Item</div>
      </Grid>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.gridTemplateColumns).toBe('repeat(var(--grid-cols, 3), minmax(0, 1fr))');
  });

  it('defaults to 12 columns', () => {
    const { container } = render(
      <Grid>
        <div>Item</div>
      </Grid>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.gridTemplateColumns).toContain('12');
  });

  it('applies auto-collapse class for numeric columns', () => {
    const { container } = render(
      <Grid columns={3}>
        <div>Item</div>
      </Grid>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('gridAutoCollapse');
  });

  it('accepts responsive columns object', () => {
    const { container } = render(
      <Grid columns={{ sm: 1, md: 2, lg: 3 }}>
        <div>Item</div>
      </Grid>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('gridResponsive');
    expect(el.style.getPropertyValue('--grid-cols-sm')).toBe('1');
    expect(el.style.getPropertyValue('--grid-cols-md')).toBe('2');
    expect(el.style.getPropertyValue('--grid-cols-lg')).toBe('3');
  });

  it('applies semantic gap', () => {
    const { container } = render(
      <Grid gap="lg">
        <div>Item</div>
      </Grid>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.gap).toBe('var(--spacing-lg)');
  });

  it('applies numeric gap as spacing token', () => {
    const { container } = render(
      <Grid gap={4}>
        <div>Item</div>
      </Grid>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.gap).toBe('var(--spacing-4)');
  });

  it('applies separate rowGap and colGap', () => {
    const { container } = render(
      <Grid rowGap="sm" colGap="lg">
        <div>Item</div>
      </Grid>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.rowGap).toBe('var(--spacing-sm)');
    expect(el.style.columnGap).toBe('var(--spacing-lg)');
  });

  it('applies align and justify', () => {
    const { container } = render(
      <Grid align="center" justify="between">
        <div>Item</div>
      </Grid>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.style.alignItems).toBe('center');
    expect(el.style.justifyContent).toBe('space-between');
  });

  it('renders as custom element via as prop', () => {
    render(
      <Grid as="ul" data-testid="grid">
        <li>Item</li>
      </Grid>,
    );
    expect(screen.getByTestId('grid').tagName).toBe('UL');
  });

  it('forwards className', () => {
    const { container } = render(
      <Grid className="my-grid">
        <div>Item</div>
      </Grid>,
    );
    const el = container.firstChild as HTMLElement;
    expect(el.className).toContain('my-grid');
    expect(el.className).toContain('grid');
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(
      <Grid columns={2}>
        <div>A</div>
        <div>B</div>
      </Grid>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// ─── GridColumn ─────────────────────────────────────────────────────────────

describe('GridColumn', () => {
  it('renders children', () => {
    render(
      <Grid>
        <GridColumn>Cell</GridColumn>
      </Grid>,
    );
    expect(screen.getByText('Cell')).toBeInTheDocument();
  });

  it('applies numeric span as grid-column', () => {
    const { container } = render(
      <Grid>
        <GridColumn span={6} data-testid="col">
          Cell
        </GridColumn>
      </Grid>,
    );
    const el = screen.getByTestId('col');
    expect(el.style.gridColumn).toBe('span 6');
  });

  it('defaults to span 12', () => {
    const { container } = render(
      <Grid>
        <GridColumn data-testid="col">Cell</GridColumn>
      </Grid>,
    );
    const el = screen.getByTestId('col');
    expect(el.style.gridColumn).toBe('span 12');
  });

  it('applies start position', () => {
    render(
      <Grid>
        <GridColumn span={6} start={3} data-testid="col">
          Cell
        </GridColumn>
      </Grid>,
    );
    const el = screen.getByTestId('col');
    expect(el.style.gridColumnStart).toBe('3');
  });

  it('accepts responsive span object', () => {
    render(
      <Grid>
        <GridColumn span={{ default: 12, sm: 6, lg: 4 }} data-testid="col">
          Cell
        </GridColumn>
      </Grid>,
    );
    const el = screen.getByTestId('col');
    expect(el.className).toContain('columnResponsive');
    expect(el.style.getPropertyValue('--col-span-sm')).toBe('6');
    expect(el.style.getPropertyValue('--col-span-lg')).toBe('4');
  });

  it('renders as custom element via as prop', () => {
    render(
      <Grid as="ul">
        <GridColumn as="li" data-testid="col">
          Item
        </GridColumn>
      </Grid>,
    );
    expect(screen.getByTestId('col').tagName).toBe('LI');
  });

  it('forwards className', () => {
    render(
      <Grid>
        <GridColumn className="my-col" data-testid="col">
          Cell
        </GridColumn>
      </Grid>,
    );
    expect(screen.getByTestId('col').className).toContain('my-col');
    expect(screen.getByTestId('col').className).toContain('column');
  });

  it('has min-width: 0 to prevent overflow', () => {
    render(
      <Grid>
        <GridColumn data-testid="col">Cell</GridColumn>
      </Grid>,
    );
    const el = screen.getByTestId('col');
    expect(el.className).toContain('column');
  });

  it('passes axe accessibility checks', async () => {
    const { container } = render(
      <Grid columns={2}>
        <GridColumn span={1}>A</GridColumn>
        <GridColumn span={1}>B</GridColumn>
      </Grid>,
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
