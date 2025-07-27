import { Grid, Icon, Color } from "@raycast/api";
import { ReactNode } from "react";

interface SectionContainerProps {
  title: string;
  subtitle?: string;
  icon: Icon;
  tintColor?: Color;
  isLoading?: boolean;
  error?: string;
  children?: ReactNode;
  accessoryText?: string;
}

export function SectionContainer({
  title,
  subtitle,
  icon,
  tintColor = Color.Blue,
  isLoading = false,
  error,
  children,
  accessoryText
}: SectionContainerProps) {
  if (error) {
    return (
      <Grid.Item
        title={title}
        subtitle="Error loading data"
        content={{
          value: {
            source: icon,
            tintColor: Color.Red
          }
        }}
        accessory={error ? { text: "!" } : undefined}
      />
    );
  }

  if (isLoading) {
    return (
      <Grid.Item
        title={title}
        subtitle="Loading..."
        content={{
          value: {
            source: icon,
            tintColor: Color.SecondaryText
          }
        }}
        accessory={accessoryText ? { text: accessoryText } : undefined}
      />
    );
  }

  return (
    <Grid.Item
      title={title}
      subtitle={subtitle || ""}
      content={{
        value: {
          source: icon,
          tintColor
        }
      }}
      accessory={accessoryText ? { text: accessoryText } : undefined}
    >
      {children}
    </Grid.Item>
  );
}