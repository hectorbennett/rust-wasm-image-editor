import { useState, MouseEventHandler, useRef, useEffect } from "react";
import { Box, ActionIcon, TextInput, Menu } from "@mantine/core";
import { EyeFill, EyeSlash, LockFill, Lock, Plus, Trash } from "react-bootstrap-icons";
import { useRightClick } from "../../../hooks";
import { LayersContext } from "../../../context/layers";
import { WasmContext } from "../../../context/wasm";

import { LayerSerializer } from "wasm";
import Sortable, { Item } from "../../../components/Sortable";

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

interface LayerThumbnailProps {
  layer: LayerSerializer;
}

function LayerThumbnail(props: LayerThumbnailProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  const wasm = WasmContext.useContainer();

  const width = 20;
  const height = 20;

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    const newData = ctx.createImageData(width, height);
    if (wasm.api) {
      newData.data.set(wasm.api.get_layer_thumbnail(BigInt(props.layer.uid)));
    }
    ctx.putImageData(newData, 0, 0);
  }, [props.layer.thumbnail_hash]);

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      style={{
        background:
          "repeating-conic-gradient(rgb(135, 135, 135) 0%, rgb(135, 135, 135) 25%, rgb(90, 90, 90) 0%, rgb(90, 90, 90) 50%) 50% center / 5px 5px",
      }}
    />
  );
}

interface LayerLabelProps {
  layer: LayerSerializer;
}

function LayerLabel(props: LayerLabelProps) {
  const layers = LayersContext.useContainer();
  const [editMode, setEditMode] = useState(false);
  const [value, setValue] = useState(props.layer.name);

  function handleBlur() {
    layers.renameLayer(props.layer.uid, value);
    setEditMode(false);
  }

  function handleDoubleClick() {
    setEditMode(true);
  }

  // const form = useForm();

  return (
    <Box mx={5} sx={{ flex: 1, textAlign: "left" }} onDoubleClick={handleDoubleClick}>
      {editMode ? (
        <form onSubmit={handleBlur}>
          <TextInput
            size="xs"
            autoFocus
            onChange={(event) => setValue(event.currentTarget.value)}
            onBlur={handleBlur}
          />
        </form>
      ) : (
        props.layer.name
      )}
    </Box>
  );
}

interface LayerProps {
  layer: LayerSerializer;
}

function LayerRow(props: LayerProps) {
  const layers = LayersContext.useContainer();
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const rightClickRef = useRightClick<HTMLDivElement>(function (_event: Event) {
    setMenuIsOpen(true);
  });
  return (
    <>
      <Menu
        withArrow
        position="bottom-end"
        arrowPosition="center"
        withinPortal={true}
        opened={menuIsOpen}
        onChange={(val) => {
          if (!val) {
            setMenuIsOpen(false);
          }
        }}
      >
        <Menu.Target>
          <Box sx={{ display: "flex" }} ref={rightClickRef}>
            <VisibleCheckbox
              checked={props.layer.visible}
              onClick={(e) => {
                e.preventDefault();
                layers.setLayerVisibility(props.layer.uid, !props.layer.visible);
              }}
            />
            <LockedCheckbox
              checked={props.layer.locked}
              onClick={(e) => {
                e.preventDefault();
                layers.setLayerLocked(props.layer.uid, !props.layer.locked);
              }}
            />
            <Box
              sx={{ display: "flex", alignItems: "center" }}
              // onClick={() => layers.setActiveLayerId(props.layer.id)}
            >
              <LayerThumbnail layer={props.layer} />
              <LayerLabel layer={props.layer} />
            </Box>
          </Box>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item icon={<Trash size={14} />} onClick={() => layers.deleteLayer(props.layer.uid)}>
            Delete layer
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
}

function NewLayerButton() {
  const layers = LayersContext.useContainer();
  return (
    <ActionIcon
      size="sm"
      onClick={() => {
        layers.createNewLayer();
      }}
    >
      <Plus size={12} />
    </ActionIcon>
  );
}

export default function Layers() {
  const layers = LayersContext.useContainer();
  const wasm = WasmContext.useContainer();

  const l = layers.layers?.slice(0).reverse() || [];

  const onChange = (items: Item[]) => {
    const biguint64 = new BigUint64Array(items.length);

    items.forEach((item, index) => {
      biguint64[items.length - index - 1] = BigInt(item.id);
    });

    wasm.api?.reeorder_layers(biguint64);
  };

  return (
    <>
      <NewLayerButton />
      <Sortable
        onChange={onChange}
        items={l.map((layer) => ({ id: layer.uid, component: <LayerRow layer={layer} /> }))}
      />
    </>
  );
}
