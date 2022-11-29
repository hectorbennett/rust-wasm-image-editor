import { useState, MouseEventHandler } from "react";
import {
  SegmentedControl,
  Box,
  ActionIcon,
  TextInput,
  Paper,
} from "@mantine/core";
import { EyeFill, EyeSlash, LockFill, Lock, Plus } from "react-bootstrap-icons";
import { useRightClick } from "../../../hooks";
import { Layer, LayersContext } from "../../../context/layers";

interface LayerCheckboxProps {
  checked: boolean;
  onClick: MouseEventHandler;
}

function VisibleCheckbox(props: LayerCheckboxProps) {
  return (
    <ActionIcon size="sm" onClick={props.onClick}>
      {props.checked ? <EyeFill size={12} /> : <EyeSlash size={12} />}
    </ActionIcon>
  );
}

function LockedCheckbox(props: LayerCheckboxProps) {
  return (
    <ActionIcon size="sm" onClick={props.onClick}>
      {props.checked ? <LockFill size={12} /> : <Lock size={12} />}
    </ActionIcon>
  );
}

function LayerPreview() {
  return (
    <Paper
      shadow="xs"
      radius="xs"
      p={0}
      m={1}
      mx={5}
      withBorder
      sx={{ width: 20, height: 20, background: "white" }}
    />
  );
}

interface LayerLabelProps {
  layer: Layer;
}

function LayerLabel(props: LayerLabelProps) {
  const layers = LayersContext.useContainer();
  const [editMode, setEditMode] = useState(false);
  const [value, setValue] = useState(props.layer.name);
  // function handleDoubleClick(event: MouseEventHandler) {
  //   console.log("double click");
  //   setEditMode(true);
  // }

  function handleBlur() {
    layers.renameLayer(props.layer.id, value);
    setEditMode(false);
  }
  return (
    <Box
      mx={5}
      sx={{ flex: 1, textAlign: "left" }}
      // onDoubleClick={handleDoubleClick}
    >
      {editMode ? (
        <TextInput
          size="xs"
          value={value}
          autoFocus
          onChange={(event) => setValue(event.currentTarget.value)}
          onBlur={handleBlur}
        />
      ) : (
        props.layer.name
      )}
    </Box>
  );
}

interface LayerProps {
  layer: Layer;
}

function LayerRow(props: LayerProps) {
  const layers = LayersContext.useContainer();
  const rightClickRef = useRightClick(function (event: Event) {
    console.log("right click");
    console.log(event);
  });
  //   const ref = useRef<HTMLDivElement>(null);
  return (
    <Box sx={{ display: "flex" }} ref={rightClickRef}>
      <VisibleCheckbox
        checked={props.layer.visible}
        onClick={(e) => {
          e.preventDefault();
          layers.toggleVisibility(props.layer.id);
        }}
      />
      <LockedCheckbox
        checked={props.layer.locked}
        onClick={(e) => {
          e.preventDefault();
          layers.toggleLocked(props.layer.id);
        }}
      />
      <Box
        sx={{ display: "flex", alignItems: "center" }}
        // onClick={() => layers.setActiveLayerId(props.layer.id)}
      >
        <LayerPreview />
        <LayerLabel layer={props.layer} />
      </Box>
    </Box>
  );
}

function NewLayerButton() {
  const layers = LayersContext.useContainer();
  return (
    <ActionIcon
      size="sm"
      onClick={() => {
        layers.addNewLayer();
      }}
    >
      <Plus size={12} />
    </ActionIcon>
  );
}

export default function Layers() {
  const layers = LayersContext.useContainer();
  return (
    <>
      <NewLayerButton />
      <SegmentedControl
        // value={layers.activeLayerId.toString()}
        //   onChange={setValue}
        fullWidth
        orientation="vertical"
        data={layers.layers.map((layer) => ({
          value: layer.uid.toString(),
          label: <LayerRow layer={layer} />,
        }))}
      />
    </>
  );
}
