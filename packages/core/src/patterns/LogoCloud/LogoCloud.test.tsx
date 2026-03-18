import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import type { LogoItem } from './LogoCloud';
import { LogoCloud } from './LogoCloud';

const sampleLogos: LogoItem[] = [
  { src: '/logo-a.svg', alt: 'Company A' },
  { src: '/logo-b.svg', alt: 'Company B' },
  { src: '/logo-c.svg', alt: 'Company C' },
];

describe('LogoCloud', () => {
  it('renders as section element', () => {
    const { container } = render(<LogoCloud logos={sampleLogos} />);
    expect(container.querySelector('section')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<LogoCloud ref={ref} logos={sampleLogos} />);
    expect(ref).toHaveBeenCalled();
  });

  it('accepts className', () => {
    const { container } = render(<LogoCloud logos={sampleLogos} className="custom" />);
    expect(container.querySelector('section')?.classList.contains('custom')).toBe(true);
  });

  it('renders title', () => {
    render(<LogoCloud logos={sampleLogos} title="Trusted by" />);
    expect(screen.getByText('Trusted by')).toBeTruthy();
  });

  it('renders grid variant by default', () => {
    const { container } = render(<LogoCloud logos={sampleLogos} />);
    expect(container.querySelector('[class*="grid"]')).toBeTruthy();
  });

  it('renders all logos as images in grid', () => {
    const { container } = render(<LogoCloud logos={sampleLogos} />);
    const images = container.querySelectorAll('img');
    expect(images).toHaveLength(3);
    expect(images[0].getAttribute('alt')).toBe('Company A');
    expect(images[1].getAttribute('alt')).toBe('Company B');
    expect(images[2].getAttribute('alt')).toBe('Company C');
  });

  it('renders logo with link when href provided', () => {
    const logosWithLinks: LogoItem[] = [
      { src: '/logo.svg', alt: 'Acme', href: 'https://acme.com' },
    ];
    render(<LogoCloud logos={logosWithLinks} />);
    const link = screen.getByRole('link');
    expect(link.getAttribute('href')).toBe('https://acme.com');
    expect(link.getAttribute('target')).toBe('_blank');
    expect(link.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('renders marquee variant', () => {
    const { container } = render(<LogoCloud logos={sampleLogos} variant="marquee" />);
    expect(container.querySelector('[class*="marqueeWrapper"]')).toBeTruthy();
  });

  it('marquee has duplicated logos for seamless loop', () => {
    const { container } = render(<LogoCloud logos={sampleLogos} variant="marquee" />);
    // 3 logos duplicated = 6 images in marquee track
    const track = container.querySelector('[class*="marqueeTrack"]');
    expect(track?.querySelectorAll('img')).toHaveLength(6);
  });

  it('marquee has accessible sr-only list', () => {
    const { container } = render(<LogoCloud logos={sampleLogos} variant="marquee" />);
    const srList = container.querySelector('[class*="srOnly"]');
    expect(srList).toBeTruthy();
    expect(srList?.querySelectorAll('li')).toHaveLength(3);
  });

  it('logos have loading="lazy"', () => {
    const { container } = render(<LogoCloud logos={sampleLogos} />);
    const images = container.querySelectorAll('img');
    for (const img of images) {
      expect(img.getAttribute('loading')).toBe('lazy');
    }
  });

  it('renders empty state gracefully', () => {
    const { container } = render(<LogoCloud logos={[]} />);
    expect(container.querySelector('section')).toBeTruthy();
    expect(container.querySelectorAll('img')).toHaveLength(0);
  });
});
