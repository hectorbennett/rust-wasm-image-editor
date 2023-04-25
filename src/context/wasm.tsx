import { useEffect, useRef, useState } from "react";
import { createContainer } from "unstated-next";
import * as Comlink from "comlink";

async function getApi() {
  const c = Comlink.wrap<any>(
    new Worker(new URL("../wasm.worker.ts", import.meta.url), {
      type: "module",
    }),
  );
  return await c.handler;
}

function wrapApiWithCallback(api: any, callback: any) {
  /* Perform callback any time any api method is called */
  const methods_without_callback = ["render_to_canvas", "scroll_workspace", "zoom_workspace"];
  const apiHandler: ProxyHandler<any> = {
    get(target: any, prop: string, _receiver: unknown) {
      console.log(`target:`);
      console.log(target);
      console.log(`prop: ${prop}`);
      console.log(`_receiver: ${_receiver}`);
      if (!target) {
        return null;
      }
      const p = Reflect.get(target, prop);
      if (p instanceof Function) {
        console.log("hi");
        console.log(target);
        console.log(prop);
        console.log(p);
        // return (...args: Array<unknown>) => {
        //   const result = p.apply(target, args);
        //   if (!methods_without_callback.includes(prop)) {
        //     console.log(prop);
        //     callback();
        //   }
        //   return result;
        // };
      } else {
        // return p;
      }
    },
  };
  return new Proxy(api, apiHandler);
}

const useWasmApiHandler = () => {
  const inited = useRef(false);
  const handler = useRef();
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    (async () => {
      if (inited.current) {
        return;
      }
      inited.current = true;

      handler.current = await getApi();
      setLoaded(true);
    })();
  }, []);

  return {
    handler: loaded ? handler.current : null,
    loaded,
  };
};

function useWasm() {
  const [appState, setAppState] = useState<any>(null);
  const { handler, loaded } = useWasmApiHandler();

  const api = handler ? handler.api : null;

  const refreshState = async () => {
    if (!api) {
      return;
    }
    const state = await api.state;
    setAppState(state);
  };

  const demo = async () => {
    await api.create_project();
    refreshState();
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!loaded) {
      return;
    }
    demo();
  }, [loaded]);

  const wasm = {
    // isLoading: true,
    // api,
    isLoading: !loaded,
    api: loaded ? api : null,
    state: appState,
    render_to_canvas: () => {
      // console.log("render_to_canvas");
      api?.render_to_canvas();
    },
  };

  console.log(wasm);

  return wasm;
}

export const WasmContext = createContainer(useWasm);
