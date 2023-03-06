import {
  createStyles,
  UnstyledButton,
  Group,
  Text,
  Image,
  Center,
  Badge,
  Box,
  Flex,
} from "@mantine/core";
import { SpotlightProvider, SpotlightAction, SpotlightActionProps } from "@mantine/spotlight";
import { ReactEventHandler } from "react";
import { CommandCategory } from "../context/commands";
import { CommandTypeBadge } from "./CommandTypeBadge";
import KeyboardShortcut from "./KeyboardShortcut";

const useStyles = createStyles((theme, _params, getRef) => ({
  action: {
    position: "relative",
    display: "flex",
    width: "100%",
    padding: "10px 12px",
    borderRadius: theme.radius.sm,
  },

  category: {
    width: 90,
    textAlign: "center",
  },

  actionInner: {
    display: "flex",
    flex: 1,
    alignItems: "center",
  },

  icon: {
    display: "flex",
    width: 35,
    // flex: 1,
  },

  keyboardShortcuts: {
    // display: "flex",
    width: 100,
    // width: 100,
    textAlign: "right",
    // flex: 1,
  },

  actionHovered: {
    backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[1],
  },

  actionBody: {
    flex: 1,
  },
}));

export function CustomSpotlightAction({
  action,
  styles,
  classNames,
  hovered,
  onTrigger,
  ...others
}: SpotlightActionProps) {
  // const { classes, cx } = useStyles({ styles, classNames, name: 'Spotlight' });
  const { classes, cx } = useStyles();

  return (
    <UnstyledButton
      className={cx(classes.action, { [classes.actionHovered]: hovered })}
      tabIndex={-1}
      onMouseDown={(event: any) => event.preventDefault()}
      onClick={onTrigger}
      {...others}
    >
      <Box className={classes.actionInner}>
        <Box className={classes.icon}>{action.icon}</Box>

        <Box className={classes.actionBody}>
          <Text>{action.title}</Text>

          {action.description && (
            <Text color="dimmed" size="xs">
              {action.description}
            </Text>
          )}
        </Box>

        <Box className={classes.category} ml="xl">
          {action.category && <CommandTypeBadge category={action.category as CommandCategory} />}
        </Box>

        <Box className={classes.keyboardShortcuts}>
          {action.keyboard_shortcut && <KeyboardShortcut keys={action.keyboard_shortcut} />}
        </Box>
      </Box>
    </UnstyledButton>
  );
}

// function Demo() {
//   return (
//     <SpotlightProvider
//       actions={actions}
//       actionComponent={CustomAction}
//       searchPlaceholder="Search..."
//       shortcut="mod + shift + I"
//     >
//       <App />
//     </SpotlightProvider>
//   );
// }
