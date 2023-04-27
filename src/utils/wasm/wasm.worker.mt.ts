import * as Comlink from "comlink";
import wrapApi from "./wrap-api";

async function initApi() {
  const app = await import("../../../wasm/pkg-parallel/wasm.js");
  await app.default();

  // m1 chip slows down on all 8 cores so manually limit to 4 for now :(
  // https://bugs.chromium.org/p/chromium/issues/detail?id=1228686
  // https://github.com/GoogleChromeLabs/wasm-bindgen-rayon/issues/16
  const coreCount = Math.min(navigator.hardwareConcurrency, 4);
  await app.initThreadPool(coreCount);
  console.log(`Using multi-threaded wasm with ${coreCount} cores`);
  return Comlink.proxy(wrapApi(new app.Api()));
}

const api = initApi();

export type Api = Awaited<typeof api>;

const worker = {
  handler: api,
};

export type WasmWorker = Awaited<typeof worker>;

Comlink.expose(worker);
