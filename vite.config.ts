import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    strictPort: true,
    host: true,
  },
  optimizeDeps: {
    include: [
      "@chakra-ui/react",
      "@emotion/react",
      "@emotion/styled",
      "framer-motion",
    ],
  },
  resolve: {
    dedupe: [
      "@chakra-ui/react",
      "@emotion/react",
      "@emotion/styled",
      "react",
      "react-dom",
    ],
  },
  base: "/",
});
