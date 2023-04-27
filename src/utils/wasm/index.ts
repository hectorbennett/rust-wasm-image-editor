import { threads as supportsThreads } from "wasm-feature-detect";
import * as Comlink from "comlink";
import type { WasmWorker } from "./wasm.worker.st";

import { Api } from "wasm/pkg/wasm";

const FORCE_USE_SINGLE_THREADS = true;

const methods_with_callback = [...Object.getOwnPropertyNames(Api.prototype)].filter(
  (i) => !["constructor", "__destroy_into_raw", "free", "state"].includes(i),
);

// these methods only affect the canvas
const methods_without_callback = [
  "center_canvas",
  "eye_dropper",
  "fill_selection",
  "fuzzy_select",
  "get_layer_thumbnail",
  "move_active_layer",
  "scroll_workspace",
  "select_ellipse",
  "select_none",
  "select_rect",
  "zoom_workspace",
];

class ApiWrapper {
  api: any;
  get_raw_image_data: any;
  methodCallback: () => void;
  constructor(api, rawImageData, methodCallback) {
    this.api = api;
    this.get_raw_image_data = rawImageData;
    this.methodCallback = methodCallback;
  }

  get state() {
    return this.api.state;
  }
}

methods_with_callback.forEach((method) => {
  ApiWrapper.prototype[method] = async function (...args) {
    const result = await this.api[method](...args);
    this.methodCallback();
    return result;
  };
});

methods_without_callback.forEach((method) => {
  ApiWrapper.prototype[method] = async function (...args) {
    return await this.api[method](...args);
  };
});

export async function getMtApi(methodCallback) {
  const c = Comlink.wrap<WasmWorker>(
    new Worker(new URL("./wasm.worker.mt.ts", import.meta.url), {
      type: "module",
    }),
  );
  const { api, rawImageData } = await c.handler;
  return new ApiWrapper(api, rawImageData, methodCallback);
}

export async function getStApi(methodCallback) {
  const c = Comlink.wrap<WasmWorker>(
    new Worker(new URL("./wasm.worker.st.ts", import.meta.url), {
      type: "module",
    }),
  );
  const { api, rawImageData } = await c.handler;
  return new ApiWrapper(api, rawImageData, methodCallback);
}

export async function getApi(methodCallback) {
  if (FORCE_USE_SINGLE_THREADS || !(await supportsThreads())) {
    return await getStApi(methodCallback);
  } else {
    return await getMtApi(methodCallback);
  }
}
