/**
 * UI component types for the Pulse Raycast extension
 */

import { ReactNode } from 'react';
import { Account, Transaction, FinancialSummary } from '../domain/finance';
import { Task, Project, TaskStats } from '../domain/tasks';
import { Habit, HabitStreak, HabitStats } from '../domain/habits';
import { HealthMetrics, Exercise, HealthSummary } from '../domain/health';

/**
 * Base component state types
 */
export interface LoadingState {
  /** Whether component is loading */
  isLoading: boolean;
  /** Loading message */
  message?: string;
}

export interface ErrorState {
  /** Whether there's an error */
  hasError: boolean;
  /** Error message */
  message?: string;
  /** Error code */
  code?: string;
  /** Recovery action */
  onRetry?: () => void;
}

export interface EmptyState {
  /** Whether state is empty */
  isEmpty: boolean;
  /** Empty state message */
  message?: string;
  /** Call to action */
  actionLabel?: string;
  /** Action handler */
  onAction?: () => void;
}

/**
 * Dashboard component props
 */
export interface DashboardProps {
  /** Finance section data */
  financeData?: FinancialSummary;
  /** Health section data */
  healthData?: HealthSummary;
  /** Tasks section data */
  tasksData?: TaskStats;
  /** Habits section data */
  habitsData?: HabitStats;
  /** Loading states for each section */
  loading: {
    finance: LoadingState;
    health: LoadingState;
    tasks: LoadingState;
    habits: LoadingState;
  };
  /** Error states for each section */
  errors: {
    finance: ErrorState;
    health: ErrorState;
    tasks: ErrorState;
    habits: ErrorState;
  };
  /** Refresh handlers */
  onRefresh: {
    finance: () => void;
    health: () => void;
    tasks: () => void;
    habits: () => void;
    all: () => void;
  };
}

/**
 * Finance section component props
 */
export interface FinanceSectionProps {
  /** Finance data */
  data?: FinancialSummary;
  /** Loading state */
  loading: LoadingState;
  /** Error state */
  error: ErrorState;
  /** Refresh handler */
  onRefresh: () => void;
  /** Quick action handlers */
  onQuickActions?: {
    addExpense: () => void;
    viewAccounts: () => void;
    viewTransactions: () => void;
  };
}

/**
 * Health section component props
 */
export interface HealthSectionProps {
  /** Health data */
  data?: HealthSummary;
  /** Loading state */
  loading: LoadingState;
  /** Error state */
  error: ErrorState;
  /** Refresh handler */
  onRefresh: () => void;
  /** Quick action handlers */
  onQuickActions?: {
    logWorkout: () => void;
    viewMetrics: () => void;
    addMeal: () => void;
  };
}

/**
 * Tasks section component props
 */
export interface TasksSectionProps {
  /** Tasks statistics */
  stats?: TaskStats;
  /** Recent tasks */
  recentTasks?: Task[];
  /** Loading state */
  loading: LoadingState;
  /** Error state */
  error: ErrorState;
  /** Refresh handler */
  onRefresh: () => void;
  /** Quick action handlers */
  onQuickActions?: {
    addTask: () => void;
    viewProjects: () => void;
    completeTask: (taskId: string) => void;
  };
}

/**
 * Habits section component props
 */
export interface HabitsSectionProps {
  /** Habits statistics */
  stats?: HabitStats;
  /** Recent habit entries */
  recentHabits?: Habit[];
  /** Loading state */
  loading: LoadingState;
  /** Error state */
  error: ErrorState;
  /** Refresh handler */
  onRefresh: () => void;
  /** Quick action handlers */
  onQuickActions?: {
    logHabit: () => void;
    viewStreaks: () => void;
    addHabit: () => void;
  };
}

/**
 * Quick actions bar props
 */
export interface QuickActionsProps {
  /** Available actions */
  actions: QuickAction[];
  /** Loading state */
  loading?: LoadingState;
}

/**
 * Quick action definition
 */
export interface QuickAction {
  /** Action identifier */
  id: string;
  /** Action label */
  label: string;
  /** Action icon */
  icon?: string;
  /** Keyboard shortcut */
  shortcut?: string;
  /** Action handler */
  onAction: () => void;
  /** Whether action is disabled */
  disabled?: boolean;
  /** Disable reason */
  disabledReason?: string;
}

