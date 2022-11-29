import { ReactNode } from "react";
import { Box, Title } from "@mantine/core";
import { NavBar } from "./NavBar";

import { SettingsContext } from "../context/settings";
import { KeyboardShortcutsTab } from "./tabs/KeyboardShortcuts";
import { UserInterfaceTab } from "./tabs/UserInterface";

const SETTINGS = {
  keyboard_shortcuts: KeyboardShortcutsTab,
  user_interface: UserInterfaceTab,
};

interface SettingsTabProps {
  title: string;
  children: ReactNode;
}

function SettingsTab(props: SettingsTabProps) {
  return (
    <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
      <Box mb="xl">
        <Title order={2}>{props.title}</Title>
      </Box>
      <Box sx={{ overflow: "scroll" }}>{props.children}</Box>
    </Box>
  );
}

// TODO: place in a dict type structure
function SettingsInner() {
  const settings = SettingsContext.useContainer();
  const Comp = SETTINGS[settings.activeTab.id];
  return (
    <SettingsTab title={settings.activeTab.label}>
      <Comp />
    </SettingsTab>
  );
}

export function Settings() {
  return (
    <Box p="xl" sx={(theme) => ({ display: "flex", height: "100%" })}>
      <NavBar />
      <Box ml="xl" sx={{ flex: 1, display: "flex" }}>
        <SettingsInner />
      </Box>
    </Box>
  );
}
