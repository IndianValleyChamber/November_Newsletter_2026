import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  base: "/november-2026-newsletter/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});