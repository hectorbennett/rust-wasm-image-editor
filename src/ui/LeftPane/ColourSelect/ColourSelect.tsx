import { ColorPicker, Text, Stack } from "@mantine/core";
import { AppContext } from "../../../context/app";

// import { ProjectContext } from "../../../context";

function parse_rgba_string_to_array(rgbaString: string) {
  let rgbaArray = rgbaString
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
        onChange={(stringValue) =>
          props.onChange(parse_rgba_string_to_array(stringValue))
        }
      />
      <Text>{props.value}</Text>
    </Stack>
  );
}

export default function ColourSelect() {
  const app = AppContext.useContainer();
  return (
    <div>
      <ColourPicker onChange={app.setActiveColour} value={app.activeColour} />
    </div>
  );
}
