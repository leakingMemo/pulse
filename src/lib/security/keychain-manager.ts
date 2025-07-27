import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Service identifiers for different types of credentials
 */
export const KEYCHAIN_SERVICES = {
  NOTION_API: 'com.pulse.raycast.notion-api',
  PLAID_CLIENT: 'com.pulse.raycast.plaid-client',
  PLAID_SECRET: 'com.pulse.raycast.plaid-secret',
  HEALTHKIT: 'com.pulse.raycast.healthkit',
  ENCRYPTION_KEY: 'com.pulse.raycast.encryption-key',
} as const;

/**
 * Account identifiers for credential storage
 */
export const KEYCHAIN_ACCOUNTS = {
  DEFAULT: 'pulse-extension',
  USER_TOKEN: 'user-token',
  API_KEY: 'api-key',
  CLIENT_SECRET: 'client-secret',
} as const;

/**
 * Keychain operation result
 */
export interface KeychainResult {
  success: boolean;
  error?: string;
}

/**
 * Keychain retrieve result
 */
export interface KeychainRetrieveResult extends KeychainResult {
  value?: string;
}

/**
 * macOS Keychain Manager for secure credential storage
 *
 * This class provides a secure interface to the macOS Keychain for storing
 * and retrieving sensitive credentials like API keys, tokens, and secrets.
 *
 * All operations use the `security` command-line tool to ensure proper
 * integration with the macOS security framework.
 */
export class KeychainManager {
  /**
   * Store a credential in the macOS Keychain
   *
   * @param service - The service identifier (e.g., 'com.pulse.raycast.notion-api')
   * @param account - The account identifier (e.g., 'api-key')
   * @param password - The credential value to store
   * @returns Promise resolving to operation result
   */
  async store(service: string, account: string, password: string): Promise<KeychainResult> {
    try {
      // Validate inputs
      if (!service || !account || !password) {
        return {
          success: false,
          error: 'Service, account, and password are required',
        };
      }

      // First, try to delete any existing entry
      await this.delete(service, account);

      // Add the new credential
      const command = [
        'security',
        'add-generic-password',
        '-s',
        `"${service}"`,
        '-a',
        `"${account}"`,
        '-w',
        `"${password}"`,
        '-A', // Allow access from this application
      ].join(' ');

      await execAsync(command);

      this.logSecurityEvent('store', service, account, true);

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logSecurityEvent('store', service, account, false, errorMessage);

      return {
        success: false,
        error: `Failed to store credential: ${errorMessage}`,
      };
    }
  }

