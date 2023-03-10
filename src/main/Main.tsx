import { HotkeyItem, useHotkeys } from "@mantine/hooks";
import Ui from "../ui/Ui";
import { SettingsContext } from "../context/settings";
import { Settings } from "../settings";
import { CommandsContext } from "../context";
import Workspace from "../workspace/Workspace";
import { TabsContext } from "../context/tabs";
import { ReactNode } from "react";

function Tabs() {
  const tabs = TabsContext.useContainer();
  if (!tabs.activeTab) {
    return null;
  }
  if (tabs.activeTab.type === "project") {
    return <Workspace />;
  } else if (tabs.activeTab.type === "settings") {
    return <Settings />;
  }
  return null;
}

function HotkeyProvider(props: { children: ReactNode }) {
  const settings = SettingsContext.useContainer();
  const commands = CommandsContext.useContainer();
  const hotkeys: HotkeyItem[] = Object.entries(settings.keyboardShortcuts).map(
    ([command, shortcut]) => {
      return [shortcut.join("+"), () => commands.executeCommand(command)];
    },
  );
  useHotkeys(hotkeys);
  return <div>{props.children}</div>;
}

export default function Main() {
  return (
    <HotkeyProvider>
      <Ui>
        <Tabs />
      </Ui>
    </HotkeyProvider>
  );
}
