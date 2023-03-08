import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { SpotlightProvider } from "@mantine/spotlight";

// import { DndProvider } from "react-dnd";
// import { HTML5Backend } from "react-dnd-html5-backend";

import modals from "./ui/Modals";
import Provider from "./context";
import { WasmContext } from "./context/wasm";

import Main from "./main/Main";
import { CustomSpotlightAction } from "./components/CustomSpotlightAction";
import { useEffect, useRef } from "react";

function Testing() {
  const wasm = WasmContext.useContainer();
  const testCalled = useRef(false);
  useEffect(() => {
    test();
  }, []);

  function test() {
    if (testCalled.current) {
      return;
    }
    testCalled.current = true;
    wasm.api.create_project("Test project", 500, 500);

    // red square layer
    const layer_1_uid = wasm.api.create_layer("Test layer 1", 500, 500);
    const red = [255, 0, 0, 100];
    wasm.api.fill_rect(layer_1_uid, red, 100, 100, 150, 150);

    // green square layer
    const layer_2_uid = wasm.api.create_layer("Test layer 2", 500, 500);
    const green = [0, 255, 0, 100];
    wasm.api.fill_rect(layer_2_uid, green, 220, 50, 180, 150);

    // blue square layer
    const layer_3_uid = wasm.api.create_layer("Test layer 3", 500, 500);
    const blue = [0, 0, 255, 100];
    wasm.api.fill_rect(layer_3_uid, blue, 180, 150, 200, 200);
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
