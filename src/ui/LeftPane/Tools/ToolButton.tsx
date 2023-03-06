import { ActionIcon } from "@mantine/core";

import { ToolsContext } from "../../../context";
import { Tool } from "../../../context/tools";

interface ToolButtonProps {
  tool: Tool;
}

export default function ToolButton(props: ToolButtonProps) {
    const tools = ToolsContext.useContainer();
    return (
        <ActionIcon
            sx={{ flex: 1 }}
            variant={tools.activeTool.name === props.tool.name ? "filled" : "default"}
            onClick={() => tools.setActiveTool(props.tool)}
        >
            <props.tool.icon size={16} />
        </ActionIcon>
    );
}
