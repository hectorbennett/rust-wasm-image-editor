import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";
import { WasmContext } from "./wasm";

import { ProjectSerializer } from "wasm";

type TabType = "project" | "settings";

interface Tab {
  uid: string;
  type: TabType;
}

function useTabs() {
  const wasm = WasmContext.useContainer();
  const [activeTabId, setActiveTabId] = useState<string | null>(null);
  const [tabs, setTabs] = useState<Array<Tab>>([]);

  const activeTab: Tab = tabs.find((tab) => tab.uid === activeTabId) || tabs[0] || null;

  useEffect(() => {
    if (!activeTab || activeTab.type !== "project") {
      // wasm.api && wasm.api.clear_active_project();
    } else {
      wasm.api && wasm.api.set_active_project(BigInt(activeTab.uid));
    }
  }, [activeTab]);

  function newTab(uid: string, type: TabType) {
    setTabs((t) => {
      if (t.find((tab) => tab.uid === uid)) {
        return t;
      }
      return [...t, { uid: uid, type: type }];
    });
    setActiveTabId(uid);
  }

  function closeTab(_uid: string) {
    console.log("close tab");
  }

  function focusTab(uid: string) {
    setActiveTabId(uid);
  }

  useEffect(() => {
    if (!wasm.state?.projects) {
      return;
    }
    const current_uids = tabs.map((tab) => tab.uid);
    wasm.state.projects.forEach((project: ProjectSerializer) => {
      if (!current_uids.includes(project.uid)) {
        newTab(project.uid, "project");
      }
    });
  }, [wasm.state]);

  return {
    tabs,
    activeTab,
    newTab,
    closeTab,
    focusTab,
  };
}

export const TabsContext = createContainer(useTabs);
