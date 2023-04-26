// This is a test that directly imports wasm and executes a few functions to a canvas.
import { useEffect, useRef } from "react";
import { getApi, getMtApi, getStApi } from "../utils/wasm";

export default function CanvasTest() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    (async () => {
      const { api, rawImageData } = await getApi();
      await render(api, rawImageData);
    })();
  }, []);

  const renderSingleThreaded = async () => {
    const { api, rawImageData } = await getStApi();
    await render(api, rawImageData);
  };

  const renderMultiThreaded = async () => {
    const { api, rawImageData } = await getMtApi();
    await render(api, rawImageData);
  };

  const render = async (api, rawImageData) => {
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

    const ctx = canvasRef.current.getContext("2d");

    const imageData = await rawImageData();
    const image = new ImageData(imageData, 800, 800);
    ctx.putImageData(image, 0, 0);
  };

  return (
    <>
      <button onClick={renderMultiThreaded}>Render multi-threaded</button>
      <button onClick={renderSingleThreaded}>Render single-threaded</button>
      <canvas ref={canvasRef} width={800} height={800} />
    </>
  );
}
