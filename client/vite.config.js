import { defineConfig } from "vite";
import preact from "@preact/preset-vite";
import RemoteAssets from "vite-plugin-remote-assets";

export default defineConfig({
  plugins: [preact(), RemoteAssets()],
  esbuild: {
    logOverride: { "this-is-undefined-in-esm": "silent" },
  },
  build: {
    rollupOptions: {
      output: {
        entryFileNames: `assets/[name].js`,
        chunkFileNames: `assets/[name].js`,
        assetFileNames: `assets/[name].[ext]`,
      },
    },
  },
  server: {
    port: 3456,
  },
});
