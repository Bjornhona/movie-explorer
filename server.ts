import React from "react";
import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { fetch } from 'undici';
globalThis.fetch = fetch as any;
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();

    // TMDB guest session authentication proxy endpoint
  app.get('/api/tmdb/guest-session', async (req: Request, res: Response) => {
    try {
      const accessToken = process.env.TMDB_ACCESS_TOKEN;
      if (!accessToken) {
        return res.status(500).json({ error: 'TMDB access token not configured' });
      }
      const response = await fetch('https://api.themoviedb.org/3/authentication/guest_session/new', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'accept': 'application/json',
        },
      });
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to create guest session' });
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("TMDB Guest Session Error:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // TMDB movie changes proxy endpoint
  app.get('/api/tmdb/movie/now_playing', async (req: Request, res: Response) => {
    try {
      const accessToken = process.env.TMDB_ACCESS_TOKEN;
      if (!accessToken) {
        return res.status(500).json({ error: 'TMDB access token not configured' });
      }
      const page = req.query.page || 1;
      const url = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'accept': 'application/json',
        },
      });
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to fetch TMDB movie now playing' });
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("TMDB API Error:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // TMDB get movie by ID proxy endpoint
  app.get('/api/tmdb/movie/:id', async (req: Request, res: Response) => {
    try {
      const accessToken = process.env.TMDB_ACCESS_TOKEN;
      if (!accessToken) {
        return res.status(500).json({ error: 'TMDB access token not configured' });
      }
      const { id } = req.params;
      const language = req.query.language || 'en-US';
      const url = `https://api.themoviedb.org/3/movie/${id}?language=${language}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'accept': 'application/json',
        },
      });
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to fetch movie details' });
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("TMDB Get Movie By ID Error:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*all", async (req: Request, res: Response) => {
    try {
      const url = req.originalUrl;

      let template = fs.readFileSync(
        path.resolve(__dirname, "index.html"),
        "utf-8"
      );
      
      template = await vite.transformIndexHtml(url, template);

      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
      const appHtml = await render(url);      
      const html = template.replace(`<!--ssr-outlet-->`, () => appHtml);
      
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (err: any) {
      vite.ssrFixStacktrace(err);
      console.error(err.stack);
      res.status(500).end(err.stack);
    }
  });

  app.listen(3000, () => {
    console.log("➜ SSR server running at http://localhost:3000");
  });
}

startServer().catch((err) => {
  console.error("❌ Failed to start server:", err);
});
