import { useEffect, useRef, useState } from "react";
import { Cursor } from "../components/Cursor";
import { ActiveProjectContext } from "../context/activeProject";
import { WasmContext } from "../context/wasm";

// interface WorkspaceProps {
//   id: string;
// }

interface CanvasProps {
  width: number;
  height: number;
  image_hash: string;
}

const Canvas = function (props: CanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const wasm = WasmContext.useContainer();
  // const [apiInited, setApiInted] = useState(false);

  // useEffect(() => {
  //   const canvas = ref.current;
  //   if (!canvas) {
  //     return;
  //   }
  //   const ctx = canvas.getContext("2d");
  //   if (!ctx) {
  //     return;
  //   }
  //   if (!wasm.api) {
  //     return;
  //   }
  //   if (apiInited) {
  //     return;
  //   }
  //   // wasm.api.init_canvas_rendering_context(ctx);
  //   // setApiInted(true);
  // }, []);

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
};

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
  const [cursorVisible, setCursorVisible] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });

  if (!activeProject.activeProject) {
    return null;
  }

  return (
    <div
      onMouseEnter={() => setCursorVisible(true)}
      onMouseLeave={() => setCursorVisible(false)}
      onMouseMove={(e) => {
        setCursorPosition({ x: e.clientX, y: e.clientY });
      }}
      // style={{ cursor: "none" }}
    >
      <Canvas
        width={activeProject.activeProject.width}
        height={activeProject.activeProject.height}
        image_hash={activeProject.activeProject.image_hash}
      />
      <Background
        width={activeProject.activeProject.width}
        height={activeProject.activeProject.height}
      />
      {cursorVisible ? <Cursor ref={cursorRef} position={cursorPosition} /> : null}
    </div>
  );
}
