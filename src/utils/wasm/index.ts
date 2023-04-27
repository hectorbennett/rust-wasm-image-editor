import { threads as supportsThreads } from "wasm-feature-detect";
import * as Comlink from "comlink";
import type { WasmWorker } from "./wasm.worker.st";

// these methods affect the ui (and maybe the canvas)
const methods_with_callback = [
  "create_layer",
  "create_project",
  "redo",
  "reeorder_layers",
  "rename_layer",
  "set_active_layer",
  "set_active_project",
  "set_layer_locked",
  "set_layer_visible",
  "set_primary_colour",
  "set_workspace_size",
  "undo",
];

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
