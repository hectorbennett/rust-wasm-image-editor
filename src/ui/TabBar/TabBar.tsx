import { Tabs } from "@mantine/core";
import { IconPhoto, IconSettings } from "@tabler/icons";
import { CloseButton } from "@mantine/core";
import { AppContext } from "../../context/app";

export function TabBar() {
  const app = AppContext.useContainer();
  if (!app.tabs.length) {
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
      value={app.activeTab.uid}
      onTabChange={app.focusTab}
    >
      <Tabs.List>
        <TabBarTabs />
      </Tabs.List>
    </Tabs>
  );
}

function TabBarTabs() {
  const app = AppContext.useContainer();

  //   const moveTab = useCallback((dragIndex: number, hoverIndex: number) => {
  //     console.log("moveTab");
  //     console.log(dragIndex);
  //     console.log(hoverIndex);
  //     app.setTabs((prevTabs) =>
  //       update(prevTabs, {
  //         $splice: [
  //           [dragIndex, 1],
  //           [hoverIndex, 0, prevTabs[dragIndex]],
  //         ],
  //       })
  //     );
  //   }, []);

  //   const renderTab = (tab: { id: string; type: string }, index: number) => {
  //     return (
  //       <TabBarTab
  //         key={tab.id}
  //         index={index}
  //         id={tab.id}
  //         type={tab.type}
  //         // moveTab={moveTab}
  //       />
  //     );
  //   };

  // const renderTab =
  // console.log("tabs");
  // console.log(app.tabs);

  return (
    <>
      {app.tabs.map((tab, i) => (
        <TabBarTab key={tab.uid} uid={tab.uid} type={tab.type} />
      ))}
    </>
  );
}

interface TabBarTabProps {
  uid: string;
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
  uid: string;
}

function SettingsTab(props: SettingsTabProps) {
  return (
    <Tabs.Tab
      value={props.uid}
      icon={<IconSettings size={14} />}
      rightSection={<TabCloseButton id={props.uid} />}
    >
      Settings
    </Tabs.Tab>
  );
}

interface ProjectTabProps {
  uid: string;
}

function ProjectTab(props: ProjectTabProps) {
  return (
    <Tabs.Tab
      value={props.uid}
      icon={<IconPhoto size={14} />}
      rightSection={<TabCloseButton id={props.uid} />}
    >
      Project {props.uid}
    </Tabs.Tab>
  );
}

function TabCloseButton(props: { id: string }) {
  const app = AppContext.useContainer();
  return (
    <CloseButton
      component="div"
      size={14}
      onClick={(e) => {
        e.stopPropagation();
        app.closeTab(props.id);
      }}
    />
  );
}
