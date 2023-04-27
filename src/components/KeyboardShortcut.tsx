import { Fragment } from "react";
import { Kbd, Text } from "@mantine/core";

interface KeyboardShortcutProps {
  keys: Array<string>;
}

export default function KeyboardShortcut(props: KeyboardShortcutProps) {
  return (
    <>
      {props.keys.map((key, i) => {
        if (i === props.keys.length - 1) {
          return (
            <Kbd size="xs" key={key as string}>
              {key}
            </Kbd>
          );
        }
        return (
          <Fragment key={key as string}>
            <Kbd size="xs">{key}</Kbd>
            <Text fz="xs" component="span">
              {" "}
              +{" "}
            </Text>
          </Fragment>
        );
      })}
    </>
  );
}
