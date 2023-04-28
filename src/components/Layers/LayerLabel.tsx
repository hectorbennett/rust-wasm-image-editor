import { Box, TextInput } from "@mantine/core";
import { useState } from "react";

interface LayerLabelProps {
  name: string;
  onChangeName: (name: string) => void;
}

export default function LayerLabel({ name, onChangeName }: LayerLabelProps) {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [value, setValue] = useState<string>(name);

  function handleBlur() {
    onChangeName(value);
    setEditMode(false);
  }

  function handleDoubleClick() {
    setEditMode(true);
  }

  return (
    <Box
      mx="md"
      sx={{ flex: 1, textAlign: "left", width: "100%" }}
      onDoubleClick={handleDoubleClick}
    >
      {editMode ? (
        <form onSubmit={handleBlur}>
          <TextInput
            size="xs"
            autoFocus
            onChange={(event) => setValue(event.currentTarget.value)}
            onBlur={handleBlur}
            width="100%"
          />
        </form>
      ) : (
        name
      )}
    </Box>
  );
}
