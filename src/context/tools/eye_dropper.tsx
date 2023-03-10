// import { Box } from "@mantine/core";
import { IconColorPicker } from "@tabler/icons";

import { Tool, ToolEventParams } from ".";

export const eye_dropper: Tool = {
  name: "eye_dropper",
  label: "Eye dropper",
  icon: IconColorPicker,
  events: {
    onClick: function ({ event, api }: ToolEventParams) {
      const target = event.target as HTMLCanvasElement;
      const x = event.nativeEvent.clientX - target.offsetLeft;
      const y = event.nativeEvent.clientY - target.offsetTop;
      api.eye_dropper(x, y);
    },
  },
};
