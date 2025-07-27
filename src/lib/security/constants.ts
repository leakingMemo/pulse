/**
 * Security constants and configuration
 */

/**
 * Security levels for different types of data
 */
export enum SecurityLevel {
  PUBLIC = 'public',
  INTERNAL = 'internal',
  CONFIDENTIAL = 'confidential',
  RESTRICTED = 'restricted',
}

/**
 * Data classification for security handling
 */
export const DATA_CLASSIFICATION = {
  // Public data - no encryption needed
  PUBLIC: {
    level: SecurityLevel.PUBLIC,
    requiresEncryption: false,
    requiresKeychain: false,
    auditLevel: 'minimal',
  },

  // Internal data - basic protection
  INTERNAL: {
    level: SecurityLevel.INTERNAL,
    requiresEncryption: true,
    requiresKeychain: false,
    auditLevel: 'standard',
  },

  // Confidential data - strong protection
  CONFIDENTIAL: {
    level: SecurityLevel.CONFIDENTIAL,
    requiresEncryption: true,
    requiresKeychain: true,
    auditLevel: 'detailed',
  },

  // Restricted data - maximum protection
  RESTRICTED: {
    level: SecurityLevel.RESTRICTED,
    requiresEncryption: true,
    requiresKeychain: true,
    auditLevel: 'comprehensive',
  },
} as const;

/**
 * Security policy configuration
 */
export const SECURITY_POLICY = {
  // Password/key requirements
  PASSWORD: {
    minLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days in milliseconds
  },

  // Session management
  SESSION: {
    maxDuration: 8 * 60 * 60 * 1000, // 8 hours in milliseconds
    refreshThreshold: 30 * 60 * 1000, // 30 minutes in milliseconds
    maxConcurrentSessions: 3,
  },

  // API security
  API: {
    maxRetries: 3,
    timeoutMs: 30000, // 30 seconds
    rateLimitWindow: 60 * 1000, // 1 minute
    rateLimitMax: 100, // requests per window
  },

  // Audit settings
  AUDIT: {
    retentionDays: 90,
    sensitiveOperations: [
      'credential_store',
      'credential_retrieve',
      'credential_delete',
      'encryption_key_access',
      'security_config_change',
    ],
  },
} as const;

/**
 * Credential types and their security requirements
 */
export const CREDENTIAL_TYPES = {
  NOTION_API_TOKEN: {
    name: 'Notion API Token',
    classification: DATA_CLASSIFICATION.RESTRICTED,
    service: 'com.pulse.raycast.notion-api',
    account: 'api-token',
    description: 'Notion integration API token',
    validationPattern: /^secret_[a-zA-Z0-9]{43}$/,
  },

  PLAID_CLIENT_ID: {
    name: 'Plaid Client ID',
    classification: DATA_CLASSIFICATION.CONFIDENTIAL,
    service: 'com.pulse.raycast.plaid-client',
    account: 'client-id',
    description: 'Plaid banking API client identifier',
    validationPattern: /^[a-f0-9]{24}$/,
  },

  PLAID_SECRET: {
    name: 'Plaid Secret',
    classification: DATA_CLASSIFICATION.RESTRICTED,
    service: 'com.pulse.raycast.plaid-secret',
    account: 'secret-key',
    description: 'Plaid banking API secret key',
    validationPattern: /^[a-f0-9]{40}$/,
  },

  HEALTHKIT_ACCESS: {
    name: 'HealthKit Access Token',
    classification: DATA_CLASSIFICATION.RESTRICTED,
    service: 'com.pulse.raycast.healthkit',
    account: 'access-token',
    description: 'iOS HealthKit data access token',
    validationPattern: /^[A-Za-z0-9\-._~+/]+=*$/,
  },

  ENCRYPTION_MASTER_KEY: {
    name: 'Master Encryption Key',
    classification: DATA_CLASSIFICATION.RESTRICTED,
    service: 'com.pulse.raycast.encryption-key',
    account: 'master-key',
    description: 'Master key for local data encryption',
    validationPattern: /^[A-Za-z0-9+/]+=*$/,
  },
} as const;

