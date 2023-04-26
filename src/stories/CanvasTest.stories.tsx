import type { Meta, StoryObj } from "@storybook/react";
import CanvasTest from "../components/CanvasTest";

const meta = {
  component: CanvasTest,
  tags: ["autodocs"],
} satisfies Meta<typeof CanvasTest>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/7.0/react/writing-stories/args
export const Primary: Story = {
  args: {},
};
