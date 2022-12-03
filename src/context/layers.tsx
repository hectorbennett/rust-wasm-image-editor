import { createContainer } from "unstated-next";
import { ActiveProjectContext } from "./activeProject";
import { WasmContext } from "./wasm";

export interface Layer {
  uid: string;
  name: string;
  width: number;
  height: number;
  left: number;
  top: number;
  visible: boolean;
  locked: boolean;
  thumbnail_hash: string;
}

function useLayers() {
  const wasm = WasmContext.useContainer();
  const activeProject = ActiveProjectContext.useContainer();

  return {
    layers: activeProject.activeProject
      ? activeProject.activeProject.layers
      : null,
    createNewLayer: function createNewLayer() {
      wasm.api.create_layer("A new layer :)", 500, 500);
    },
    setLayerLocked: function setLayerLocked(
      layer_uid: string,
      locked: boolean
    ) {
      wasm.api.set_layer_locked(layer_uid, locked);
    },
    setLayerVisibility: function setLayerVisibility(
      layer_uid: string,
      visible: boolean
    ) {
      wasm.api.set_layer_visibile(layer_uid, visible);
    },
    renameLayer: function renameLayer(layer_uid: string, name: string) {
      console.log("rename layer");
    },
  };
}
export const LayersContext = createContainer(useLayers);
