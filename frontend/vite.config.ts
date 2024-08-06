import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": "https://url-shortener-9o0q.onrender.com",
      "/thach.lalala": "https://url-shortener-9o0q.onrender.com",
    },
  },
});
