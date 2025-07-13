import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  // css: {
  //   preprocessorOptions: {
  //     scss: {
  //       additionalData: `@import "@/styles/variables.scss";`
  //     }
  //   }
  // },
  build: {
    ssr: 'src/entry-server.tsx',
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 5173,
    open: true
  },
  optimizeDeps: {
    exclude: ['fsevents'],
  },
})
