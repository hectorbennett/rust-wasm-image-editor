import { useEffect, useRef, useState } from "react";
import { createContainer } from "unstated-next";
import { useEffectOnce } from "../hooks";
import { getApi } from "../utils/wasm";
import api_demo from "../utils/api_demo";

function useWasm() {
  const [appState, setAppState] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const apiRef = useRef(null);

  const refreshState = () => {
    apiRef.current.state.then((state) => {
      setAppState(() => state);
    });
  };

  useEffectOnce(() => {
    (async () => {
      const api = await getApi(() => refreshState());
      apiRef.current = api;
      refreshState();
      setIsLoaded(true);
      api_demo(apiRef.current);
    })();
  });

  return {
    isLoading: !isLoaded || !appState,
    api: isLoaded && appState ? apiRef.current : null,
    state: appState,
  };
}

export const WasmContext = createContainer(useWasm);
