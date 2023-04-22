import type { Meta, StoryObj } from "@storybook/react";
import Sortable, { Item } from "../components/Sortable";
import { useState } from "react";

// More on how to set up stories at: https://storybook.js.org/docs/7.0/react/writing-stories/introduction
const meta = {
  component: Sortable,
  tags: ["autodocs"],
} satisfies Meta<typeof Sortable>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Vertical: Story = {
  render: () => {
    const [items, setItems] = useState<Array<Item>>([
      {
        id: 1,
        component: <div>Component 1</div>,
      },
      {
        id: 2,
        component: <div>Component 2</div>,
      },
      {
        id: 3,
        component: <div>Component 3</div>,
      },
    ]);
    const onChange = (items: Array<Item>) => {
      setItems(items);
    };
    return <Sortable items={items} onChange={onChange} />;
  },
};
