import { BoundingBox } from "react-bootstrap-icons";
import { Api } from "wasm";
import { Tool, ToolEventParams } from ".";
import { getRelativeMouseCoords } from "./utils";

let startX = 0;
let startY = 0;
let currX = 0;
let currY = 0;
let drawing = false;

const events = {
  onMouseDown: function ({ event, zoom }: ToolEventParams) {
    const [x, y] = getRelativeMouseCoords(event, zoom);
    drawing = true;
    startX = x;
    startY = y;
    currX = x;
    currY = y;
  },
  onMouseMove: function ({ event, api, zoom }: ToolEventParams) {
    if (!drawing) {
      return;
    }
    [startX, startY] = getRelativeMouseCoords(event, zoom);
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

const select_rect = (api: Api) =>
  api.select_rect(
    Math.min(startX, currX),
    Math.min(startY, currY),
    Math.abs(currX - startX),
    Math.abs(currY - startY),
  );

export const rectangle_select: Tool = {
  name: "rectangle_select",
  label: "Rectangle Select",
  icon: BoundingBox,
  events: events,
};
