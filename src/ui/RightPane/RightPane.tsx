import { Box, Tabs, Title } from "@mantine/core";
import Layers from "./Layers";
import History from "src/components/History";
import { ActiveProjectContext, WasmContext } from "src/context";
import { IconMessageCircle, IconPhoto, IconSettings } from "@tabler/icons-react";
import PaneTitle from "src/components/PaneTitle";
import PaneSection from "src/components/PaneSection";
import Pane from "src/components/Pane";

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
    <Pane>
      <Layers />
      <RightPaneHistory />
    </Pane>
  );
}
