import 'dotenv/config';
import express from 'express';
import http from 'http';
import https from 'https';
import path from 'path';
import { handleAdminApiRequest } from './src/server/mockBackendState';

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  // Everything under /api except the built-in admin mock goes to the real API (AqarApi, .NET).
  // Piped raw — before express.json() — so multipart uploads and bodies pass through untouched.
  const apiUrl = new URL(process.env.API_URL || 'https://forsa-h3bmgghpcybshtfg.westus3-01.azurewebsites.net');
  app.use((req, res, next) => {
    const url = req.originalUrl || req.url || '';
    if (!url.startsWith('/api/') || url.startsWith('/api/admin') || url === '/api/health') return next();
    const client = apiUrl.protocol === 'https:' ? https : http;
    const upstream = client.request(
      {
        protocol: apiUrl.protocol,
        hostname: apiUrl.hostname,
        port: apiUrl.port,
        method: req.method,
        path: url,
        headers: { ...req.headers, host: apiUrl.host },
      },
      (apiRes) => {
        res.writeHead(apiRes.statusCode ?? 502, apiRes.headers);
        apiRes.pipe(res);
      },
    );
    upstream.on('error', (err) => {
      console.error(`API proxy error for ${req.method} ${url}:`, err.message);
      if (!res.headersSent) res.status(502).json({ message: 'السيرفر مش متاح دلوقتي، جرّب كمان شوية.', errors: [] });
    });
    req.pipe(upstream);
  });

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

