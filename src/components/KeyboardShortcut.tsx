import { Fragment } from "react";
import { Kbd, Text } from "@mantine/core";

interface KeyboardShortcutProps {
  keys: string;
}

export default function KeyboardShortcut(props: KeyboardShortcutProps) {
  const keys = props.keys.split("+");
  return (
    <>
      {keys.map((key, i) => {
        if (i === keys.length - 1) {
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
