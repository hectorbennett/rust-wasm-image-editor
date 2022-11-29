import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";

import { WasmContext } from "./wasm";
import { AppContext } from "./app";

interface SerializedProject {
  uid: string;
  width: number;
  height: number;
}

const BLANK_DATA: SerializedProject = {
  uid: "",
  width: 0,
  height: 0,
};

interface Layer {
  uid: string;
  name: string;
  width: number;
  height: number;
  visible: boolean;
}

function useActiveProject() {
  // const [data, setData] = useState<SerializedProject>(BLANK_DATA);
  const [layers, setLayers] = useState<Array<Layer>>([]);
  const wasm = WasmContext.useContainer();
  const app = AppContext.useContainer();

  let data = BLANK_DATA;
  if (app.activeTab && app.activeTab.type == "project" && wasm.data.projects) {
    data = wasm.data.projects.get(app.activeTab.uid);
    // console.log(data);
  }

  const resizeCanvas = (width: number, height: number) => {
    wasm.app.resize_canvas(width, height);
  };

  return {
    app,
    resizeCanvas,
    uid: data.uid,
    width: data.width,
    height: data.height,
  };
}

export const ActiveProjectContext = createContainer(useActiveProject);
