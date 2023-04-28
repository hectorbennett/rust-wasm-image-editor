import { Box, Table, UnstyledButton } from "@mantine/core";
import KeyboardShortcut from "src/components/KeyboardShortcut";

import { CommandsContext, SettingsContext } from "src/context";
import type { KeyboardShortcutName } from "src/context/settings";
import { CommandTypeBadge } from "src/components/CommandTypeBadge";

interface EditKeyboardShortcutProps {
  shortcutName: KeyboardShortcutName;
}

function EditKeyboardShortcut(props: EditKeyboardShortcutProps) {
  // const [inEditMode, setInEditMode] = useState(false);
  const settings = SettingsContext.useContainer();

  // if (inEditMode) {
  //   return (
  //     <Input.Wrapper
  //       size="xs"
  //       // autoFocus
  //       onBlur={() => setInEditMode(false)}
  //       placeholder="Enter new shortcut"
  //     >
  //       <div>Hello world</div>
  //     </Input.Wrapper>
  //   );
  // }

  if (props.shortcutName in settings.keyboardShortcuts) {
    return (
      <UnstyledButton
      // onFocus={() => setInEditMode(true)}
      >
        {/* <KeyboardShortcut keys={settings.keyboardShortcuts[props.shortcutName]} /> */}
      </UnstyledButton>
    );
  }
  return <>shortcut</>;
}

function Demo() {
  const commands = CommandsContext.useContainer();

  const rows = commands.commands.map((command) => (
    <tr key={command.id}>
      <td style={{ textAlign: "center" }}>
        <CommandTypeBadge category={command.category} />
      </td>
      <td style={{ width: "100%" }}>{command.label}</td>
      <td>
        <EditKeyboardShortcut shortcutName={command.id as KeyboardShortcutName} />
      </td>
    </tr>
  ));

  return (
    <Table>
      {/* <thead>
        <tr>
          <th>Category</th>
          <th>Name</th>
          <th>Keyboard shortcut</th>
        </tr>
      </thead> */}
      <tbody>{rows}</tbody>
    </Table>
  );
}

export function KeyboardShortcutsTab() {
  return (
    <Box>
      <Demo />
    </Box>
  );
}
