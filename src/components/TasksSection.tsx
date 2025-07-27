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
}

export function TasksSection({ data }: Props) {
  const urgentCount = data?.urgentTasks?.length ?? 0;
  const totalTasks = data?.totalTasks ?? 0;

  return (
    <Grid.Item
      title={`${urgentCount} Urgent`}
      subtitle={`${totalTasks} total tasks`}
      content={Icon.CheckCircle}
      actions={
        <ActionPanel>
          <Action title="View Task Details" onAction={() => console.log("Tasks details")} />
          {data?.urgentTasks?.slice(0, 3).map((task) => (
            <Action key={task.id} title={`→ ${task.title}`} />
          )) || null}
        </ActionPanel>
      }
    />
  );
}