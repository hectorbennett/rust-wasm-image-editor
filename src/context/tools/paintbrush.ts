import { SyntheticEvent } from "react";
import { Brush } from "react-bootstrap-icons";
import { ToolEventParams } from ".";

let prevX = 0;
let prevY = 0;
let currX = 0;
let currY = 0;
let drawing = false;

function draw({ ctx, from, to }: any) {
  ctx.beginPath();
  ctx.moveTo(Math.floor(from[0]), Math.floor(from[1]));
  ctx.lineTo(Math.floor(to[0]), Math.floor(to[1]));
  ctx.strokeStyle = "blue";
  ctx.lineWidth = "2";
  ctx.stroke();
  ctx.closePath();
}

function processDrawEvent({ event, cursorX, cursorY, ctx }: ToolEventParams) {
  //   var clientX = event.clientX;
  //   var clientY = event.clientY;

  /* set is drawing */
  if (event.type == "mousedown") {
    drawing = true;
    prevX = currX;
    prevY = currY;
  } else if (["mouseup", "mouseout"].includes(event.type)) {
    drawing = false;
    return;
  }

  if (drawing && event.type == "mousemove") {
    prevX = currX || cursorX;
    prevY = currY || cursorY;
    currX = cursorX;
    currY = cursorY;
    draw({ ctx, from: [prevX, prevY], to: [currX, currY] });
  }
}

export const paintbrush = {
  name: "paintbrush",
  label: "Paintbrush",
  icon: Brush,
  events: {
    onMouseMove: function (params: ToolEventParams) {
      processDrawEvent(params);
    },
    onMouseDown: function (params: ToolEventParams) {
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
