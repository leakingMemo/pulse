import { Grid, Color, Icon, ActionPanel, Action } from "@raycast/api";

interface HealthData {
  exerciseToday: boolean;
  dietStatus: 'good' | 'moderate' | 'poor';
  sleepHours: number;
}

interface Props {
  data?: HealthData;
}

export function HealthSection({ data }: Props) {
  const exerciseToday = data?.exerciseToday ?? false;
  const dietStatus = data?.dietStatus ?? 'moderate';
  const sleepHours = data?.sleepHours ?? 0;

  const dietColor = {
    good: Color.Green,
    moderate: Color.Yellow,
    poor: Color.Red
  }[dietStatus];

  return (
    <Grid.Item
      title={exerciseToday ? "Active Day" : "Rest Day"}
      subtitle={`${sleepHours}h sleep`}
      content={Icon.Heart}
      actions={
        <ActionPanel>
          <Action title="View Health Details" onAction={() => console.log("Health details")} />
          <Action title={`Exercise: ${exerciseToday ? '✓ Completed' : '✗ Not done'}`} />
          <Action title={`Diet: ${dietStatus}`} />
        </ActionPanel>
      }
    />
  );
}