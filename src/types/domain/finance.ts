/**
 * Financial domain types for the Pulse Raycast extension
 */

/**
 * Represents a financial account (bank account, credit card, investment, etc.)
 */
export interface Account {
  /** Unique identifier for the account */
  id: string;
  /** Display name for the account */
  name: string;
  /** Type of financial account */
  type: AccountType;
  /** Current balance in the account */
  balance: Balance;
  /** Institution that holds the account */
  institution: string;
  /** Last 4 digits of account number for identification */
  lastFourDigits?: string;
  /** Currency code (e.g., 'USD', 'EUR') */
  currency: string;
  /** Whether the account is currently active */
  isActive: boolean;
  /** Last time the account was synced */
  lastSyncedAt: Date;
  /** Account creation date */
  createdAt: Date;
  /** Last modification date */
  updatedAt: Date;
}

/**
 * Types of financial accounts
 */
export enum AccountType {
  CHECKING = "checking",
  SAVINGS = "savings",
  CREDIT_CARD = "credit_card",
  INVESTMENT = "investment",
  LOAN = "loan",
  MORTGAGE = "mortgage",
  OTHER = "other",
}

/**
 * Represents an account balance at a specific point in time
 */
export interface Balance {
  /** Current balance amount */
  current: number;
  /** Available balance (for credit accounts) */
  available?: number;
  /** Credit limit (for credit accounts) */
  limit?: number;
  /** Currency code */
  currency: string;
  /** When this balance was recorded */
  asOf: Date;
}

/**
 * Represents a financial transaction
 */
export interface Transaction {
  /** Unique identifier for the transaction */
  id: string;
  /** Account ID this transaction belongs to */
  accountId: string;
  /** Transaction amount (positive for deposits, negative for withdrawals) */
  amount: number;
  /** Currency code */
  currency: string;
  /** Transaction date */
  date: Date;
  /** Merchant or payee name */
  merchant?: string;
  /** Transaction description */
  description: string;
  /** Transaction category */
  category: TransactionCategory;
  /** Sub-category for more detailed classification */
  subCategory?: string;
  /** Transaction status */
  status: TransactionStatus;
  /** Whether this is a recurring transaction */
  isRecurring: boolean;
  /** Notes or tags associated with the transaction */
  notes?: string;
  /** Location where transaction occurred */
  location?: TransactionLocation;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * High-level transaction categories
 */
export enum TransactionCategory {
  INCOME = "income",
  HOUSING = "housing",
  TRANSPORTATION = "transportation",
  FOOD = "food",
  UTILITIES = "utilities",
  HEALTHCARE = "healthcare",
  ENTERTAINMENT = "entertainment",
  SHOPPING = "shopping",
  EDUCATION = "education",
  PERSONAL = "personal",
  INSURANCE = "insurance",
  INVESTMENT = "investment",
  TRANSFER = "transfer",
  OTHER = "other",
}

/**
 * Transaction processing status
 */
export enum TransactionStatus {
  PENDING = "pending",
  POSTED = "posted",
  CLEARED = "cleared",
  FAILED = "failed",
  CANCELLED = "cancelled",
}

/**
 * Location information for a transaction
 */
export interface TransactionLocation {
  /** Location name or address */
  address?: string;
  /** City */
  city?: string;
  /** State or region */
  state?: string;
  /** Country */
  country?: string;
  /** Postal code */
  postalCode?: string;
  /** Latitude coordinate */
  latitude?: number;
  /** Longitude coordinate */
  longitude?: number;
}

/**
 * Represents a budget for tracking spending
 */
export interface Budget {
  /** Unique identifier */
  id: string;
  /** Budget name */
  name: string;
  /** Budget period type */
  period: BudgetPeriod;
  /** Start date of the budget */
  startDate: Date;
  /** End date of the budget (if applicable) */
  endDate?: Date;
  /** Budget categories with limits */
  categories: BudgetCategory[];
  /** Total budget amount */
  totalAmount: number;
  /** Currency code */
  currency: string;
  /** Whether the budget is active */
  isActive: boolean;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Budget period types
 */
export enum BudgetPeriod {
  WEEKLY = "weekly",
  BIWEEKLY = "biweekly",
  MONTHLY = "monthly",
  QUARTERLY = "quarterly",
  YEARLY = "yearly",
  CUSTOM = "custom",
}

/**
 * Individual category within a budget
 */
export interface BudgetCategory {
  /** Transaction category */
  category: TransactionCategory;
  /** Budget limit for this category */
  limit: number;
  /** Amount spent in current period */
  spent: number;
  /** Percentage of limit used */
  percentageUsed: number;
}

/**
 * Financial summary for a specific period
 */
export interface FinancialSummary {
  /** Period start date */
  startDate: Date;
  /** Period end date */
  endDate: Date;
  /** Total income for the period */
  totalIncome: number;
  /** Total expenses for the period */
  totalExpenses: number;
  /** Net amount (income - expenses) */
  netAmount: number;
  /** Breakdown by category */
  categoryBreakdown: CategoryBreakdown[];
  /** Currency code */
  currency: string;
}

/**
 * Spending breakdown by category
 */
export interface CategoryBreakdown {
  /** Transaction category */
  category: TransactionCategory;
  /** Total amount for this category */
  amount: number;
  /** Percentage of total spending */
  percentage: number;
  /** Number of transactions */
  transactionCount: number;
}
