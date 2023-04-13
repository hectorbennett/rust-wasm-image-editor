import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";
import { WasmContext } from "./wasm";
import { SettingsContext } from "./settings";

type TabType = "project" | "settings";

interface Tab {
  uid: string;
  type: TabType;
}

function useTabs() {
  const wasm = WasmContext.useContainer();
  const settings = SettingsContext.useContainer();
  const [tabOrder, setTabOrder] = useState<Array<string>>([]);
  const [activeTabUid, setActiveTabUid] = useState<string | null>(null);

  /* Get active projects from wasm */
  const tabs: Array<Tab> = wasm.state
    ? [...wasm.state.projects.values()].map((project) => ({ uid: project.uid, type: "project" }))
    : [];

  /* Add settings to the tabs if it's open */
  if (settings.isOpen) {
    tabs.push({ uid: "settings", type: "settings" });
  }

  /* sort by the custom sort order the user chooses */
  tabs.sort((a, b) => {
    const t = [...tabOrder];
    if (!tabOrder.includes(a.uid)) {
      t.push(a.uid);
    } else if (!tabOrder.includes(b.uid)) {
      t.push(b.uid);
    }
    return t.indexOf(a.uid) - t.indexOf(b.uid);
  });

  const activeTab: Tab = tabs.find((tab) => tab.uid === activeTabUid) || tabs[0] || null;

  useEffect(() => {
    /* Add a new tab to the tabOrder array when a new tab is focused */
    if (activeTabUid && !tabOrder.includes(activeTabUid)) {
      setTabOrder((t) => [...t, activeTabUid]);
    }
  }, [activeTabUid]);

  useEffect(() => {
    /* Focus the settings tab when it appears */
    if (settings.isOpen) {
      focusTab("settings");
    }
  }, [settings.isOpen]);

  function closeTab(_uid: string) {
    console.log("close tab");
  }

  function focusTab(uid: string) {
    if (uid == "settings") {
      wasm.api?.clear_active_project();
      setActiveTabUid("settings");
    } else {
      wasm.api?.set_active_project(BigInt(uid));
      setActiveTabUid(uid);
    }
  }

  useEffect(() => {
    if (wasm.state?.active_project_uid && wasm.state.active_project_uid !== activeTabUid) {
      setActiveTabUid(wasm.state.active_project_uid);
    }
  }, [wasm.state?.active_project_uid]);

  return {
    tabs,
    activeTab,
    closeTab,
    focusTab,
  };
}

export const TabsContext = createContainer(useTabs);
