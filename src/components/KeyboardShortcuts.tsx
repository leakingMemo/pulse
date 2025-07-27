import { Detail, ActionPanel, Action } from "@raycast/api";
import { keyboardHelp } from "../utils/keyboard";

export default function KeyboardShortcuts() {
  const helpText = Object.entries(keyboardHelp)
    .map(([shortcut, description]) => `**${shortcut}** - ${description}`)
    .join("\n\n");

  const markdown = `
# ⌨️ Keyboard Shortcuts

${helpText}

---

## Tips
- Use shortcuts to quickly log data without navigating through menus
- All shortcuts work from the main dashboard view
- Combine shortcuts for faster workflow (e.g., ⌘R to refresh after logging)
`;

  return (
    <Detail
      markdown={markdown}
      navigationTitle="Keyboard Shortcuts"
      actions={
        <ActionPanel>
          <Action.Push title="Back to Dashboard" target={<div></div>} />
        </ActionPanel>
      }
    />
  );
}