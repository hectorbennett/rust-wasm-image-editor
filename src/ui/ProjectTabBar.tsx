import { Tabs } from "@mantine/core";

export default function ProjectTabBar() {
  return (
    <Tabs variant="outline" defaultValue="gallery">
      <Tabs.List>
        <Tabs.Tab
          value="gallery"
          // icon={<IconPhoto size={14} />}
        >
          Gallery
        </Tabs.Tab>
        <Tabs.Tab
          value="messages"
          // icon={<IconMessageCircle size={14} />}
        >
          Messages
        </Tabs.Tab>
        <Tabs.Tab
          value="settings"
          //  icon={<IconSettings size={14} />}
        >
          Settings
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="gallery" pt="xs">
        Gallery tab content
      </Tabs.Panel>

      <Tabs.Panel value="messages" pt="xs">
        Messages tab content
      </Tabs.Panel>

      <Tabs.Panel value="settings" pt="xs">
        Settings tab content
      </Tabs.Panel>
    </Tabs>
  );
}
