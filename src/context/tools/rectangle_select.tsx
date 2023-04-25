import { BoundingBox } from "react-bootstrap-icons";
import { Tool, ToolEventParams } from ".";
import { getProjectMouseCoords } from "../../utils";
import { Api } from "../../../wasm/pkg/wasm";

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
      select_square(api);
    } else {
      select_rect(api);
    }
  },
  onMouseUp: function ({ event, api }: ToolEventParams) {
    drawing = false;
    if (event.shiftKey) {
      select_square(api);
    } else {
      select_rect(api);
    }
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

const select_square = (api: Api) => {
  const sX = Math.max(startX, 0);
  const cX = Math.max(currX, 0);
  const sY = Math.max(startY, 0);
  const cY = Math.max(currY, 0);

  const width = Math.abs(cX - sX);
  const height = Math.abs(cY - sY);
  const size = Math.max(width, height);
  api.select_rect(Math.min(sX, cX), Math.min(sY, currY), size, size);
};

export const rectangle_select: Tool = {
  name: "rectangle_select",
  label: "Rectangle Select",
  icon: BoundingBox,
  events: events,
};
