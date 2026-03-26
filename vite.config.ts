import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/WEAREAGAINSTCLIMATE/',
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
  },
});

