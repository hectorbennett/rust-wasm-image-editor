import { useState } from "react";
import { Text, Button, NumberInput } from "@mantine/core";

import { ContextModalProps } from "@mantine/modals";

import { ActiveProjectContext } from "../../context/activeProject";

export default function ResizeCanvas({
  context,
  id,
  innerProps,
}: ContextModalProps) {
  const project = ActiveProjectContext.useContainer();
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  return (
    <>
      <Text size="sm">Resize Canvas</Text>
      <NumberInput
        placeholder="width"
        data-autofocus
        value={width}
        onChange={(w) => setWidth(w || 0)}
        rightSection="px"
      />
      <NumberInput
        placeholder="height"
        value={height}
        onChange={(h) => setHeight(h || 0)}
        rightSection="px"
      />
      <Button
        fullWidth
        mt="md"
        onClick={() => {
          project.resizeCanvas(width, height);
          context.closeModal(id);
        }}
      >
        Resize
      </Button>
    </>
  );
}
