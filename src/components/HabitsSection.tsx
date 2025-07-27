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
  isLoading?: boolean;
  error?: string;
}

export function HabitsSection({ data, isLoading, error }: Props) {
  const habits = data?.habits ?? [];
  const completedCount = habits.filter(h => h.completed).length;
  const totalCount = habits.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const getTintColor = () => {
    if (error) return Color.Red;
    if (isLoading) return Color.SecondaryText;
    if (completionRate >= 80) return Color.Green;
    if (completionRate >= 50) return Color.Orange;
    return Color.Red;
  };

  const getSubtitle = () => {
    if (isLoading) return "Loading...";
    if (error) return "Error loading data";
    
    const streak = completionRate >= 80 ? "🔥 Great streak!" : "🎯 Keep going";
    return `${completedCount}/${totalCount} done • ${streak}`;
  };

  const getTitle = () => {
    if (isLoading) return "Habits";
    if (error) return "Habits Error";
    if (completionRate >= 100) return "🏆 Perfect Day!";
    if (completionRate >= 80) return "✨ Excellent!";
    return `${completionRate}% Complete`;
  };

  return (
    <Grid.Item
      title={getTitle()}
      subtitle={getSubtitle()}
      content={{
        value: {
          source: Icon.Checkmark,
          tintColor: getTintColor()
        }
      }}
      accessory={{ text: `${completionRate}%` }}
      actions={
        <ActionPanel>
          <Action title="View Habit Details" onAction={() => console.log("Habits details")} />
          <Action title="Log Habit" onAction={() => console.log("Log habit")} shortcut={{ modifiers: ["cmd"], key: "h" }} />
          {habits.map((habit) => (
            <Action 
              key={habit.id} 
              title={`${habit.completed ? '✓' : '○'} ${habit.name}`}
              onAction={() => console.log(`Toggle: ${habit.name}`)}
            />
          ))}
        </ActionPanel>
      }
    />
  );
}