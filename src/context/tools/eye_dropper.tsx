import { IconColorPicker } from "@tabler/icons-react";
import { Tool, ToolEventParams } from ".";
import { getProjectMouseCoords } from "../../utils";

export const eye_dropper: Tool = {
  name: "eye_dropper",
  label: "Eye dropper",
  icon: IconColorPicker,
  events: {
    onClick: async function ({ event, api }: ToolEventParams) {
      const [x, y] = await getProjectMouseCoords(event, api);
      api.eye_dropper(x, y);
    },
  },
};
