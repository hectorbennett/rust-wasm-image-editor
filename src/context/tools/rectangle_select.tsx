import { BoundingBox } from "react-bootstrap-icons";
import { Api } from "wasm";
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
    select_rect(api);
  },
  onMouseUp: function ({ api }: ToolEventParams) {
    drawing = false;
    select_rect(api);
  },
  onMouseOut: function () {
    drawing = false;
  },
};

const select_rect = (api: Api) => {
  const sX = Math.max(startX, 0);
  const cX = Math.max(currX, 0);
  const sY = Math.max(startY, 0);
  const cY = Math.max(currY, 0);
  api.select_rect(Math.min(sX, cX), Math.min(sY, currY), Math.abs(cX - sX), Math.abs(cY - sY));
};

export const rectangle_select: Tool = {
  name: "rectangle_select",
  label: "Rectangle Select",
  icon: BoundingBox,
  events: events,
};
