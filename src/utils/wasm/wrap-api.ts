import * as Comlink from "comlink";

export default function wrapApi(api) {
  return {
    api,
    rawImageData: (width: number, height: number) => {
      const data = api.get_workspace_buffer(width, height);
      return Comlink.transfer(data, [data.buffer]);
    },
  };
}
