// import { Box } from "@mantine/core";
import { IconColorPicker } from "@tabler/icons";

import { Tool, ToolEventParams } from ".";
import { getProjectMouseCoords } from "../../utils";

export const eye_dropper: Tool = {
  name: "eye_dropper",
  label: "Eye dropper",
  icon: IconColorPicker,
  events: {
    onClick: function ({ event, api }: ToolEventParams) {
      const [x, y] = getProjectMouseCoords(event, api);
      api.eye_dropper(x, y);
    },
  },
};
