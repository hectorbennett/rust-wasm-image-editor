import { useState, MouseEventHandler, useRef, useEffect } from "react";
import { Box, ActionIcon, TextInput, Menu } from "@mantine/core";
import { EyeFill, EyeSlash, LockFill, Lock, Trash } from "react-bootstrap-icons";
import { useRightClick } from "../hooks";

interface LayerProps {
  name: string;
  onChangeName?: (name: string) => void;
  locked?: boolean;
  onChangeLocked?: (locked: boolean) => void;
  visible?: boolean;
  onChangeVisible?: (visible: boolean) => void;
  active?: boolean;
  onSetActive?: () => void;
  onDelete?: () => void;
  thumbnail?: ImageData;
}

const noop = () => {
  /* noop */
};

export function Layer({
  name,
  onChangeName = noop,
  locked = false,
  onChangeLocked = noop,
  visible = true,
  onChangeVisible = noop,
  active = false,
  onSetActive = noop,
  onDelete = noop,
  thumbnail,
}: LayerProps) {
  const [menuIsOpen, setMenuIsOpen] = useState(false);
  const rightClickRef = useRightClick<HTMLDivElement>(function (_event: Event) {
    setMenuIsOpen(true);
  });

  return (
    <Menu
      position="bottom-start"
      withinPortal={true}
      width="target"
      opened={menuIsOpen}
      onChange={(val) => {
        if (!val) {
          setMenuIsOpen(false);
        }
      }}
    >
      <Menu.Target>
        <Box
          pl="xs"
          sx={{
            display: "flex",
            height: 50,
            alignItems: "center",
            // border: "1px solid grey",
            background: active ? "rgba(255, 255, 255, 0.05)" : undefined,
          }}
          ref={rightClickRef}
          onClick={() => {
            console.log("click!");
            onSetActive();
          }}
        >
          <VisibleCheckbox
            checked={visible}
            onClick={(e) => {
              e.preventDefault();
              onChangeVisible(!visible);
            }}
          />
          <LockedCheckbox
            checked={locked}
            onClick={(e) => {
              e.preventDefault();
              onChangeLocked(!locked);
            }}
          />
          {/* <LayerThumbnail thumbnail={thumbnail} />
          <LayerLabel name={name} onChangeName={onChangeName} /> */}
          <Box
            pl="xs"
            sx={{ display: "flex", alignItems: "center", width: "100%" }}
            // onClick={() => layers.setActiveLayerId(props.layer.id)}
          >
            <LayerThumbnail thumbnail={thumbnail} />
            <LayerLabel name={name} onChangeName={onChangeName} />
          </Box>
        </Box>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item icon={<Trash size={14} />} onClick={() => onDelete()}>
          Delete layer
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

interface LayerLabelProps {
  name: string;
  onChangeName: (name: string) => void;
}

function LayerLabel({ name, onChangeName }: LayerLabelProps) {
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
      mx="sm"
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

interface LayerCheckboxProps {
  checked: boolean;
  onClick: MouseEventHandler;
}

function VisibleCheckbox(props: LayerCheckboxProps) {
  return (
    <ActionIcon size="sm" mx={2} onClick={props.onClick}>
      {props.checked ? <EyeFill size={12} /> : <EyeSlash size={12} />}
    </ActionIcon>
  );
}

function LockedCheckbox(props: LayerCheckboxProps) {
  return (
    <ActionIcon size="sm" mx={2} onClick={props.onClick}>
      {props.checked ? <LockFill size={12} /> : <Lock size={12} />}
    </ActionIcon>
  );
}

function LayerThumbnail({ thumbnail }: { thumbnail?: ImageData }) {
  const ref = useRef<HTMLCanvasElement>(null);

  const width = 30;
  const height = 30;

  useEffect(() => {
    if (!thumbnail) {
      return;
    }
    const canvas = ref.current;
    if (!canvas) {
      return;
    }
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.putImageData(thumbnail, 0, 0);
  }, [thumbnail]);

  return (
    <canvas
      ref={ref}
      width={width}
      height={height}
      style={{
        background:
          "repeating-conic-gradient(rgb(135, 135, 135) 0%, rgb(135, 135, 135) 25%, rgb(90, 90, 90) 0%, rgb(90, 90, 90) 50%) 50% center / 10px 10px",
      }}
    />
  );
}
