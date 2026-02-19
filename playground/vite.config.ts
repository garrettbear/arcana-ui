import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@arcana-ui/core': '/Users/silverblue/Projects/arcana-ui/packages/core/src/index.ts',
    },
  },
})
