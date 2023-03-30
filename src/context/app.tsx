import { createContainer } from "unstated-next";
import { TabsContext } from "./tabs";
import { WasmContext } from "./wasm";

function useFile() {
  const wasm = WasmContext.useContainer();
  return {
    new: function _new(width: number, height: number) {
      wasm.api && wasm.api.create_project("Untitled", width, height);
    },
    open: function open() {
      const inp = document.createElement("input");
      inp.type = "file";
      inp.onchange = (e) => {
        const target: HTMLInputElement = e.target as HTMLInputElement;
        if (!target.files) {
          return;
        }
        const file = target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = function (e) {
          if (e.target?.result && wasm.api) {
            wasm.api.from_json(e.target.result as string);
          }
        };
        reader.readAsText(file);
      };
      inp.click();
    },
    save: function save() {
      if (!wasm.api) {
        return;
      }
      const link = document.createElement("a");
      const file = new Blob([wasm.api.to_json()], { type: "text/plain" });
      link.href = URL.createObjectURL(file);
      link.download = `${"Untitled"}.thing`;
      link.click();
      URL.revokeObjectURL(link.href);
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
  };
}

export const AppContext = createContainer(useApp);
