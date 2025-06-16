import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    watch: {
      usePolling: true,
      proxy:
        process.env.NODE_ENV === "development"
          ? {
              "/api": "http://localhost:5000",
              "/auth": "http://localhost:5000",
            }
          : undefined,
    },
  },
});
