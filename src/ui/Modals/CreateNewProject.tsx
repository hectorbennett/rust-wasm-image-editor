import { useState } from "react";
import { Button, NumberInput } from "@mantine/core";

import { ContextModalProps } from "@mantine/modals";
import { AppContext } from "../../context/app";

export default function CreateNewProject({ context, id }: ContextModalProps) {
  const app = AppContext.useContainer();
  const [width, setWidth] = useState(500);
  const [height, setHeight] = useState(500);
  return (
    <>
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
          context.closeModal(id);
          app.file.new();
        }}
      >
        New project
      </Button>
    </>
  );
}
