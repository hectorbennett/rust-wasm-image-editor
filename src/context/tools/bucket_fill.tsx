import { PaintBucket } from "react-bootstrap-icons";
import { Tool, ToolEventParams } from ".";

export const bucket_fill: Tool = {
  name: "bucket_fill",
  label: "Bucket Fill",
  icon: PaintBucket,
  events: {
    onClick: function ({ api }: ToolEventParams) {
      api.fill_selection();
    },
  },
};
