import { ReactNode, useState } from "react";
// import { usePopper } from "react-popper";
import { createContainer } from "unstated-next";

interface Coords {
  x: number;
  y: number;
}

function useContextMenuContainer() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [coords, setCoords] = useState<Coords>({ x: 0, y: 0 });
  const [menuContent, setMenuContent] = useState<ReactNode>(<div>Hi :)</div>);

  return {
    isOpen,
    setIsOpen,
    coords,
    setCoords,
    menuContent,
    setMenuContent,
  };
}

export const ContextMenuContext = createContainer(useContextMenuContainer);

// export function ContextMenuProvider({ children }: { children: ReactNode }) {
//   return <Inner>{children}</Inner>;
// }

// interface PopupStyle {
//   position: "absolute";
//   left?: number;
//   right?: number;
//   top?: number;
//   bottom?: number;
// }

// function getStyle({ x, y }: { x: number; y: number }) {
//   const windowSize = { width: window.innerWidth, height: window.innerHeight };
//   /* if in the top-left of the screen, use the top-left as the origin, etc. */
//   const s: PopupStyle = {
//     position: "absolute",
//   };

//   if (x < windowSize.width / 2) {
//     s["left"] = x;
//   } else {
//     s["right"] = windowSize.width - x;
//   }

//   if (y < windowSize.height / 2) {
//     s["top"] = y;
//   } else {
//     s["bottom"] = windowSize.height - y;
//   }

//   return s;
// }

export function ContextMenuWrapper({ children }: { children: ReactNode }) {
  const context = ContextMenuContext.useContainer();

  const handleUnfocus = (event: React.MouseEvent) => {
    context.setIsOpen(false);
    context.setMenuContent(null);
  };

  return <div onClick={handleUnfocus}>{children}</div>;
}
