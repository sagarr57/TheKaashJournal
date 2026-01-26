import { jsxLocPlugin } from "@builder.io/vite-plugin-jsx-loc";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import fs from "node:fs";
import path from "path";
import { defineConfig } from "vite";
import { vitePluginManusRuntime } from "vite-plugin-manus-runtime";

const plugins = [react(), tailwindcss(), jsxLocPlugin(), vitePluginManusRuntime()];

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
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Split React into separate chunks to reduce individual chunk size
          if (id.includes('node_modules/react/jsx-runtime') || id.includes('node_modules/react/jsx-dev-runtime')) {
            return 'react-jsx';
          }
          if (id.includes('node_modules/react/') && !id.includes('react-dom')) {
            return 'react-core';
          }
          if (id.includes('node_modules/react-dom/')) {
            return 'react-dom';
          }
          
          // Router
          if (id.includes('node_modules/wouter')) {
            return 'router';
          }
          
          // Radix UI components
          if (id.includes('node_modules/@radix-ui')) {
            return 'ui-vendor';
          }
          
          // Charts (large library) - only loaded in admin dashboard
          if (id.includes('node_modules/recharts')) {
            return 'charts';
          }
          
          // Markdown and syntax highlighting (very large) - only loaded in Post page
          if (id.includes('node_modules/react-markdown') || 
              id.includes('node_modules/remark') || 
              id.includes('node_modules/react-syntax-highlighter') ||
              id.includes('node_modules/unified') ||
              id.includes('node_modules/micromark') ||
              id.includes('node_modules/mdast') ||
              id.includes('node_modules/decode-named-character-reference') ||
              id.includes('node_modules/character-entities') ||
              id.includes('node_modules/zwitch') ||
              id.includes('node_modules/bail') ||
              id.includes('node_modules/extend') ||
              id.includes('node_modules/vfile') ||
              id.includes('node_modules/property-information')) {
            return 'markdown';
          }
          
          // Icons
          if (id.includes('node_modules/lucide-react')) {
            return 'icons';
          }
          
          // Admin module and Google Analytics - already lazy loaded
          if (id.includes('modules/admin') || id.includes('node_modules/@google-analytics')) {
            return 'admin';
          }
          
          // Form libraries (used in admin and newsletter)
          if (id.includes('node_modules/react-hook-form') || 
              id.includes('node_modules/@hookform') ||
              id.includes('node_modules/zod')) {
            return 'forms';
          }
          
          // Other vendor libraries
          if (id.includes('node_modules/')) {
            return 'vendor';
          }
        },
      },
    },
    chunkSizeWarningLimit: 900, // React 19 is inherently large (~900KB), this is expected
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
  },
});
