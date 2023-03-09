import { BoundingBox } from "react-bootstrap-icons";
import { Tool, ToolEventParams } from ".";

let startX = 0;
let startY = 0;
let currX = 0;
let currY = 0;
let drawing = false;

function drawRect({
  ctx,
  from,
  to,
}: {
  ctx: CanvasRenderingContext2D;
  from: number[];
  to: number[];
}) {
  ctx.beginPath();
  ctx.moveTo(Math.floor(from[0]), Math.floor(from[1]));
  ctx.lineTo(Math.floor(to[0]), Math.floor(to[1]));
  ctx.strokeStyle = "blue";
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.closePath();
}

function processDrawEvent({ event, cursorX, cursorY, ctx }: ToolEventParams) {
  //   var clientX = event.clientX;
  //   var clientY = event.clientY;

  /* set is drawing */
  if (event.type == "mousedown") {
    drawing = true;
    startX = currX;
    startY = currY;
  } else if (["mouseup", "mouseout"].includes(event.type)) {
    drawing = false;
    return;
  }

  if (drawing && event.type == "mousemove") {
    const rect = [startX, startY, currX, currY];
    console.log(rect);
    // prevX = currX || cursorX;
    // prevY = currY || cursorY;
    currX = cursorX;
    currY = cursorY;
    drawRect({ ctx, from: [startX, startY], to: [currX, currY] });
  }
}

export const rectangle_select: Tool = {
  name: "rectangle_select",
  label: "Rectangle Select",
  icon: BoundingBox,
  events: {
    onMouseDown: function (params: ToolEventParams) {
      console.log("mouse down");
      processDrawEvent(params);
    },
    onMouseMove: function (params: ToolEventParams) {
      processDrawEvent(params);
    },
    onMouseUp: function (params: ToolEventParams) {
      processDrawEvent(params);
    },
    onMouseOut: function (params: ToolEventParams) {
      processDrawEvent(params);
    },
  },
};
