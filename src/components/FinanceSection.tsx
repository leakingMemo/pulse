import { Grid, Color, Icon, ActionPanel, Action } from "@raycast/api";

interface FinanceData {
  totalBalance: number;
  recentSpending: number;
  savingsRate: number;
}

interface Props {
  data?: FinanceData;
}

export function FinanceSection({ data }: Props) {
  const balance = data?.totalBalance ?? 0;
  const spending = data?.recentSpending ?? 0;
  const savingsRate = data?.savingsRate ?? 0;

  return (
    <Grid.Item
      title={`$${balance.toLocaleString()}`}
      subtitle="Total Balance"
      content={Icon.BankNote}
      actions={
        <ActionPanel>
          <Action title="View Finance Details" onAction={() => console.log("Finance details")} />
          <Action title={`Recent Spending: $${spending.toLocaleString()}`} />
          <Action title={`Savings Rate: ${savingsRate}%`} />
        </ActionPanel>
      }
    />
  );
}