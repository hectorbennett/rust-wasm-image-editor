import React, { forwardRef, useEffect, useRef, useState } from "react";
// import { Cursor } from "../components/Cursor";
import { ToolsContext, ActiveProjectContext } from "../context";
import { ToolEventParams, ToolEvents } from "../context/tools";

import { WasmContext } from "../context/wasm";

interface CanvasProps {
  width: number;
  height: number;
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(function Canvas(props, ref) {
  return (
    <canvas
      id="wasm-canvas"
      ref={ref}
      width={props.width}
      height={props.height}
      style={{
        position: "absolute",
        zIndex: 1,
      }}
    />
  );
});

function Background(props: { width: number; height: number }) {
  return (
    <div
      style={{
        width: props.width,
        height: props.height,
        position: "relative",
        zIndex: 0,
        background: "repeating-conic-gradient(#878787 0% 25%, #5a5a5a 0% 50%) 50% / 20px 20px",
      }}
    />
  );
}

export default function Workspace() {
  const activeProject = ActiveProjectContext.useContainer();
  const tools = ToolsContext.useContainer();
  // const [cursorVisible, setCursorVisible] = useState(false);
  // const cursorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  // const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  if (!activeProject.activeProject) {
    return null;
  }

  const wasm = WasmContext.useContainer();
  const [apiInited, setApiInted] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    if (!wasm.api) {
      return;
    }
    if (apiInited) {
      return;
    }
    wasm.api.init_canvas("wasm-canvas");
    setApiInted(true);
  }, [canvasRef.current, wasm.api, apiInited]);

  const events = Object.fromEntries(
    Object.keys(tools.activeTool.events).map((eventName) => [
      eventName,
      (event: React.MouseEvent) => {
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx || !wasm.api) {
          return;
        }
        const func = tools.activeTool.events[eventName as keyof ToolEvents] as (
          params: ToolEventParams,
        ) => void;
        func({ ctx, event, api: wasm.api });
      },
    ]),
  );

  const centerCanvas = () => {
    containerRef.current?.scrollIntoView({ behavior: "auto", block: "center", inline: "center" });
  };

  /* re-render canvas on project change */
  useEffect(() => {
    wasm.api?.render_to_canvas();
    centerCanvas();
  }, [
    activeProject.activeProject.uid,
    activeProject.activeProject.width,
    activeProject.activeProject.height,
  ]);

  return (
    <div
      style={{
        overflow: "auto",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          width: activeProject.activeProject.width + 2000,
          height: activeProject.activeProject.height + 2000,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          ref={containerRef}
          style={{
            width: activeProject.activeProject.width,
            height: activeProject.activeProject.height,
            position: "relative",
          }}
          {...events}
        >
          <Canvas
            ref={canvasRef}
            width={activeProject.activeProject.width}
            height={activeProject.activeProject.height}
          />
          <Background
            width={activeProject.activeProject.width}
            height={activeProject.activeProject.height}
          />
        </div>
        {/* {cursorVisible ? <Cursor ref={cursorRef} position={cursorPosition} /> : null} */}
      </div>
    </div>
  );
}
