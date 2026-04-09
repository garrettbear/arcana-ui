import { ToastProvider } from '@arcana-ui/core';
import { ThemeSwitcher } from '@arcana-ui/demo-shared/theme-switcher';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { DemoFooter } from './components/DemoFooter';
import { DemoNavbar } from './components/DemoNavbar';
import { CartProvider } from './context/CartContext';
import { Cart } from './pages/Cart';
import { Home } from './pages/Home';
import { ProductDetail } from './pages/ProductDetail';
import { Shop } from './pages/Shop';

export function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CartProvider>
          <DemoNavbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:slug" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
          </Routes>
          <DemoFooter />
          <ThemeSwitcher defaultTheme="commerce" />
        </CartProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}
