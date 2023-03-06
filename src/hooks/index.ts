import { useEffect, useRef } from "react";

export function useRightClick(callback: Function) {
    const ref = useRef<HTMLDivElement>(null);
    function handleContextMenu(event: Event) {
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