/**
 * Environment validation settings
 */
export const ENVIRONMENT_SECURITY = {
  // Required environment variables
  REQUIRED_ENV_VARS: ['NODE_ENV', 'RAYCAST_OWNER_EMAIL'],

  // Forbidden environment variables (should use keychain instead)
  FORBIDDEN_ENV_VARS: [
    'NOTION_API_TOKEN',
    'PLAID_CLIENT_SECRET',
    'PLAID_SECRET',
    'API_KEY',
    'SECRET_KEY',
    'PASSWORD',
  ],

  // Development environment settings
  DEVELOPMENT: {
    allowPlaintextSecrets: false,
    requireHttps: false,
    enableDebugLogging: true,
    skipCertificateValidation: false,
  },

  // Production environment settings
  PRODUCTION: {
    allowPlaintextSecrets: false,
    requireHttps: true,
    enableDebugLogging: false,
    skipCertificateValidation: false,
  },
} as const;

/**
 * Security event types for audit logging
 */
export enum SecurityEventType {
  // Authentication events
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAILURE = 'login_failure',
  LOGOUT = 'logout',
  SESSION_EXPIRED = 'session_expired',

  // Credential events
  CREDENTIAL_STORED = 'credential_stored',
  CREDENTIAL_RETRIEVED = 'credential_retrieved',
  CREDENTIAL_UPDATED = 'credential_updated',
  CREDENTIAL_DELETED = 'credential_deleted',

  // Encryption events
  DATA_ENCRYPTED = 'data_encrypted',
  DATA_DECRYPTED = 'data_decrypted',
  KEY_GENERATED = 'key_generated',
  KEY_ROTATED = 'key_rotated',

  // Access events
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  PRIVILEGE_ESCALATION = 'privilege_escalation',
  SUSPICIOUS_ACTIVITY = 'suspicious_activity',

  // Configuration events
  SECURITY_CONFIG_CHANGED = 'security_config_changed',
  POLICY_UPDATED = 'policy_updated',
}

/**
 * Security error codes
 */
export enum SecurityErrorCode {
  // Authentication errors
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  EXPIRED_TOKEN = 'EXPIRED_TOKEN',
  ACCESS_DENIED = 'ACCESS_DENIED',

  // Encryption errors
  ENCRYPTION_FAILED = 'ENCRYPTION_FAILED',
  DECRYPTION_FAILED = 'DECRYPTION_FAILED',
  INVALID_KEY = 'INVALID_KEY',

  // Keychain errors
  KEYCHAIN_ACCESS_DENIED = 'KEYCHAIN_ACCESS_DENIED',
  CREDENTIAL_NOT_FOUND = 'CREDENTIAL_NOT_FOUND',
  KEYCHAIN_OPERATION_FAILED = 'KEYCHAIN_OPERATION_FAILED',

  // Validation errors
  INVALID_FORMAT = 'INVALID_FORMAT',
  VALIDATION_FAILED = 'VALIDATION_FAILED',
  POLICY_VIOLATION = 'POLICY_VIOLATION',

  // Environment errors
  INSECURE_ENVIRONMENT = 'INSECURE_ENVIRONMENT',
  MISSING_REQUIREMENTS = 'MISSING_REQUIREMENTS',
  CONFIGURATION_ERROR = 'CONFIGURATION_ERROR',
}

/**
 * Security headers for HTTP requests
 */
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Content-Security-Policy': "default-src 'self'",
} as const;

/**
 * Timeout values for security operations (milliseconds)
 */
export const SECURITY_TIMEOUTS = {
  KEYCHAIN_OPERATION: 5000,
  ENCRYPTION_OPERATION: 10000,
  CREDENTIAL_VALIDATION: 3000,
  AUDIT_LOG_WRITE: 2000,
} as const;
