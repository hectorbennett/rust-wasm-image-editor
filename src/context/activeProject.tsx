import { createContainer } from "unstated-next";

import { WasmContext } from "./wasm";
import { Layer } from "./layers";

export interface Project {
  uid: string;
  name: string;
  width: number;
  height: number;
  image_hash: string;
  layers: Array<Layer>;
  active_layer_uid: string | null;
}

function useActiveProject() {
  const wasm = WasmContext.useContainer();
  let data: Project | null = wasm.state.active_project_uid
    ? wasm.state.projects.get(wasm.state.active_project_uid) || null
    : null;
  return {
    activeProject: data,
  };
}

export const ActiveProjectContext = createContainer(useActiveProject);
