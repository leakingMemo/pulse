import { Grid, Color, Icon, ActionPanel, Action } from "@raycast/api";
import { SectionContainer } from "./SectionContainer";

interface FinanceData {
  totalBalance: number;
  recentSpending: number;
  savingsRate: number;
}

interface Props {
  data?: FinanceData;
  isLoading?: boolean;
  error?: string;
}

export function FinanceSection({ data, isLoading, error }: Props) {
  const balance = data?.totalBalance ?? 0;
  const spending = data?.recentSpending ?? 0;
  const savingsRate = data?.savingsRate ?? 0;

  const getTintColor = () => {
    if (balance > 50000) return Color.Green;
    if (balance > 10000) return Color.Orange;
    return Color.Red;
  };

  const getSubtitle = () => {
    if (isLoading) return "Loading...";
    if (error) return "Error loading data";
    
    const trend = spending > 5000 ? "↗️ High spending" : "✅ On track";
    return `${trend} • ${savingsRate}% saved`;
  };

  return (
    <Grid.Item
      title={`$${balance.toLocaleString()}`}
      subtitle={getSubtitle()}
      content={{
        value: {
          source: Icon.BankNote,
          tintColor: error ? Color.Red : isLoading ? Color.SecondaryText : getTintColor()
        }
      }}
      accessory={spending > 0 ? { text: `$${spending.toLocaleString()}` } : undefined}
      actions={
        <ActionPanel>
          <Action title="View Finance Details" onAction={() => console.log("Finance details")} />
          <Action title={`Recent Spending: $${spending.toLocaleString()}`} />
          <Action title={`Savings Rate: ${savingsRate}%`} />
          <Action title="Quick Log Expense" onAction={() => console.log("Log expense")} shortcut={{ modifiers: ["cmd"], key: "e" }} />
        </ActionPanel>
      }
    />
  );
}