export function getRelativeMouseCoords(
  event: React.MouseEvent<Element, MouseEvent>,
  zoom: number,
  x: number,
  y: number,
) {
  const target = event.target as HTMLElement;
  const rect = target.getBoundingClientRect();
  return [
    (event.clientX - rect.left - x) / (zoom / 100),
    (event.clientY - rect.top - y) / (zoom / 100),
  ];
}
