import * as Comlink from "comlink";
import wrapApi from "./wrap-api";

async function initApi() {
  const app = await import("../../../wasm/pkg-parallel/wasm.js");
  await app.default();
  await app.initThreadPool(navigator.hardwareConcurrency);
  return Comlink.proxy(wrapApi(new app.Api()));
}

const api = initApi();

export type Api = Awaited<typeof api>;

const worker = {
  handler: api,
};

export type WasmWorker = Awaited<typeof worker>;

Comlink.expose(worker);