import { defineConfig } from "vite";
import wasmPack from "vite-plugin-wasm-pack";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 3000,
  },
  plugins: [wasmPack(["./wasm"]), react()],
});
