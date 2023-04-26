import { createContainer } from "unstated-next";
import { WasmContext } from "./wasm";

function useLayers() {
  const wasm = WasmContext.useContainer();

  const layers = wasm.state?.projects?.get(wasm.state?.active_project_uid || "")?.layers;

  return {
    layers,
    active_layer_uid: wasm.state?.projects?.get(wasm.state?.active_project_uid || "")
      ?.active_layer_uid,
    createNewLayer: function createNewLayer() {
      wasm.api?.create_layer();
    },
    setLayerLocked: function setLayerLocked(layer_uid: string, locked: boolean) {
      wasm.api?.set_layer_locked(BigInt(layer_uid), locked);
    },
    setLayerVisibility: function setLayerVisibility(layer_uid: string, visible: boolean) {
      wasm.api?.set_layer_visibile(BigInt(layer_uid), visible);
    },
    renameLayer: function renameLayer(layer_uid: string, name: string) {
      wasm.api?.rename_layer(BigInt(layer_uid), name);
    },
    setActiveLayer: function (layer_uid: string) {
      wasm.api?.set_active_layer(BigInt(layer_uid));
    },
    deleteLayer: function (layer_uid: string) {
      wasm.api?.delete_layer(BigInt(layer_uid));
    },
    getThumbnail: async function (layer_uid: string) {
      return await wasm.api?.get_layer_thumbnail(BigInt(layer_uid));
    },
  };
}
export const LayersContext = createContainer(useLayers);
