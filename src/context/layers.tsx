import { useEffect, useState } from "react";

import { createContainer } from "unstated-next";
import { ActiveProjectContext } from "./activeProject";
import { WasmContext } from "./wasm";

export interface Canvas {
  c: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
}

export interface Layer {
  id: number;
  name: string;
  visible: boolean;
  locked: boolean;
  width: number;
  height: number;

  /* the offset from the top left origin */
  xOffset: number;
  yOffset: number;
}

function useLayers() {
  const [layers, setLayers] = useState<Array<Layer>>([createBackgroundLayer()]);
  const [activeLayerId, setActiveLayerId] = useState(1);
  const wasm = WasmContext.useContainer();
  const activeProject = ActiveProjectContext.useContainer();

  function createBackgroundLayer(): Layer {
    const layer_id = 0;
    const layer_name = "Background";
    // const canvas = useCanvas({ width: 500, height: 500 });

    return {
      id: layer_id,
      name: layer_name,
      visible: true,
      locked: false,
      width: 500,
      height: 500,
      xOffset: 0,
      yOffset: 0,
    };
  }

  function createNewLayer() {
    if (!activeProject.uid) {
      return;
    }
    // if (!wasm.lib) {
    //   return;
    // }
    // async function test() {
    //   const { return_pointer, take_pointer_by_value } = await import(
    //     "hello-wasm"
    //   );

    //   let pointer = return_pointer();
    //   console.log("pointer:");
    //   console.log(pointer);
    //   let result = take_pointer_by_value(pointer);
    //   console.log("result:");
    //   console.log(result);

    //   let result_2 = take_pointer_by_value(wasm.app.ptr);
    //   console.log("result_2:");
    //   console.log(result_2);
    // }
    // test();

    // console.log("wasm.app:");
    // console.log(wasm.app);
    // let p = wasm.lib.get_project(wasm.app.ptr, activeProject.uid);
    // console.log("p:");
    // console.log(p);
    // wasm.get_project()
    // let layer_test = wasm.app.new_layer();
    // console.log("layer_test: " + layer_test);
    // const layer_id = Math.max(...layers.map((layer) => layer.id)) + 1;
    // const layer_name = `Layer ${layers.length}`;
    // return {
    //   id: layer_id,
    //   name: layer_name,
    //   visible: true,
    //   locked: false,
    //   width: 500,
    //   height: 500,
    //   xOffset: 0,
    //   yOffset: 0,
    // };
  }

  function addNewLayer() {
    const newLayer = createNewLayer();
    // setLayers([newLayer, ...layers]);
    // setActiveLayerId(newLayer.id);
  }

  function toggleLocked(layer_id: number) {
    setLayers(
      layers.map((layer) => ({
        ...layer,
        locked: layer.id === layer_id ? !layer.locked : layer.locked,
      }))
    );
  }

  function toggleVisibility(layer_id: number) {
    setLayers(
      layers.map((layer) => ({
        ...layer,
        visible: layer.id === layer_id ? !layer.visible : layer.visible,
      }))
    );
  }

  function renameLayer(layer_id: number, name: string) {
    setLayers(
      layers.map((layer) => ({
        ...layer,
        name: layer.id === layer_id ? name : layer.name,
      }))
    );
  }

  return {
    layers,
    addNewLayer,
    activeLayerId,
    activeLayer: layers.find((layer) => layer.id === activeLayerId),
    setActiveLayerId,
    toggleLocked,
    toggleVisibility,
    renameLayer,
  };
}

export const LayersContext = createContainer(useLayers);
