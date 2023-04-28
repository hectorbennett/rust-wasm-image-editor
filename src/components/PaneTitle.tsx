import { Title, Box } from "@mantine/core";
import type { ReactNode } from "react";

interface PaneTitleProps {
  label: string;
  rightSection?: ReactNode;
}

export default function PaneTitle({ label, rightSection }: PaneTitleProps) {
  return (
    <Box
      mx="xs"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        height: "3rem",
        alignItems: "center",
      }}
    >
      <Title order={6}>{label}</Title>
      {rightSection}
    </Box>
  );
}
