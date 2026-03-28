import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@arcana-ui/core': path.resolve(__dirname, '../packages/core/src/index.ts'),
    },
  },
  // Enable JSON imports for token-map.json
  json: {
    stringify: false,
  },
});
