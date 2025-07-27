import { Keyboard } from "@raycast/api";

export const shortcuts = {
  // Global shortcuts
  refresh: { modifiers: ["cmd"] as const, key: "r" as const },
  settings: { modifiers: ["cmd"] as const, key: "," as const },
  
  // Section-specific shortcuts
  finance: {
    logExpense: { modifiers: ["cmd"] as const, key: "e" as const },
    viewDetails: { modifiers: ["cmd", "shift"] as const, key: "f" as const }
  },
  
  health: {
    logWorkout: { modifiers: ["cmd"] as const, key: "w" as const },
    viewDetails: { modifiers: ["cmd", "shift"] as const, key: "h" as const }
  },
  
  tasks: {
    addTask: { modifiers: ["cmd"] as const, key: "t" as const },
    viewDetails: { modifiers: ["cmd", "shift"] as const, key: "t" as const }
  },
  
  habits: {
    logHabit: { modifiers: ["cmd"] as const, key: "h" as const },
    viewDetails: { modifiers: ["cmd", "shift"] as const, key: "b" as const }
  }
};

export const keyboardHelp = {
  "⌘ R": "Refresh Dashboard",
  "⌘ ,": "Open Settings",
  "⌘ E": "Log Expense",
  "⌘ W": "Log Workout", 
  "⌘ T": "Add Task",
  "⌘ H": "Log Habit",
  "⌘ ⇧ F": "Finance Details",
  "⌘ ⇧ H": "Health Details",
  "⌘ ⇧ T": "Task Details",
  "⌘ ⇧ B": "Habit Details"
};

export function getKeyboardHelpText(): string {
  return Object.entries(keyboardHelp)
    .map(([shortcut, description]) => `${shortcut}: ${description}`)
    .join("\n");
}