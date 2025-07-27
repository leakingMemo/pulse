import { Grid, Color, Icon, ActionPanel, Action } from "@raycast/api";

interface Habit {
  id: string;
  name: string;
  completed: boolean;
}

interface HabitsData {
  habits: Habit[];
  completionRate: number;
}

interface Props {
  data?: HabitsData;
}

export function HabitsSection({ data }: Props) {
  const habits = data?.habits ?? [];
  const completedCount = habits.filter(h => h.completed).length;
  const totalCount = habits.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <Grid.Item
      title={`${completionRate}%`}
      subtitle="Today's Progress"
      content={Icon.Checkmark}
      actions={
        <ActionPanel>
          <Action title="View Habit Details" onAction={() => console.log("Habits details")} />
          {habits.map((habit) => (
            <Action 
              key={habit.id} 
              title={`${habit.completed ? '✓' : '○'} ${habit.name}`}
            />
          ))}
        </ActionPanel>
      }
    />
  );
}