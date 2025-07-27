/**
 * Keychain Manager for Pulse Extension
 *
 * Provides secure credential storage using Raycast's LocalStorage API
 * with additional encryption layer for maximum security.
 */

import { LocalStorage } from '@raycast/api';
import { EncryptionUtils, EncryptedData } from './encryption';
import { CREDENTIAL_TYPES, SecurityErrorCode, SecurityEventType } from './constants';
import { SecurityAudit } from './audit';

/**
 * Credential storage result
 */
export interface CredentialResult {
  success: boolean;
  error?: string;
}

/**
 * Credential retrieval result
 */
export interface CredentialRetrievalResult extends CredentialResult {
  credential?: string;
}

/**
 * Stored credential structure
 */
interface StoredCredential {
  encrypted: EncryptedData;
  type: string;
  createdAt: string;
  lastAccessed: string;
  version: number;
}

/**
 * Credential validation result
 */
interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * KeychainManager provides secure storage for API keys, tokens, and other sensitive data
 * using Raycast's encrypted LocalStorage combined with additional encryption layers.
 */
export class KeychainManager {
  private static instance: KeychainManager;
  private readonly audit: SecurityAudit;
  private readonly masterPassword: string;

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    this.audit = SecurityAudit.getInstance();
    // In a real implementation, this would come from a secure source
    // For now, we generate a deterministic key based on system info
    this.masterPassword = this.generateMasterPassword();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): KeychainManager {
    if (!KeychainManager.instance) {
      KeychainManager.instance = new KeychainManager();
    }
    return KeychainManager.instance;
  }

  /**
   * Store a credential securely
   */
  async store(service: string, account: string, credential: string): Promise<CredentialResult> {
    try {
      // Validate inputs
      const validation = this.validateCredentialParams(service, account, credential);
      if (!validation.isValid) {
        await this.audit.log(SecurityEventType.CREDENTIAL_STORED, 'FAILED', {
          service,
          account,
          errors: validation.errors,
        });
        return {
          success: false,
          error: `Validation failed: ${validation.errors.join(', ')}`,
        };
      }

      // Encrypt the credential
      const encryptionResult = await EncryptionUtils.encrypt(credential, this.masterPassword);
      if (!encryptionResult.success || !encryptionResult.encrypted) {
        await this.audit.log(SecurityEventType.CREDENTIAL_STORED, 'FAILED', {
          service,
          account,
          error: 'Encryption failed',
        });
        return {
          success: false,
          error: 'Failed to encrypt credential',
        };
      }

      // Create storage structure
      const storedCredential: StoredCredential = {
        encrypted: encryptionResult.encrypted,
        type: this.inferCredentialType(service, account),
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        version: 1,
      };

      // Store in Raycast LocalStorage
      const storageKey = this.generateStorageKey(service, account);
      await LocalStorage.setItem(storageKey, JSON.stringify(storedCredential));

      // Log successful storage
      await this.audit.log(SecurityEventType.CREDENTIAL_STORED, 'SUCCESS', {
        service,
        account,
        type: storedCredential.type,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.audit.log(SecurityEventType.CREDENTIAL_STORED, 'FAILED', {
        service,
        account,
        error: errorMessage,
      });

      return {
        success: false,
        error: `Storage failed: ${errorMessage}`,
      };
    }
  }

  /**
   * Retrieve a credential
   */
  async retrieve(service: string, account: string): Promise<CredentialRetrievalResult> {
    try {
      // Validate service and account
      if (!this.isValidServiceName(service) || !this.isValidAccountName(account)) {
        await this.audit.log(SecurityEventType.CREDENTIAL_RETRIEVED, 'FAILED', {
          service,
          account,
          error: 'Invalid service or account name',
        });
        return {
          success: false,
          error: 'Invalid service or account name',
        };
      }

      // Get from LocalStorage
      const storageKey = this.generateStorageKey(service, account);
      const storedData = await LocalStorage.getItem<string>(storageKey);

      if (!storedData) {
        await this.audit.log(SecurityEventType.CREDENTIAL_RETRIEVED, 'FAILED', {
          service,
          account,
          error: 'Credential not found',
        });
        return {
          success: false,
          error: 'Credential not found',
        };
      }

      // Parse stored credential
      let storedCredential: StoredCredential;
      try {
        storedCredential = JSON.parse(storedData);
      } catch {
        await this.audit.log(SecurityEventType.CREDENTIAL_RETRIEVED, 'FAILED', {
          service,
          account,
          error: 'Invalid stored credential format',
        });
        return {
          success: false,
          error: 'Invalid stored credential format',
        };
      }

      // Decrypt the credential
      const decryptionResult = await EncryptionUtils.decrypt(
        storedCredential.encrypted,
        this.masterPassword
      );

      if (!decryptionResult.success || !decryptionResult.decrypted) {
        await this.audit.log(SecurityEventType.CREDENTIAL_RETRIEVED, 'FAILED', {
          service,
          account,
          error: 'Decryption failed',
        });
        return {
          success: false,
          error: 'Failed to decrypt credential',
        };
      }

      // Update last accessed time
      storedCredential.lastAccessed = new Date().toISOString();
      await LocalStorage.setItem(storageKey, JSON.stringify(storedCredential));

      // Log successful retrieval
      await this.audit.log(SecurityEventType.CREDENTIAL_RETRIEVED, 'SUCCESS', {
        service,
        account,
        type: storedCredential.type,
      });

      return {
        success: true,
        credential: decryptionResult.decrypted,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.audit.log(SecurityEventType.CREDENTIAL_RETRIEVED, 'FAILED', {
        service,
        account,
        error: errorMessage,
      });

      return {
        success: false,
        error: `Retrieval failed: ${errorMessage}`,
      };
    }
  }

  /**
   * Delete a credential
   */
  async delete(service: string, account: string): Promise<CredentialResult> {
    try {
      const storageKey = this.generateStorageKey(service, account);

      // Check if credential exists
      const exists = await LocalStorage.getItem(storageKey);
      if (!exists) {
        return {
          success: false,
          error: 'Credential not found',
        };
      }

      // Remove from storage
      await LocalStorage.removeItem(storageKey);

      // Log deletion
      await this.audit.log(SecurityEventType.CREDENTIAL_DELETED, 'SUCCESS', {
        service,
        account,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.audit.log(SecurityEventType.CREDENTIAL_DELETED, 'FAILED', {
        service,
        account,
        error: errorMessage,
      });

      return {
        success: false,
        error: `Deletion failed: ${errorMessage}`,
      };
    }
  }

  /**
   * List all stored credentials (without revealing the actual credentials)
   */
  async list(): Promise<
    Array<{ service: string; account: string; type: string; lastAccessed: string }>
  > {
    try {
      const allItems = await LocalStorage.allItems();
      const credentials: Array<{
        service: string;
        account: string;
        type: string;
        lastAccessed: string;
      }> = [];

      for (const [key, value] of Object.entries(allItems)) {
        if (key.startsWith('pulse.credential.')) {
          try {
            const storedCredential: StoredCredential = JSON.parse(value);
            const [, , service, account] = key.split('.');

            credentials.push({
              service: service || 'unknown',
              account: account || 'unknown',
              type: storedCredential.type,
              lastAccessed: storedCredential.lastAccessed,
            });
          } catch {
            // Skip invalid entries
          }
        }
      }

      return credentials;
    } catch {
      return [];
    }
  }

  /**
   * Generate storage key for a credential
   */
  private generateStorageKey(service: string, account: string): string {
    return `pulse.credential.${service}.${account}`;
  }

  /**
   * Generate master password for encryption
   * In a real implementation, this would use more sophisticated key derivation
   */
  private generateMasterPassword(): string {
    // This is a simplified approach - in production, you'd want to:
    // 1. Use hardware-backed key storage
    // 2. Derive from user authentication
    // 3. Use system keychain integration
    return EncryptionUtils.generateSecurePassword(32);
  }

  /**
   * Validate credential storage parameters
   */
  private validateCredentialParams(
    service: string,
    account: string,
    credential: string
  ): ValidationResult {
    const errors: string[] = [];

    if (!service || !this.isValidServiceName(service)) {
      errors.push('Invalid service name');
    }

    if (!account || !this.isValidAccountName(account)) {
      errors.push('Invalid account name');
    }

    if (!credential || credential.length < 8) {
      errors.push('Credential must be at least 8 characters');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate service name format
   */
  private isValidServiceName(service: string): boolean {
    return /^[a-z0-9._-]+$/.test(service) && service.length <= 100;
  }

  /**
   * Validate account name format
   */
  private isValidAccountName(account: string): boolean {
    return /^[a-z0-9._-]+$/.test(account) && account.length <= 100;
  }

  /**
   * Infer credential type from service and account
   */
  private inferCredentialType(service: string, account: string): string {
    // Check against known credential types
    for (const [, credType] of Object.entries(CREDENTIAL_TYPES)) {
      if (credType.service.includes(service) && credType.account === account) {
        return credType.name;
      }
    }

    // Default to generic type
    return 'Generic Credential';
  }

  /**
   * Clear all stored credentials (use with caution)
   */
  async clearAll(): Promise<CredentialResult> {
    try {
      const allItems = await LocalStorage.allItems();

      for (const key of Object.keys(allItems)) {
        if (key.startsWith('pulse.credential.')) {
          await LocalStorage.removeItem(key);
        }
      }

      await this.audit.log(SecurityEventType.CREDENTIAL_DELETED, 'SUCCESS', {
        action: 'clear_all_credentials',
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Failed to clear credentials: ${errorMessage}`,
      };
    }
  }
}
