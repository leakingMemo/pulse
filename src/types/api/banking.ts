/**
 * Banking API types for the Pulse Raycast extension
 */

/**
 * Banking API provider types
 */
export enum BankingProvider {
  PLAID = 'plaid',
  YODLEE = 'yodlee',
  MX = 'mx',
  FINICITY = 'finicity',
  OPEN_BANKING = 'open_banking',
  MANUAL = 'manual',
}

/**
 * Banking API configuration
 */
export interface BankingApiConfig {
  /** API provider */
  provider: BankingProvider;
  /** API credentials */
  credentials: BankingCredentials;
  /** Environment (sandbox/development/production) */
  environment: ApiEnvironment;
  /** API version */
  version?: string;
  /** Request timeout */
  timeout?: number;
  /** Webhook URL for notifications */
  webhookUrl?: string;
}

/**
 * API environment types
 */
export enum ApiEnvironment {
  SANDBOX = 'sandbox',
  DEVELOPMENT = 'development',
  PRODUCTION = 'production',
}

/**
 * Banking API credentials
 */
export interface BankingCredentials {
  /** Client/App ID */
  clientId: string;
  /** Client secret */
  clientSecret: string;
  /** Public key (if applicable) */
  publicKey?: string;
  /** Access token */
  accessToken?: string;
  /** Refresh token */
  refreshToken?: string;
  /** Token expiry */
  tokenExpiry?: Date;
}

/**
 * Bank connection/link
 */
