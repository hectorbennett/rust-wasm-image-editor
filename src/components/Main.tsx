import { ReactNode } from "react";
import { HotkeyItem, useHotkeys } from "@mantine/hooks";
import { AppContext, CommandsContext, SettingsContext, TabsContext } from "../context";
import Ui from "../ui/Ui";
import Workspace from "../ui/Workspace";
import Dropzone from "./Dropzone";
import { Settings } from "../ui/settings";

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
  const app = AppContext.useContainer();
  return (
    <>
      <HotkeyProvider>
        <Ui>
          <Tabs />
        </Ui>
      </HotkeyProvider>
      <Dropzone onDropImages={app.file.import_files_as_images_as_layers} />
    </>
  );
}