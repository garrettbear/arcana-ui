import { ToastProvider } from '@arcana-ui/core';
import { ThemeSwitcher } from '@arcana-ui/demo-shared/theme-switcher';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MosaicNavbar } from './components/MosaicNavbar';
import { CollectionDetail } from './pages/CollectionDetail';
import { Collections } from './pages/Collections';
import { Discover } from './pages/Discover';

export function App(): React.JSX.Element {
  return (
    <BrowserRouter>
      <ToastProvider>
        <div className="mosaic-page">
          <MosaicNavbar />
          <Routes>
            <Route path="/" element={<Discover />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/collections/:id" element={<CollectionDetail />} />
          </Routes>
        </div>
        <ThemeSwitcher defaultTheme="light" />
      </ToastProvider>
    </BrowserRouter>
  );
}
