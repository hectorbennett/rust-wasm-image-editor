import { createContainer } from "unstated-next";
import { ActiveProjectContext } from "./activeProject";
import { WasmContext } from "./wasm";

export interface Layer {
  uid: bigint;
  name: string;
  width: number;
  height: number;
  left: number;
  top: number;
  visible: boolean;
  locked: boolean;
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
      layer_uid: bigint,
      locked: boolean
    ) {
      console.log("set layer locked");
    },
    setLayerVisibility: function setLayerVisibility(
      layer_uid: bigint,
      visible: boolean
    ) {
      console.log("set layer visibility");
    },
    renameLayer: function renameLayer(layer_uid: bigint, name: string) {
      console.log("rename layer");
    },
  };
}
export const LayersContext = createContainer(useLayers);
