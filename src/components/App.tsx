import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { SpotlightProvider } from "@mantine/spotlight";

import modals from "../ui/Modals";
import Provider from "../context";
import { WasmContext } from "../context/wasm";

import Main from "./Main";
import { CustomSpotlightAction } from "../components/CustomSpotlightAction";

export default function App() {
  return (
    <MantineProvider
      theme={{
        colorScheme: "dark",
        defaultRadius: "xs",
        primaryColor: "yellow",
        primaryShade: 8,
      }}
      withGlobalStyles
      withNormalizeCSS
    >
      <SpotlightProvider
        shortcut={null}
        actions={[]}
        actionComponent={CustomSpotlightAction}
        overlayProps={{ blur: 0 }}
        transitionProps={{ duration: 0 }}
      >
        <WasmContext.Provider>
          <Provider>
            <ModalsProvider modals={modals}>
              <Main />
            </ModalsProvider>
          </Provider>
        </WasmContext.Provider>
      </SpotlightProvider>
    </MantineProvider>
  );
}
