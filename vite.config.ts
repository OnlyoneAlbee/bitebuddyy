import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Plain Vite + React SPA configuration.
// Output is a fully static site in /dist that can be deployed on Vercel or
// Netlify with no server runtime (all routing happens client-side).
export default defineConfig({
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  build: {
    outDir: "dist",
  },
  server: {
    host: "::",
    port: 8080,
    allowedHosts: true,
  },
  preview: {
    host: "::",
    port: 8080,
  },
});
