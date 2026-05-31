import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
// vitePluginManusRuntime removed - it was inlining React code into HTML (368KB file!)
// This caused circular dependency errors and blank page
const plugins = [react(), tailwindcss(), jsxLocPlugin()];

export default defineConfig({
  plugins,
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "client/dist"),
    emptyOutDir: true,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    // Let Vite handle chunking automatically to avoid circular dependencies
    chunkSizeWarningLimit: 900, // React 19 is inherently large (~900KB), this is expected
    rollupOptions: {
      output: {
        format: 'es',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
        manualChunks: (id) => {
          // React core — single shared chunk
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'vendor-react';
          }
          // Recharts + d3 — only used in admin, keep out of public pages
          if (id.includes('node_modules/recharts') || id.includes('node_modules/d3') || id.includes('node_modules/victory')) {
            return 'vendor-charts';
          }
          // Markdown rendering — only used on post pages
          if (id.includes('node_modules/react-markdown') || id.includes('node_modules/remark') || id.includes('node_modules/rehype') || id.includes('node_modules/micromark') || id.includes('node_modules/mdast') || id.includes('node_modules/unified')) {
            return 'vendor-markdown';
          }
          // Radix UI + shadcn components
          if (id.includes('node_modules/@radix-ui')) {
            return 'vendor-ui';
          }
        },
      },
    },
  },
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: [],
  },
  server: {
    port: 3000,
    strictPort: false, // Will find next available port if 3000 is busy
    host: true,
    allowedHosts: [
      ".manuspre.computer",
      ".manus.computer",
      ".manus-asia.computer",
      ".manuscomputer.ai",
      ".manusvm.computer",
      "localhost",
      "127.0.0.1",
    ],
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
    // Proxy API requests to local Express server (for admin login)
    // In production, Vercel handles /api routes via serverless functions
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
