import { Api } from "wasm";
import { TbOvalVertical } from "react-icons/tb";
import { Tool, ToolEventParams } from ".";
import { getRelativeMouseCoords } from "./utils";

let startX = 0;
let startY = 0;
let currX = 0;
let currY = 0;
let drawing = false;

const events = {
  onMouseDown: function ({ event, api }: ToolEventParams) {
    const [x, y] = getRelativeMouseCoords(
      event,
      api.state.workspace.zoom,
      api.state.workspace.x,
      api.state.workspace.y,
    );
    drawing = true;
    startX = x;
    startY = y;
    currX = x;
    currY = y;
  },
  onMouseMove: function ({ event, api }: ToolEventParams) {
    if (!drawing) {
      return;
    }
    [startX, startY] = getRelativeMouseCoords(
      event,
      api.state.workspace.zoom,
      api.state.workspace.x,
      api.state.workspace.y,
    );
    select_ellipse(api);
  },
  onMouseUp: function ({ api }: ToolEventParams) {
    drawing = false;
    select_ellipse(api);
  },
  onMouseOut: function () {
    drawing = false;
  },
};

const select_ellipse = (api: Api) => {
  const sX = Math.max(startX, 0);
  const cX = Math.max(currX, 0);
  const sY = Math.max(startY, 0);
  const cY = Math.max(currY, 0);
  api.select_ellipse(Math.min(sX, cX), Math.min(sY, currY), Math.abs(cX - sX), Math.abs(cY - sY));
};

export const ellipse_select: Tool = {
  name: "ellipse_select",
  label: "Ellipse Select",
  icon: TbOvalVertical,
  events: events,
};
