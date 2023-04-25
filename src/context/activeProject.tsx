import { createContainer } from "unstated-next";

import { WasmContext } from "./wasm";

import { ProjectSerializer } from "../../wasm/pkg/wasm.js";

function useActiveProject() {
  const wasm = WasmContext.useContainer();
  const data: ProjectSerializer | null = wasm.state?.active_project_uid
    ? wasm.state.projects.get(wasm.state.active_project_uid) || null
    : null;
  return {
    activeProject: data,
  };
}

export const ActiveProjectContext = createContainer(useActiveProject);
