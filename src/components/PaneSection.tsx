import { Box, Divider } from "@mantine/core";
import PaneTitle from "./PaneTitle";
import type { ReactNode } from "react";

interface PaneSectionProps {
  title: string;
  titleRightSection?: ReactNode;
  children: ReactNode;
}

export default function PaneSection({ title, titleRightSection, children }: PaneSectionProps) {
  return (
    <Box>
      <PaneTitle label={title} rightSection={titleRightSection} />
      <Box sx={{ maxHeight: "12rem", overflow: "auto" }}>{children}</Box>
      <Divider />
    </Box>
  );
}
