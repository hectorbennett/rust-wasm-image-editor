import { MenuBarItem } from "./MenuBarItem";
import { Group } from "@mantine/core";
import { FunctionComponent, MouseEventHandler } from "react";
import { CommandsContext } from "../../context";
import { TablerIconProps } from "@tabler/icons";

export interface MenuItem {
  label: string;
  kbd_shortcut?: Array<string>;
  onClick: MouseEventHandler;
  icon?: FunctionComponent<TablerIconProps>;
}

interface RootMenuItem {
  label: string;
  items: Array<MenuItem>;
  width?: number;
}

const MENUS = ["app", "file", "edit", "view", "select", "tools", "filters", "image", "layer"];

export function MenuBarItems() {
  const commands = CommandsContext.useContainer();
  const menu_items: Array<RootMenuItem> = MENUS.map((m) => ({
    label: m,
    items: commands.commands
      .filter((c) => c.category === m)
      .map((c) => ({
        label: c.label,
        icon: c.icon,
        onClick: () => c.action(),
      })),
  }));

  return (
    <Group>
      {menu_items.map((menuItem) => {
        return (
          <MenuBarItem
            key={menuItem.label}
            width={menuItem.width}
            label={menuItem.label}
            items={menuItem.items}
          />
        );
      })}
    </Group>
  );
}
