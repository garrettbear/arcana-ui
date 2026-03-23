import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@arcana-ui/tokens';
import '@arcana-ui/core/styles';
import { App } from './App';

// biome-ignore lint/style/noNonNullAssertion: root element always exists in index.html
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
