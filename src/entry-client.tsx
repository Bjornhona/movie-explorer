import React, { StrictMode } from "react";
import { hydrateRoot } from 'react-dom/client';
import App from './App.tsx';

const container = document.getElementById("root");

if (container) {
  hydrateRoot(
    container,
    <StrictMode>
      <App />
    </StrictMode>
  );
} else {
  console.error("❌ Could not find root element to hydrate");
}
