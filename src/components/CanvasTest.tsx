// This is a test that directly imports wasm and executes a few functions to a canvas.

import { useEffect, useRef } from "react";
import { threads as supportsThreads } from "wasm-feature-detect";
import * as Comlink from "comlink";
import type { WasmWorker } from "../wasm.worker.st";

async function getMtApi() {
  console.log("Using multi threaded wasm");
  const c = Comlink.wrap<WasmWorker>(
    new Worker(new URL("../wasm.worker.mt.ts", import.meta.url), {
      type: "module",
    }),
  );
  return await c.handler;
}

async function getStApi() {
  console.log("Using single threaded wasm");
  const c = Comlink.wrap<WasmWorker>(
    new Worker(new URL("../wasm.worker.st.ts", import.meta.url), {
      type: "module",
    }),
  );
  return await c.handler;
}

async function getApi() {
  if (await supportsThreads()) {
    return await getMtApi();
  } else {
    return await getStApi();
  }
}

export default function CanvasTest() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    (async () => {
      const { api } = await getApi();
      await render(api);
    })();
  }, []);

  const renderSingleThreaded = async () => {
    const { api } = await getStApi();
    await render(api);
  };

  const renderMultiThreaded = async () => {
    const { api } = await getMtApi();
    await render(api);
  };

  const render = async (api) => {
    await api.create_project();
    // red square layer
    await api.set_primary_colour(255, 0, 0, 100);
    await api.select_rect(100, 150, 150, 150);
    await api.fill_selection();

    // green square layer
    await api.create_layer();
    await api.set_primary_colour(0, 255, 0, 100);
    await api.select_rect(220, 100, 180, 150);
    await api.fill_selection();

    // blue circle layer
    await api.create_layer();
    await api.set_primary_colour(0, 0, 255, 100);
    await api.select_ellipse(180, 200, 200, 200);
    await api.fill_selection();

    // clear selection
    await api.select_none();

    await api.set_workspace_size(800, 800);
    await api.center_canvas();

    const buffer = await api.get_workspace_buffer();

    const ctx = canvasRef.current.getContext("2d");

    const image = new ImageData(buffer, 800, 800);
    ctx.putImageData(image, 0, 0);
  };

  return (
    <>
      <button onClick={renderMultiThreaded}>Render multi-threaded</button>
      <button onClick={renderSingleThreaded}>Render single-threaded</button>
      <canvas ref={canvasRef} width={800} height={800} />;
    </>
  );
}
