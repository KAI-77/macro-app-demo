import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
    },
    proxy:
      process.env.NODE_ENV === "development"
        ? {
            "/api": "http://localhost:5000",
            "/auth": "http://localhost:5000",
          }
        : {
            "/api": "https://vitascan-backend.onrender.com",
            "/auth": "https://vitascan-backend.onrender.com",
          },
  },
});
