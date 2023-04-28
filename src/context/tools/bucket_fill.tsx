import { Tool, ToolEventParams } from ".";
import { IconBucketDroplet } from "@tabler/icons-react";

export const bucket_fill: Tool = {
  name: "bucket_fill",
  label: "Bucket Fill",
  icon: IconBucketDroplet,
  events: {
    onClick: function ({ api }: ToolEventParams) {
      api.fill_selection();
    },
  },
};
