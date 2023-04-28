import { useEffect, useRef } from "react";

export default function LayerThumbnail({
  thumbnailHash,
  getThumbnail,
  active,
}: {
  thumbnailHash?: string;
  getThumbnail?: () => Promise<Uint8ClampedArray | undefined>;
  active: boolean;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  const width = 30;
  const height = 30;

  useEffect(() => {
    (async () => {
      if (!thumbnailHash || !getThumbnail) {
        return;
      }
      const canvas = ref.current;
      if (!canvas) {
        return;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return;
      }
      const thumbnail = await getThumbnail();
      if (!thumbnail) {
        return;
      }
      const image_data = ctx.createImageData(width, height);
      image_data.data.set(thumbnail);
      ctx.putImageData(image_data, 0, 0);
    })();
  }, [thumbnailHash]);

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      style={{
        outline: active ? "2px solid black" : undefined,
        background:
          "repeating-conic-gradient(rgb(135, 135, 135) 0%, rgb(135, 135, 135) 25%, rgb(90, 90, 90) 0%, rgb(90, 90, 90) 50%) 50% center / 10px 10px",
      }}
    />
  );
}
