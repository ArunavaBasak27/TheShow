import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import autoprefixer from "autoprefixer";
// https://vite.dev/config/

export default defineConfig(({ mode }) => {
  // Load env variables from project root
  const env = loadEnv(mode, path.resolve(process.cwd(), ".."), "");
  return {
    plugins: [react()],
    css: {
      postcss: {
        plugins: [autoprefixer()],
      },
    },

    server: {
      proxy: {
        "/api": {
          target: `http://localhost:${env.PORT}`,
          changeOrigin: true,
        },
      },
    },
    base: "/", // Adjust if deploying to a subdirectory
  };
});
