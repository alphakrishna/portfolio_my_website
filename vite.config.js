import { defineConfig } from 'vite';

export default defineConfig({
  server: { host: true, open: false },
  build: {
    target: 'es2019',
    cssMinify: true,
  },
});
