import React, { StrictMode } from "react";
import App from "./App.tsx";
import { renderToString } from "react-dom/server";

export function render(url: string) {
const html = renderToString(
    <StrictMode>
      <App url={url} />
    </StrictMode>,
  )
  return { html }
}
