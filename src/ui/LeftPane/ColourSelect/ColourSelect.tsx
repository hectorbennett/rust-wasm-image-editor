import { ColorPicker, Text, Stack } from "@mantine/core";
import { WasmContext } from "../../../context/wasm";

function parse_rgba_string_to_array(rgbaString: string) {
  const rgbaArray = rgbaString
    .replace("rgba(", "")
    .replace(")", "")
    .split(",")
    .map((c) => parseFloat(c));
  rgbaArray[3] = Math.floor(rgbaArray[3] * 255);
  return rgbaArray;
}

function parse_rgba_array_to_string(array: Array<number>) {
  return `rgba(${array[0]}, ${array[1]}, ${array[2]}, ${array[3] / 255})`;
}

interface ColourPickerProps {
  value: Array<number>;
  onChange: (colour: Array<number>) => void;
}

function ColourPicker(props: ColourPickerProps) {
  const valueString = parse_rgba_array_to_string(props.value);
  return (
    <Stack align="center">
      <ColorPicker
        sx={{ width: "100%" }}
        format="rgba"
        value={valueString}
        onChange={(stringValue) => props.onChange(parse_rgba_string_to_array(stringValue))}
      />
      <Text>{props.value}</Text>
    </Stack>
  );
}

export default function ColourSelect() {
  const wasm = WasmContext.useContainer();

  return (
    <div>
      <ColourPicker
        onChange={(colour) => {
          wasm.api?.set_primary_colour(colour[0], colour[1], colour[2], colour[3]);
        }}
        value={wasm.api?.state?.primary_colour || [0, 0, 0, 0]}
      />
    </div>
  );
}
