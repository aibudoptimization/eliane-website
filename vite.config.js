import { defineConfig } from 'vite';
import { resolve } from 'node:path';

const TRAILING_SLASH_REDIRECT_ROUTES = [
  '/politique-de-confidentialite',
  '/conditions-utilisation',
  '/offres/le-tremplin',
];

function trailingSlashRedirectPlugin() {
  const redirect = (middlewares) => {
    middlewares.use((req, res, next) => {
      if (!req.url) return next();
      const path = req.url.split('?')[0];
      if (TRAILING_SLASH_REDIRECT_ROUTES.includes(path)) {
        res.statusCode = 302;
        res.setHeader('Location', `${path}/`);
        res.end();
        return;
      }
      next();
    });
  };

  return {
    name: 'trailing-slash-route-redirect',
    configureServer(server) {
      redirect(server.middlewares);
    },
    configurePreviewServer(server) {
      redirect(server.middlewares);
    },
  };
}

export default defineConfig({
  appType: 'mpa',
  plugins: [trailingSlashRedirectPlugin()],
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
        conditionsUtilisation: resolve(__dirname, 'conditions-utilisation/index.html'),
        offresLeTremplin: resolve(__dirname, 'offres/le-tremplin/index.html'),
      },
      output: {
        manualChunks: undefined,
      },
    },
  },
});
