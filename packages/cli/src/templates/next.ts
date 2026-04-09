/**
 * Next.js App Router template. Mirrors the Vite template so both
 * frameworks hand consumers the same starter layout with identical
 * Arcana imports — only the plumbing around the layout differs.
 */
import { ARCANA_CORE_VERSION, ARCANA_TOKENS_VERSION } from '../utils/presets.js';

export interface NextTemplateOptions {
  projectName: string;
  theme: string;
  density: string;
  appBody: string;
  appImports: string;
}

export function nextPackageJson(opts: NextTemplateOptions): string {
  return `${JSON.stringify(
    {
      name: opts.projectName,
      private: true,
      version: '0.0.0',
      scripts: {
        dev: 'next dev',
        build: 'next build',
        start: 'next start',
        lint: 'next lint',
      },
      dependencies: {
        '@arcana-ui/core': ARCANA_CORE_VERSION,
        '@arcana-ui/tokens': ARCANA_TOKENS_VERSION,
        next: '^15.0.0',
        react: '^18.3.1',
        'react-dom': '^18.3.1',
      },
      devDependencies: {
        '@types/node': '^22.10.0',
        '@types/react': '^18.3.12',
        '@types/react-dom': '^18.3.1',
        typescript: '^5.6.3',
      },
    },
    null,
    2,
  )}\n`;
}

export function nextConfig(): string {
  return `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // @arcana-ui/core is pre-bundled ESM with "use client" directives, so
  // it works out of the box with the Next.js App Router — no
  // transpilePackages needed.
};

export default nextConfig;
`;
}

export function nextTsconfig(): string {
  return `${JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        lib: ['dom', 'dom.iterable', 'esnext'],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        noEmit: true,
        esModuleInterop: true,
        module: 'esnext',
        moduleResolution: 'bundler',
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: 'preserve',
        incremental: true,
        plugins: [{ name: 'next' }],
        paths: { '@/*': ['./*'] },
      },
      include: ['next-env.d.ts', '**/*.ts', '**/*.tsx', '.next/types/**/*.ts'],
      exclude: ['node_modules'],
    },
    null,
    2,
  )}\n`;
}

export function nextEnvDts(): string {
  return `/// <reference types="next" />
/// <reference types="next/image-types/global" />

// NOTE: This file should not be edited
// see https://nextjs.org/docs/basic-features/typescript for more information.
`;
}

export function nextLayout(opts: NextTemplateOptions): string {
  return `import type { ReactNode } from 'react';

// Arcana design tokens — imported once at the app root so every route
// sees the same theme variables.
import '@arcana-ui/tokens/dist/arcana.css';
import '@arcana-ui/core/styles';

export const metadata = {
  title: '${opts.projectName}',
  description: 'Built with Arcana UI',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="${opts.theme}" data-density="${opts.density}">
      <body>{children}</body>
    </html>
  );
}
`;
}

export function nextPage(opts: NextTemplateOptions): string {
  return `${opts.appImports}

export default function Page() {
${opts.appBody}
}
`;
}

export function nextGitignore(): string {
  return `node_modules
.next
out
build
*.local
.env
.env.*
!.env.example
.DS_Store
*.log
.vercel
next-env.d.ts
.vscode/*
!.vscode/extensions.json
`;
}
