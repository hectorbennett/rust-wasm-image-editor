import initWasm, { Api } from "wasm";

import { useEffect, useRef, useState } from "react";
import { createContainer } from "unstated-next";
import { Project } from "./activeProject";

interface AppState {
  projects: Map<string, Project>;
  active_project_uid: string | null;
}

const DEFAULT_APP_STATE: AppState = {
  projects: new Map(),
  active_project_uid: null,
};

const useWasmApi = ({ methodCallback }: { methodCallback: () => void }) => {
  const [api, setApi] = useState<null | Api>(null);
  const inited = useRef(false);
  useEffect(() => {
    if (inited.current) {
      return;
    }
    inited.current = true;
    initWasm().then(() => {
      const apiHandler: ProxyHandler<Api> = {
        get(target: Api, prop: string, _receiver: unknown) {
          const p = Reflect.get(target, prop);
          if (p instanceof Function) {
            return (...args: Array<unknown>) => {
              const result = p.apply(target, args);
              methodCallback();
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
  const [appState, setAppState] = useState<AppState>(DEFAULT_APP_STATE);
  const methodCallback = useRef<() => void>(() => {
    /* noop */
  });
  const api = useWasmApi({
    methodCallback: () => {
      methodCallback.current();
    },
  });

  useEffect(() => {
    const refreshAppState = () => setAppState(() => (api ? api.state : DEFAULT_APP_STATE));
    methodCallback.current = refreshAppState;
    refreshAppState();
  }, [api]);

  const isLoading = !api || !appState;

  return {
    isLoading,
    api,
    state: appState,
  };
}

export const WasmContext = createContainer(useWasm);
