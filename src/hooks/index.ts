import { ReactNode, useEffect, useRef } from "react";
import { ContextMenuContext } from "../components/ContextMenu";

export function useRightClick<T extends HTMLElement>(callback: (event: MouseEvent) => unknown) {
  const ref = useRef<T>(null);
  function handleContextMenu(event: MouseEvent) {
    event.preventDefault();
    callback(event);
  }
  useEffect(() => {
    if (!ref.current) {
      return;
    }
    ref.current.addEventListener("contextmenu", handleContextMenu);
    return () => {
      if (!ref.current) {
        return;
      }
      ref.current.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [ref]);
  return ref;
}

export function useRightClickMenu(menuContent: ReactNode) {
  const context = ContextMenuContext.useContainer();

  const rightClickRef = useRightClick((event) => {
    context.setMenuContent(menuContent);
    context.setCoords({ x: event.pageX, y: event.pageY });
  });
  return rightClickRef;
}
