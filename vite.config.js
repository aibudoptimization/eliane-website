import { defineConfig } from 'vite';
import { resolve } from 'node:path';

export default defineConfig({
  root: '.',
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        politiqueDeConfidentialite: resolve(__dirname, 'politique-de-confidentialite/index.html'),
      },
      output: {
        manualChunks: undefined,
      },
    },
  },
});
