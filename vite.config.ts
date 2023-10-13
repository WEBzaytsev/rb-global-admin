import { fileURLToPath, URL } from "node:url";

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default ({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    server: {
      host: true,
      port: 8081,
      strictPort: true,
      // add the next lines if you're using windows and hot reload doesn't work
      watch: {
        usePolling: true,
      },
    },
    preview: {
      port: 8080,
    },
  });
};
