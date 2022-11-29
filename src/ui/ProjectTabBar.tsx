// import styled from "styled-components";

import { AppShell, Navbar, Header } from "@mantine/core";
import { Button } from "@mantine/core";
import { TextInput } from "@mantine/core";
import { Menu, Text } from "@mantine/core";
import {
  IconSettings,
  IconSearch,
  IconPhoto,
  IconMessageCircle,
  IconTrash,
  IconArrowsLeftRight,
} from "@tabler/icons";

import { Tabs } from "@mantine/core";
// import { IconPhoto, IconMessageCircle, IconSettings } from "@tabler/icons";


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
