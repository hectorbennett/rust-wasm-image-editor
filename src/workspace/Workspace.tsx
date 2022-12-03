import { useEffect, useRef } from "react";
import { ActiveProjectContext } from "../context/activeProject";
import { WasmContext } from "../context/wasm";

interface WorkspaceProps {
  id: string;
}

interface CanvasProps {
  width: number;
  height: number;
  image_hash: string;
}

const Canvas = function (props: CanvasProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const wasm = WasmContext.useContainer();

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    let newData = ctx.createImageData(props.width, props.height);
    newData.data.set(wasm.api.image_data);
    ctx.putImageData(newData, 0, 0);
  }, [props.image_hash]);

  return (
    <canvas
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
        background:
          "repeating-conic-gradient(#878787 0% 25%, #5a5a5a 0% 50%) 50% / 20px 20px",
      }}
    />
  );
}

export default function Workspace(props: WorkspaceProps) {
  const activeProject = ActiveProjectContext.useContainer();

  if (!activeProject.activeProject) {
    return null;
  }

  return (
    <div>
      <Canvas
        width={activeProject.activeProject.width}
        height={activeProject.activeProject.height}
        image_hash={activeProject.activeProject.image_hash}
      />
      <Background
        width={activeProject.activeProject.width}
        height={activeProject.activeProject.height}
      />
    </div>
  );
}
