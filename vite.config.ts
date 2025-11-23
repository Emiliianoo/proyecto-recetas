import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
/// <reference types="vitest/config" />

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
});
