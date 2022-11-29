import { useEffect, useRef } from "react";
import { createContainer } from "unstated-next";

const useCanvas = () => {
  const canvasRef = useRef(null);
  const outerRef = useRef(null);
  const workspaceSize = 2000;

  useEffect(() => {
    centerWorkspace();
  }, []);

  function centerWorkspace() {
    let outer = outerRef.current as HTMLElement | null;
    if (!outer) {
      return;
    }
    outer.scrollTo(
      (workspaceSize - outer.getBoundingClientRect().width) / 2,
      (workspaceSize - outer.getBoundingClientRect().height) / 2
    );
  }

  return {
    outerRef,
    canvasRef,
    workspaceSize,
  };
};

export const CanvasContext = createContainer(useCanvas);
