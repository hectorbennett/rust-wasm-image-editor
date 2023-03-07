import { FunctionComponent, useState } from "react";
import { createContainer } from "unstated-next";
import { IconGauge, IconKeyboard, TablerIconProps } from "@tabler/icons";

export interface KeyboardShortcuts {
  "app.settings": Array<string>;
  "app.exit": Array<string>;
  "app.command_palette": Array<string>;
  "file.new": Array<string>;
  "file.open": Array<string>;
  "file.close": Array<string>;
  "file.save": Array<string>;
  "file.export": Array<string>;
  "edit.undo": Array<string>;
  "edit.redo": Array<string>;
  "edit.cut": Array<string>;
  "edit.copy": Array<string>;
  "edit.paste": Array<string>;
  "select.all": Array<string>;
  "select.none": Array<string>;
}

export interface Settings {
  keyboard_shortcuts: KeyboardShortcuts;
}
export type KeyboardShortcutName = keyof KeyboardShortcuts;

const DEFAULT_SETTINGS: Settings = {
  keyboard_shortcuts: {
    "app.settings": [],
    "app.exit": [],
    "app.command_palette": ["CTRL", "P"],
    "file.new": ["CTRL", "N"],
    "file.open": ["CTRL", "O"],
    "file.close": ["CTRL", "F4"],
    "file.save": ["CTRL", "S"],
    "file.export": ["CTRL", "E"],
    "edit.undo": ["CTRL", "Z"],
    "edit.redo": ["CTRL", "Y"],
    "edit.cut": ["CTRL", "X"],
    "edit.copy": ["CTRL", "C"],
    "edit.paste": ["CTRL", "V"],
    "select.all": ["CTRL", "A"],
    "select.none": ["CTRL", "SHIFT", "A"],
  },
};

type TabId = "user_interface" | "keyboard_shortcuts";

interface SettingsTab {
  id: TabId;
  icon: FunctionComponent<TablerIconProps>;
  label: string;
}

function useSettings() {
  const [settings, _setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const tabs: Array<SettingsTab> = [
    {
      id: "user_interface",
      icon: IconGauge,
      label: "User interface",
    },
    {
      id: "keyboard_shortcuts",
      icon: IconKeyboard,
      label: "Keyboard shortcuts",
    },
  ];

  //   useEffect(() => {}, [settings.keyboard_shortcuts]);

  const [activeTabId, setActiveTabId] = useState<string>("user_interface");

  const activeTab: SettingsTab = tabs.find((tab) => tab.id === activeTabId) || tabs[0];

  const openSettingsTab = (tabId: TabId) => {
    setActiveTabId(tabId);
  };

  return {
    tabs,
    activeTab,
    openSettingsTab,
    keyboardShortcuts: settings.keyboard_shortcuts,
  };
}

export const SettingsContext = createContainer(useSettings);
