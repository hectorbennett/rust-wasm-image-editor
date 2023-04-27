import type { Meta, StoryObj } from "@storybook/react";
import KeyboardShortcut from "./KeyboardShortcut";

const meta = {
  title: "Example/KeyboardShortcut",
  component: KeyboardShortcut,
  // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/7.0/react/writing-docs/docs-page
  tags: ["autodocs"],
  parameters: {
    // More on how to position stories at: https://storybook.js.org/docs/7.0/react/configure/story-layout
    layout: "fullscreen",
  },
} satisfies Meta<typeof KeyboardShortcut>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Thing: Story = {
  args: {
    keys: "ctrl+F",
  },
};

// export const LoggedOut: Story = {};
