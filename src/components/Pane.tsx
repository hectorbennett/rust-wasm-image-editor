import { Box } from "@mantine/core";
import type { ReactNode } from "react";

export default function Pane({ children }: { children: ReactNode }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      {children}
    </Box>
  );
}
