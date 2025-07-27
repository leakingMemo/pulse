import { Grid, ActionPanel, Action } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { getDashboardData } from "./services/dashboard";
import { FinanceSection } from "./components/FinanceSection";
import { HealthSection } from "./components/HealthSection";
import { TasksSection } from "./components/TasksSection";
import { HabitsSection } from "./components/HabitsSection";

export default function Dashboard() {
  const { data, isLoading, error } = usePromise(getDashboardData);

  if (error) {
    return (
      <Grid isLoading={false}>
        <Grid.EmptyView
          title="Failed to load dashboard"
          description={error.message}
        />
      </Grid>
    );
  }

  return (
    <Grid
      isLoading={isLoading}
      navigationTitle="Pulse Dashboard"
      searchBarPlaceholder="Search your dashboard..."
    >
      <Grid.Section title="Overview">
        <FinanceSection data={data?.finance} />
        <HealthSection data={data?.health} />
        <TasksSection data={data?.tasks} />
        <HabitsSection data={data?.habits} />
      </Grid.Section>
    </Grid>
  );
}