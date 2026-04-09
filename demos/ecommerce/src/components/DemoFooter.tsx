import { Divider, Footer, FooterBottom, FooterLink, FooterSection } from '@arcana-ui/core';
import { Link } from 'react-router-dom';
import './DemoFooter.css';

export function DemoFooter(): React.JSX.Element {
  return (
    <Footer border>
      <div className="forma-footer-grid">
        <div className="forma-footer-brand">
          <Link to="/" className="forma-footer-logo">
            ARCANA SUPPLY
          </Link>
          <p className="forma-footer-tagline">Gear for people who build with tokens.</p>
        </div>

        <FooterSection title="Shop">
          <FooterLink href="/shop">All Products</FooterLink>
          <FooterLink href="/shop?category=Apparel">Apparel</FooterLink>
          <FooterLink href="/shop?category=Accessories">Accessories</FooterLink>
          <FooterLink href="/shop?category=Home">Home</FooterLink>
        </FooterSection>

        <FooterSection title="New & Sale">
          <FooterLink href="/shop">New Arrivals</FooterLink>
          <FooterLink href="/shop">Best Sellers</FooterLink>
          <FooterLink href="/shop">Sale</FooterLink>
          <FooterLink href="/shop">Bundles</FooterLink>
        </FooterSection>

        <FooterSection title="Company">
          <FooterLink href="/#about">About</FooterLink>
          <FooterLink href="https://arcana-ui.com">Arcana UI</FooterLink>
          <FooterLink href="/#about">Contact</FooterLink>
          <FooterLink href="https://github.com/Arcana-UI/arcana">GitHub</FooterLink>
        </FooterSection>
      </div>

      <Divider spacing="lg" />

      <FooterBottom>
        <span className="forma-footer-copy">&copy; 2026 Arcana Supply. All rights reserved.</span>
      </FooterBottom>
    </Footer>
  );
}
