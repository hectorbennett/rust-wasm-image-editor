import ToolButton from "./ToolButton";

import { ToolsContext } from "src/context";

import { Flex } from "@mantine/core";
import PaneSection from "src/components/PaneSection";

export default function Tools() {
  const tools = ToolsContext.useContainer();
  return (
    <PaneSection title="Tools">
      <Flex m="xs" gap="0.2rem" justify="flex-start" align="flex-start" direction="row" wrap="wrap">
        {tools.tools.map((tool, index) => (
          <ToolButton tool={tool} key={index} />
        ))}
      </Flex>
    </PaneSection>
  );
}
