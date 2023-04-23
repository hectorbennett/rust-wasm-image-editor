import type { Meta, StoryObj } from "@storybook/react";
import { Layer } from "../components/Layers";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  component: Layer,
  tags: ["autodocs"],
} satisfies Meta<typeof Layer>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InactiveLayer: Story = {
  args: {
    name: "Layer",
    locked: false,
    visible: true,
    active: false,
  },
};

export const ActiveLayer: Story = {
  args: {
    name: "Active layer",
    locked: false,
    visible: true,
    active: true,
  },
};