  /**
   * Retrieve a credential from the macOS Keychain
   *
   * @param service - The service identifier
   * @param account - The account identifier
   * @returns Promise resolving to credential value or error
   */
  async retrieve(service: string, account: string): Promise<KeychainRetrieveResult> {
    try {
      // Validate inputs
      if (!service || !account) {
        return {
          success: false,
          error: 'Service and account are required',
        };
      }

      const command = [
        'security',
        'find-generic-password',
        '-s',
        `"${service}"`,
        '-a',
        `"${account}"`,
        '-w', // Output only the password
      ].join(' ');

      const { stdout, stderr } = await execAsync(command);

      if (stderr && stderr.includes('could not be found')) {
        this.logSecurityEvent('retrieve', service, account, false, 'Credential not found');
        return {
          success: false,
          error: 'Credential not found',
        };
      }

      const value = stdout.trim();
      this.logSecurityEvent('retrieve', service, account, true);

      return {
        success: true,
        value,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logSecurityEvent('retrieve', service, account, false, errorMessage);

      return {
        success: false,
        error: `Failed to retrieve credential: ${errorMessage}`,
      };
    }
  }

  /**
   * Delete a credential from the macOS Keychain
   *
   * @param service - The service identifier
   * @param account - The account identifier
   * @returns Promise resolving to operation result
   */
  async delete(service: string, account: string): Promise<KeychainResult> {
    try {
      // Validate inputs
      if (!service || !account) {
        return {
          success: false,
          error: 'Service and account are required',
        };
      }

      const command = [
        'security',
        'delete-generic-password',
        '-s',
        `"${service}"`,
        '-a',
        `"${account}"`,
      ].join(' ');

      await execAsync(command);

      this.logSecurityEvent('delete', service, account, true);

      return { success: true };
    } catch (error) {
      // Deletion failure is often expected (credential doesn't exist)
      // We log but don't treat as error unless needed
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';

      if (errorMessage.includes('could not be found')) {
        // This is expected when deleting non-existent credentials
        return { success: true };
      }

      this.logSecurityEvent('delete', service, account, false, errorMessage);

      return {
        success: false,
        error: `Failed to delete credential: ${errorMessage}`,
      };
    }
  }

  /**
   * Check if a credential exists in the keychain
   *
   * @param service - The service identifier
   * @param account - The account identifier
   * @returns Promise resolving to boolean indicating existence
   */
  async exists(service: string, account: string): Promise<boolean> {
    try {
      const result = await this.retrieve(service, account);
      return result.success;
    } catch {
      return false;
    }
  }

  /**
   * Update an existing credential (delete and recreate)
   *
   * @param service - The service identifier
   * @param account - The account identifier
   * @param newPassword - The new credential value
   * @returns Promise resolving to operation result
   */
  async update(service: string, account: string, newPassword: string): Promise<KeychainResult> {
    const deleteResult = await this.delete(service, account);
    if (!deleteResult.success) {
      return deleteResult;
    }

    return this.store(service, account, newPassword);
  }

  /**
   * List all Pulse-related credentials in the keychain
   *
   * @returns Promise resolving to array of service/account pairs
   */
  async listCredentials(): Promise<Array<{ service: string; account: string }>> {
    try {
      const command = [
        'security',
        'dump-keychain',
        '-d',
        '|',
        'grep',
        '-E',
        '"(com\\.pulse\\.raycast|pulse-extension)"',
      ].join(' ');

      const { stdout } = await execAsync(command);

      // Parse the output to extract service/account pairs
      // This is a simplified implementation - real parsing would be more robust
      const credentials: Array<{ service: string; account: string }> = [];
      const lines = stdout.split('\n');

      for (const line of lines) {
        if (line.includes('com.pulse.raycast')) {
          // Extract service and account from keychain dump output
          // Format varies, this is a basic implementation
          const serviceMatch = line.match(/srvr"<blob>="([^"]+)"/);
          const accountMatch = line.match(/acct"<blob>="([^"]+)"/);

          if (serviceMatch && accountMatch) {
            credentials.push({
              service: serviceMatch[1],
              account: accountMatch[1],
            });
          }
        }
      }

      return credentials;
    } catch {
      // If listing fails, return empty array
      return [];
    }
  }

  /**
   * Clear all Pulse-related credentials from the keychain
   *
   * @returns Promise resolving to operation result
   */
  async clearAllCredentials(): Promise<KeychainResult> {
    try {
      const credentials = await this.listCredentials();

      for (const { service, account } of credentials) {
        await this.delete(service, account);
      }

      this.logSecurityEvent('clear_all', 'all', 'all', true);

      return { success: true };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logSecurityEvent('clear_all', 'all', 'all', false, errorMessage);

      return {
        success: false,
        error: `Failed to clear credentials: ${errorMessage}`,
      };
    }
  }

  /**
   * Log security events for audit purposes
   *
   * @private
   */
  private logSecurityEvent(
    operation: string,
    service: string,
    account: string,
    success: boolean,
    error?: string
  ): void {
    const timestamp = new Date().toISOString();
    const logEntry = {
      timestamp,
      operation,
      service: service.replace(/"/g, ''), // Remove quotes for logging
      account: account.replace(/"/g, ''),
      success,
      error,
    };

    // In a production environment, this would write to a secure audit log
    // For now, we use console.log with a security prefix
    if (process.env.NODE_ENV !== 'production') {
      console.log(`[SECURITY AUDIT] ${JSON.stringify(logEntry)}`);
    }
  }
}

/**
 * Default singleton instance of KeychainManager
 */
export const keychainManager = new KeychainManager();
