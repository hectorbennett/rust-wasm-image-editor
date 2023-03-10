import { BoundingBox } from "react-bootstrap-icons";
import { Api } from "wasm";
import { Tool, ToolEventParams } from ".";

let startX = 0;
let startY = 0;
let currX = 0;
let currY = 0;
let drawing = false;

const events = {
  onMouseDown: function ({ event }: ToolEventParams) {
    const target = event.target as HTMLCanvasElement;
    drawing = true;
    startX = event.nativeEvent.clientX - target.offsetLeft;
    startY = event.nativeEvent.clientY - target.offsetTop;
    currX = startX;
    currY = startY;
  },
  onMouseMove: function ({ event, api }: ToolEventParams) {
    if (!drawing) {
      return;
    }
    const target = event.target as HTMLCanvasElement;
    currX = event.nativeEvent.clientX - target.offsetLeft;
    currY = event.nativeEvent.clientY - target.offsetTop;
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