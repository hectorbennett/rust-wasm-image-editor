import { Api } from "../wasm/pkg/wasm";

export function getProjectMouseCoords(event: React.MouseEvent<Element, MouseEvent>, api: Api) {
  const zoom = api.state.workspace.zoom;
  const x = api.state.workspace.x;
  const y = api.state.workspace.y;
  const target = event.target as HTMLElement;
  const rect = target.getBoundingClientRect();
  return [
    (event.clientX - rect.left - x) / (zoom / 100),
    (event.clientY - rect.top - y) / (zoom / 100),
  ];
}

export function getWorkspaceMouseCoords(event: React.MouseEvent<Element, MouseEvent>) {
  const target = event.target as HTMLElement;
  const rect = target.getBoundingClientRect();
  return [event.clientX - rect.left, event.clientY - rect.top];
}
