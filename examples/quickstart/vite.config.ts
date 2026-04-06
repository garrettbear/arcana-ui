import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Minimal Vite config for consuming @arcana-ui/core + @arcana-ui/tokens from npm.
// This project is intentionally not a pnpm workspace package — it installs
// Arcana from the registry the same way a user's greenfield app would.
export default defineConfig({
  plugins: [react()],
});
