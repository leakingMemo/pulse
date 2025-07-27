/**
 * Main types exports for the Pulse Raycast extension
 *
 * This file provides convenient access to all type definitions
 * across the application domains.
 */

// Domain types
export * from './domain';

// API integration types
export * from './api';

// UI component types
export * from './ui';

// Re-export commonly used types for convenience
export type {
  // Finance
  Account,
  Transaction,
  FinancialSummary,

  // Health
  HealthMetrics,
  Exercise,
  HealthSummary,

  // Tasks
  Task,
  Project,
  TaskStats,

  // Habits
  Habit,
  HabitStreak,
  HabitStats,
} from './domain';

export type {
  // UI Components
  DashboardProps,
  FinanceSectionProps,
  HealthSectionProps,
  TasksSectionProps,
  HabitsSectionProps,
  LoadingState,
  ErrorState,
} from './ui';

export type {
  // Notion API
  NotionPage,
  NotionDatabase,
  NotionPropertySchema,

  // Banking API
  Institution,
  BankConnection,

  // HealthKit API
  HKQuantitySample,
  HKWorkout,
} from './api';
