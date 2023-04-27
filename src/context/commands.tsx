import { useSpotlight } from "@mantine/spotlight";
import { openContextModal } from "@mantine/modals";
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconClipboardCopy,
  IconCopy,
  IconCut,
  IconDeviceFloppy,
  IconFile,
  IconFileArrowRight,
  IconFolders,
  IconFoldersOff,
  IconPhotoCog,
  // IconFileOff,
  // IconLogout,
  TablerIconsProps,
} from "@tabler/icons-react";
import { FunctionComponent, useCallback, useEffect, useMemo } from "react";
import { createContainer } from "unstated-next";
import type { SpotlightAction } from "@mantine/spotlight";
import { IconSettings } from "@tabler/icons-react";
import { KeyboardShortcutName, SettingsContext } from "./settings";
import { AppContext } from "./app";
import { LayersContext } from "./layers";
import { WasmContext } from "./wasm";
import { ActiveProjectContext } from "./activeProject";
import { useHotkeys } from "@mantine/hooks";
import { ToolsContext } from "./tools";

export type CommandCategory =
  | "app"
  | "file"
  | "edit"
  | "view"
  | "select"
  | "tools"
  | "filters"
  | "image"
  | "layer";

interface Command {
  category: CommandCategory;
  id: string;
  label: string;
  action: () => void; // todo: make manditory
  icon?: FunctionComponent<TablerIconsProps>;
  disabled?: boolean;
  kbd_shortcut?: string;
}

