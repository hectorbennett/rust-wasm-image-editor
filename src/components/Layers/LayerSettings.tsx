import { Select, Box } from "@mantine/core";
import { capitalizeFirstLetter } from "src/utils";

export default function LayerSettings() {
  const values = ["normal", "dissolve", "darken", "multiply", "color burn", "linear burn"];
  return (
    <Box m="sm">
      <Select
        size="xs"
        value={values[0]}
        data={values.map((v) => ({ value: v, label: capitalizeFirstLetter(v) }))}
      />
    </Box>
  );
}
