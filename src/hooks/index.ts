import { ReactNode, useEffect, useRef, RefObject, useMemo } from "react";
import { ContextMenuContext } from "../components/ContextMenu";

export function useRightClick<T extends HTMLElement>(callback: (event: MouseEvent) => unknown) {
  const ref = useRef<T>(null);

  useEffect(() => {
    function handleContextMenu(event: MouseEvent) {
      event.preventDefault();
      callback(event);
    }
    const el = ref.current;

    if (!el) {
      return;
    }
    el.addEventListener("contextmenu", handleContextMenu);
    return () => {
      if (!el) {
        return;
      }
      el.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [callback]);
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

export function useResizeObserver<T extends HTMLElement>(
  ref: RefObject<T>,
  callback: (entry: ResizeObserverEntry) => void,
) {
  const observer = useMemo(() => {
    return new ResizeObserver((entries) => {
      callback(entries[0]);
    });
  }, [callback]);

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

export function useEffectOnce(callback: () => void) {
  const hasRunOnce = useRef(false);
  useEffect(() => {
    if (!hasRunOnce.current) {
      callback();
      hasRunOnce.current = true;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
