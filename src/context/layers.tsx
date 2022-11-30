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
}

function useLayers() {
  const wasm = WasmContext.useContainer();
  const activeProject = ActiveProjectContext.useContainer();
  const layers: Array<Layer> = Array.from(activeProject.layers.values());

  function addNewLayer() {
    wasm.api.create_layer("A new layer :)", 500, 500);
    wasm.refresh_data();
  }

  function toggleLocked(layer_id: string) {
    // setLayers(
    //   layers.map((layer) => ({
    //     ...layer,
    //     locked: layer.id === layer_id ? !layer.locked : layer.locked,
    //   }))
    // );
  }

  function toggleVisibility(layer_id: string) {
    // setLayers(
    //   layers.map((layer) => ({
    //     ...layer,
    //     visible: layer.id === layer_id ? !layer.visible : layer.visible,
    //   }))
    // );
  }

  function renameLayer(layer_id: string, name: string) {
    // setLayers(
    //   layers.map((layer) => ({
    //     ...layer,
    //     name: layer.id === layer_id ? name : layer.name,
    //   }))
    // );
  }

  return {
    layers,
    addNewLayer,
    // activeLayerId,
    // activeLayer: null, // layers.find((layer) => layer.uid === activeLayerId),
    // setActiveLayerId,
    toggleLocked,
    toggleVisibility,
    renameLayer,
  };
}

export const LayersContext = createContainer(useLayers);
