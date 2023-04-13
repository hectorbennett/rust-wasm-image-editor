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
  disabled?: boolean;
}

interface RootMenuItem {
  label: string;
  items: Array<MenuItem>;
  width?: number;
}

export function MenuBarItems() {
  const commands = CommandsContext.useContainer();
  const categories = [...new Set(commands.commands.map((command) => command.category))];
  const menu_items: Array<RootMenuItem> = categories.map((m) => ({
    label: m,
    items: commands.commands
      .filter((c) => c.category === m)
      .map((c) => ({
        label: c.label,
        icon: c.icon,
        onClick: () => c.action(),
        disabled: c.disabled,
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
