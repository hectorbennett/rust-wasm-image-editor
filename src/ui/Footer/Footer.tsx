import { useRef } from "react";
import { NumberInput, Group, ActionIcon, NumberInputHandlers } from "@mantine/core";
import { AppContext } from "../../context/app";
import { WasmContext } from "../../context/wasm";

function Zoom() {
  const app = AppContext.useContainer();
  const handlers = useRef<NumberInputHandlers>();

  return (
    <Group spacing={5}>
      <ActionIcon size={30} variant="default" onClick={() => handlers.current?.decrement()}>
        –
      </ActionIcon>

      <NumberInput
        hideControls
        value={app.zoom}
        onChange={(value) => app.setZoom(value || 100)}
        handlersRef={handlers}
        max={1000}
        min={10}
        step={10}
        styles={{ input: { width: "4rem", textAlign: "center" } }}
        size="xs"
        rightSection="%"
      />

      <ActionIcon size={30} variant="default" onClick={() => handlers.current?.increment()}>
        +
      </ActionIcon>
    </Group>
  );
}

function Position() {
  const wasm = WasmContext.useContainer();
  return (
    <Group spacing={5}>
      <NumberInput
        value={wasm.state?.workspace.x}
        onChange={(value) =>
          wasm.api?.set_workspace_position(value || 0, wasm.state?.workspace.y || 0)
        }
        styles={{ input: { width: "4rem", textAlign: "center" } }}
        size="xs"
        rightSection="x"
      />
      <NumberInput
        value={wasm.state?.workspace.y}
        onChange={(value) =>
          wasm.api?.set_workspace_position(wasm.state?.workspace.x || 0, value || 0)
        }
        styles={{ input: { width: "4rem", textAlign: "center" } }}
        size="xs"
        rightSection="y"
      />
    </Group>
  );
}

export default function Footer() {
  return (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "end" }}>
      <Position />
      <Zoom />
    </div>
  );
}
