import { useState, useRef, useEffect, forwardRef, createRef } from "react";
import { setConstantValue } from "typescript";
// import ProjectContainer from "../../active/Project";
import { ProjectContext, CanvasContext, ToolsContext } from "../context";
import { LayersContext } from "../context";

function useNoopTool() {
  return {
    events: {},
  };
}

function useBucketFillTool({
  activeLayer,
  selectionOutlineLayer,
  selectionMaskLayer,
}) {
  const project = ProjectContext.useContainer();
  return {
    events: {
      onClick: function () {
        const maskData = selectionMaskLayer.ctx.getImageData(
          0,
          0,
          selectionMaskLayer.canvas.width,
          selectionMaskLayer.canvas.height
        );

        const newImage = new OffscreenCanvas(500, 500);
        const newImageContext = newImage.getContext("2d");
        let newImageData = newImageContext.getImageData(0, 0, 500, 500);
        for (let i = 0; i < newImageData.data.length; i += 4) {
          const transparency = maskData.data[i + 3];
          if (transparency) {
            newImageData.data[i] = project.activeColour[0];
            newImageData.data[i + 1] = project.activeColour[1];
            newImageData.data[i + 2] = project.activeColour[2];
            newImageData.data[i + 3] = project.activeColour[3];
          }
        }
        newImageContext.putImageData(newImageData, 0, 0);
        activeLayer.ctx.drawImage(
          newImage,
          0,
          0,
          activeLayer.canvas.width,
          activeLayer.canvas.height
        );
      },
    },
  };
}

function usePaintbrushTool({ activeLayer, selectionOutlineLayer }) {
  const [drawing, setDrawing] = useState(false);

  const startDraw = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    activeLayer.ctx.beginPath();
    activeLayer.ctx.moveTo(offsetX, offsetY);
    setDrawing(true);
  };

  const stopDraw = () => {
    activeLayer.ctx.closePath();
    setDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!drawing) return;
    const { offsetX, offsetY } = nativeEvent;
    activeLayer.ctx.lineTo(offsetX, offsetY);
    activeLayer.ctx.stroke();
  };

  return {
    events: {
      onMouseDown: startDraw,
      onMouseUp: stopDraw,
      onMouseMove: draw,
    },
  };
}

function useRectangleSelectTool({
  activeLayer,
  selectionOutlineLayer,
  selectionMaskLayer,
}) {
  const [drawing, setDrawing] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  const startDraw = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setStart({ x: offsetX, y: offsetY });
    selectionOutlineLayer.ctx.clearRect(
      0,
      0,
      selectionOutlineLayer.canvas.width,
      selectionOutlineLayer.canvas.height
    );
    setDrawing(true);
  };

  const stopDraw = ({ nativeEvent }) => {
    setDrawing(false);
    const { offsetX, offsetY } = nativeEvent;
    const x = Math.min(offsetX, start.x);
    const y = Math.min(offsetY, start.y);
    const width = Math.abs(offsetX - start.x);
    const height = Math.abs(offsetY - start.y);
    selectionMaskLayer.ctx.clearRect(
      0,
      0,
      selectionOutlineLayer.canvas.width,
      selectionOutlineLayer.canvas.height
    );
    selectionMaskLayer.ctx.fillStyle = "black";
    selectionMaskLayer.ctx.fillRect(x, y, width, height);
  };

  const draw = ({ nativeEvent }) => {
    if (!drawing) return;

    const { offsetX, offsetY } = nativeEvent;
    const x = Math.min(offsetX, start.x);
    const y = Math.min(offsetY, start.y);
    const width = Math.abs(offsetX - start.x);
    const height = Math.abs(offsetY - start.y);
    selectionOutlineLayer.ctx.clearRect(
      0,
      0,
      selectionOutlineLayer.canvas.width,
      selectionOutlineLayer.canvas.height
    );
    selectionOutlineLayer.ctx.lineWidth = 1;
    selectionOutlineLayer.ctx.strokeStyle = "white";
    selectionOutlineLayer.ctx.setLineDash([]);
    selectionOutlineLayer.ctx.strokeRect(x, y, width, height);

    selectionOutlineLayer.ctx.lineWidth = 1;
    selectionOutlineLayer.ctx.strokeStyle = "black";
    selectionOutlineLayer.ctx.setLineDash([10]);
    selectionOutlineLayer.ctx.strokeRect(x, y, width, height);
  };

  return {
    events: {
      onMouseDown: startDraw,
      onMouseUp: stopDraw,
      onMouseMove: draw,
    },
  };
}

