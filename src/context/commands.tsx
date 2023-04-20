import { useSpotlight } from "@mantine/spotlight";
import { openContextModal } from "@mantine/modals";
import {
  IconArrowBackUp,
  IconArrowForwardUp,
  IconCopy,
  IconCut,
  IconDeviceFloppy,
  IconFile,
  // IconFileOff,
  // IconLogout,
  TablerIconProps,
} from "@tabler/icons";
import { FunctionComponent, useEffect } from "react";
import { createContainer } from "unstated-next";
import type { SpotlightAction } from "@mantine/spotlight";
import { IconSettings } from "@tabler/icons";
import { KeyboardShortcutName, SettingsContext } from "./settings";
import { AppContext } from "./app";
import { LayersContext } from "./layers";
import { WasmContext } from "./wasm";
import { ActiveProjectContext } from "./activeProject";

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
  icon?: FunctionComponent<TablerIconProps>;
  disabled?: boolean;
}

function useCommands() {
  const settings = SettingsContext.useContainer();
  const wasm = WasmContext.useContainer();
  const app = AppContext.useContainer();
  const layers = LayersContext.useContainer();
  const active_project = ActiveProjectContext.useContainer();
  const spotlight = useSpotlight();

  console.log(active_project);

  const commands: Array<Command> = [
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
    },
    {
      category: "file",
      id: "file.open",
      label: "Open",
      action: app.file.open,
    },
    {
      category: "file",
      id: "file.save",
      label: "Save",
      icon: IconDeviceFloppy,
      action: app.file.save,
    },
    {
      category: "file",
      id: "file.export",
      label: "Export",
      action: app.file.export_png,
    },
    {
      category: "file",
      id: "file.import_image",
      label: "Import image",
      action: app.file.import_image_as_layer,
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
      action: () => app.edit.cut(),
    },
    {
      category: "edit",
      id: "edit.copy",
      label: "Copy",
      icon: IconCopy,
      action: () => app.edit.copy(),
    },
    {
      category: "edit",
      id: "edit.paste",
      label: "Paste",
      //   icon: IconP
      action: () => app.edit.paste(),
    },
    /* view */
    /* select */
    {
      category: "select",
      id: "select.all",
      label: "Select all",
      action: () => wasm.api?.select_all(),
    },
    {
      category: "select",
      id: "select.none",
      label: "Select none",
      action: () => wasm.api?.select_none(),
    },
    {
      category: "select",
      id: "select.inverse",
      label: "Select inverse",
      action: () => wasm.api?.select_inverse(),
    },
    /* tools */
    {
      category: "tools",
      id: "tools.rectangular_marquee",
      label: "Rectangular marquee",
      action: () => console.warn("not implemented"),
    },
    {
      category: "tools",
      id: "tools.elliptical_marquee",
      label: "Elliptical marquee",
      action: () => console.warn("not implemented"),
    },
    {
      category: "tools",
      id: "tools.eyedrop",
      label: "Eyedrop",
      action: () => console.warn("not implemented"),
    },
    {
      category: "tools",
      id: "tools.paintbrush",
      label: "Paintbrush",
      action: () => console.warn("not implemented"),
    },
    {
      category: "tools",
      id: "tools.eraser",
      label: "Eraser",
      action: () => console.warn("not implemented"),
    },
    {
      category: "tools",
      id: "tools.paint_bucket",
      label: "Paint Bucket",
      action: () => console.warn("not implemented"),
    },
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
    },
  ];

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
  }, []);

  const executeCommand = (command_id: string) => {
    const command = commands.find((c) => c.id === command_id);
    if (command) {
      command.action();
    }
  };

  return {
    commands,
    executeCommand,
  };
}

export const CommandsContext = createContainer(useCommands);
