import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";
import { WasmContext } from "./wasm";

type TabType = "project" | "settings";

interface Tab {
  uid: bigint;
  type: TabType;
}

function useTabs() {
  const wasm = WasmContext.useContainer();
  const [activeTabId, setActiveTabId] = useState<bigint>(0n);
  const [tabs, setTabs] = useState<Array<Tab>>([]);

  const activeTab: Tab =
    tabs.find((tab) => tab.uid === activeTabId) || tabs[0] || null;

  function newTab(uid: bigint, type: TabType) {
    setTabs((t) => {
      if (t.find((tab) => tab.uid === uid)) {
        return t;
      }
      return [...t, { uid: uid, type: type }];
    });
    setActiveTabId(uid);
  }

  function closeTab(uid: bigint) {
    console.log("close tab");
  }

  function focusTab(uid: bigint) {
    setActiveTabId(uid);
  }

  useEffect(() => {
    if (!wasm.state.projects) {
      return;
    }
    const current_uids = tabs.map((tab) => tab.uid);
    wasm.state.projects.forEach((project: any) => {
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
