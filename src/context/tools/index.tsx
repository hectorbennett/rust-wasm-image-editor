import { ReactElement, useState } from "react";
import { createContainer } from "unstated-next";

import { Cursor, Crop, BoundingBoxCircles, Icon } from "react-bootstrap-icons";

import { TbRectangle, TbOvalVertical } from "react-icons/tb";

import { paintbrush } from "./paintbrush";
import { eye_dropper } from "./eye_dropper";
import { bucket_fill } from "./bucket_fill";
import { Project } from "../activeProject";

export interface ToolEventParams {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  canvasLeft: number;
  canvasTop: number;
  canvasWidth: number;
  canvasHeight: number;
  cursorX: number;
  cursorY: number;
  project: Project;
  event: MouseEvent;
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
  icon: Icon;
  events: ToolEvents;
  cursor?: ReactElement;
}

function useTools() {
  // const canvas = CanvasContext.useContainer();
  const tools: Array<Tool> = [
    {
      name: "select",
      label: "Select",
      icon: Cursor,
      events: {},
    },
    {
      name: "rectangle_select",
      label: "Rectangle Select",
      icon: TbRectangle,
      events: {},
    },
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
    {
      name: "rectangle_select",
      label: "Rectangle select",
      icon: BoundingBoxCircles,
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
