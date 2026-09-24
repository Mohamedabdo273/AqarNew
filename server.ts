import express from 'express';
import path from 'path';
import { handleAdminApiRequest } from './src/server/mockBackendState';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // JSON parsing middleware
  app.use(express.json());

  // Health check for Cloud Run and container readiness
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // Mount Admin APIs
  app.use(async (req, res, next) => {
    const targetUrl = req.originalUrl || req.url || '';
    if (targetUrl.startsWith('/api/admin')) {
      try {
        const handled = await handleAdminApiRequest(req, res);
        if (handled) return;
      } catch (err) {
        return next(err);
      }
    }
    next();
  });

  // Vite middleware for development; static files for production
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Wahdety server running on http://0.0.0.0:${PORT}`);
  });

  server.on('error', (err) => {
    console.error('Server listen error:', err);
  });
}

startServer().catch((err) => {
  console.error('Failed to initialize server:', err);
  process.exit(1);
});

