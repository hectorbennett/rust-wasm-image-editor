import { useState, useRef, useEffect } from "react";
import { NumberInput, Group, ActionIcon, NumberInputHandlers } from "@mantine/core";
import { AppContext } from "../../context/app";

function Zoom() {
  const app = AppContext.useContainer();
  const [value, setValue] = useState<number>(100);
  const handlers = useRef<NumberInputHandlers>();

  useEffect(() => {
    if (value !== app.zoom) {
      app.setZoom(value);
    }
  }, [value]);

  useEffect(() => {
    if (value != app.zoom) {
      setValue(app.zoom);
    }
  }, [app.zoom]);

  return (
    <Group spacing={5}>
      <ActionIcon size={30} variant="default" onClick={() => handlers.current?.decrement()}>
        –
      </ActionIcon>

      <NumberInput
        hideControls
        value={value}
        onChange={(val) => setValue(val || 100)}
        handlersRef={handlers}
        max={1000}
        min={10}
        step={10}
        styles={{ input: { width: "3rem", textAlign: "center" } }}
        size="xs"
      />

      <ActionIcon size={30} variant="default" onClick={() => handlers.current?.increment()}>
        +
      </ActionIcon>
    </Group>
  );
}

export default function Footer() {
  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "end" }}>
      <Zoom />
    </div>
  );
}
