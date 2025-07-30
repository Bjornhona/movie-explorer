import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

const isSSR = process.env.BUILD_TARGET === "server";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    ssr: isSSR ? "src/entry-server.tsx" : false,
    outDir: isSSR ? "dist/server" : "dist/client",
    rollupOptions: {
      input: isSSR ? "src/entry-server.tsx" : "index.html",
    },
    sourcemap: true,
    target: "esnext",
  },
  server: {
    port: 5173,
    open: true,
  },
  optimizeDeps: {
    exclude: ["fsevents"],
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/setupTests.ts",
  },
});
