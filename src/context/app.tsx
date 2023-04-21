import { createContainer } from "unstated-next";
import { WasmContext } from "./wasm";

function readFile(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("loadend", (e) => {
      if (e.target?.result) {
        resolve(e.target.result as ArrayBuffer);
      } else {
        resolve(new ArrayBuffer(0));
      }
    });
    reader.addEventListener("error", () => resolve(new ArrayBuffer(0)));
    reader.readAsArrayBuffer(file);
  });
}

async function getAsByteArray(file: File) {
  return readFile(file).then((result) => new Uint8Array(result));
}

function useFile() {
  const wasm = WasmContext.useContainer();
  return {
    open: function open() {
      const inp = document.createElement("input");
      inp.type = "file";
      inp.onchange = (e) => {
        const target: HTMLInputElement = e.target as HTMLInputElement;
        if (!target.files) {
          return;
        }
        const file = target.files[0];
        getAsByteArray(file).then((result) => {
          wasm.api?.from_postcard(result);
        });
      };
      inp.click();
    },
    import_image_as_layer: function import_image() {
      const inp = document.createElement("input");
      inp.type = "file";
      inp.onchange = (e) => {
        const target: HTMLInputElement = e.target as HTMLInputElement;
        if (!target.files) {
          return;
        }
        const file = target.files[0];
        getAsByteArray(file).then((result) => {
          wasm.api?.import_image_as_layer(result);
        });
      };
      inp.click();
    },
    save: function save() {
      if (!wasm.api) {
        return;
      }
      const link = document.createElement("a");
      const file = new Blob([wasm.api.to_postcard()]);
      link.href = URL.createObjectURL(file);
      link.download = `${"Untitled"}.thing`;
      link.click();
      URL.revokeObjectURL(link.href);
    },
    export: function _export() {
      console.log("export");
    },
    export_png: function save() {
      if (!wasm.api) {
        return;
      }
      const link = document.createElement("a");
      const file = new Blob([wasm.api.to_png()], { type: "image/png" });
      link.href = URL.createObjectURL(file);
      link.download = `${"Untitled"}.png`;
      link.click();
      URL.revokeObjectURL(link.href);
    },
    close: function close() {
      console.log("close");
    },
  };
}

function useEdit() {
  const wasm = WasmContext.useContainer();
  return {
    undo: function undo() {
      wasm.api?.undo();
    },
    redo: function redo() {
      wasm.api?.redo();
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
  const wasm = WasmContext.useContainer();
  return {
    exit: function exit() {
      console.log("exit");
    },
    file: useFile(),
    edit: useEdit(),
    filters: useFilters(),
    image: useImage(),
    zoom: wasm.state?.workspace.zoom || 100,
    setZoom: (zoom: number) => wasm.api?.set_workspace_zoom(zoom),
  };
}

export const AppContext = createContainer(useApp);
