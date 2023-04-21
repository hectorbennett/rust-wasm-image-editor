import { Api } from "wasm";
import { TbOvalVertical } from "react-icons/tb";
import { Tool, ToolEventParams } from ".";
import { getProjectMouseCoords } from "../../utils";

let startX = 0;
let startY = 0;
let currX = 0;
let currY = 0;
let drawing = false;

const events = {
  onMouseDown: function ({ event, api }: ToolEventParams) {
    const [x, y] = getProjectMouseCoords(event, api);
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
    [startX, startY] = getProjectMouseCoords(event, api);
    if (event.shiftKey) {
      select_circle(api);
    } else {
      select_ellipse(api);
    }
  },
  onMouseUp: function ({ event, api }: ToolEventParams) {
    drawing = false;
    if (event.shiftKey) {
      select_circle(api);
    } else {
      select_ellipse(api);
    }
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

const select_circle = (api: Api) => {
  const sX = Math.max(startX, 0);
  const cX = Math.max(currX, 0);
  const sY = Math.max(startY, 0);
  const cY = Math.max(currY, 0);

  const width = Math.abs(cX - sX);
  const height = Math.abs(cY - sY);
  const size = Math.max(width, height);

  api.select_ellipse(Math.min(sX, cX), Math.min(sY, currY), size, size);
};

export const ellipse_select: Tool = {
  name: "ellipse_select",
  label: "Ellipse Select",
  icon: TbOvalVertical,
  events: events,
};
