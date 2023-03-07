import ToolButton from "./ToolButton";

import { ToolsContext } from "../../../context";

import { createStyles } from "@mantine/core";

const useStyles = createStyles((_theme, _params, _getRef) => ({
  tools: {
    display: "flex",
    flexWrap: "wrap",
    gap: 4,
    // margin: 4,
    justifyContent: "space-between",
  },
}));

export default function Tools() {
  const tools = ToolsContext.useContainer();
  const { classes } = useStyles();
  return (
    <div className={classes.tools}>
      {tools.tools.map((tool, index) => (
        <ToolButton tool={tool} key={index} />
      ))}
    </div>
  );
}
