import React from "react";
import App from "./App.tsx";
import { renderToString } from "react-dom/server";

export function render(url: string) {
  const html = renderToString(<App />);
  return `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Movie Explorer App</title>
    </head>
    <body>
      <div id="root">${html}</div>
      <script type="module" src="/src/entry-client.tsx"></script>
    </body>
    </html>`;
}
