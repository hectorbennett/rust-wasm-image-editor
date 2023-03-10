import type { Meta, StoryObj } from "@storybook/react";
import RectangleSelect from "./RectangleSelect";

const meta = {
  title: "Example/RectangleSelect",
  component: RectangleSelect,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof RectangleSelect>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Thing: Story = {
  args: {
    // keys: ["CTRL", "F"],
  },
};