export interface BankConnection {
  /** Connection ID */
  id: string;
  /** Provider-specific item ID */
  itemId: string;
  /** Institution information */
  institution: Institution;
  /** Connection status */
  status: ConnectionStatus;
  /** Connected accounts */
  accounts: string[];
  /** Last successful sync */
  lastSync?: Date;
  /** Next scheduled sync */
  nextSync?: Date;
  /** Error information */
  error?: ConnectionError;
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Financial institution
 */
export interface Institution {
  /** Institution ID */
  id: string;
  /** Institution name */
  name: string;
  /** Institution logo URL */
  logo?: string;
  /** Primary color */
  primaryColor?: string;
  /** Website URL */
  url?: string;
  /** Country code */
  country?: string;
  /** Products offered */
  products?: InstitutionProduct[];
}

/**
 * Institution product types
 */
export enum InstitutionProduct {
  ACCOUNTS = 'accounts',
  TRANSACTIONS = 'transactions',
  IDENTITY = 'identity',
  INVESTMENTS = 'investments',
  LIABILITIES = 'liabilities',
  PAYMENT_INITIATION = 'payment_initiation',
}

/**
 * Connection status
 */
export enum ConnectionStatus {
  CONNECTED = 'connected',
  DISCONNECTED = 'disconnected',
  ERROR = 'error',
  UPDATING = 'updating',
  NEEDS_REAUTH = 'needs_reauth',
}

/**
 * Connection error details
 */
export interface ConnectionError {
  /** Error code */
  code: string;
  /** Error type */
  type: string;
  /** Error message */
  message: string;
  /** Display message for user */
  displayMessage?: string;
  /** Suggested action */
  suggestedAction?: string;
  /** Error timestamp */
  timestamp: Date;
}

/**
 * Account sync request
 */
export interface AccountSyncRequest {
  /** Connection ID */
  connectionId: string;
  /** Specific account IDs to sync (optional) */
  accountIds?: string[];
  /** Force refresh even if recently synced */
  forceRefresh?: boolean;
  /** Include pending transactions */
  includePending?: boolean;
  /** Date range for transactions */
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

/**
 * Account sync response
 */
export interface AccountSyncResponse {
  /** Sync ID */
  syncId: string;
  /** Sync status */
  status: SyncStatus;
  /** Synced accounts */
  accounts: AccountSyncResult[];
  /** Total transactions synced */
  transactionCount: number;
  /** Sync timestamp */
  timestamp: Date;
  /** Any warnings */
  warnings?: string[];
}

/**
 * Sync status
 */
export enum SyncStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  PARTIAL = 'partial',
}

/**
 * Individual account sync result
 */
export interface AccountSyncResult {
  /** Account ID */
  accountId: string;
  /** Sync successful */
  success: boolean;
  /** New transactions count */
  newTransactions: number;
  /** Updated transactions count */
  updatedTransactions: number;
  /** Current balance */
  currentBalance?: number;
  /** Available balance */
  availableBalance?: number;
  /** Error if sync failed */
  error?: string;
}

/**
 * Transaction webhook payload
 */
export interface TransactionWebhook {
  /** Webhook type */
  webhookType: 'TRANSACTIONS';
  /** Webhook code */
  webhookCode: TransactionWebhookCode;
  /** Connection/Item ID */
  itemId: string;
  /** Number of new transactions */
  newTransactions?: number;
  /** Number of removed transactions */
  removedTransactions?: string[];
  /** Error information */
  error?: ConnectionError;
  /** Webhook timestamp */
  timestamp: Date;
}

/**
 * Transaction webhook codes
 */
export enum TransactionWebhookCode {
  INITIAL_UPDATE = 'INITIAL_UPDATE',
  HISTORICAL_UPDATE = 'HISTORICAL_UPDATE',
  DEFAULT_UPDATE = 'DEFAULT_UPDATE',
  TRANSACTIONS_REMOVED = 'TRANSACTIONS_REMOVED',
  SYNC_ERROR = 'SYNC_ERROR',
}

/**
 * API account object (from banking provider)
 */
export interface ApiAccount {
  /** Account ID */
  account_id: string;
  /** Account name */
  name: string;
  /** Official name */
  official_name?: string;
  /** Account type */
  type: string;
  /** Account subtype */
  subtype?: string;
  /** Account mask (last 4 digits) */
  mask?: string;
  /** Current balance */
  balances: ApiBalance;
  /** Currency code */
  currency_code?: string;
  /** Account number (if available) */
  account_number?: string;
  /** Routing number (if available) */
  routing_number?: string;
  /** Wire routing number */
  wire_routing_number?: string;
}

/**
 * API balance object
 */
export interface ApiBalance {
  /** Available balance */
  available: number | null;
  /** Current balance */
  current: number | null;
  /** Limit (for credit cards) */
  limit?: number | null;
  /** ISO currency code */
  iso_currency_code?: string;
  /** Unofficial currency code */
  unofficial_currency_code?: string;
}

/**
 * API transaction object
 */
export interface ApiTransaction {
  /** Transaction ID */
  transaction_id: string;
  /** Account ID */
  account_id: string;
  /** Transaction amount */
  amount: number;
  /** ISO currency code */
  iso_currency_code?: string;
  /** Unofficial currency code */
  unofficial_currency_code?: string;
  /** Transaction date */
  date: string;
  /** Authorization date */
  authorized_date?: string;
  /** Transaction name */
  name: string;
  /** Merchant name */
  merchant_name?: string;
  /** Payment channel */
  payment_channel: PaymentChannel;
  /** Primary category */
  category?: string[];
  /** Category ID */
  category_id?: string;
  /** Location information */
  location?: ApiLocation;
  /** Payment metadata */
  payment_meta?: ApiPaymentMeta;
  /** Pending transaction */
  pending: boolean;
  /** Pending transaction ID */
  pending_transaction_id?: string;
  /** Account owner */
  account_owner?: string;
  /** Transaction code */
  transaction_code?: string;
  /** Transaction type */
  transaction_type?: string;
}

/**
 * Payment channels
 */
export enum PaymentChannel {
  ONLINE = 'online',
  IN_STORE = 'in_store',
  OTHER = 'other',
}

/**
 * API location information
 */
export interface ApiLocation {
  /** Address */
  address?: string;
  /** City */
  city?: string;
  /** Region/State */
  region?: string;
  /** Postal code */
  postal_code?: string;
  /** Country */
  country?: string;
  /** Latitude */
  lat?: number;
  /** Longitude */
  lon?: number;
  /** Store number */
  store_number?: string;
}

/**
 * API payment metadata
 */
export interface ApiPaymentMeta {
  /** Reference number */
  reference_number?: string;
  /** PPD ID */
  ppd_id?: string;
  /** Payee */
  payee?: string;
  /** By order of */
  by_order_of?: string;
  /** Payer */
  payer?: string;
  /** Payment method */
  payment_method?: string;
  /** Payment processor */
  payment_processor?: string;
  /** Reason */
  reason?: string;
}

/**
 * Investment holdings
 */
export interface ApiInvestmentHolding {
  /** Account ID */
  account_id: string;
  /** Security ID */
  security_id: string;
  /** Institution price */
  institution_price: number;
  /** Institution price as of date */
  institution_price_as_of?: string;
  /** Institution value */
  institution_value: number;
  /** Cost basis */
  cost_basis?: number;
  /** Quantity */
  quantity: number;
  /** ISO currency code */
  iso_currency_code?: string;
  /** Unofficial currency code */
  unofficial_currency_code?: string;
}

/**
 * Investment security
 */
export interface ApiSecurity {
  /** Security ID */
  security_id: string;
  /** ISIN */
  isin?: string;
  /** CUSIP */
  cusip?: string;
  /** SEDOL */
  sedol?: string;
  /** Institution security ID */
  institution_security_id?: string;
  /** Institution ID */
  institution_id?: string;
  /** Proxy security ID */
  proxy_security_id?: string;
  /** Security name */
  name?: string;
  /** Ticker symbol */
  ticker_symbol?: string;
  /** Is cash equivalent */
  is_cash_equivalent?: boolean;
  /** Security type */
  type?: string;
  /** Close price */
  close_price?: number;
  /** Close price as of date */
  close_price_as_of?: string;
  /** ISO currency code */
  iso_currency_code?: string;
  /** Unofficial currency code */
  unofficial_currency_code?: string;
}

/**
 * Liability account
 */
export interface ApiLiability {
  /** Account ID */
  account_id: string;
  /** APR percentage */
  apr_percentage?: number;
  /** APR type */
  apr_type?: string;
  /** Interest rate percentage */
  interest_rate_percentage?: number;
  /** Interest rate type */
  interest_rate_type?: string;
  /** Loan name */
  loan_name?: string;
  /** Loan type */
  loan_type?: string;
  /** Payment reference number */
  payment_reference_number?: string;
  /** PSL service code */
  pslf_status?: ApiPSLFStatus;
  /** Repayment plan */
  repayment_plan?: ApiRepaymentPlan;
  /** Student loan status */
  student_loan_status?: ApiStudentLoanStatus;
}

/**
 * PSLF status
 */
export interface ApiPSLFStatus {
  /** Estimated eligibility date */
  estimated_eligibility_date?: string;
  /** Payments made */
  payments_made?: number;
  /** Payments remaining */
  payments_remaining?: number;
}

/**
 * Repayment plan
 */
export interface ApiRepaymentPlan {
  /** Plan type */
  type?: string;
  /** Description */
  description?: string;
}

/**
 * Student loan status
 */
export interface ApiStudentLoanStatus {
  /** End date */
  end_date?: string;
  /** Type */
  type?: string;
}
