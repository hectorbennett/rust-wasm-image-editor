import { Button, Menu } from "@mantine/core";

import KeyboardShortcut from "../../components/KeyboardShortcut";
import { MenuItem } from "./MenuBarItems";

interface MenuBarItemProps {
  label: string;
  width?: number;
  items: Array<MenuItem>;
}

function capitalizeFirstLetter(string: string) {
  /* TODO: Move to some general utils folder */
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function MenuBarItem(props: MenuBarItemProps) {
  return (
    <Menu shadow="md" styles={{ dropdown: { minWidth: 150 } }} position="bottom-start">
      <Menu.Target>
        <Button size="sm" variant="subtle" compact styles={{ label: { fontWeight: "lighter" } }}>
          {capitalizeFirstLetter(props.label)}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {props.items.map((item) => (
          <Menu.Item
            onClick={item.onClick}
            key={item.label}
            icon={item.icon ? <item.icon size={14} /> : null}
            rightSection={item.kbd_shortcut ? <KeyboardShortcut keys={item.kbd_shortcut} /> : null}
            disabled={item.disabled}
          >
            {capitalizeFirstLetter(item.label)}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
