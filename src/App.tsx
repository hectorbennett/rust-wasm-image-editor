import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { SpotlightProvider } from "@mantine/spotlight";

import modals from "./ui/Modals";
import Provider from "./context";
import { WasmContext } from "./context/wasm";

import Main from "./main/Main";
import { CustomSpotlightAction } from "./components/CustomSpotlightAction";
import { useEffect, useRef } from "react";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function Testing() {
  const wasm = WasmContext.useContainer();
  const testCalled = useRef(false);
  useEffect(() => {
    test();
  }, []);

  async function test() {
    if (testCalled.current) {
      return;
    }
    testCalled.current = true;
    if (!wasm.api) {
      return;
    }
    wasm.api.create_project("Test project", 500, 500);
    wasm.api.create_layer("Test layer 1", 500, 500);

    await sleep(2000);

    // red square layer
    wasm.api.set_primary_colour(255, 0, 0, 100);
    wasm.api.select_rect(100, 100, 150, 150);
    wasm.api.fill_selection();
    wasm.api.set_primary_colour(1, 2, 3, 255);
    wasm.api.select_rect(400, 400, 100, 100);
    wasm.api.fill_selection();

    // green square layer
    wasm.api.create_layer("Test layer 2", 500, 500);
    wasm.api.set_primary_colour(0, 255, 0, 100);
    wasm.api.select_rect(220, 50, 180, 150);
    wasm.api.fill_selection();

    // blue square layer
    wasm.api.create_layer("Test layer 3", 500, 500);
    wasm.api.set_primary_colour(0, 0, 255, 100);
    wasm.api.select_rect(180, 150, 200, 200);
    wasm.api.fill_selection();

    // invert selection
    wasm.api.create_layer("Test layer 4", 500, 500);
    wasm.api.set_primary_colour(100, 0, 255, 100);
    wasm.api.select_rect(50, 50, 400, 400);
    wasm.api.select_inverse();
    wasm.api.fill_selection();
  }
  return null;
}

function App() {
  return (
    // <DndProvider backend={HTML5Backend}>
    <MantineProvider
      theme={{
        // radius: 0,
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
        overlayBlur={0}
        transitionDuration={0}
      >
        <WasmContext.Provider>
          <Provider>
            <ModalsProvider modals={modals}>
              <Main />
              <Testing />
            </ModalsProvider>
          </Provider>
        </WasmContext.Provider>
      </SpotlightProvider>
    </MantineProvider>
    // </DndProvider>
  );
}

export default App;
