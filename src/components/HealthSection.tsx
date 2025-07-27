import { Grid, Color, Icon, ActionPanel, Action } from "@raycast/api";

interface HealthData {
  exerciseToday: boolean;
  dietStatus: 'good' | 'moderate' | 'poor';
  sleepHours: number;
}

interface Props {
  data?: HealthData;
  isLoading?: boolean;
  error?: string;
}

export function HealthSection({ data, isLoading, error }: Props) {
  const exerciseToday = data?.exerciseToday ?? false;
  const dietStatus = data?.dietStatus ?? 'moderate';
  const sleepHours = data?.sleepHours ?? 0;

  const dietColor = {
    good: Color.Green,
    moderate: Color.Yellow,
    poor: Color.Red
  }[dietStatus];

  const getTintColor = () => {
    if (error) return Color.Red;
    if (isLoading) return Color.SecondaryText;
    return exerciseToday ? Color.Green : Color.Orange;
  };

  const getSubtitle = () => {
    if (isLoading) return "Loading...";
    if (error) return "Error loading data";
    
    const sleepStatus = sleepHours >= 7 ? "✅" : sleepHours >= 6 ? "⚠️" : "❌";
    return `${sleepStatus} ${sleepHours}h sleep • Diet: ${dietStatus}`;
  };

  const getTitle = () => {
    if (isLoading) return "Health Status";
    if (error) return "Health Error";
    return exerciseToday ? "✨ Active Day" : "🛋️ Rest Day";
  };

  return (
    <Grid.Item
      title={getTitle()}
      subtitle={getSubtitle()}
      content={{
        value: {
          source: Icon.Heart,
          tintColor: getTintColor()
        }
      }}
      accessory={exerciseToday ? { text: "✓" } : { text: "⏸️" }}
      actions={
        <ActionPanel>
          <Action title="View Health Details" onAction={() => console.log("Health details")} />
          <Action title="Log Workout" onAction={() => console.log("Log workout")} shortcut={{ modifiers: ["cmd"], key: "w" }} />
          <Action title={`Exercise: ${exerciseToday ? '✓ Completed' : '✗ Not done'}`} />
          <Action title={`Diet: ${dietStatus}`} />
        </ActionPanel>
      }
    />
  );
}