import { MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { SpotlightProvider } from "@mantine/spotlight";

import modals from "../ui/Modals";
import Provider from "../context";
import { WasmContext } from "../context/wasm";

import Main from "../main/Main";
import { CustomSpotlightAction } from "../components/CustomSpotlightAction";
import { useEffect, useRef } from "react";

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function Testing() {
  const wasm = WasmContext.useContainer();
  const testCalled = useRef(false);
  useEffect(() => {
    async function test() {
      if (testCalled.current) {
        return;
      }
      testCalled.current = true;
      if (!wasm.api) {
        return;
      }
      wasm.api.create_project();

      await sleep(200);

      wasm.api.center_canvas();

      // red square layer
      wasm.api.set_primary_colour(255, 0, 0, 100);
      wasm.api.select_rect(100, 150, 150, 150);
      wasm.api.fill_selection();

      // green square layer
      wasm.api.create_layer();
      wasm.api.set_primary_colour(0, 255, 0, 100);
      wasm.api.select_rect(220, 100, 180, 150);
      wasm.api.fill_selection();

      // blue circle layer
      wasm.api.create_layer();
      wasm.api.set_primary_colour(0, 0, 255, 100);
      wasm.api.select_ellipse(180, 200, 200, 200);
      wasm.api.fill_selection();

      // clear selection
      wasm.api.select_none();
    }
    if (wasm.api) {
      test();
    }
  }, [wasm.api]);

  return null;
}

export default function App() {
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
        overlayProps={{ blur: 0 }}
        transitionProps={{ duration: 0 }}
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