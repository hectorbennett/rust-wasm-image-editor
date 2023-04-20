import React, { forwardRef, useEffect, useRef, useState } from "react";
import { ToolsContext, ActiveProjectContext } from "../context";
import { ToolEventParams, ToolEvents } from "../context/tools";

import { WasmContext } from "../context/wasm";
import useResizeObserver from "../hooks";
import Stats from "stats.js";

// todo: generate uid;
const CANVAS_ID = "123456";
let API_INITED = false;

interface CanvasProps {
  width: number;
  height: number;
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>(function Canvas({ width, height }, ref) {
  return <canvas id={CANVAS_ID} ref={ref} width={width} height={height} />;
});

export default function Workspace() {
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
    if (API_INITED) {
      return;
    }
    API_INITED = true;
    wasm.api.init_canvas(CANVAS_ID);

    const stats = new Stats();
    stats.showPanel(0);
    stats.dom.style.position = "static";
    document.getElementById("fps-counter")?.appendChild(stats.dom);

    const step = () => {
      stats.begin();
      wasm.render_to_canvas();
      stats.end();
      requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [canvasRef.current, wasm.api]);

  const default_events: ToolEvents = {
    onWheel: function ({ event }: ToolEventParams) {
      /* todo: can we do some better TypeScript here - e.g. dynamic event type with <T> syntax? */
      const e = event as unknown as WheelEvent;

      if (e.metaKey) {
        // zoom workspace
        wasm.api?.zoom_workspace(-e.deltaY);
      } else {
        // scroll workspace
        wasm.api?.scroll_workspace(-e.deltaX, -e.deltaY);
      }
    },
  };

  const combined_events = { ...default_events, ...tools.activeTool.events };

  const events = Object.fromEntries(
    Object.keys(combined_events).map((eventName) => [
      eventName,
      (event: React.MouseEvent) => {
        const ctx = canvasRef.current?.getContext("2d");
        if (!ctx || !wasm.api) {
          return;
        }
        const func = combined_events[eventName as keyof ToolEvents] as (
          params: ToolEventParams,
        ) => void;
        func({ ctx, event, api: wasm.api });
      },
    ]),
  );

  useResizeObserver(containerRef, (entry) => {
    const w = entry.contentRect.width;
    const h = entry.contentRect.height;
    if (w !== workspaceSize.width || h !== workspaceSize.height) {
      setWorkspaceSize({ width: w, height: h });
    }
  });

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
      <Fps />
    </div>
  );
}

function Fps() {
  return <div id="fps-counter" style={{ position: "absolute", top: 10, right: 10 }} />;
}
