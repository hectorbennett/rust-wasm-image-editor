import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";
import { WasmContext } from "./wasm";

type TabType = "project" | "settings";

interface Tab {
  uid: string;
  type: TabType;
}

function useFilters() {
  const wasm = WasmContext.useContainer();
  function generateNoise() {}
  return {
    generateNoise,
  };
}

function useTabs() {
  const wasm = WasmContext.useContainer();
  const [activeTabId, setActiveTabId] = useState<string | null>("");
  const [tabs, setTabs] = useState<Array<Tab>>([]);

  const activeTab: Tab =
    tabs.find((tab) => tab.uid === activeTabId) || tabs[0] || null;

  function newTab(uid: string, type: TabType) {
    setTabs((t) => {
      if (t.find((tab) => tab.uid === uid)) {
        return t;
      }
      return [...t, { uid: uid, type: type }];
    });
    setActiveTabId(uid);
  }

  function closeTab(uid: string) {
    console.log("close tab");
  }

  function focusTab(uid: string) {
    setActiveTabId(uid);
    // wasm.api.set_active_project(uid);
  }

  useEffect(() => {
    if (!wasm.data.projects) {
      return;
    }
    const current_uids = tabs.map((tab) => tab.uid);
    wasm.data.projects.forEach((project: any) => {
      if (!current_uids.includes(project.uid)) {
        newTab(project.uid, "project");
      }
    });
  }, [wasm.data]);

  return {
    tabs,
    activeTab,
    newTab,
    closeTab,
    focusTab,
  };
}

function useApp() {
  const tabs = useTabs();
  const filters = useFilters();
  const wasm = WasmContext.useContainer();
  const [activeColour, setActiveColour] = useState([255, 255, 255, 255]);

  useEffect(() => {
    // wasm.app.set_active_colour(...activeColour);
  }, [activeColour]);

  function closeTab(tabId: string) {
    tabs.closeTab(tabId);
  }

  function openSettings() {
    tabs.newTab("settings", "settings");
  }

  function createNewProject(width: number, height: number) {
    const uid = wasm.app.new_project(width, height);
    tabs.newTab(uid, "project");
  }

  return {
    tabs: tabs.tabs,
    filters,
    activeTab: tabs.activeTab,
    focusTab: tabs.focusTab,
    closeTab,
    openSettings,
    createNewProject,
    activeColour,
    setActiveColour,
  };
}

export const AppContext = createContainer(useApp);
