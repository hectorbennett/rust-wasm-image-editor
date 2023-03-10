import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";
import { TabsContext } from "./tabs";
import { WasmContext } from "./wasm";

function useFile() {
  const wasm = WasmContext.useContainer();
  // const tabs = TabsContext.useContainer();
  return {
    new: function _new(width: number, height: number) {
      wasm.api && wasm.api.create_project("Untitled", width, height);
    },
    open: function open() {
      console.log("open");
    },
    save: function save() {
      console.log("save");
    },
    export: function _export() {
      console.log("export");
    },
    close: function close() {
      console.log("close");
    },
  };
}

function useEdit() {
  return {
    undo: function undo() {
      console.log("undo");
    },
    redo: function redo() {
      console.log("redo");
    },
    cut: function redo() {
      console.log("cut");
    },
    copy: function redo() {
      console.log("copy");
    },
    paste: function redo() {
      console.log("paste");
    },
  };
}

function useFilters() {
  // const wasm = WasmContext.useContainer();
  function generateNoise() {
    // todo
  }
  return {
    generateNoise,
  };
}

function useImage() {
  return {
    resizeCanvas: function resizeCanvas() {
      console.log("resizeCanvas");
    },
  };
}

function useApp() {
  const tabs = TabsContext.useContainer();
  const wasm = WasmContext.useContainer();
  const [activeColour, setActiveColour] = useState<number[]>([255, 255, 255, 255]);

  useEffect(() => {
    wasm.api?.set_primary_colour(
      activeColour[0],
      activeColour[1],
      activeColour[2],
      activeColour[3],
    );
  }, [activeColour]);

  return {
    openSettings: function openSettings() {
      tabs.newTab("settings", "settings");
    },
    exit: function exit() {
      console.log("exit");
    },
    file: useFile(),
    edit: useEdit(),
    filters: useFilters(),
    image: useImage(),
    activeColour,
    setActiveColour,
  };
}

export const AppContext = createContainer(useApp);
