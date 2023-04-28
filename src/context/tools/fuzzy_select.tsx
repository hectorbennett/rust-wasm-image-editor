import { Tool, ToolEventParams } from ".";
import { getProjectMouseCoords } from "src/utils";
import { IconWand } from "@tabler/icons-react";

const events = {
  onClick: async function ({ event, api }: ToolEventParams) {
    const [x, y] = await getProjectMouseCoords(event, api);
    api.fuzzy_select(x, y);
  },
};

export const fuzzy_select: Tool = {
  name: "fuzzy_select",
  label: "Fuzzy select",
  icon: IconWand,
  events: events,
};
