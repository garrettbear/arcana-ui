import React from 'react';
import ReactDOM from 'react-dom/client';

// 1. Arcana design tokens (all 14 themes). Exposes CSS custom properties
//    scoped under [data-theme="..."] selectors on the root element.
import '@arcana-ui/tokens';

// 2. Arcana component stylesheet. Components use only the tokens above,
//    so theme switching happens without re-importing CSS.
import '@arcana-ui/core/styles';

import { App } from './App';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found in index.html');

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
