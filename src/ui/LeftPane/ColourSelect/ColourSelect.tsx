// import { ColorPicker, Text, Stack } from "@mantine/core";
// import { WasmContext } from "../../../context/wasm";

import { Box } from "@mantine/core";
import ColourPicker from "src/components/ColourPicker";
import PaneSection from "src/components/PaneSection";

export default function ColourSelect() {
  // const wasm = WasmContext.useContainer();

  return (
    <PaneSection title="Colour">
      <Box m="xs">
        <ColourPicker />
      </Box>
    </PaneSection>
  );
}
