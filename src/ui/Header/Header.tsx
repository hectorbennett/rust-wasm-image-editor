import { Box, createStyles } from "@mantine/core";
import { MenuBarItems } from "./MenuBarItems";

const useStyles = createStyles((_theme, _params, _getRef) => ({
  header: {
    display: "flex",
    alignItems: "center",
    height: "100%",
  },
}));

export default function Header() {
  const { classes } = useStyles();
  return (
    <Box className={classes.header} mx="sm">
      <MenuBarItems />
    </Box>
  );
}
