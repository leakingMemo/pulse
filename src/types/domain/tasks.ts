/**
 * Task management domain types for the Pulse Raycast extension
 */

/**
 * Represents a task or todo item
 */
export interface Task {
  /** Unique identifier for the task */
  id: string;
  /** Task title/summary */
  title: string;
  /** Detailed description of the task */
  description?: string;
  /** Task completion status */
  completed: boolean;
  /** Task priority level */
  priority: Priority;
  /** Due date for the task */
  dueDate?: Date;
  /** Project this task belongs to */
  projectId?: string;
  /** Tags associated with the task */
  tags: string[];
  /** Task creation date */
  createdAt: Date;
  /** Last modification date */
  updatedAt: Date;
  /** Date when task was completed */
  completedAt?: Date;
  /** Source system (notion, local, etc.) */
  source: TaskSource;
  /** External reference ID (for synced tasks) */
  externalId?: string;
}

/**
 * Task priority levels
 */
export enum Priority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent'
}

/**
 * Task source systems
 */
export enum TaskSource {
  LOCAL = 'local',
  NOTION = 'notion',
  TODOIST = 'todoist',
  APPLE_REMINDERS = 'apple_reminders',
  OTHER = 'other'
}

/**
 * Represents a project that groups related tasks
 */
export interface Project {
  /** Unique identifier for the project */
  id: string;
  /** Project name */
  name: string;
  /** Project description */
  description?: string;
  /** Project color for UI display */
  color?: string;
  /** Project completion status */
  completed: boolean;
  /** Project creation date */
  createdAt: Date;
  /** Last modification date */
  updatedAt: Date;
  /** Project completion date */
  completedAt?: Date;
  /** Source system */
  source: TaskSource;
  /** External reference ID */
  externalId?: string;
}

/**
 * Task statistics and analytics
 */
export interface TaskStats {
  /** Total number of tasks */
  total: number;
  /** Number of completed tasks */
  completed: number;
  /** Number of pending tasks */
  pending: number;
  /** Number of overdue tasks */
  overdue: number;
  /** Completion rate (0-1) */
  completionRate: number;
  /** Tasks completed today */
  completedToday: number;
  /** Tasks due today */
  dueToday: number;
}