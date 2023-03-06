import { ReactNode, useEffect, useState } from "react";

import { Box, ThemeIcon, useMantineTheme } from "@mantine/core";

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

  function handleMousedown(e: any) {
    setDragging(true);
    setStartX(e.clientX);
    setStartWidth(props.width);
  }

  useEffect(() => {
    if (dragging) {
      document.documentElement.addEventListener("mousemove", doDrag, false);
      document.documentElement.addEventListener("mouseup", stopDrag, false);
    }
  }, [startX]);

  function doDrag(e: any) {
    if (props.position == "left") {
      const diff = e.clientX - startX;
      const width = startWidth - diff;
      props.onResize({ width: width });
    } else if (props.position == "right") {
      const diff = e.clientX - startX;
      const width = startWidth + diff;
      props.onResize({ width: width });
    }
  }

  function stopDrag(e: any) {
    setDragging(false);
    document.documentElement.removeEventListener("mousemove", doDrag, false);
    document.documentElement.removeEventListener("mouseup", stopDrag, false);
  }

  const colour = theme.colors[theme.primaryColor][theme.primaryShade as number];

  return (
    <Box
      onMouseDown={handleMousedown}
      sx={{
        zIndex: 1000,
        cursor: "e-resize",
        position: "absolute",
        // background: theme.primaryColor,
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

interface ResizableProps {
  width: number;
  className: string;
  handles: Array<"left" | "right">;
  children: ReactNode;
  onResize: (size: Size) => void;
}

export default function Resizable(props: ResizableProps) {
  const [width, setWidth] = useState(props.width);

  function handleResize(size: Size) {
    if (size.width) {
      setWidth(size.width);
    }
    props.onResize(size);
  }
  return (
    <div className={props.className} style={{ width: width, position: "relative" }}>
      {props.handles.includes("left") ? (
        <EdgeHandle position="left" onResize={handleResize} width={width} />
      ) : null}
      {props.children}
      {props.handles.includes("right") ? (
        <EdgeHandle position="right" onResize={handleResize} width={width} />
      ) : null}
    </div>
  );
}
