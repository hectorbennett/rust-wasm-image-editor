import { defineConfig } from "vite";
import wasmPack from "vite-plugin-wasm-pack";
import react from "@vitejs/plugin-react";
import fullReload from "vite-plugin-full-reload";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  plugins: [wasmPack("./wasm"), react(), fullReload(["wasm/pkg/**/*"])],
  esbuild: {
    target: "es2020",
  },
  build: { target: "es2020" },
  optimizeDeps: {
    esbuildOptions: { target: "es2020", supported: { bigint: true } },
  },
});
