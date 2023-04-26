import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
const config: StorybookConfig = {
  stories: ["../src/**/*.mdx", "../src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  framework: {
    name: "@storybook/react-vite",
    options: {},
  },
  docs: {
    autodocs: "tag",
  },
  async viteFinal(config) {
    return mergeConfig(config, {
      server: {
        headers: {
          "Cross-Origin-Embedder-Policy": "require-corp",
          "Cross-Origin-Opener-Policy": "same-origin",
        },
      },
    });
  },
};
export default config;

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import fullReload from "vite-plugin-full-reload";
// import OMT from "@surma/rollup-plugin-off-main-thread";

// export default defineConfig({
//   server: {
//     host: "0.0.0.0",
//     port: 3000,
//     headers: {
//       "Cross-Origin-Embedder-Policy": "require-corp",
//       "Cross-Origin-Opener-Policy": "same-origin",
//     },
//   },
//   plugins: [{ ...OMT() }, react(), fullReload(["wasm/pkg/**/*"])],
//   esbuild: {
//     target: "es2020",
//   },
//   build: { target: "es2020" },
//   optimizeDeps: {
//     esbuildOptions: { target: "es2020", supported: { bigint: true } },
//   },
// });
