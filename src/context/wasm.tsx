import { useRef, useState } from "react";
import { createContainer } from "unstated-next";
import { useEffectOnce } from "../hooks";
import { getApi } from "../utils/wasm";

function useWasm() {
  const [appState, setAppState] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const apiRef = useRef(null);
  const getRawImageDataRef = useRef(null);

  useEffectOnce(() => {
    (async () => {
      const { api, rawImageData } = await getApi();
      apiRef.current = api;
      getRawImageDataRef.current = rawImageData;
      setIsLoaded(true);
    })();
  });

  return {
    isLoading: !isLoaded,
    api: isLoaded ? apiRef.current : null,
    state: appState,
    get_image_buffer: () => (isLoaded ? getRawImageDataRef.current() : null),
  };
}

export const WasmContext = createContainer(useWasm);
