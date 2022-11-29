import { Eyedropper } from "react-bootstrap-icons";

import { ToolEventParams } from ".";
export const eye_dropper = {
  name: "eye_dropper",
  label: "Eye dropper",
  icon: Eyedropper,
  events: {
    onMouseMove: function ({
      canvas,
      ctx,
      event,
      project,
      cursorX,
      cursorY,
    }: ToolEventParams) {
      const pixel = ctx.getImageData(cursorX, cursorY, 1, 1);
      const data = pixel.data;
      project.setActiveColour(pixel.data);
    },
    onClick: function ({
      ctx,
      event,
      project,
    }: //  cursorX, cursorY
    ToolEventParams) {
      // const x = event.nativeEvent.layerX;
      // const y = event.nativeEvent.layerY;
      const pixel = ctx.getImageData(0, 0, 1, 1);
      const data = pixel.data;
      project.setActiveColour(data);
    },
  },
};
