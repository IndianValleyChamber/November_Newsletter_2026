import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  base: "/november-newsletter-2026/",

  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});