function useCommands() {
  const settings = SettingsContext.useContainer();
  const wasm = WasmContext.useContainer();
  const app = AppContext.useContainer();
  const layers = LayersContext.useContainer();
  const active_project = ActiveProjectContext.useContainer();
  const tools = ToolsContext.useContainer();
  const spotlight = useSpotlight();

  const commands: Array<Command> = useMemo(
    () => [
      /* app */
      {
        category: "app",
        id: "app.settings",
        label: "Settings",
        icon: IconSettings,
        action: () => settings.open(),
      },
      {
        category: "app",
        id: "app.command_palette",
        label: "Command palette",
        action: spotlight.openSpotlight,
      },
      // {
      //   category: "app",
      //   id: "app.exit",
      //   label: "Exit",
      //   icon: IconLogout,
      //   action: () => app.exit(),
      // },
      /* file */
      {
        category: "file",
        id: "file.new",
        label: "New",
        icon: IconFile,
        action: () => wasm.api?.create_project(),
        kbd_shortcut: "ctrl+N",
      },
      {
        category: "file",
        id: "file.open",
        label: "Open",
        action: app.file.open,
        kbd_shortcut: "ctrl+O",
        icon: IconFolders,
      },
      {
        category: "file",
        id: "file.save",
        label: "Save",
        icon: IconDeviceFloppy,
        action: app.file.save,
        kbd_shortcut: "ctrl+S",
      },
      {
        category: "file",
        id: "file.export",
        label: "Export",
        action: app.file.export_png,
        icon: IconFileArrowRight,
      },
      {
        category: "file",
        id: "file.import_image",
        label: "Import image",
        action: app.file.import_image_as_layer,
        icon: IconPhotoCog,
      },
      // {
      //   category: "file",
      //   id: "file.close",
      //   label: "Close",
      //   icon: IconFileOff,
      //   action: () => app.file.close(),
      // },
      /* edit */
      {
        category: "edit",
        id: "edit.undo",
        icon: IconArrowBackUp,
        action: () => app.edit.undo(),
        kbd_shortcut: "ctrl+Z",
        label: (() => {
          /* get undo label */
          if (!active_project.activeProject) {
            return "Undo";
          }
          const revision = active_project.activeProject.history.revision - 1;
          if (revision < 0) {
            return "Undo";
          }
          const command_name = active_project.activeProject?.history.history[revision].name;
          return `Undo ${command_name}`;
        })(),
        disabled: (() => {
          /* get undo label */
          if (!active_project.activeProject) {
            return true;
          }
          const revision = active_project.activeProject.history.revision - 1;
          if (revision < 0) {
            return true;
          }
          return false;
        })(),
      },
      {
        category: "edit",
        id: "edit.redo",
        icon: IconArrowForwardUp,
        action: () => app.edit.redo(),
        kbd_shortcut: "ctrl+shift+Z",
        label: (() => {
          /* get redo label */
          if (!active_project.activeProject) {
            return "Redo";
          }
          const revision = active_project.activeProject.history.revision + 1;
          if (revision > active_project.activeProject?.history.history.length) {
            return "Redo";
          }
          const command_name = active_project.activeProject?.history.history[revision - 1].name;
          return `Redo ${command_name}`;
        })(),
        disabled: (() => {
          /* disable the redo button if there's no available commands to redo */
          if (!active_project.activeProject) {
            return true;
          }
          const revision = active_project.activeProject.history.revision + 1;
          if (revision > active_project.activeProject?.history.history.length) {
            return true;
          }
          return false;
        })(),
      },
      {
        category: "edit",
        id: "edit.cut",
        label: "Cut",
        icon: IconCut,
        kbd_shortcut: "ctrl+X",
        action: () => app.edit.cut(),
      },
      {
        category: "edit",
        id: "edit.copy",
        label: "Copy",
        icon: IconCopy,
        kbd_shortcut: "ctrl+C",
        action: () => app.edit.copy(),
      },
      {
        category: "edit",
        id: "edit.paste",
        label: "Paste",
        icon: IconClipboardCopy,
        kbd_shortcut: "ctrl+V",
        action: () => app.edit.paste(),
      },
      /* view */
      /* select */
      {
        category: "select",
        id: "select.all",
        label: "Select all",
        action: () => wasm.api?.select_all(),
        kbd_shortcut: "cmd+A",
      },
      {
        category: "select",
        id: "select.none",
        label: "Select none",
        action: () => wasm.api?.select_none(),
        kbd_shortcut: "cmd+D",
      },
      {
        category: "select",
        id: "select.inverse",
        label: "Select inverse",
        action: () => wasm.api?.select_inverse(),
        kbd_shortcut: "shift+cmd+I",
      },
      /* tools */
      ...tools.tools.map((tool) => ({
        category: "tools",
        id: `tools.${tool.name}`,
        label: tool.label,
        icon: tool.icon,
        action: () => tools.setActiveTool(tool),
        kbd_shortcut: tool.kbd_shortcut,
      })),
      /* filters */
      // {
      //   category: "filters",
      //   id: "filters.noise",
      //   label: "Noise",
      //   action: () => app.filters.generateNoise(),
      // },
      {
        category: "filters",
        id: "filters.checkerboard",
        label: "Checkerboard",
        action: () => wasm.api?.generate_checkerboard(),
      },

      /* image */
      {
        category: "image",
        id: "image.resize_canvas",
        label: "Resize Canvas",
        action: () =>
          openContextModal({
            modal: "image.resize_canvas",
            innerProps: {},
          }),
      },
      /* layer */
      {
        category: "layer",
        id: "layer.new",
        label: "New layer",
        action: () => layers.createNewLayer(),
        kbd_shortcut: "shift+cmd+N",
      },
    ],
    [
      active_project.activeProject,
      app.edit,
      app.file.export_png,
      app.file.import_image_as_layer,
      app.file.open,
      app.file.save,
      layers,
      settings,
      spotlight.openSpotlight,
      tools,
      wasm.api,
    ],
  );

  useHotkeys(
    commands
      .filter((command) => command.kbd_shortcut && command.action)
      .map((command) => [command.kbd_shortcut, command.action]),
  );

  const executeCommand = useCallback(
    (command_id: string) => {
      const command = commands.find((c) => c.id === command_id);
      if (command) {
        command.action();
      }
    },
    [commands],
  );

  /* register commands to the spotlight */
  useEffect(() => {
    const actions: Array<SpotlightAction> = commands.map((command) => ({
      id: command.id,
      title: command.label,
      category: command.category,
      description: "",
      onTrigger: () => {
        executeCommand(command.id);
      },
      icon: command.icon ? <command.icon size={18} /> : null,
      keyboard_shortcut:
        command.id in settings.keyboardShortcuts
          ? settings.keyboardShortcuts[command.id as KeyboardShortcutName]
          : null,
    }));
    spotlight.registerActions(actions);
  }, [commands, executeCommand, settings.keyboardShortcuts, spotlight]);

  return {
    commands,
    executeCommand,
  };
}

export const CommandsContext = createContainer(useCommands);
