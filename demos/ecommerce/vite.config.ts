import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: '@arcana-ui/core/styles',
        replacement: path.resolve(__dirname, '../../packages/core/dist/index.css'),
      },
      {
        find: '@arcana-ui/core',
        replacement: path.resolve(__dirname, '../../packages/core/src/index.ts'),
      },
    ],
  },
  server: {
    port: 3004,
  },
});
