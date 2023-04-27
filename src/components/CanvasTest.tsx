// This is a test that directly imports wasm and executes a few functions to a canvas.
import { useEffect, useRef } from "react";
import { getApi, getMtApi, getStApi } from "../utils/wasm";
import api_demo from "../utils/api_demo";

export default function CanvasTest() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    (async () => {
      const api = await getApi(() => {
        console.log("method callback 1 :)");
      });
      await render(api);
    })();
  }, []);

  const renderSingleThreaded = async () => {
    const api = await getStApi(() => {
      console.log("method callback 2 :)");
    });
    await render(api);
  };

  const renderMultiThreaded = async () => {
    const api = await getMtApi(() => {
      console.log("method callback 3 :)");
    });
    await render(api);
  };

  const render = async (api) => {
    await api_demo(api);

    const ctx = canvasRef.current.getContext("2d");

    const imageData = await api.get_raw_image_data(800, 800);
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
