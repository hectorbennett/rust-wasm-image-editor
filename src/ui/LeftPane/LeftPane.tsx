import { Divider } from "@mantine/core";
import Tools from "./Tools";
import ColourSelect from "./ColourSelect";
import Pane from "src/components/Pane";

export default function LeftPane() {
  return (
    <Pane>
      <Tools />
      <ColourSelect />
    </Pane>
  );
}
