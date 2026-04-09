import { ToastProvider } from '@arcana-ui/core';
import { ThemeSwitcher } from '@arcana-ui/demo-shared/theme-switcher';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Archive } from './pages/Archive';
import { ArticleDetail } from './pages/ArticleDetail';
import { Home } from './pages/Home';

export function App(): React.JSX.Element {
  return (
    <ToastProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/article/:slug" element={<ArticleDetail />} />
          <Route path="/archive" element={<Archive />} />
        </Routes>
        <ThemeSwitcher defaultTheme="editorial" />
      </BrowserRouter>
    </ToastProvider>
  );
}
