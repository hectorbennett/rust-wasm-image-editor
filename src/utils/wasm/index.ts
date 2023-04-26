import { threads as supportsThreads } from "wasm-feature-detect";
import * as Comlink from "comlink";
import type { WasmWorker } from "./wasm.worker.st";

export async function getMtApi() {
  console.info("Using multi threaded wasm");
  const c = Comlink.wrap<WasmWorker>(
    new Worker(new URL("./wasm.worker.mt.ts", import.meta.url), {
      type: "module",
    }),
  );
  return await c.handler;
}

export async function getStApi() {
  console.info("Using single threaded wasm");
  const c = Comlink.wrap<WasmWorker>(
    new Worker(new URL("./wasm.worker.st.ts", import.meta.url), {
      type: "module",
    }),
  );
  return await c.handler;
}

export async function getApi() {
  if (await supportsThreads()) {
    return await getMtApi();
  } else {
    return await getStApi();
  }
}
