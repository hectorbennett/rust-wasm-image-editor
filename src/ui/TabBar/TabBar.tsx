import { Tabs } from "@mantine/core";
import { IconPhoto, IconSettings } from "@tabler/icons";
import { CloseButton } from "@mantine/core";
import { AppContext } from "../../context/app";
import { WasmContext } from "../../context/wasm";
import { TabsContext } from "../../context/tabs";

export function TabBar() {
  const tabs = TabsContext.useContainer();
  if (!tabs.tabs.length) {
    return null;
  }
  return (
    <Tabs
      styles={(theme) => ({
        tabsList: {
          flexWrap: "nowrap",
        },
        tab: {
          "&[data-active]": {
            backgroundColor: theme.colors.dark[5],
          },
        },
        tabLabel: {
          overflow: "hidden",
          textOverflow: "ellipsis",
          maxWidth: 100,
        },
      })}
      value={tabs.activeTab.uid.toString()}
      onTabChange={(uid) => tabs.focusTab(BigInt(uid || 0))}
    >
      <Tabs.List>
        <TabBarTabs />
      </Tabs.List>
    </Tabs>
  );
}

function TabBarTabs() {
  const tabs = TabsContext.useContainer();

  console.log("tabs");
  console.log(tabs);

  return (
    <>
      {tabs.tabs.map((tab, i) => (
        <TabBarTab key={tab.uid.toString()} uid={tab.uid} type={tab.type} />
      ))}
    </>
  );
}

interface TabBarTabProps {
  uid: bigint;
  type: string;
}

function TabBarTab(props: TabBarTabProps) {
  if (props.type === "settings") {
    return <SettingsTab uid={props.uid} />;
  } else if (props.type === "project") {
    return <ProjectTab uid={props.uid} />;
  }
  return null;
}

interface SettingsTabProps {
  uid: bigint;
}

function SettingsTab(props: SettingsTabProps) {
  return (
    <Tabs.Tab
      value={props.uid.toString()}
      icon={<IconSettings size={14} />}
      rightSection={<TabCloseButton uid={props.uid} />}
    >
      Settings
    </Tabs.Tab>
  );
}

interface ProjectTabProps {
  uid: bigint;
}

function ProjectTab(props: ProjectTabProps) {
  const wasm = WasmContext.useContainer();
  const project_name = wasm.state.projects.get(props.uid)?.name || "error";
  return (
    <Tabs.Tab
      value={props.uid.toString()}
      icon={<IconPhoto size={14} />}
      rightSection={<TabCloseButton uid={props.uid} />}
    >
      Project {project_name}
    </Tabs.Tab>
  );
}

function TabCloseButton(props: { uid: bigint }) {
  const tabs = TabsContext.useContainer();
  return (
    <CloseButton
      component="div"
      size={14}
      onClick={(e) => {
        e.stopPropagation();
        tabs.closeTab(props.uid);
      }}
    />
  );
}
