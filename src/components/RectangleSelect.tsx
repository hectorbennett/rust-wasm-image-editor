import styles from "./RectangleSelect.module.scss";

import { Rnd } from "react-rnd";

const HANDLE_SIZE = 40;

const cornerStyle = {
  width: HANDLE_SIZE,
  height: HANDLE_SIZE,
  cursor: "default",
};

const edgeStyle = {
  cursor: "default",
};

const LONG_EDGE = `calc(100% - ${HANDLE_SIZE * 2}px)`;

export default function RectangleSelect() {
  return (
    <Rnd
      className={styles.rectangle_select}
      style={{ cursor: "default" }}
      default={{
        x: 0,
        y: 0,
        width: 320,
        height: 200,
      }}
      resizeHandleStyles={{
        topLeft: {
          top: 0,
          left: 0,
          ...cornerStyle,
        },
        top: {
          top: 0,
          width: LONG_EDGE,
          height: HANDLE_SIZE,
          left: HANDLE_SIZE,
          ...edgeStyle,
        },
        topRight: {
          top: 0,
          right: 0,
          ...cornerStyle,
        },
        right: {
          right: 0,
          width: HANDLE_SIZE,
          top: HANDLE_SIZE,
          height: LONG_EDGE,
          ...edgeStyle,
        },
        bottomRight: {
          bottom: 0,
          right: 0,
          ...cornerStyle,
        },
        bottom: {
          bottom: 0,
          width: LONG_EDGE,
          height: HANDLE_SIZE,
          left: HANDLE_SIZE,
          ...edgeStyle,
        },
        bottomLeft: {
          bottom: 0,
          left: 0,
          ...cornerStyle,
        },
        left: {
          left: 0,
          width: HANDLE_SIZE,
          top: HANDLE_SIZE,
          height: LONG_EDGE,
          ...edgeStyle,
        },
      }}
      resizeHandleClasses={{
        topLeft: styles.corner,
        top: styles.edge,
        topRight: styles.corner,
        right: styles.edge,
        bottomRight: styles.corner,
        bottom: styles.edge,
        bottomLeft: styles.corner,
        left: styles.edge,
      }}
    />
  );
}
