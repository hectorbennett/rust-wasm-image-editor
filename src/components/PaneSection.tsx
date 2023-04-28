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
      <Box>{children}</Box>
      <Divider />
    </Box>
  );
}
