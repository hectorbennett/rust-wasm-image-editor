import { Box, NavLink } from "@mantine/core";
import { SettingsContext } from "src/context";

export function NavBar() {
  const settings = SettingsContext.useContainer();

  const items = settings.tabs.map((item, _index) => (
    <NavLink
      key={item.label}
      active={item.id === settings?.activeTab?.id}
      label={item.label}
      icon={item.icon ? <item.icon size={16} stroke={1.5} /> : null}
      onClick={() => settings.openSettingsTab(item.id)}
    />
  ));

  return <Box sx={{ width: 220 }}>{items}</Box>;
}
