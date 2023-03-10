import { BoundingBox } from "react-bootstrap-icons";
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
  onMouseMove: function ({ event }: ToolEventParams) {
    if (!drawing) {
      return;
    }
    const target = event.target as HTMLCanvasElement;
    currX = event.nativeEvent.clientX - target.offsetLeft;
    currY = event.nativeEvent.clientY - target.offsetTop;
  },
  onMouseUp: function ({ api }: ToolEventParams) {
    drawing = false;
    api.select_rect(startX, startY, currX - startX, currY - startY);
  },
  onMouseOut: function () {
    drawing = false;
  },
};

export const rectangle_select: Tool = {
  name: "rectangle_select",
  label: "Rectangle Select",
  icon: BoundingBox,
  events: events,
};
