import { ModalsProvider } from "@mantine/modals";

import modals from "../ui/Modals";
import Provider from "../context";
import { WasmContext } from "../context/wasm";

import Main from "./Main";

export default function App() {
  return (
    <WasmContext.Provider>
      <Provider>
        <ModalsProvider modals={modals}>
          <Main />
        </ModalsProvider>
      </Provider>
    </WasmContext.Provider>
  );
}
