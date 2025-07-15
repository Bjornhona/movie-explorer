import React, { StrictMode } from "react";
import App from "./App.tsx";
import { renderToString } from "react-dom/server";

export async function render(url: string) {
  const pathname = new URL(url, "http://localhost").pathname;
  let initialMovie = null;

  const movieMatch = pathname.match(/^\/([^/]+)\/(\d+)$/);
  if (movieMatch) {
    const movieId = movieMatch[2];
    const res = await fetch(`http://localhost:3000/api/tmdb/movie/${movieId}`);
    initialMovie = await res.json();
  }

  const html = renderToString(
    <StrictMode>
      <App initialUrl={url} initialMovie={initialMovie} />
    </StrictMode>
  );
  return html;
}
