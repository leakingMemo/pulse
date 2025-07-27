/**
 * Security Infrastructure Module
 *
 * This module provides comprehensive security infrastructure for the Pulse
 * Raycast extension, including:
 *
 * - Secure credential storage using macOS Keychain
 * - Encryption/decryption utilities with AES-256-CBC
 * - Environment validation and security compliance
 * - Security constants and configuration
 * - Audit logging for security events
 *
 * @module Security
 */

export {
  KeychainManager,
  keychainManager,
  KEYCHAIN_SERVICES,
  KEYCHAIN_ACCOUNTS,
  type KeychainResult,
  type KeychainRetrieveResult,
} from './keychain-manager';

export {
  EncryptionUtils,
  encryption,
  type EncryptedData,
  type EncryptionResult,
  type DecryptionResult,
} from './encryption';

export {
  EnvironmentValidator,
  environmentValidator,
  type EnvironmentValidationResult,
  type SecurityRequirement,
} from './environment-validator';

export {
  SecurityLevel,
  DATA_CLASSIFICATION,
  SECURITY_POLICY,
  CREDENTIAL_TYPES,
  ENVIRONMENT_SECURITY,
  SecurityEventType,
  SecurityErrorCode,
  SECURITY_HEADERS,
  SECURITY_TIMEOUTS,
} from './constants';

/**
 * Initialize the security infrastructure
 *
 * This function should be called during application startup to validate
 * the environment and ensure all security requirements are met.
 *
 * @returns Promise resolving to initialization result
 */
export async function initializeSecurity(): Promise<{
  success: boolean;
  errors: string[];
  warnings: string[];
}> {
  const validation = EnvironmentValidator.validate();

  return {
    success: validation.isValid,
    errors: validation.errors.map((e) => `${e.code}: ${e.message}`),
    warnings: validation.warnings,
  };
}

/**
 * Quick security status check
 *
 * @returns Boolean indicating if security infrastructure is ready
 */
export function isSecurityReady(): boolean {
  const validation = EnvironmentValidator.validate();
  return validation.isValid;
}

/**
 * Generate a comprehensive security report
 *
 * @returns Formatted security report string
 */
export function generateSecurityReport(): string {
  return EnvironmentValidator.generateSecurityReport();
}
