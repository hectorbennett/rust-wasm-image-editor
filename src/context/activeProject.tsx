import { createContainer } from "unstated-next";

import { WasmContext } from "./wasm";
import { AppContext } from "./app";
import { Layer } from "./layers";

interface SerializedProject {
  uid: string;
  width: number;
  height: number;
  name: string;
  layers: Array<Layer>;
}

const BLANK_DATA: SerializedProject = {
  uid: "",
  width: 0,
  height: 0,
  name: "",
  layers: [],
};

function useActiveProject() {
  const wasm = WasmContext.useContainer();
  const app = AppContext.useContainer();
  let data = BLANK_DATA;
  if (app.activeTab && app.activeTab.type == "project" && wasm.data.projects) {
    data = wasm.data.projects.get(app.activeTab.uid);
  }
  return data;
}

export const ActiveProjectContext = createContainer(useActiveProject);
