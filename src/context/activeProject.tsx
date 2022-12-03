import { createContainer } from "unstated-next";

import { WasmContext } from "./wasm";
import { Layer } from "./layers";
import { TabsContext } from "./tabs";

export interface Project {
  uid: bigint;
  name: string;
  width: number;
  height: number;
  layers: Map<bigint, Layer>;
}

function useActiveProject() {
  const wasm = WasmContext.useContainer();
  const tabs = TabsContext.useContainer();
  let data: Project | null =
    wasm.state.projects.get(tabs.activeTab?.uid) || null;
  return {
    activeProject: data,
  };
}

export const ActiveProjectContext = createContainer(useActiveProject);
