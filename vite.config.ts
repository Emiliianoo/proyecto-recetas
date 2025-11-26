import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler"]],
      },
    }),
  ],
  // @ts-ignore
  test: {
    globals: true, // permite usar describe/test/expect sin importarlos
    environment: "jsdom", // simula navegador
    setupFiles: "./src/setupTests.ts", // archivo de setup global
  },
});
