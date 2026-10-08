import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig, Plugin} from 'vite';

const xtreamProxyPlugin = (): Plugin => ({
  name: 'xtream-proxy-plugin',
  configureServer(server) {
    server.middlewares.use('/api/proxy', async (req, res) => {
      try {
        const urlObj = new URL(req.url || '', 'http://localhost:3000');
        const targetUrl = urlObj.searchParams.get('url');
        if (!targetUrl) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Missing url parameter' }));
          return;
        }

        const fetchResponse = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'IPTVSmarters/1.0.0 (Linux; Android)',
            'Accept': '*/*',
          },
        });

        res.statusCode = fetchResponse.status;
        fetchResponse.headers.forEach((value, key) => {
          if (!['content-encoding', 'content-length', 'transfer-encoding'].includes(key.toLowerCase())) {
            res.setHeader(key, value);
          }
        });
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');

        const contentType = fetchResponse.headers.get('content-type') || '';
        const isM3u8 = targetUrl.includes('.m3u8') || contentType.includes('mpegurl');

        if (isM3u8 && fetchResponse.ok) {
          const text = await fetchResponse.text();
          const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);
          const rewritten = text
            .split('\n')
            .map((line) => {
              const trimmed = line.trim();
              if (!trimmed || trimmed.startsWith('#')) return line;
              const fullUrl = trimmed.startsWith('http')
                ? trimmed
                : new URL(trimmed, baseUrl).toString();
              return `/api/proxy?url=${encodeURIComponent(fullUrl)}`;
            })
            .join('\n');

          res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
          res.end(rewritten);
          return;
        }

        const arrayBuffer = await fetchResponse.arrayBuffer();
        res.end(Buffer.from(arrayBuffer));
      } catch (err: any) {
        res.statusCode = 502;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err.message || 'Proxy request failed' }));
      }
    });
  },
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), xtreamProxyPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
