import React, { forwardRef, useEffect, useRef, useState } from "react";
import { ToolsContext, ActiveProjectContext } from "../context";
import { ToolEventParams, ToolEvents } from "../context/tools";

import { WasmContext } from "../context/wasm";
import { AppContext } from "../context/app";
import useResizeObserver from "../hooks";

interface CanvasProps {
  width: number;
  height: number;
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(function Canvas({ width, height }, ref) {
  return (
    <canvas
      id="wasm-canvas"
      ref={ref}
      width={width}
      height={height}
      //   style={
      //     {
      //       // position: "absolute",
      //       // zIndex: 1,
      //     }
      //   }
    />
  );
});

export default function Workspace() {
  const app = AppContext.useContainer();
  const activeProject = ActiveProjectContext.useContainer();
  const tools = ToolsContext.useContainer();
  // const [cursorVisible, setCursorVisible] = useState(false);
  // const cursorRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [workspaceSize, setWorkspaceSize] = useState({ width: 0, height: 0 });
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
        func({ ctx, event, api: wasm.api, zoom: app.zoom });
      },
    ]),
  );

  //   const centerCanvas = () => {
  //     containerRef.current?.scrollIntoView({ behavior: "auto", block: "center", inline: "center" });
  //   };

  /* re-render canvas on project change */
  //   useEffect(() => {
  //     wasm.api?.render_to_canvas();
  //     // centerCanvas();
  //     // app.setZoom(100);
  //   }, [
  //     activeProject.activeProject.uid,
  //     activeProject.activeProject.width,
  //     activeProject.activeProject.height,
  //   ]);

  useResizeObserver(containerRef, (entry) => {
    const w = entry.contentRect.width;
    const h = entry.contentRect.height;
    if (w !== workspaceSize.width || h !== workspaceSize.height) {
      setWorkspaceSize({ width: w, height: h });
    }
  });

  useEffect(() => {
    wasm.api?.set_workspace_size(workspaceSize.width, workspaceSize.height);
  }, [workspaceSize.width, workspaceSize.height]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100%",
        position: "relative",
      }}
      {...events}
    >
      <Canvas ref={canvasRef} width={workspaceSize.width} height={workspaceSize.height} />
    </div>
  );
}
