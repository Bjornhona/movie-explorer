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
  app.use(express.json());

  // TMDB movies list proxy endpoint (supports category)
  app.get('/api/tmdb/movie/list', async (req: Request, res: Response) => {
    try {
      const accessToken = process.env.TMDB_ACCESS_TOKEN;
      if (!accessToken) {
        return res.status(500).json({ error: 'TMDB access token not configured' });
      }
      const category = req.query.category || 'upcoming';
      const page = req.query.page || 1;
      const allowedCategories = ['upcoming', 'popular', 'top_rated'];
      if (!allowedCategories.includes(category as string)) {
        return res.status(400).json({ error: 'Invalid category' });
      }
      const url = `https://api.themoviedb.org/3/movie/${category}?page=${page}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'accept': 'application/json',
        },
      });
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to fetch TMDB movies' });
      }
      const data = await response.json();
      res.setHeader('Cache-Control', 'public, max-age=86400');
      res.json(data);
    } catch (error) {
      console.error('TMDB Movies List Error:', error);
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

  // TMDB create access token proxy endpoint
  app.get('/api/tmdb/authentication/token/new', async (req: Request, res: Response) => {
    try {
      const accessToken = process.env.TMDB_ACCESS_TOKEN;
      if (!accessToken) {
        return res.status(500).json({ error: 'TMDB access token not configured' });
      }
      const url = 'https://api.themoviedb.org/3/authentication/token/new';
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'accept': 'application/json',
        },
      });
      if (!response.ok) {
        return res.status(response.status).json({ error: 'Failed to create TMDB access token' });
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('TMDB Create Access Token Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // TMDB session authentication proxy endpoint
  app.post('/api/tmdb/session', async (req: Request, res: Response) => {
    try {
      const accessToken = process.env.TMDB_ACCESS_TOKEN;
      const { request_token } = req.body;
      if (!accessToken) {
        return res.status(500).json({ error: 'TMDB access token not configured' });
      }
      if (!request_token) {
        return res.status(400).json({ error: 'Missing request_token in request body' });
      }
      const response = await fetch('https://api.themoviedb.org/3/authentication/session/new', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify({ request_token })
      });
      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ error: 'Failed to create session', details: errorText });
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("TMDB Session Error:", error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get('/api/tmdb/account', async (req: Request, res: Response) => {
    try {
      const accessToken = process.env.TMDB_ACCESS_TOKEN;
      if (!accessToken) {
        return res.status(500).json({ error: 'TMDB access token not configured' });
      }
      const response = await fetch('https://api.themoviedb.org/3/account', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'accept': 'application/json',
        }
      });
      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ error: 'Failed to get account data', details: errorText });
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("TMDB Account Error:", error);
      res.status(500).json({ error: 'Internal server error'});
    }
  });

  app.post('/api/tmdb/wishlist', async (req: Request, res: Response) => {
    try {
      const accessToken = process.env.TMDB_ACCESS_TOKEN;
      const { accountId, sessionId, addToWishlist = true, movieId } = req.body;

      if (!accessToken) {
        return res.status(500).json({ error: 'TMDB access token not configured' });
      }
      if (!accountId) {
        return res.status(400).json({ error: 'Missing accountId in request body' });
      }
      if (!movieId) {
        return res.status(400).json({ error: 'Missing movieId in request body' });
      }
      // const response = await fetch(`https://api.themoviedb.org/3/account/${accountId}/watchlist`, {
      const response = await fetch(`https://api.themoviedb.org/3/account/${accountId}/watchlist?session_id=${sessionId}`, {

        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
          'accept': 'application/json',
        },
        body: JSON.stringify({
          media_type: "movie",
          media_id: movieId,
          watchlist: addToWishlist
        })
      });
      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ error: 'Failed to add to wishlist', details: errorText });
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("TMDB Watchlist Error:", error);
    }
  });

  // TMDB get user's wishlist movies proxy endpoint
  app.get('/api/tmdb/wishlist', async (req: Request, res: Response) => {
    try {
      const accessToken = process.env.TMDB_ACCESS_TOKEN;
      const { accountId, sessionId, page = 1 } = req.query;
      if (!accessToken) {
        return res.status(500).json({ error: 'TMDB access token not configured' });
      }
      if (!accountId || !sessionId) {
        return res.status(400).json({ error: 'Missing accountId or sessionId' });
      }
      const url = `https://api.themoviedb.org/3/account/${accountId}/watchlist/movies?session_id=${sessionId}&page=${page}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'accept': 'application/json',
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        return res.status(response.status).json({ error: 'Failed to fetch wishlist', details: errorText });
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("TMDB Watchlist Fetch Error:", error);
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
