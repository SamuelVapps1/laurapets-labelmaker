import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["icon.svg"],
      manifest: {
        name: "LabelMaker",
        short_name: "LabelMaker",
        start_url: "/new",
        display: "standalone",
        background_color: "#f8fafc",
        theme_color: "#0f172a",
        icons: [
          {
            src: "/icon.svg",
            sizes: "512x512",
            type: "image/svg+xml",
          },
        ],
      },
      workbox: {
        navigateFallback: "/index.html",
      },
    }),
  ],
});
