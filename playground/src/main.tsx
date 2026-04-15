import { Analytics } from '@vercel/analytics/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import App from './App';
import ComponentDetail from './pages/ComponentDetail';
import ComponentGallery from './pages/ComponentGallery';
import Generate from './pages/Generate';
import Landing from './pages/Landing';
import PlaygroundLayout from './pages/PlaygroundLayout';
import RelationshipGraph from './pages/RelationshipGraph';
import TokenExplorer from './pages/TokenExplorer';
import TokenImpact from './pages/TokenImpact';

// Import Arcana tokens (CSS custom properties + reset)
import '../../packages/tokens/dist/arcana.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        {/* AI theme generation: preview + pick step before landing in the editor */}
        <Route path="/generate" element={<Generate />} />
        {/* Main editor — existing App with three-panel layout */}
        <Route path="/playground" element={<App />} />
        {/* New playground pages with shared layout */}
        <Route element={<PlaygroundLayout />}>
          <Route path="/playground/components" element={<ComponentGallery />} />
          <Route path="/playground/components/:name" element={<ComponentDetail />} />
          <Route path="/playground/tokens" element={<TokenExplorer />} />
          <Route path="/playground/tokens/:category/:name" element={<TokenImpact />} />
          <Route path="/playground/graph" element={<RelationshipGraph />} />
        </Route>
      </Routes>
      {/*
        Vercel Web Analytics — mounted inside BrowserRouter so pageview
        tracking picks up react-router-dom path changes automatically.
        No-ops in dev (the script only loads when VERCEL_ENV is set on
        the Vercel deployment). Zero-config: enable Web Analytics in the
        project's Vercel dashboard and events start flowing.
      */}
      <Analytics />
    </BrowserRouter>
  </React.StrictMode>,
);
