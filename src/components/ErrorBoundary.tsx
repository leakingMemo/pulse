import { Component, ReactNode } from "react";
import { Grid, Icon, Color } from "@raycast/api";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  sectionName?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error(`Error in ${this.props.sectionName || 'component'}:`, error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <Grid.Item
          title={`${this.props.sectionName || 'Section'} Error`}
          subtitle="Something went wrong"
          content={{
            value: {
              source: Icon.ExclamationMark,
              tintColor: Color.Red
            }
          }}
          accessory={{ text: "!" }}
        />
      );
    }

    return this.props.children;
  }
}

// Hook version for functional components
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  sectionName?: string
) {
  return function WrappedComponent(props: P) {
    return (
      <ErrorBoundary sectionName={sectionName}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}