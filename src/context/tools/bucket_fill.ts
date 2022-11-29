import { PaintBucket } from "react-bootstrap-icons";
import { ToolEventParams } from ".";

export const bucket_fill = {
  name: "bucket_fill",
  label: "Bucket Fill",
  icon: PaintBucket,
  events: {
    onClick: function ({
      ctx,
      canvasLeft,
      canvasTop,
      canvasWidth,
      canvasHeight,
      project,
    }: ToolEventParams) {
      ctx.fillStyle = project.activeColourAsString;
      ctx.fillRect(canvasLeft, canvasTop, canvasWidth, canvasHeight);
    },
  },
};
