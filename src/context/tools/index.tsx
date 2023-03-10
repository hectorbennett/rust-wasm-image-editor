import { ReactElement, useState } from "react";
import { Api } from "wasm";
import { createContainer } from "unstated-next";

import { Cursor, Crop, Icon } from "react-bootstrap-icons";

import { TbOvalVertical } from "react-icons/tb";

import { paintbrush } from "./paintbrush";
import { eye_dropper } from "./eye_dropper";
import { bucket_fill } from "./bucket_fill";
import { TablerIcon } from "@tabler/icons";
import { rectangle_select } from "./rectangle_select";

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
}

export interface Tool {
  name: string;
  label: string;
  icon: Icon | TablerIcon;
  events: ToolEvents;
  cursor?: ReactElement;
}

function useTools() {
  const tools: Array<Tool> = [
    {
      name: "select",
      label: "Select",
      icon: Cursor,
      events: {},
    },
    rectangle_select,
    {
      name: "oval_select",
      label: "Oval Select",
      icon: TbOvalVertical,
      events: {},
    },
    bucket_fill,
    eye_dropper,
    paintbrush,
    {
      name: "crop",
      label: "Crop",
      icon: Crop,
      events: {},
    },
  ];

  const [activeTool, setActiveTool] = useState(tools[0]);

  return {
    setActiveTool,
    activeTool,
    tools,
  };
}

export const ToolsContext = createContainer(useTools);
