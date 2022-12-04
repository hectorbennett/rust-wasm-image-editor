import { forwardRef } from "react";

interface Position {
  x: number;
  y: number;
}

interface CursorProps {
  position: Position;
}

export const Cursor = forwardRef<HTMLDivElement, CursorProps>((props, ref) => {
  return (
    <div
      style={{
        width: 10,
        height: 10,
        border: "2px solid black",
        position: "absolute",
        top: 0,
        left: 0,
        borderRadius: "100%",
        transform: `translate3d(${props.position.x}px, ${props.position.y}px, 0)`,
      }}
      ref={ref}
    />
  );
});
