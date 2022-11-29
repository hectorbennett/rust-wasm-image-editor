import { ReactNode } from "react";
import { AppContext } from "./app";
import { CanvasContext } from "./canvas";
import { LayersContext } from "./layers";
import { ActiveProjectContext } from "./activeProject";
import { ToolsContext } from "./tools";
import { CommandsContext } from "./commands";
import { SettingsContext } from "./settings";

import { WasmContext } from "./wasm";

export default function Provider(props: { children: ReactNode }) {
  const wasm = WasmContext.useContainer();
  if (wasm.isLoading) {
    return <div>Loading...</div>;
  }
  return (
    <AppContext.Provider>
      <ActiveProjectContext.Provider>
        <ToolsContext.Provider>
          <LayersContext.Provider>
            <CanvasContext.Provider>
              <SettingsContext.Provider>
                <CommandsContext.Provider>
                  {props.children}
                </CommandsContext.Provider>
              </SettingsContext.Provider>
            </CanvasContext.Provider>
          </LayersContext.Provider>
        </ToolsContext.Provider>
      </ActiveProjectContext.Provider>
    </AppContext.Provider>
  );
}
