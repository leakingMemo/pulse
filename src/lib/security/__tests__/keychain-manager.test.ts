import { KeychainManager, KEYCHAIN_SERVICES, KEYCHAIN_ACCOUNTS } from '../keychain-manager';

// Mock the exec function for testing
jest.mock('child_process', () => ({
  exec: jest.fn(),
}));

jest.mock('util', () => ({
  promisify: jest.fn((fn) => {
    return jest.fn().mockImplementation(async (command: string) => {
      // Mock different scenarios based on command
      if (command.includes('add-generic-password')) {
        if (command.includes('invalid-service')) {
          throw new Error('Failed to add password');
        }
        return { stdout: '', stderr: '' };
      }

      if (command.includes('find-generic-password')) {
        if (command.includes('nonexistent-service')) {
          throw new Error('The specified item could not be found in the keychain.');
        }
        if (command.includes('test-service')) {
          return { stdout: 'test-password-value\n', stderr: '' };
        }
        return { stdout: 'mock-password\n', stderr: '' };
      }

      if (command.includes('delete-generic-password')) {
        if (command.includes('nonexistent-service')) {
          throw new Error('The specified item could not be found in the keychain.');
        }
        return { stdout: '', stderr: '' };
      }

      return { stdout: '', stderr: '' };
    });
  }),
}));

describe('KeychainManager', () => {
  let keychainManager: KeychainManager;

  beforeEach(() => {
    keychainManager = new KeychainManager();
    jest.clearAllMocks();
  });

  describe('store', () => {
    it('should successfully store a credential', async () => {
      const result = await keychainManager.store(
        KEYCHAIN_SERVICES.NOTION_API,
        KEYCHAIN_ACCOUNTS.API_KEY,
        'test-password'
      );

      expect(result.success).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should fail with invalid parameters', async () => {
      const result = await keychainManager.store('', '', '');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Service, account, and password are required');
    });

    it('should handle keychain errors', async () => {
      const result = await keychainManager.store(
        'invalid-service',
        KEYCHAIN_ACCOUNTS.API_KEY,
        'test-password'
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to store credential');
    });
  });

  describe('retrieve', () => {
    it('should successfully retrieve a credential', async () => {
      const result = await keychainManager.retrieve('test-service', KEYCHAIN_ACCOUNTS.API_KEY);

      expect(result.success).toBe(true);
      expect(result.value).toBe('test-password-value');
    });

    it('should fail with invalid parameters', async () => {
      const result = await keychainManager.retrieve('', '');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Service and account are required');
    });

    it('should handle credential not found', async () => {
      const result = await keychainManager.retrieve(
        'nonexistent-service',
        KEYCHAIN_ACCOUNTS.API_KEY
      );

      expect(result.success).toBe(false);
      expect(result.error).toContain('Credential not found');
    });
  });

  describe('delete', () => {
    it('should successfully delete a credential', async () => {
      const result = await keychainManager.delete(
        KEYCHAIN_SERVICES.NOTION_API,
        KEYCHAIN_ACCOUNTS.API_KEY
      );

      expect(result.success).toBe(true);
    });

    it('should succeed when deleting non-existent credential', async () => {
      const result = await keychainManager.delete('nonexistent-service', KEYCHAIN_ACCOUNTS.API_KEY);

      expect(result.success).toBe(true);
    });

    it('should fail with invalid parameters', async () => {
      const result = await keychainManager.delete('', '');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Service and account are required');
    });
  });

  describe('exists', () => {
    it('should return true for existing credential', async () => {
      const exists = await keychainManager.exists('test-service', KEYCHAIN_ACCOUNTS.API_KEY);

      expect(exists).toBe(true);
    });

    it('should return false for non-existing credential', async () => {
      const exists = await keychainManager.exists('nonexistent-service', KEYCHAIN_ACCOUNTS.API_KEY);

      expect(exists).toBe(false);
    });
  });

  describe('update', () => {
    it('should successfully update a credential', async () => {
      const result = await keychainManager.update(
        KEYCHAIN_SERVICES.NOTION_API,
        KEYCHAIN_ACCOUNTS.API_KEY,
        'new-password'
      );

      expect(result.success).toBe(true);
    });
  });

  describe('clearAllCredentials', () => {
    it('should attempt to clear all credentials', async () => {
      // Mock the listCredentials method
      jest
        .spyOn(keychainManager, 'listCredentials')
        .mockResolvedValue([
          { service: KEYCHAIN_SERVICES.NOTION_API, account: KEYCHAIN_ACCOUNTS.API_KEY },
        ]);

      const result = await keychainManager.clearAllCredentials();

      expect(result.success).toBe(true);
    });
  });

  describe('constants', () => {
    it('should have proper service identifiers', () => {
      expect(KEYCHAIN_SERVICES.NOTION_API).toBe('com.pulse.raycast.notion-api');
      expect(KEYCHAIN_SERVICES.PLAID_CLIENT).toBe('com.pulse.raycast.plaid-client');
      expect(KEYCHAIN_SERVICES.PLAID_SECRET).toBe('com.pulse.raycast.plaid-secret');
    });

    it('should have proper account identifiers', () => {
      expect(KEYCHAIN_ACCOUNTS.DEFAULT).toBe('pulse-extension');
      expect(KEYCHAIN_ACCOUNTS.API_KEY).toBe('api-key');
      expect(KEYCHAIN_ACCOUNTS.CLIENT_SECRET).toBe('client-secret');
    });
  });
});
