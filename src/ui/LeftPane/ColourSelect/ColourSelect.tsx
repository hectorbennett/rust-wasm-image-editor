import { Box } from "@mantine/core";
import ColourPicker from "src/components/ColourPicker";
import PaneSection from "src/components/PaneSection";
import { WasmContext } from "src/context";

export default function ColourSelect() {
  const wasm = WasmContext.useContainer();

  return (
    <PaneSection title="Colour">
      <Box m="xs">
        <ColourPicker
          value={wasm.state.primary_colour}
          onChange={(colour) => {
            wasm.api.set_primary_colour(...colour);
          }}
        />
      </Box>
    </PaneSection>
  );
}
