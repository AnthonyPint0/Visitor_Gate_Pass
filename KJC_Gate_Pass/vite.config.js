import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0", // Listen on all network interfaces (useful for network access)
    port: 5173, // The port you want to use
    strictPort: true, // Prevents Vite from using a different port if the specified one is occupied
  },
  build: {
    outDir: "dist", // Directory to output build files
  },
});
