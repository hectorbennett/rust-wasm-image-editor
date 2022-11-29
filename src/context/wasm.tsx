// @ts-ignore
import init, { init_api } from "wasm";

import { useEffect, useState } from "react";
import { createContainer } from "unstated-next";

function useWasm() {
  const [inited, setInited] = useState<any>();
  const [api, setApi] = useState<any>(null);
  const [data, setData] = useState<any>({});
  useEffect(() => {
    (async () => {
      if (inited) {
        return;
      }
      setInited(true);
      init().then(() => {
        setApi(init_api());
      });
    })();
  }, []);

  const refresh_data = () => {
    setData(api.to_json());
  };

  const isLoading = !api;

  return {
    isLoading,
    api,
    app: api,
    data,
    refresh_data,
  };
}

export const WasmContext = createContainer(useWasm);
