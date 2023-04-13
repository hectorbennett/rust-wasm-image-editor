export function getRelativeMouseCoords(event: React.MouseEvent<Element, MouseEvent>, zoom: number) {
  const target = event.target as HTMLElement;
  const rect = target.getBoundingClientRect();
  return [(event.clientX - rect.left) / (zoom / 100), (event.clientY - rect.top) / (zoom / 100)];
}
