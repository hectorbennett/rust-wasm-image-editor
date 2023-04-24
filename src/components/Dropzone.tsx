// import { useState } from "react";
// import { Group, Text, useMantineTheme, Button, rem } from "@mantine/core";
// import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import { Dropzone as MantineDropzone, IMAGE_MIME_TYPE, FileWithPath } from "@mantine/dropzone";

interface DropzoneProps {
  onDropImages: (files: FileWithPath[]) => void;
}

export default function Dropzone({ onDropImages }: DropzoneProps) {
  //   const theme = useMantineTheme();

  return (
    <MantineDropzone.FullScreen
      active={true}
      accept={IMAGE_MIME_TYPE}
      onDrop={onDropImages}
      sx={(_theme) => ({
        // minHeight: rem(120),
        // display: "flex",
        // justifyContent: "center",
        // alignItems: "center",
        // border: 0,
        backgroundColor: "unset",

        // "&[data-accept]": {
        //   color: theme.white,
        //   backgroundColor: theme.colors.blue[6],
        // },

        // "&[data-reject]": {
        //   color: theme.white,
        //   backgroundColor: theme.colors.red[6],
        // },
      })}
    >
      {/* <Group position="center" spacing="xl" mih={220} sx={{ pointerEvents: "none" }}>
        <MantineDropzone.Accept>
          <IconUpload
            size="3.2rem"
            stroke={1.5}
            color={theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]}
          />
        </MantineDropzone.Accept>
        <MantineDropzone.Reject>
          <IconX
            size="3.2rem"
            stroke={1.5}
            color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
          />
        </MantineDropzone.Reject>
        <MantineDropzone.Idle>
          <IconPhoto size="3.2rem" stroke={1.5} />
        </MantineDropzone.Idle>

        <div>
          <Text size="xl" inline>
            Drag images here or click to select files
          </Text>
          <Text size="sm" color="dimmed" inline mt={7}>
            Attach as many files as you like, each file should not exceed 5mb
          </Text>
        </div>
      </Group> */}
    </MantineDropzone.FullScreen>
  );
}
