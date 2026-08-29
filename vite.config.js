import { defineConfig } from 'vite';

export default defineConfig({
  // GitHub Pages serves this project from a subpath:
  // https://alphakrishna.github.io/portfolio_my_website/
  // The base must match the repo name (with slashes) or every asset 404s.
  // If you move to a custom domain or a user site, set this back to "/".
  base: "/portfolio_my_website/",
  server: { host: true, open: false },
  build: {
    target: 'es2019',
    cssMinify: true,
  },
});
