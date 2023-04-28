import { ColorPicker as MantineColourPicker, Text, Stack } from "@mantine/core";
import { useEffect, useState } from "react";

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

// interface ColourPickerProps {
//   value: Array<number>;
//   onChange: (colour: Array<number>) => void;
// }

export default function ColourPicker({}: {}) {
  //   const valueString = parse_rgba_array_to_string(props.value);
  const [tempValue, setTempValue] = useState("rgba(0, 0, 0, 0)");

  return (
    <MantineColourPicker
      sx={{ width: "100%" }}
      format="rgba"
      // value={valueString}
      // onChange={(stringValue) => props.onChange(parse_rgba_string_to_array(stringValue))}
      value={tempValue}
      onChange={setTempValue}
      swatches={[
        "#25262b",
        "#868e96",
        "#fa5252",
        "#e64980",
        "#be4bdb",
        "#7950f2",
        "#4c6ef5",
        "#228be6",
        "#15aabf",
        "#12b886",
        "#40c057",
        "#82c91e",
        "#fab005",
        "#fd7e14",
      ]}
      onChangeEnd={() => {
        console.log("mouseUp");
      }}
    />
  );
}
