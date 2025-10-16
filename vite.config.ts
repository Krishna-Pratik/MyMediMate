import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Use "/" for Vercel, "/MyMediMate/" for GitHub Pages
  base: process.env.VERCEL ? "/" : "/MyMediMate/",
  server: {
    host: "localhost",
    port: 8080,
  },
  plugins: [react()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