function useOvalSelectTool({
  activeLayer,
  selectionOutlineLayer,
  selectionMaskLayer,
}) {
  const [drawing, setDrawing] = useState(false);
  const [start, setStart] = useState({ x: 0, y: 0 });

  const startDraw = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setStart({ x: offsetX, y: offsetY });
    selectionOutlineLayer.ctx.clearRect(
      0,
      0,
      selectionOutlineLayer.canvas.width,
      selectionOutlineLayer.canvas.height
    );
    setDrawing(true);
  };

  const stopDraw = ({ nativeEvent }) => {
    setDrawing(false);
    const { offsetX, offsetY } = nativeEvent;
    const x = Math.min(offsetX, start.x);
    const y = Math.min(offsetY, start.y);
    const width = Math.abs(offsetX - start.x);
    const height = Math.abs(offsetY - start.y);

    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const radiusX = width / 2;
    const radiusY = height / 2;
    selectionMaskLayer.ctx.clearRect(
      0,
      0,
      selectionOutlineLayer.canvas.width,
      selectionOutlineLayer.canvas.height
    );
    selectionMaskLayer.ctx.beginPath();
    selectionMaskLayer.ctx.ellipse(
      centerX,
      centerY,
      radiusX,
      radiusY,
      0,
      0,
      2 * Math.PI
    );
    selectionMaskLayer.ctx.fill();
  };

  const draw = ({ nativeEvent }) => {
    if (!drawing) return;

    const { offsetX, offsetY } = nativeEvent;
    const x = Math.min(offsetX, start.x);
    const y = Math.min(offsetY, start.y);
    const width = Math.abs(offsetX - start.x);
    const height = Math.abs(offsetY - start.y);

    const centerX = x + width / 2;
    const centerY = y + height / 2;
    const radiusX = width / 2;
    const radiusY = height / 2;

    selectionOutlineLayer.ctx.clearRect(
      0,
      0,
      selectionOutlineLayer.canvas.width,
      selectionOutlineLayer.canvas.height
    );
    selectionOutlineLayer.ctx.lineWidth = 1;
    selectionOutlineLayer.ctx.strokeStyle = "white";
    selectionOutlineLayer.ctx.setLineDash([4, 2]);
    selectionOutlineLayer.ctx.beginPath();
    selectionOutlineLayer.ctx.ellipse(
      centerX,
      centerY,
      radiusX,
      radiusY,
      0,
      0,
      2 * Math.PI
    );
    selectionOutlineLayer.ctx.stroke();

    selectionOutlineLayer.ctx.lineWidth = 1;
    selectionOutlineLayer.ctx.strokeStyle = "black";
    selectionOutlineLayer.ctx.setLineDash([4, 8]);
    selectionOutlineLayer.ctx.beginPath();
    selectionOutlineLayer.ctx.ellipse(
      centerX,
      centerY,
      radiusX,
      radiusY,
      0,
      0,
      2 * Math.PI
    );
    selectionOutlineLayer.ctx.stroke();
  };

  return {
    events: {
      onMouseDown: startDraw,
      onMouseUp: stopDraw,
      onMouseMove: draw,
    },
  };
}

function useTool({ activeLayer, selectionOutlineLayer, selectionMaskLayer }) {
  const _tools = ToolsContext.useContainer();
  const activeTool = _tools.activeTool.name;
  const tools = {
    select: useNoopTool(),
    bucket_fill: useBucketFillTool({
      activeLayer,
      selectionOutlineLayer,
      selectionMaskLayer,
    }),
    paintbrush: usePaintbrushTool({
      activeLayer,
      selectionOutlineLayer,
      selectionMaskLayer,
    }),
    rectangle_select: useRectangleSelectTool({
      activeLayer,
      selectionOutlineLayer,
      selectionMaskLayer,
    }),
    oval_select: useOvalSelectTool({
      activeLayer,
      selectionOutlineLayer,
      selectionMaskLayer,
    }),
  };
  return tools[activeTool];
}

const Canvas = forwardRef(function (props, ref) {
  return (
    <canvas
      ref={ref}
      width={500}
      height={500}
      style={{
        position: "absolute",
        ...props.style,
      }}
    />
  );
});

function Background() {
  return (
    <div
      style={{
        width: 500,
        height: 500,
        position: "relative",
        zIndex: -1,
        background:
          "repeating-conic-gradient(#878787 0% 25%, #5a5a5a 0% 50%) 50% / 20px 20px",
      }}
    />
  );
}

export default function Workspace() {
  const selection_outline_layer_ref = useRef();
  const layers = LayersContext.useContainer();

  const layersRef = useRef({});

  const [canvases, setCanvases] = useState({
    active: {
      canvas: null,
      ctx: null,
    },
    selection_outline_layer: {
      canvas: null,
      ctx: null,
    },
    selection_mask_layer: {
      canvas: null,
      ctx: null,
    },
  });
  const tool = useTool({
    activeLayer: canvases.active,
    selectionOutlineLayer: canvases.selection_outline_layer,
    selectionMaskLayer: canvases.selection_mask_layer,
  });

  useEffect(() => {
    const selection_mask = new OffscreenCanvas(500, 500);
    const c = {
      selection_outline_layer: {
        canvas: selection_outline_layer_ref.current,
        ctx: selection_outline_layer_ref.current.getContext("2d"),
      },
      selection_mask_layer: {
        canvas: selection_mask,
        ctx: selection_mask.getContext("2d"),
      },
    };
    setCanvases(c);
  }, []);

  useEffect(() => {
    setCanvases((c) => ({
      ...c,
      active: {
        canvas: layersRef.current[layers.activeLayerId],
        ctx: layersRef.current[layers.activeLayerId]?.getContext("2d"),
      },
    }));
  }, [layers.layers, layers.activeLayerId]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        overflow: "scroll",
        position: "relative",
      }}
      {...tool.events}
    >
      <Canvas ref={selection_outline_layer_ref} style={{ zIndex: 10000 }} />
      {layers.layers.map((layer, i) => (
        <Canvas
          key={layer.id}
          ref={(el) => {
            return (layersRef.current[layer.id] = el);
          }}
          style={{ zIndex: 10000 - i, opacity: layer.visible ? 1 : 0 }}
        />
      ))}
      <Background />
    </div>
  );
}
