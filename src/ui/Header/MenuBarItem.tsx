import { Button, Menu } from "@mantine/core";

import KeyboardShortcut from "../../components/KeyboardShortcut";
import { MenuItem } from "./MenuBarItems";

interface MenuBarItemProps {
  label: string;
  width?: number;
  items: Array<MenuItem>;
}

export function MenuBarItem(props: MenuBarItemProps) {
    return (
        <Menu
            shadow="md"
            styles={{ dropdown: { minWidth: 150 } }}
            position="bottom-start"
        >
            <Menu.Target>
                <Button size="xs" variant="subtle" compact>
                    {props.label}
                </Button>
            </Menu.Target>

            <Menu.Dropdown>
                {props.items.map((item) => (
                    <Menu.Item
                        onClick={item.onClick}
                        key={item.label}
                        icon={item.icon ? <item.icon size={14} /> : null}
                        rightSection={
                            item.kbd_shortcut ? (
                                <KeyboardShortcut keys={item.kbd_shortcut} />
                            ) : null
                        }
                    >
                        {item.label}
                    </Menu.Item>
                ))}
            </Menu.Dropdown>
        </Menu>
    );
}
