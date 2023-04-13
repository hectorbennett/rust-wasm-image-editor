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

const select_ellipse = (api: Api) =>
  api.select_ellipse(
    Math.min(startX, currX),
    Math.min(startY, currY),
    Math.abs(currX - startX),
    Math.abs(currY - startY),
  );

export const ellipse_select: Tool = {
  name: "ellipse_select",
  label: "Ellipse Select",
  icon: TbOvalVertical,
  events: events,
};
