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
  onMouseDown: async function ({ event, api }: ToolEventParams) {
    const [x, y] = await getProjectMouseCoords(event, api);
    drawing = true;
    startX = x;
    startY = y;
    currX = x;
    currY = y;
  },
  onMouseMove: async function ({ event, api }: ToolEventParams) {
    if (!drawing) {
      return;
    }
    [startX, startY] = [currX, currY];
    [currX, currY] = await getProjectMouseCoords(event, api);
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
  api.move_active_layer(currX - startX, currY - startY);
};

export const move_layer: Tool = {
  name: "move_layer",
  label: "Move layer",
  icon: ArrowsMove,
  events: events,
};
