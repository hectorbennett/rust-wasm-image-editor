import { ReactNode } from "react";

import { ActiveProjectContext } from "./activeProject";
import { AppContext } from "./app";
import { CommandsContext } from "./commands";
import { LayersContext } from "./layers";
import { SettingsContext } from "./settings";
import { TabsContext } from "./tabs";
import { ToolsContext } from "./tools";

export default function Provider(props: { children: ReactNode }) {
  return (
    <TabsContext.Provider>
      <AppContext.Provider>
        <ActiveProjectContext.Provider>
          <ToolsContext.Provider>
            <LayersContext.Provider>
              <SettingsContext.Provider>
                <CommandsContext.Provider>{props.children}</CommandsContext.Provider>
              </SettingsContext.Provider>
            </LayersContext.Provider>
          </ToolsContext.Provider>
        </ActiveProjectContext.Provider>
      </AppContext.Provider>
    </TabsContext.Provider>
  );
}
