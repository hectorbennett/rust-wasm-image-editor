import { Box } from "@mantine/core";
import { IconColorPicker } from "@tabler/icons";

import { Tool, ToolEventParams } from ".";

function Cursor() {
  return (
    <Box
      sx={{
        display: "flex",
        position: "absolute",
      }}
    >
      <IconColorPicker size={24} stroke={1} />
    </Box>
  );
}

export const eye_dropper: Tool = {
  name: "eye_dropper",
  label: "Eye dropper",
  icon: IconColorPicker,
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
  cursor: <Cursor />,
};
