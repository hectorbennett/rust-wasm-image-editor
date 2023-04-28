import { useState, MouseEventHandler } from "react";
import { Box, ActionIcon, Menu, Button } from "@mantine/core";
import { IconEye, IconEyeClosed, IconLock, IconLockOff, IconTrash } from "@tabler/icons-react";
import { useRightClick } from "../../hooks";
import LayerLabel from "./LayerLabel";
import LayerThumbnail from "./LayerThumbnail";

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
  getThumbnail?: () => Promise<Uint8ClampedArray | undefined>;
  thumbnailHash?: string;
}

const noop = () => {
  /* noop */
};

export default function Layer({
  name,
  onChangeName = noop,
  locked = false,
  onChangeLocked = noop,
  visible = true,
  onChangeVisible = noop,
  active = false,
  onSetActive = noop,
  onDelete = noop,
  getThumbnail,
  thumbnailHash,
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
        <Button
          pl="xs"
          component="div"
          variant={active ? "light" : "subtle"}
          radius={0}
          styles={{ label: { fontWeight: "lighter" } }}
          sx={{
            display: "flex",
            height: "3rem",
            alignItems: "center",
            width: "100%",
          }}
          ref={rightClickRef}
          onMouseDown={() => {
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
          <Box pl="xs" sx={{ display: "flex", alignItems: "center", width: "100%" }}>
            <LayerThumbnail
              thumbnailHash={thumbnailHash}
              getThumbnail={getThumbnail}
              active={active}
            />
            <LayerLabel name={name} onChangeName={onChangeName} />
          </Box>
        </Button>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Item icon={<IconTrash size={14} />} onClick={() => onDelete()}>
          Delete layer
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}

interface LayerCheckboxProps {
  checked: boolean;
  onClick: MouseEventHandler;
}

function VisibleCheckbox(props: LayerCheckboxProps) {
  return (
    <ActionIcon size="sm" mx={2} onMouseDown={props.onClick}>
      {props.checked ? <IconEye size={12} /> : <IconEyeClosed size={12} />}
    </ActionIcon>
  );
}

function LockedCheckbox(props: LayerCheckboxProps) {
  return (
    <ActionIcon size="sm" mx={2} onMouseDown={props.onClick}>
      {props.checked ? <IconLockOff size={12} /> : <IconLock size={12} />}
    </ActionIcon>
  );
}
