import { ArrowsMove } from "react-bootstrap-icons";
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
    [startX, startY] = [currX, currY];
    [currX, currY] = getRelativeMouseCoords(event, zoom);
    move_active_layer(api);
  },
  onMouseUp: function ({ api }: ToolEventParams) {
    drawing = false;
    move_active_layer(api);
  },
  onMouseOut: function () {
    drawing = false;
  },
};

const move_active_layer = (api: Api) => {
  console.log(currX - startX);
  api.move_active_layer(currX - startX, currY - startY);
};

export const move_layer: Tool = {
  name: "move_layer",
  label: "Move layer",
  icon: ArrowsMove,
  events: events,
};
