import { useHotkeys } from "@mantine/hooks";
import Ui from "../ui/Ui";
import { AppContext } from "../context/app";
import { SettingsContext } from "../context/settings";
import { Settings } from "../settings";
import { CommandsContext } from "../context";
import Workspace from "../workspace/Workspace";

function Tabs() {
  const app = AppContext.useContainer();
  if (!app.activeTab) {
    return null;
  }
  if (app.activeTab.type === "project") {
    return <Workspace />;
  } else if (app.activeTab.type === "settings") {
    return <Settings />;
  }
  return null;
}

function HotkeyProvider(props) {
  const settings = SettingsContext.useContainer();
  const commands = CommandsContext.useContainer();
  const hotkeys = Object.entries(settings.keyboardShortcuts).map(
    ([command, shortcut]) => {
      return [shortcut.join("+"), () => commands.executeCommand(command)];
    }
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
