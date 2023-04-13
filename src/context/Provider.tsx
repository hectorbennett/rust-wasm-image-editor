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
    <AppContext.Provider>
      <ActiveProjectContext.Provider>
        <ToolsContext.Provider>
          <LayersContext.Provider>
            <SettingsContext.Provider>
              <TabsContext.Provider>
                <CommandsContext.Provider>{props.children}</CommandsContext.Provider>
              </TabsContext.Provider>
            </SettingsContext.Provider>
          </LayersContext.Provider>
        </ToolsContext.Provider>
      </ActiveProjectContext.Provider>
    </AppContext.Provider>
  );
}
