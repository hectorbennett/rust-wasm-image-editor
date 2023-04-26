import { threads as supportsThreads } from "wasm-feature-detect";
import * as Comlink from "comlink";
import type { WasmWorker } from "./wasm.worker.st";

// todo: can we get these dynamically
const methods = [
  "create_project",
  "set_primary_colour",
  "select_rect",
  "fill_selection",
  "create_layer",
  "select_ellipse",
  "select_none",
  "set_workspace_size",
  "center_canvas",
];

class ApiWrapper {
  constructor(api, rawImageData, methodCallback) {
    this.api = api;
    this.get_raw_image_data = rawImageData;
    this.methodCallback = methodCallback;
  }
}

methods.forEach((method) => {
  ApiWrapper.prototype[method] = async function (...args) {
    await this.api[method](...args);
    this.methodCallback();
  };
});

export async function getMtApi(methodCallback) {
  console.info("Using multi threaded wasm");
  const c = Comlink.wrap<WasmWorker>(
    new Worker(new URL("./wasm.worker.mt.ts", import.meta.url), {
      type: "module",
    }),
  );
  const { api, rawImageData } = await c.handler;
  return new ApiWrapper(api, rawImageData, methodCallback);
}

export async function getStApi(methodCallback) {
  console.info("Using single threaded wasm");
  const c = Comlink.wrap<WasmWorker>(
    new Worker(new URL("./wasm.worker.st.ts", import.meta.url), {
      type: "module",
    }),
  );
  const { api, rawImageData } = await c.handler;
  return new ApiWrapper(api, rawImageData, methodCallback);
}

export async function getApi(methodCallback) {
  if (await supportsThreads()) {
    return await getMtApi(methodCallback);
  } else {
    return await getStApi(methodCallback);
  }
}
