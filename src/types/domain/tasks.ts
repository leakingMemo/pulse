/**
 * Task management domain types for the Pulse Raycast extension
 */

/**
 * Represents a task or to-do item
 */
export interface Task {
  /** Unique identifier */
  id: string;
  /** Task title */
  title: string;
  /** Detailed description */
  description?: string;
  /** Priority level */
  priority: Priority;
  /** Current status */
  status: TaskStatus;
  /** Due date */
  dueDate?: Date;
  /** Scheduled start date */
  scheduledDate?: Date;
  /** Estimated time to complete (in minutes) */
  estimatedMinutes?: number;
  /** Actual time spent (in minutes) */
  actualMinutes?: number;
  /** Project this task belongs to */
  projectId?: string;
  /** Parent task ID (for subtasks) */
  parentTaskId?: string;
  /** List of subtask IDs */
  subtaskIds?: string[];
  /** Tags for categorization */
  tags?: string[];
  /** User assigned to this task */
  assigneeId?: string;
  /** Task completion date */
  completedAt?: Date;
  /** Recurrence rule */
  recurrence?: RecurrenceRule;
  /** File attachments */
  attachments?: TaskAttachment[];
  /** Task creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
  /** Task creator ID */
  createdBy: string;
  /** Last updated by user ID */
  updatedBy?: string;
}

/**
 * Task priority levels
 */
export enum Priority {
  URGENT = 'urgent',
  HIGH = 'high',
  MEDIUM = 'medium',
  LOW = 'low',
  NONE = 'none'
}

/**
 * Task status states
 */
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  BLOCKED = 'blocked',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ARCHIVED = 'archived'
}

/**
 * Represents a project containing multiple tasks
 */
export interface Project {
  /** Unique identifier */
  id: string;
  /** Project name */
  name: string;
  /** Project description */
  description?: string;
  /** Project color for UI */
  color?: string;
  /** Project icon */
  icon?: string;
  /** Project status */
  status: ProjectStatus;
  /** Project priority */
  priority: Priority;
  /** Start date */
  startDate?: Date;
  /** Target completion date */
  targetDate?: Date;
  /** Actual completion date */
  completedAt?: Date;
  /** Parent project ID (for sub-projects) */
  parentProjectId?: string;
  /** Project owner/lead */
  ownerId: string;
  /** Team member IDs */
  memberIds?: string[];
  /** Associated task IDs */
  taskIds?: string[];
  /** Project goals/milestones */
  milestones?: Milestone[];
  /** Project tags */
  tags?: string[];
  /** Whether project is archived */
  isArchived: boolean;
  /** Project creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Project status states
 */
export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

/**
 * Project milestone
 */
export interface Milestone {
  /** Unique identifier */
  id: string;
  /** Milestone name */
  name: string;
  /** Description */
  description?: string;
  /** Target date */
  targetDate: Date;
  /** Completion date */
  completedAt?: Date;
  /** Whether milestone is completed */
  isCompleted: boolean;
  /** Associated task IDs */
  taskIds?: string[];
}

/**
 * Task recurrence configuration
 */
export interface RecurrenceRule {
  /** Recurrence frequency */
  frequency: RecurrenceFrequency;
  /** Interval between recurrences */
  interval: number;
  /** Days of week (for weekly recurrence) */
  daysOfWeek?: DayOfWeek[];
  /** Day of month (for monthly recurrence) */
  dayOfMonth?: number;
  /** End date for recurrence */
  endDate?: Date;
  /** Maximum number of occurrences */
  maxOccurrences?: number;
}

/**
 * Recurrence frequency options
 */
export enum RecurrenceFrequency {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  BIWEEKLY = 'biweekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

/**
 * Days of the week
 */
export enum DayOfWeek {
  SUNDAY = 0,
  MONDAY = 1,
  TUESDAY = 2,
  WEDNESDAY = 3,
  THURSDAY = 4,
  FRIDAY = 5,
  SATURDAY = 6
}

/**
 * File attachment for a task
 */
export interface TaskAttachment {
  /** Unique identifier */
  id: string;
  /** File name */
  name: string;
  /** File URL or path */
  url: string;
  /** File size in bytes */
  size?: number;
  /** MIME type */
  mimeType?: string;
  /** Upload timestamp */
  uploadedAt: Date;
  /** Uploader user ID */
  uploadedBy: string;
}

/**
 * Task list or category
 */
export interface TaskList {
  /** Unique identifier */
  id: string;
  /** List name */
  name: string;
  /** Description */
  description?: string;
  /** Display color */
  color?: string;
  /** Icon */
  icon?: string;
  /** Sort order */
  sortOrder: number;
  /** Whether list is default */
  isDefault: boolean;
  /** Task IDs in this list */
  taskIds?: string[];
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Time tracking entry
 */
export interface TimeEntry {
  /** Unique identifier */
  id: string;
  /** Associated task ID */
  taskId: string;
  /** Start time */
  startTime: Date;
  /** End time */
  endTime?: Date;
  /** Duration in minutes */
  duration?: number;
  /** Description of work done */
  description?: string;
  /** User who tracked time */
  userId: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Task comment
 */
export interface TaskComment {
  /** Unique identifier */
  id: string;
  /** Task ID */
  taskId: string;
  /** Comment text */
  content: string;
  /** Author user ID */
  authorId: string;
  /** Parent comment ID (for replies) */
  parentCommentId?: string;
  /** Mentioned user IDs */
  mentionedUserIds?: string[];
  /** Comment attachments */
  attachments?: TaskAttachment[];
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
  /** Whether comment was edited */
  isEdited: boolean;
}

/**
 * Task activity log entry
 */
export interface TaskActivity {
  /** Unique identifier */
  id: string;
  /** Task ID */
  taskId: string;
  /** Activity type */
  type: TaskActivityType;
  /** User who performed the action */
  userId: string;
  /** Activity description */
  description: string;
  /** Old value (for updates) */
  oldValue?: string;
  /** New value (for updates) */
  newValue?: string;
  /** Activity timestamp */
  timestamp: Date;
}

/**
 * Types of task activities
 */
export enum TaskActivityType {
  CREATED = 'created',
  STATUS_CHANGED = 'status_changed',
  PRIORITY_CHANGED = 'priority_changed',
  ASSIGNED = 'assigned',
  DUE_DATE_CHANGED = 'due_date_changed',
  DESCRIPTION_UPDATED = 'description_updated',
  COMMENT_ADDED = 'comment_added',
  ATTACHMENT_ADDED = 'attachment_added',
  TIME_LOGGED = 'time_logged',
  COMPLETED = 'completed',
  REOPENED = 'reopened',
  ARCHIVED = 'archived'
}