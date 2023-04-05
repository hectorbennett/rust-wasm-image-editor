import { createContainer } from "unstated-next";
import { WasmContext } from "./wasm";

function useLayers() {
  const wasm = WasmContext.useContainer();

  return {
    layers: wasm.state?.projects.get(wasm.state?.active_project_uid || "")?.layers,
    active_layer_uid: wasm.state?.projects.get(wasm.state?.active_project_uid || "")
      ?.active_layer_uid,
    createNewLayer: function createNewLayer() {
      wasm.api && wasm.api.create_layer();
    },
    setLayerLocked: function setLayerLocked(layer_uid: string, locked: boolean) {
      wasm.api && wasm.api.set_layer_locked(BigInt(layer_uid), locked);
    },
    setLayerVisibility: function setLayerVisibility(layer_uid: string, visible: boolean) {
      wasm.api && wasm.api.set_layer_visibile(BigInt(layer_uid), visible);
    },
    renameLayer: function renameLayer(_layer_uid: string, _name: string) {
      // console.log("rename layer");
    },
    setActiveLayer: function (layer_uid: string) {
      wasm.api && wasm.api.set_active_layer(BigInt(layer_uid));
    },
  };
}
export const LayersContext = createContainer(useLayers);
