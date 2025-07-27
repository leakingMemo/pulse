/**
 * Habit tracking domain types for the Pulse Raycast extension
 */

import { DayOfWeek } from './tasks';

/**
 * Represents a habit to be tracked
 */
export interface Habit {
  /** Unique identifier */
  id: string;
  /** Habit name */
  name: string;
  /** Detailed description */
  description?: string;
  /** Category for grouping */
  category: HabitCategory;
  /** Habit frequency configuration */
  frequency: HabitFrequency;
  /** Target/goal configuration */
  target?: HabitTarget;
  /** Visual customization */
  appearance: HabitAppearance;
  /** When to remind user */
  reminderTime?: string; // Format: "HH:MM"
  /** Days of week for reminders */
  reminderDays?: DayOfWeek[];
  /** Current streak information */
  currentStreak: Streak;
  /** Best streak achieved */
  bestStreak: Streak;
  /** Whether habit is active */
  isActive: boolean;
  /** Whether habit is archived */
  isArchived: boolean;
  /** Start date for the habit */
  startDate: Date;
  /** End date (if habit has a time limit) */
  endDate?: Date;
  /** Notes about the habit */
  notes?: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Habit categories
 */
export enum HabitCategory {
  HEALTH = 'health',
  FITNESS = 'fitness',
  PRODUCTIVITY = 'productivity',
  LEARNING = 'learning',
  FINANCE = 'finance',
  SOCIAL = 'social',
  MINDFULNESS = 'mindfulness',
  CREATIVITY = 'creativity',
  PERSONAL_CARE = 'personal_care',
  OTHER = 'other',
}

/**
 * Habit frequency configuration
 */
export interface HabitFrequency {
  /** Frequency type */
  type: FrequencyType;
  /** Custom configuration based on type */
  config?: FrequencyConfig;
}

/**
 * Frequency types
 */
export enum FrequencyType {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  CUSTOM = 'custom',
}

/**
 * Frequency configuration details
 */
export interface FrequencyConfig {
  /** For weekly: which days of the week */
  daysOfWeek?: DayOfWeek[];
  /** For monthly: which days of the month */
  daysOfMonth?: number[];
  /** For custom: times per period */
  timesPerPeriod?: number;
  /** For custom: period length in days */
  periodDays?: number;
}

/**
 * Habit target/goal configuration
 */
export interface HabitTarget {
  /** Target type */
  type: TargetType;
  /** Numeric value for the target */
  value: number;
  /** Unit of measurement */
  unit?: string;
}

/**
 * Target types for habits
 */
export enum TargetType {
  TIMES = 'times', // Complete X times
  DURATION = 'duration', // For X minutes/hours
  QUANTITY = 'quantity', // X amount (e.g., glasses of water)
  BOOLEAN = 'boolean', // Simple yes/no completion
}

/**
 * Visual appearance settings for a habit
 */
export interface HabitAppearance {
  /** Display color */
  color: string;
  /** Icon identifier */
  icon: string;
  /** Whether to show in widget */
  showInWidget: boolean;
  /** Display order */
  sortOrder: number;
}

/**
 * Streak tracking information
 */
export interface Streak {
  /** Current/best streak count */
  count: number;
  /** Start date of the streak */
  startDate: Date;
  /** End date of the streak (null if ongoing) */
  endDate?: Date;
  /** Whether streak is currently active */
  isActive: boolean;
}

/**
 * Progress entry for a specific date
 */
export interface Progress {
  /** Unique identifier */
  id: string;
  /** Associated habit ID */
  habitId: string;
  /** Date of the progress entry */
  date: Date;
  /** Whether habit was completed */
  completed: boolean;
  /** Value achieved (for measurable habits) */
  value?: number;
  /** Time spent (in minutes) */
  duration?: number;
  /** Notes for this entry */
  notes?: string;
  /** Mood/feeling after completion */
  mood?: ProgressMood;
  /** Difficulty rating */
  difficulty?: DifficultyRating;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Mood after completing habit
 */
export enum ProgressMood {
  VERY_NEGATIVE = 'very_negative',
  NEGATIVE = 'negative',
  NEUTRAL = 'neutral',
  POSITIVE = 'positive',
  VERY_POSITIVE = 'very_positive',
}

/**
 * Difficulty rating for completion
 */
export enum DifficultyRating {
  VERY_EASY = 'very_easy',
  EASY = 'easy',
  MODERATE = 'moderate',
  HARD = 'hard',
  VERY_HARD = 'very_hard',
}

/**
 * Habit statistics
 */
export interface HabitStatistics {
  /** Habit ID */
  habitId: string;
  /** Total completions */
  totalCompletions: number;
  /** Completion rate (percentage) */
  completionRate: number;
  /** Average completions per week */
  averagePerWeek: number;
  /** Total time spent (minutes) */
  totalDuration?: number;
  /** Average value (for measurable habits) */
  averageValue?: number;
  /** Best day of week for completion */
  bestDayOfWeek?: DayOfWeek;
  /** Worst day of week for completion */
  worstDayOfWeek?: DayOfWeek;
  /** Trend direction */
  trend: TrendDirection;
  /** Last 30 days completion rate */
  last30DaysRate: number;
  /** Monthly breakdown */
  monthlyBreakdown?: MonthlyStats[];
}

/**
 * Trend directions
 */
export enum TrendDirection {
  IMPROVING = 'improving',
  STABLE = 'stable',
  DECLINING = 'declining',
}

/**
 * Monthly statistics
 */
export interface MonthlyStats {
  /** Year */
  year: number;
  /** Month (1-12) */
  month: number;
  /** Number of completions */
  completions: number;
  /** Completion rate */
  completionRate: number;
  /** Total value/duration */
  totalValue?: number;
}

/**
 * Habit reminder
 */
export interface HabitReminder {
  /** Unique identifier */
  id: string;
  /** Habit ID */
  habitId: string;
  /** Reminder time */
  time: string; // Format: "HH:MM"
  /** Days to remind */
  days: DayOfWeek[];
  /** Whether reminder is enabled */
  isEnabled: boolean;
  /** Notification message */
  message?: string;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Habit challenge or goal
 */
export interface HabitChallenge {
  /** Unique identifier */
  id: string;
  /** Challenge name */
  name: string;
  /** Description */
  description?: string;
  /** Associated habit IDs */
  habitIds: string[];
  /** Challenge duration */
  duration: ChallengeDuration;
  /** Start date */
  startDate: Date;
  /** End date */
  endDate: Date;
  /** Target completion rate */
  targetCompletionRate: number;
  /** Reward/badge for completion */
  reward?: ChallengeReward;
  /** Current progress */
  progress: ChallengeProgress;
  /** Whether challenge is active */
  isActive: boolean;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Challenge duration options
 */
export interface ChallengeDuration {
  /** Number of days */
  days: number;
  /** Human-readable label */
  label: string; // e.g., "30 days", "1 week"
}

/**
 * Challenge reward
 */
export interface ChallengeReward {
  /** Reward type */
  type: RewardType;
  /** Badge/icon identifier */
  badge?: string;
  /** Points earned */
  points?: number;
  /** Custom reward description */
  description?: string;
}

/**
 * Reward types
 */
export enum RewardType {
  BADGE = 'badge',
  POINTS = 'points',
  MILESTONE = 'milestone',
  CUSTOM = 'custom',
}

/**
 * Challenge progress tracking
 */
export interface ChallengeProgress {
  /** Total days in challenge */
  totalDays: number;
  /** Days completed */
  daysCompleted: number;
  /** Current completion rate */
  completionRate: number;
  /** Whether challenge is completed */
  isCompleted: boolean;
  /** Completion date */
  completedAt?: Date;
}

/**
 * Habit group for related habits
 */
export interface HabitGroup {
  /** Unique identifier */
  id: string;
  /** Group name */
  name: string;
  /** Description */
  description?: string;
  /** Habit IDs in this group */
  habitIds: string[];
  /** Group color */
  color: string;
  /** Group icon */
  icon: string;
  /** Sort order */
  sortOrder: number;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Habit streak information
 */
export interface HabitStreak {
  /** Habit ID */
  habitId: string;
  /** Current streak length */
  currentStreak: number;
  /** Longest streak */
  longestStreak: number;
  /** Streak start date */
  streakStartDate?: Date;
  /** Last completion date */
  lastCompletionDate?: Date;
  /** Whether streak is active */
  isActive: boolean;
}

/**
 * Habit statistics summary
 */
export interface HabitStats {
  /** Total number of habits */
  totalHabits: number;
  /** Active habits */
  activeHabits: number;
  /** Habits completed today */
  completedToday: number;
  /** Average completion rate */
  averageCompletionRate: number;
  /** Total streaks */
  totalStreaks: number;
  /** Longest streak across all habits */
  longestOverallStreak: number;
  /** Habit breakdown by category */
  categoryBreakdown: { category: HabitCategory; count: number }[];
}
