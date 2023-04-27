import { MenuBarItem } from "./MenuBarItem";
import { Group } from "@mantine/core";
import { FunctionComponent, MouseEventHandler, useEffect, useState } from "react";
import { CommandsContext } from "../../context";
import { TablerIconsProps } from "@tabler/icons-react";
import { useFocusWithin } from "@mantine/hooks";

export interface MenuItem {
  label: string;
  kbd_shortcut?: string;
  onClick: MouseEventHandler;
  icon?: FunctionComponent<TablerIconsProps>;
  disabled?: boolean;
}

interface RootMenuItem {
  label: string;
  items: Array<MenuItem>;
  width?: number;
}

export function MenuBarItems() {
  const [openedMenu, setOpenedMenu] = useState(null);

  const { ref, focused } = useFocusWithin();

  const commands = CommandsContext.useContainer();
  const categories = [...new Set(commands.commands.map((command) => command.category))];
  const menu_items: Array<RootMenuItem> = categories.map((m) => ({
    label: m,
    items: commands.commands
      .filter((c) => c.category === m)
      .map((c) => ({
        label: c.label,
        icon: c.icon,
        kbd_shortcut: c.kbd_shortcut,
        onClick: () => c.action(),
        disabled: c.disabled,
      })),
  }));

  useEffect(() => {
    if (!focused) {
      setOpenedMenu(null);
    }
  }, [focused]);

  return (
    <Group ref={ref}>
      {menu_items.map((menuItem) => {
        return (
          <MenuBarItem
            key={menuItem.label}
            width={menuItem.width}
            label={menuItem.label}
            items={menuItem.items}
            menuBarIsFocused={focused}
            opened={menuItem.label == openedMenu}
            onOpen={() => setOpenedMenu(menuItem.label)}
          />
        );
      })}
    </Group>
  );
}
