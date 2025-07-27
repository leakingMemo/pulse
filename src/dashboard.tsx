import { Grid, ActionPanel, Action, Color, Icon } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import { getDashboardData } from "./services/dashboard";
import { FinanceSection } from "./components/FinanceSection";
import { HealthSection } from "./components/HealthSection";
import { TasksSection } from "./components/TasksSection";
import { HabitsSection } from "./components/HabitsSection";
import { ErrorBoundary } from "./components/ErrorBoundary";
import KeyboardShortcuts from "./components/KeyboardShortcuts";

export default function Dashboard() {
  const { data, isLoading, error } = usePromise(getDashboardData);

  if (error) {
    return (
      <Grid isLoading={false}>
        <Grid.EmptyView
          title="😞 Dashboard Error"
          description={`Failed to load: ${error.message}`}
          icon={{
            source: Icon.ExclamationMark,
            tintColor: Color.Red
          }}
          actions={
            <ActionPanel>
              <Action title="Retry" onAction={() => window.location.reload()} />
              <Action title="Report Issue" onAction={() => console.log("Report issue")} />
            </ActionPanel>
          }
        />
      </Grid>
    );
  }

  // Enhanced loading state
  if (isLoading) {
    return (
      <Grid
        isLoading={true}
        navigationTitle="🔄 Loading Pulse..."
        searchBarPlaceholder="Search your dashboard..."
      >
        <Grid.Section title="Loading your data...">
          <Grid.Item
            title="Finance"
            subtitle="Loading balance..."
            content={{
              value: {
                source: Icon.BankNote,
                tintColor: Color.SecondaryText
              }
            }}
          />
          <Grid.Item
            title="Health"
            subtitle="Loading metrics..."
            content={{
              value: {
                source: Icon.Heart,
                tintColor: Color.SecondaryText
              }
            }}
          />
          <Grid.Item
            title="Tasks"
            subtitle="Loading tasks..."
            content={{
              value: {
                source: Icon.CheckCircle,
                tintColor: Color.SecondaryText
              }
            }}
          />
          <Grid.Item
            title="Habits"
            subtitle="Loading progress..."
            content={{
              value: {
                source: Icon.Checkmark,
                tintColor: Color.SecondaryText
              }
            }}
          />
        </Grid.Section>
      </Grid>
    );
  }

  return (
    <Grid
      navigationTitle="⚡ Pulse Dashboard"
      searchBarPlaceholder="Search sections, metrics, or actions..."
      columns={2}
      filtering={true}
      actions={
        <ActionPanel>
          <Action title="Refresh Data" onAction={() => window.location.reload()} shortcut={{ modifiers: ["cmd"], key: "r" }} />
          <Action.Push title="Keyboard Shortcuts" target={<KeyboardShortcuts />} shortcut={{ modifiers: ["cmd"], key: "k" }} />
          <Action title="Settings" onAction={() => console.log("Settings")} shortcut={{ modifiers: ["cmd"], key: "," }} />
        </ActionPanel>
      }
    >
      <Grid.Section title="Life Overview">
        <ErrorBoundary sectionName="Finance">
          <FinanceSection 
            data={data?.finance} 
            isLoading={isLoading}
            error={error?.message}
          />
        </ErrorBoundary>
        
        <ErrorBoundary sectionName="Health">
          <HealthSection 
            data={data?.health} 
            isLoading={isLoading}
            error={error?.message}
          />
        </ErrorBoundary>
        
        <ErrorBoundary sectionName="Tasks">
          <TasksSection 
            data={data?.tasks} 
            isLoading={isLoading}
            error={error?.message}
          />
        </ErrorBoundary>
        
        <ErrorBoundary sectionName="Habits">
          <HabitsSection 
            data={data?.habits} 
            isLoading={isLoading}
            error={error?.message}
          />
        </ErrorBoundary>
      </Grid.Section>
    </Grid>
  );
}