/**
 * Navigation props
 */
export interface NavigationProps {
  /** Current view */
  currentView: DashboardView;
  /** Navigation items */
  items: NavigationItem[];
  /** Navigation change handler */
  onNavigate: (view: DashboardView) => void;
}

/**
 * Navigation item
 */
export interface NavigationItem {
  /** Item identifier */
  id: string;
  /** Item label */
  label: string;
  /** Item icon */
  icon?: string;
  /** Associated view */
  view: DashboardView;
  /** Keyboard shortcut */
  shortcut?: string;
  /** Badge count */
  badge?: number;
}

/**
 * Dashboard views
 */
export enum DashboardView {
  OVERVIEW = 'overview',
  FINANCE = 'finance',
  HEALTH = 'health',
  TASKS = 'tasks',
  HABITS = 'habits',
  SETTINGS = 'settings',
}

/**
 * Grid layout props
 */
export interface GridLayoutProps {
  /** Grid sections */
  sections: GridSection[];
  /** Layout configuration */
  layout: GridConfig;
  /** Section change handler */
  onSectionChange?: (sectionId: string, data: any) => void;
}

/**
 * Grid section
 */
export interface GridSection {
  /** Section identifier */
  id: string;
  /** Section title */
  title: string;
  /** Section icon */
  icon?: string;
  /** Section content */
  content: ReactNode;
  /** Grid position */
  position: GridPosition;
  /** Loading state */
  loading?: LoadingState;
  /** Error state */
  error?: ErrorState;
}

/**
 * Grid position
 */
export interface GridPosition {
  /** Column position */
  col: number;
  /** Row position */
  row: number;
  /** Column span */
  colSpan?: number;
  /** Row span */
  rowSpan?: number;
}

/**
 * Grid configuration
 */
export interface GridConfig {
  /** Number of columns */
  columns: number;
  /** Grid gap */
  gap?: number;
  /** Responsive breakpoints */
  responsive?: {
    sm?: Partial<GridConfig>;
    md?: Partial<GridConfig>;
    lg?: Partial<GridConfig>;
  };
}

/**
 * Data visualization props
 */
export interface ChartProps {
  /** Chart data */
  data: ChartData[];
  /** Chart type */
  type: ChartType;
  /** Chart configuration */
  config?: ChartConfig;
  /** Loading state */
  loading?: LoadingState;
  /** Error state */
  error?: ErrorState;
}

/**
 * Chart data point
 */
export interface ChartData {
  /** Data label */
  label: string;
  /** Data value */
  value: number;
  /** Data color */
  color?: string;
  /** Additional metadata */
  metadata?: Record<string, any>;
}

/**
 * Chart types
 */
export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
  PIE = 'pie',
  DONUT = 'donut',
  AREA = 'area',
}

/**
 * Chart configuration
 */
export interface ChartConfig {
  /** Chart title */
  title?: string;
  /** Show legend */
  showLegend?: boolean;
  /** Show grid */
  showGrid?: boolean;
  /** Color scheme */
  colors?: string[];
  /** Animation settings */
  animation?: boolean;
}

/**
 * User input props
 */
export interface UserInputProps {
  /** Input type */
  type: InputType;
  /** Input label */
  label: string;
  /** Input value */
  value: string;
  /** Input placeholder */
  placeholder?: string;
  /** Change handler */
  onChange: (value: string) => void;
  /** Validation state */
  validation?: ValidationState;
  /** Loading state */
  loading?: LoadingState;
}

/**
 * Input types
 */
export enum InputType {
  TEXT = 'text',
  NUMBER = 'number',
  EMAIL = 'email',
  PASSWORD = 'password',
  SEARCH = 'search',
  DATE = 'date',
  TIME = 'time',
}

/**
 * Validation state
 */
export interface ValidationState {
  /** Whether input is valid */
  isValid: boolean;
  /** Validation message */
  message?: string;
  /** Validation type */
  type?: 'error' | 'warning' | 'success';
}
