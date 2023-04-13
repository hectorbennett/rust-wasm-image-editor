import { Api } from "wasm";
import { Tool, ToolEventParams } from ".";
import { TbOvalVertical } from "react-icons/tb";

let startX = 0;
let startY = 0;
let currX = 0;
let currY = 0;
let drawing = false;

const events = {
  onMouseDown: function ({ event }: ToolEventParams) {
    const target = event.target as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    drawing = true;
    startX = event.clientX - rect.left;
    startY = event.clientY - rect.top;
    currX = startX;
    currY = startY;
  },
  onMouseMove: function ({ event, api }: ToolEventParams) {
    if (!drawing) {
      return;
    }
    const target = event.target as HTMLDivElement;
    const rect = target.getBoundingClientRect();
    startX = event.clientX - rect.left;
    startY = event.clientY - rect.top;
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
