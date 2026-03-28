import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import ComponentDetail from './pages/ComponentDetail';
import ComponentGallery from './pages/ComponentGallery';
import Landing from './pages/Landing';
import PlaygroundLayout from './pages/PlaygroundLayout';
import TokenExplorer from './pages/TokenExplorer';
import TokenImpact from './pages/TokenImpact';

// Import Arcana tokens (CSS custom properties + reset)
import '../../packages/tokens/dist/arcana.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* Main editor — existing App with three-panel layout */}
        <Route path="/playground" element={<App />} />
        {/* New playground pages with shared layout */}
        <Route element={<PlaygroundLayout />}>
          <Route path="/playground/components" element={<ComponentGallery />} />
          <Route path="/playground/components/:name" element={<ComponentDetail />} />
          <Route path="/playground/tokens" element={<TokenExplorer />} />
          <Route path="/playground/tokens/:category/:name" element={<TokenImpact />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
