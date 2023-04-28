import { ColorPicker as MantineColourPicker } from "@mantine/core";
import { useEffect, useMemo, useState } from "react";

function parse_rgba_string_to_array(rgbaString: string) {
  const rgbaArray = rgbaString
    .replace("rgba(", "")
    .replace(")", "")
    .split(",")
    .map((c) => parseFloat(c));
  rgbaArray[3] = Math.floor(rgbaArray[3] * 255);
  return rgbaArray;
}

const to_2_dp = (num: number) => Math.round(num * 100) / 100;

function parse_rgba_array_to_string(array: Array<number>) {
  return `rgba(${array[0]}, ${array[1]}, ${array[2]}, ${to_2_dp(array[3] / 255)})`;
}

interface ColourPickerProps {
  value: Array<number>;
  onChange: (colour: Array<number>) => void;
}

export default function ColourPicker({ value, onChange }: ColourPickerProps) {
  const [tempValue, setTempValue] = useState("rgba(0, 0, 0, 0)");

  const permValue = useMemo(() => parse_rgba_array_to_string(value), [value]);

  useEffect(() => {
    setTempValue(permValue);
  }, [permValue]);

  return (
    <MantineColourPicker
      sx={{ width: "100%" }}
      format="rgba"
      value={tempValue}
      onChange={setTempValue}
      onChangeEnd={(value) => {
        setTempValue(value);
        onChange(parse_rgba_string_to_array(value));
      }}
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
    />
  );
}
