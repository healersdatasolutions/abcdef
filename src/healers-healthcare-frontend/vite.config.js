import { fileURLToPath, URL } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import environment from 'vite-plugin-environment';
import dotenv from 'dotenv';
import path from "path"


dotenv.config({ path: '../../.env' });

export default defineConfig({
  server: {
    proxy: {
      "/api": {
        target: "http://127.0.0.1:4943",
        changeOrigin: true,
      },
    },
    headers: {
      'Content-Security-Policy': "default-src 'self'; img-src 'self' data: https://example.com https://pbs.twimg.com; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com; connect-src 'self' https://*.ic0.app; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.youtube.com https://s.ytimg.com; style-src 'self' 'unsafe-inline' https://www.youtube.com; object-src 'none'; worker-src 'self' blob:; font-src 'self' data:;",
      'Permissions-Policy': "accelerometer=(), autoplay=(), camera=(), gyroscope=(), magnetometer=()"
    }
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: false,
  },
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: "globalThis",
      },
    },
  },
  
  plugins: [
    react(),
    environment("all", { prefix: "CANISTER_" }),
    environment("all", { prefix: "DFX_" }),
  ],
  resolve: {
    alias: [
      {
        find: "declarations",
        replacement: fileURLToPath(
          new URL("../declarations", import.meta.url)
        ),
        "@": path.resolve(path.dirname(new URL(import.meta.url).pathname), "./src"),
      },
    ],
  },
});
