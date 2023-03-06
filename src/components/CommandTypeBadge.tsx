import { Badge } from "@mantine/core";
import { CommandCategory } from "../context/commands";

const COMMAND_COLOURS = {
  app: "blue",
  file: "cyan",
  edit: "teal",
  view: "lime",
  select: "yellow",
  tools: "orange",
  filters: "teal",
  image: "red",
  layer: "pink",
};

interface CommandTypeProps {
  category: CommandCategory;
}

export function CommandTypeBadge(props: CommandTypeProps) {
  return <Badge color={COMMAND_COLOURS[props.category]}>{props.category}</Badge>;
}
