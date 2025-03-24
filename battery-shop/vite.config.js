// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',      // فولدری که index.html در آن است
  build: {
    outDir: 'dist',        // خروحی نهایی در پوشه dist
    emptyOutDir: true,     // قبل از بیلد، پوشه dist پاک شود
  },
});
