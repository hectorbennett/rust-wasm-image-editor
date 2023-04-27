import { ActionIcon, Title, Box, Divider } from "@mantine/core";
import { Plus } from "react-bootstrap-icons";
import { LayersContext } from "src/context/layers";
import { WasmContext } from "src/context/wasm";

import Sortable, { Item } from "src/components/Sortable";
import { Layer } from "src/components/Layers";
import PaneTitle from "src/components/PaneTitle";
import PaneSection from "src/components/PaneSection";

function NewLayerButton() {
  const layers = LayersContext.useContainer();
  return (
    <ActionIcon
      // size="sm"
      onClick={() => {
        layers.createNewLayer();
      }}
    >
      <Plus size={16} />
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
    <PaneSection title="Layers" titleRightSection={<NewLayerButton />}>
      <Sortable
        onChange={onChange}
        items={l.map((layer) => ({
          id: layer.uid,
          component: (
            <Layer
              name={layer.name}
              onChangeName={(name: string) => layers.renameLayer(layer.uid, name)}
              locked={layer.locked}
              onChangeLocked={(locked: boolean) => layers.setLayerLocked(layer.uid, locked)}
              visible={layer.visible}
              onChangeVisible={(visible: boolean) => layers.setLayerVisibility(layer.uid, visible)}
              active={layer.uid === layers.active_layer_uid}
              onSetActive={() => layers.setActiveLayer(layer.uid)}
              onDelete={() => layers.deleteLayer(layer.uid)}
              getThumbnail={() => layers.getThumbnail(layer.uid)}
              thumbnailHash={layer.thumbnail_hash}
            />
          ),
        }))}
      />
    </PaneSection>
  );
}
