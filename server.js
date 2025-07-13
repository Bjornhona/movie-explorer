import React from "react";
import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();

  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*all", async (req, res) => {
    try {
      const url = req.originalUrl;

      let template = fs.readFileSync(
        path.resolve(__dirname, "index.html"),
        "utf-8"
      );
      
      template = await vite.transformIndexHtml(url, template);

      const { render } = await vite.ssrLoadModule("/src/entry-server.tsx");
      const appHtml = await render(url);

      console.log('Rendering for ', url);
      
      const html = template.replace(`<!--ssr-outlet-->`, appHtml);
      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (err) {
      vite.ssrFixStacktrace(err);
      console.error(err.stack);
      res.status(500).end(err.stack);
    }
  });

  app.listen(3000, () => {
    console.log("➜ SSR server running at http://localhost:3000");
  });
}

startServer();
