// import { Box } from "@mantine/core";
import { IconColorPicker } from "@tabler/icons";

import { Tool, ToolEventParams } from ".";
import { getRelativeMouseCoords } from "./utils";

export const eye_dropper: Tool = {
  name: "eye_dropper",
  label: "Eye dropper",
  icon: IconColorPicker,
  events: {
    onClick: function ({ event, api }: ToolEventParams) {
      const [x, y] = getRelativeMouseCoords(
        event,
        api.state.workspace.zoom,
        api.state.workspace.x,
        api.state.workspace.y,
      );
      api.eye_dropper(x, y);
    },
  },
};
