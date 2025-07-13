import React, { StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import App from "./App.tsx";

const url = window.location.pathname + window.location.search;
const container = document.getElementById("root");

if (container) {
  hydrateRoot(
    container,
    <StrictMode>
      <App url={url} />
    </StrictMode>
  );
}
