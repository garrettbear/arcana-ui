import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Footer, FooterBottom, FooterLink, FooterSection } from './Footer';

describe('Footer', () => {
  it('renders as footer element', () => {
    const { container } = render(<Footer>Content</Footer>);
    expect(container.querySelector('footer')).toBeTruthy();
  });

  it('forwards ref', () => {
    const ref = vi.fn();
    render(<Footer ref={ref}>Content</Footer>);
    expect(ref).toHaveBeenCalled();
  });

  it('accepts className', () => {
    const { container } = render(<Footer className="custom">Content</Footer>);
    expect(container.querySelector('footer')?.classList.contains('custom')).toBe(true);
  });

  it('renders FooterSection with title', () => {
    render(
      <Footer>
        <FooterSection title="Company">
          <FooterLink href="/about">About</FooterLink>
        </FooterSection>
      </Footer>,
    );
    expect(screen.getByText('Company')).toBeTruthy();
    expect(screen.getByRole('link', { name: 'About' })).toBeTruthy();
  });

  it('renders multiple sections', () => {
    render(
      <Footer>
        <FooterSection title="Product">
          <FooterLink href="/features">Features</FooterLink>
        </FooterSection>
        <FooterSection title="Support">
          <FooterLink href="/docs">Documentation</FooterLink>
        </FooterSection>
      </Footer>,
    );
    expect(screen.getByText('Product')).toBeTruthy();
    expect(screen.getByText('Support')).toBeTruthy();
  });

  it('renders FooterBottom', () => {
    render(
      <Footer>
        <FooterBottom data-testid="bottom">
          <span>© 2026 Acme Inc</span>
        </FooterBottom>
      </Footer>,
    );
    expect(screen.getByTestId('bottom')).toBeTruthy();
    expect(screen.getByText('© 2026 Acme Inc')).toBeTruthy();
  });

  it('FooterLink renders as anchor with href', () => {
    render(
      <Footer>
        <FooterLink href="/privacy">Privacy</FooterLink>
      </Footer>,
    );
    const link = screen.getByRole('link', { name: 'Privacy' });
    expect(link.getAttribute('href')).toBe('/privacy');
  });

  it('FooterSection forwards ref', () => {
    const ref = vi.fn();
    render(
      <Footer>
        <FooterSection ref={ref}>Content</FooterSection>
      </Footer>,
    );
    expect(ref).toHaveBeenCalled();
  });

  it('FooterLink forwards ref', () => {
    const ref = vi.fn();
    render(
      <Footer>
        <FooterLink ref={ref} href="/test">
          Test
        </FooterLink>
      </Footer>,
    );
    expect(ref).toHaveBeenCalled();
  });
});
