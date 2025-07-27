import { Grid, Color, Icon, ActionPanel, Action } from "@raycast/api";

interface Task {
  id: string;
  title: string;
  urgent: boolean;
  dueDate?: Date;
}

interface TasksData {
  urgentTasks: Task[];
  totalTasks: number;
}

interface Props {
  data?: TasksData;
  isLoading?: boolean;
  error?: string;
}

export function TasksSection({ data, isLoading, error }: Props) {
  const urgentCount = data?.urgentTasks?.length ?? 0;
  const totalTasks = data?.totalTasks ?? 0;
  const completedTasks = totalTasks - urgentCount;

  const getTintColor = () => {
    if (error) return Color.Red;
    if (isLoading) return Color.SecondaryText;
    if (urgentCount > 5) return Color.Red;
    if (urgentCount > 2) return Color.Orange;
    return Color.Green;
  };

  const getSubtitle = () => {
    if (isLoading) return "Loading...";
    if (error) return "Error loading data";
    
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    return `${completionRate}% complete • ${totalTasks} total`;
  };

  const getTitle = () => {
    if (isLoading) return "Tasks";
    if (error) return "Tasks Error";
    return urgentCount > 0 ? `⚠️ ${urgentCount} Urgent` : "✅ All Clear";
  };

  return (
    <Grid.Item
      title={getTitle()}
      subtitle={getSubtitle()}
      content={{
        value: {
          source: Icon.CheckCircle,
          tintColor: getTintColor()
        }
      }}
      accessory={urgentCount > 0 ? { text: urgentCount.toString() } : { text: "✓" }}
      actions={
        <ActionPanel>
          <Action title="View Task Details" onAction={() => console.log("Tasks details")} />
          <Action title="Add New Task" onAction={() => console.log("Add task")} shortcut={{ modifiers: ["cmd"], key: "t" }} />
          {data?.urgentTasks?.slice(0, 3).map((task) => (
            <Action key={task.id} title={`→ ${task.title}`} onAction={() => console.log(`Task: ${task.title}`)} />
          )) || null}
        </ActionPanel>
      }
    />
  );
}