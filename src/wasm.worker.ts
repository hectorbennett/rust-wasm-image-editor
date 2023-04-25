import { threads as supportsThreads } from "wasm-feature-detect";
import * as Comlink from "comlink";

// function wrapApi(api) {
//     return {
//         api: api,
//         getWorkspaceBuffer: () => Comlink.transfer(rawImageData, [rawImageData.buffer])
//     }
// }

async function initApi() {
  let app;
  if (await supportsThreads()) {
    console.log("using multi-threaded app");
    app = await import("../wasm/pkg/wasm.js");
    await app.default();
    // await app.initThreadPool();
  } else {
    console.log("using single-threaded app");
    app = await import("../wasm/pkg/wasm.js");
    await app.default();
  }

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
