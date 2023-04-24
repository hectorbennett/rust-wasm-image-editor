import { ReactElement, useState } from "react";
import { Api } from "wasm";
import { createContainer } from "unstated-next";

import type { Icon as TablerIcon } from "@tabler/icons-react";
import type { Icon as ReactBootstrapIcon } from "react-bootstrap-icons";
import { eye_dropper } from "./eye_dropper";
import { bucket_fill } from "./bucket_fill";
import { rectangle_select } from "./rectangle_select";
import { ellipse_select } from "./ellipse_select";
import { move_layer } from "./move_layer";
import { fuzzy_select } from "./fuzzy_select";

export interface ToolEventParams {
  ctx: CanvasRenderingContext2D;
  event: React.MouseEvent;
  api: Api;
}

export interface ToolEvents {
  onClick?: (params: ToolEventParams) => void;
  onMouseDown?: (params: ToolEventParams) => void;
  onMouseMove?: (params: ToolEventParams) => void;
  onMouseOut?: (params: ToolEventParams) => void;
  onMouseUp?: (params: ToolEventParams) => void;
  onScroll?: (params: ToolEventParams) => void;
  onWheel?: (params: ToolEventParams) => void;
}

export interface Tool {
  name: string;
  label: string;
  icon: ReactBootstrapIcon | TablerIcon;
  events: ToolEvents;
  cursor?: ReactElement;
}

function useTools() {
  const tools: Array<Tool> = [
    move_layer,
    rectangle_select,
    ellipse_select,
    bucket_fill,
    eye_dropper,
    fuzzy_select,
  ];

  const [activeTool, setActiveTool] = useState(tools[0]);

  return {
    setActiveTool,
    activeTool,
    tools,
  };
}

export const ToolsContext = createContainer(useTools);
