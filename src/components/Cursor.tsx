import { forwardRef, useEffect, useRef } from "react";
import { ToolsContext } from "../context";

interface Position {
  x: number;
  y: number;
}

interface CursorProps {
  position: Position;
}

export interface CursorComponentProps {
  size: number;
}

const drawCrosshair = (ctx: CanvasRenderingContext2D, size: number) => {
  const gap = 4;

  const draw = (margin: number) => {
    ctx.beginPath();
    // top
    ctx.moveTo(size / 2, margin);
    ctx.lineTo(size / 2, size / 2 - gap - margin);
    ctx.stroke();

    // right
    ctx.moveTo(size - margin, size / 2);
    ctx.lineTo(size / 2 + gap + margin, size / 2);
    ctx.stroke();

    // bottom
    ctx.moveTo(size / 2, size - margin);
    ctx.lineTo(size / 2, size / 2 + gap + margin);
    ctx.stroke();

    // left
    ctx.moveTo(margin, size / 2);
    ctx.lineTo(size / 2 - gap - margin, size / 2);
    ctx.stroke();
  };
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  draw(0);
  ctx.lineWidth = 1;
  ctx.strokeStyle = "white";
  draw(1);
};

const Crosshair = () => {
  const size = 27;
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      drawCrosshair(ctx, size);
    }
  }, [ref]);

  return (
    <canvas
      ref={ref}
      width={size}
      height={size}
      style={{
        left: -size / 2,
        top: -size / 2,
        position: "absolute",
      }}
    />
  );
};

export const Cursor = forwardRef<HTMLDivElement, CursorProps>((props, ref) => {
  const tools = ToolsContext.useContainer();
  const activeTool = tools.activeTool;
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        transform: `translate3d(${props.position.x}px, ${props.position.y}px, 0)`,
        zIndex: 2,
      }}
      ref={ref}
    >
      <Crosshair />
      {activeTool.cursor}
    </div>
  );
});
