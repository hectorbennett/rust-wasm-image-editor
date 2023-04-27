import { Box, Tabs, Title } from "@mantine/core";
import Layers from "./Layers";
import History from "src/components/History";
import { ActiveProjectContext, WasmContext } from "src/context";
import { IconMessageCircle, IconPhoto, IconSettings } from "@tabler/icons-react";
import PaneTitle from "src/components/PaneTitle";
import PaneSection from "src/components/PaneSection";

function RightPaneHistory() {
  const active_project = ActiveProjectContext.useContainer();

  const history = active_project.activeProject?.history.history;
  if (!history) {
    return <div>No history yet</div>;
  }
  const revision = active_project.activeProject?.history.revision;

  return (
    <PaneSection title="History">
      <History history={history} revision={revision} />
    </PaneSection>
  );
}

export default function RightPane() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <Layers />
      <RightPaneHistory />
      {/* <Tabs radius="xs" defaultValue="layers" sx={{ height: "100%" }}>
        <Tabs.List>
          <Tabs.Tab value="layers" icon={<IconPhoto size="0.8rem" />} />
          <Tabs.Tab value="history" icon={<IconSettings size="0.8rem" />} />
          <Tabs.Tab value="dunno" icon={<IconMessageCircle size="0.8rem" />} />
        </Tabs.List>

        <Tabs.Panel value="layers">
          <Layers />
        </Tabs.Panel>

        <Tabs.Panel value="history">
          <RightPaneHistory />
        </Tabs.Panel>

        <Tabs.Panel value="dunno">something else</Tabs.Panel>
      </Tabs> */}
    </Box>
  );
}
