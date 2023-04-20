import initWasm, { Api } from "wasm";

import { ApiSerializerSchema } from "wasm";

import { useEffect, useRef, useState } from "react";
import { createContainer } from "unstated-next";

const useWasmApi = ({ methodCallback }: { methodCallback: () => void }) => {
  const [api, setApi] = useState<Api>();
  const inited = useRef(false);

  const methods_without_callback = ["render_to_canvas", "scroll_workspace", "zoom_workspace"];

  useEffect(() => {
    if (inited.current) {
      return;
    }
    inited.current = true;
    initWasm().then(() => {
      const apiHandler: ProxyHandler<Api> = {
        get(target: Api, prop: string, _receiver: unknown) {
          if (!target) {
            return null;
          }
          const p = Reflect.get(target, prop);
          if (p instanceof Function) {
            return (...args: Array<unknown>) => {
              const result = p.apply(target, args);
              if (!methods_without_callback.includes(prop)) {
                console.log(prop);
                methodCallback();
              }
              return result;
            };
          } else {
            return p;
          }
        },
      };
      setApi(() => new Proxy(new Api(), apiHandler));
    });
  }, []);
  return api;
};

function useWasm() {
  const [appState, setAppState] = useState<ApiSerializerSchema>();
  const methodCallback = useRef<() => void>(() => {
    /* noop */
  });
  const api = useWasmApi({
    methodCallback: () => {
      methodCallback.current();
    },
  });

  useEffect(() => {
    const refreshAppState = () => setAppState(() => (api ? api.state : null));
    methodCallback.current = refreshAppState;
    refreshAppState();
  }, [api]);

  // useEffect(() => {
  //   console.log(appState);
  // }, [appState]);

  const isLoading = !api || !appState;

  return {
    isLoading,
    api,
    state: appState,
    render_to_canvas: () => api?.render_to_canvas(),
  };
}

export const WasmContext = createContainer(useWasm);
