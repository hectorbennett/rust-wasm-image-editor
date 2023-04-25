import { ReactNode, useCallback, useEffect, useState } from "react";

import { Box, useMantineTheme } from "@mantine/core";

export interface Size {
  width?: number;
  height?: number;
}

interface EdgeHandleProps {
  width: number;
  position: "left" | "right";
  onResize: (size: Size) => void;
}

function EdgeHandle(props: EdgeHandleProps) {
  const theme = useMantineTheme();
  const [dragging, setDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startWidth, setStartWidth] = useState(props.width);

  const positionStyle = (() => {
    switch (props.position) {
      case "left":
        return { left: -3, height: "100%", width: 5 };
      case "right":
        return { right: -3, height: "100%", width: 5 };
    }
  })();

  function handleMousedown(e: React.MouseEvent) {
    setDragging(true);
    setStartX(e.clientX);
    setStartWidth(props.width);
  }

  const doDrag = useCallback(
    (e: MouseEvent) => {
      if (props.position == "left") {
        const diff = e.clientX - startX;
        const width = startWidth - diff;
        props.onResize({ width: width });
      } else if (props.position == "right") {
        const diff = e.clientX - startX;
        const width = startWidth + diff;
        props.onResize({ width: width });
      }
    },
    [props, startWidth, startX],
  );

  const stopDrag = useCallback(() => {
    setDragging(false);
    document.documentElement.removeEventListener("mousemove", doDrag, false);
    document.documentElement.removeEventListener("mouseup", stopDrag, false);
  }, [doDrag]);

  useEffect(() => {
    if (dragging) {
      document.documentElement.addEventListener("mousemove", doDrag, false);
      document.documentElement.addEventListener("mouseup", stopDrag, false);
    }
  }, [doDrag, dragging, stopDrag]);

  const colour = theme.colors[theme.primaryColor][theme.primaryShade as number];

  return (
    <Box
      onMouseDown={handleMousedown}
      sx={{
        zIndex: 1000,
        cursor: "e-resize",
        position: "absolute",
        background: colour,
        opacity: dragging ? 1 : 0,

        "&:hover": {
          opacity: 1,
        },
        ...positionStyle,
      }}
    />
  );
}

type handle = "left" | "right" | "top" | "bottom";
type handlePropOptions = "all" | "x" | "y" | Array<handle>;

interface ResizableProps {
  width: number;
  className?: string;
  handles: handlePropOptions;
  children: ReactNode;
  onResize?: (size: Size) => void;
}

function parseHandleProp(h: handlePropOptions): Array<handle> {
  if (h === "all") {
    return ["left", "right", "top", "bottom"];
  } else if (h === "x") {
    return ["left", "right"];
  } else if (h === "y") {
    return ["top", "bottom"];
  }
  return h;
}

export default function Resizable(props: ResizableProps) {
  const [width, setWidth] = useState(props.width);

  const selectedHandles: Array<handle> = parseHandleProp(props.handles);

  function handleResize(size: Size) {
    if (size.width) {
      setWidth(size.width);
    }
    props.onResize && props.onResize(size);
  }
  return (
    <div className={props.className} style={{ width: width, position: "relative" }}>
      {selectedHandles.includes("left") ? (
        <EdgeHandle position="left" onResize={handleResize} width={width} />
      ) : null}
      {props.children}
      {selectedHandles.includes("right") ? (
        <EdgeHandle position="right" onResize={handleResize} width={width} />
      ) : null}
    </div>
  );
}
