import { ActionIcon, Tooltip } from "@mantine/core";

import { ToolsContext } from "../../../context";
import { Tool } from "../../../context/tools";
import KeyboardShortcut from "src/components/KeyboardShortcut";

interface ToolButtonProps {
  tool: Tool;
}

export default function ToolButton(props: ToolButtonProps) {
  const tools = ToolsContext.useContainer();
  return (
    <Tooltip
      openDelay={200}
      label={
        <>
          {props.tool.label}{" "}
          {props.tool.kbd_shortcut && <KeyboardShortcut keys={props.tool.kbd_shortcut} />}
        </>
      }
    >
      <ActionIcon
        sx={{ flex: 1 }}
        variant={tools.activeTool.name === props.tool.name ? "filled" : "default"}
        onClick={() => tools.setActiveTool(props.tool)}
      >
        <props.tool.icon size={16} />
      </ActionIcon>
    </Tooltip>
  );
}
