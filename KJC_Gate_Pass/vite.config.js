import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "dist", // This ensures the build output goes to the "dist" folder
  },
  server: {
    host: "0.0.0.0", // Listen on all network interfaces
    port: 5173, // The port for dev server
    strictPort: true, // Prevent Vite from switching ports if 5173 is busy
  },
});
