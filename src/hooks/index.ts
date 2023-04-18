import { ReactNode, useEffect, useRef, useMemo, RefObject } from "react";
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

export default function useResizeObserver<T extends HTMLElement>(
  ref: RefObject<T>,
  callback: (entry: ResizeObserverEntry) => void,
) {
  // const observer = useMemo(
  //   () =>

  //   [callback],
  // );

  const observer = new ResizeObserver((entries) => {
    callback(entries[0]);
    // for (const entry of entries) {
    //   callback(entry);
    // }
  });

  const element = ref.current;

  useEffect(() => {
    if (!element) {
      return;
    }
    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [element, observer]);
}
