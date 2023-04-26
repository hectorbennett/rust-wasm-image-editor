import { threads as supportsThreads } from "wasm-feature-detect";
import * as Comlink from "comlink";

// todo:
// Little perf boost to transfer data to the main thread w/o copying.
// rawImageData: Comlink.transfer(rawImageData, [rawImageData.buffer]),

async function initApi() {
  const app = await import("../wasm/pkg/wasm.js");
  await app.default();
  return Comlink.proxy({
    api: new app.Api(),
  });
}

const api = initApi();

export type Api = Awaited<typeof api>;

const worker = {
  handler: api,
};

export type WasmWorker = Awaited<typeof worker>;

Comlink.expose(worker);
