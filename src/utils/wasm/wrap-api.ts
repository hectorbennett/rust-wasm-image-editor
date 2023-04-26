import * as Comlink from "comlink";

export default function wrapApi(api) {
  return {
    api,
    rawImageData: () => {
      const data = api.get_workspace_buffer();
      return Comlink.transfer(data, [data.buffer]);
    },
  };
}
