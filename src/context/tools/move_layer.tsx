import { ArrowsMove } from "react-bootstrap-icons";
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
    [startX, startY] = [currX, currY];
    [currX, currY] = getProjectMouseCoords(event, api);
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
