import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import dotenv from 'dotenv';
import { handleChatRequest } from './api/chat.ts';
import { handleTtsRequest } from './api/tts.ts';

// Load .env variables locally
dotenv.config();

function chatApiPlugin(): Plugin {
  return {
    name: 'chat-and-tts-api-middleware',
    configureServer(server) {
      // POST /api/chat
      server.middlewares.use('/api/chat', async (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.end(JSON.stringify({ error: 'Method Not Allowed' }));
          return;
        }

        let bodyRaw = '';
        req.on('data', (chunk) => {
          bodyRaw += chunk;
        });

        req.on('end', async () => {
          try {
            const body = JSON.parse(bodyRaw);
            const response = await handleChatRequest(body);
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 200;
            res.end(JSON.stringify(response));
          } catch (err: unknown) {
            console.error('API /api/chat error:', err);
            const message = err instanceof Error ? err.message : 'Server error';
            res.setHeader('Content-Type', 'application/json');
            res.statusCode = 500;
            res.end(JSON.stringify({ error: message }));
          }
        });
      });

      // GET /api/tts
      server.middlewares.use('/api/tts', async (req, res) => {
        try {
          const url = new URL(req.url || '', `http://${req.headers.host}`);
          const text = url.searchParams.get('text') || '';
          const lang = url.searchParams.get('lang') || 'ta';

          if (!text) {
            res.statusCode = 400;
            res.end(JSON.stringify({ error: 'Text query param is required' }));
            return;
          }

          const { buffer, contentType } = await handleTtsRequest(text, lang);
          res.setHeader('Content-Type', contentType);
          res.setHeader('Cache-Control', 'public, max-age=3600');
          res.statusCode = 200;
          res.end(Buffer.from(buffer));
        } catch (err: unknown) {
          console.error('API /api/tts error:', err);
          const message = err instanceof Error ? err.message : 'TTS Server error';
          res.setHeader('Content-Type', 'application/json');
          res.statusCode = 500;
          res.end(JSON.stringify({ error: message }));
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), chatApiPlugin()],
  server: {
    port: 3000,
    open: false,
  },
});
