import { Box, Button, Menu } from "@mantine/core";

import KeyboardShortcut from "../../components/KeyboardShortcut";
import { MenuItem } from "./MenuBarItems";

interface MenuBarItemProps {
  label: string;
  width?: number;
  items: Array<MenuItem>;
  menuBarIsFocused: boolean;
  opened: boolean;
  onOpen: () => void;
  onClose: () => void;
}

function capitalizeFirstLetter(string: string) {
  /* TODO: Move to some general utils folder */
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function MenuBarItem(props: MenuBarItemProps) {
  return (
    <Menu
      shadow="md"
      styles={{ dropdown: { minWidth: 150 } }}
      position="bottom-start"
      opened={props.opened}
      transitionProps={{ duration: 0 }}
    >
      <Menu.Target>
        <Button
          size="sm"
          variant="subtle"
          compact
          styles={{ label: { fontWeight: "lighter" } }}
          onClick={() => props.onOpen()}
          onMouseOver={(event) => {
            if (props.menuBarIsFocused) {
              props.onOpen();
            }
          }}
        >
          {capitalizeFirstLetter(props.label)}
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        {props.items.map((item) => (
          <Menu.Item
            key={item.name}
            onClick={(e) => {
              props.onClose();
              item.onClick(e);
            }}
            icon={item.icon ? <item.icon size={14} stroke={1.25} /> : null}
            rightSection={
              item.kbd_shortcut ? (
                <Box ml="2rem">
                  <KeyboardShortcut keys={item.kbd_shortcut} />
                </Box>
              ) : null
            }
            disabled={item.disabled}
          >
            {capitalizeFirstLetter(item.label)}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}
