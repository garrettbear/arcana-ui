/**
 * Vite + React + TypeScript template. All files are returned as strings
 * so the init command can write them in one pass without filesystem
 * copies. Keep this lean — the shell is framework plumbing only; the
 * layouts are in `./layouts.ts`.
 */
import { ARCANA_CORE_VERSION, ARCANA_TOKENS_VERSION } from '../utils/presets.js';

export interface ViteTemplateOptions {
  projectName: string;
  theme: string;
  density: string;
  appBody: string;
  appImports: string;
}

export function vitePackageJson(opts: ViteTemplateOptions): string {
  return `${JSON.stringify(
    {
      name: opts.projectName,
      private: true,
      version: '0.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc -b && vite build',
        preview: 'vite preview',
      },
      dependencies: {
        '@arcana-ui/core': ARCANA_CORE_VERSION,
        '@arcana-ui/tokens': ARCANA_TOKENS_VERSION,
        react: '^18.3.1',
        'react-dom': '^18.3.1',
      },
      devDependencies: {
        '@types/react': '^18.3.12',
        '@types/react-dom': '^18.3.1',
        '@vitejs/plugin-react': '^4.3.3',
        typescript: '^5.6.3',
        vite: '^6.0.0',
      },
    },
    null,
    2,
  )}\n`;
}

export function viteConfig(): string {
  return `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Minimal Vite config — Arcana UI ships pre-built ESM and needs no
// plugin configuration. Add your own plugins here as needed.
export default defineConfig({
  plugins: [react()],
});
`;
}

export function viteTsconfig(): string {
  return `${JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        moduleResolution: 'bundler',
        jsx: 'react-jsx',
        strict: true,
        esModuleInterop: true,
        skipLibCheck: true,
        resolveJsonModule: true,
        isolatedModules: true,
        forceConsistentCasingInFileNames: true,
        noUnusedLocals: false,
        noUnusedParameters: false,
        noEmit: true,
      },
      include: ['src'],
    },
    null,
    2,
  )}\n`;
}

export function viteIndexHtml(opts: ViteTemplateOptions): string {
  return `<!doctype html>
<html lang="en" data-theme="${opts.theme}" data-density="${opts.density}">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${opts.projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

export function viteMain(): string {
  return `import React from 'react';
import ReactDOM from 'react-dom/client';

// Arcana design tokens — all 14 theme presets. Scoped under
// [data-theme="..."] selectors so switching themes is a single
// attribute change on <html>.
import '@arcana-ui/tokens/dist/arcana.css';

// Arcana component stylesheet — components reference only variables
// from @arcana-ui/tokens, so theme switching needs no re-import.
import '@arcana-ui/core/styles';

import { App } from './App';

const rootEl = document.getElementById('root');
if (!rootEl) throw new Error('Root element #root not found');

ReactDOM.createRoot(rootEl).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
`;
}

export function viteApp(opts: ViteTemplateOptions): string {
  return `${opts.appImports}

export function App() {
${opts.appBody}
}
`;
}

export function viteGitignore(): string {
  return `node_modules
dist
dist-ssr
*.local
.vite
.env
.env.*
!.env.example
.DS_Store
*.log
.vscode/*
!.vscode/extensions.json
.idea
`;
}
