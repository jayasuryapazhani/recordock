import react from "@vitejs/plugin-react";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  plugins: [react()],

  build: {
    rollupOptions: {
              input: {
                popup: resolve(projectRoot, "index.html"),
                preview: resolve(projectRoot, "preview.html"),
                offscreen: resolve(projectRoot, "offscreen.html"),
                background: resolve(
                  projectRoot,
                  "src/background/serviceWorker.ts",
                ),
              },

      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name === "background") {
            return "background.js";
          }

          return "assets/[name]-[hash].js";
        },

        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
      },
    },
  },
});