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
    layers: activeProject?.activeProject?.layers || null,
    active_layer_uid: activeProject?.activeProject?.active_layer_uid || null,
    createNewLayer: function createNewLayer() {
      wasm.api && wasm.api.create_layer(`layer ${(this.layers?.length || 0) + 1}`, 500, 500);
    },
    setLayerLocked: function setLayerLocked(layer_uid: string, locked: boolean) {
      wasm.api && wasm.api.set_layer_locked(BigInt(layer_uid), locked);
    },
    setLayerVisibility: function setLayerVisibility(layer_uid: string, visible: boolean) {
      wasm.api && wasm.api.set_layer_visibile(BigInt(layer_uid), visible);
    },
    renameLayer: function renameLayer(_layer_uid: string, _name: string) {
      console.log("rename layer");
    },
    setActiveLayer: function (layer_uid: string) {
      wasm.api && wasm.api.set_active_layer(BigInt(layer_uid));
    },
  };
}
export const LayersContext = createContainer(useLayers);
