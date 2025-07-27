/**
 * Security Infrastructure Tests
 *
 * Comprehensive test suite for the security infrastructure including
 * KeychainManager, EncryptionUtils, and SecurityAudit.
 */

import { KeychainManager } from '../keychain';
import { EncryptionUtils } from '../encryption';
import { SecurityAudit } from '../audit';
import { SecurityEventType } from '../constants';

// Mock Raycast API
jest.mock('@raycast/api', () => ({
  LocalStorage: {
    setItem: jest.fn().mockResolvedValue(undefined),
    getItem: jest.fn(),
    removeItem: jest.fn().mockResolvedValue(undefined),
    allItems: jest.fn().mockResolvedValue({}),
  },
}));

const { LocalStorage } = require('@raycast/api');

describe('Security Infrastructure', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('EncryptionUtils', () => {
    test('should encrypt and decrypt data successfully', async () => {
      const plaintext = 'secret-api-key-12345';
      const password = 'test-password';

      const encryptResult = await EncryptionUtils.encrypt(plaintext, password);

      expect(encryptResult.success).toBe(true);
      expect(encryptResult.encrypted).toBeDefined();
      expect(encryptResult.encrypted?.data).toBeDefined();
      expect(encryptResult.encrypted?.iv).toBeDefined();
      expect(encryptResult.encrypted?.salt).toBeDefined();

      if (encryptResult.encrypted) {
        const decryptResult = await EncryptionUtils.decrypt(encryptResult.encrypted, password);

        expect(decryptResult.success).toBe(true);
        expect(decryptResult.decrypted).toBe(plaintext);
      }
    });

    test('should fail decryption with wrong password', async () => {
      const plaintext = 'secret-data';
      const password = 'correct-password';
      const wrongPassword = 'wrong-password';

      const encryptResult = await EncryptionUtils.encrypt(plaintext, password);
      expect(encryptResult.success).toBe(true);

      if (encryptResult.encrypted) {
        const decryptResult = await EncryptionUtils.decrypt(encryptResult.encrypted, wrongPassword);
        expect(decryptResult.success).toBe(false);
        expect(decryptResult.error).toContain('Decryption failed');
      }
    });

    test('should generate secure passwords', () => {
      const password1 = EncryptionUtils.generateSecurePassword();
      const password2 = EncryptionUtils.generateSecurePassword();

      expect(password1).toBeDefined();
      expect(password2).toBeDefined();
      expect(password1).not.toBe(password2);
      expect(password1.length).toBeGreaterThan(0);
    });

    test('should hash data correctly', () => {
      const data = 'test-data';
      const salt = 'test-salt';

      const hash1 = EncryptionUtils.hash(data, salt);
      const hash2 = EncryptionUtils.hash(data, salt);
      const hash3 = EncryptionUtils.hash(data, 'different-salt');

      expect(hash1).toBe(hash2);
      expect(hash1).not.toBe(hash3);
      expect(EncryptionUtils.verifyHash(data, hash1, salt)).toBe(true);
      expect(EncryptionUtils.verifyHash(data, hash3, salt)).toBe(false);
    });

    test('should perform secure comparison', () => {
      const str1 = 'identical-string';
      const str2 = 'identical-string';
      const str3 = 'different-string';

      expect(EncryptionUtils.secureCompare(str1, str2)).toBe(true);
      expect(EncryptionUtils.secureCompare(str1, str3)).toBe(false);
      expect(EncryptionUtils.secureCompare('', '')).toBe(true);
    });

    test('should validate encryption data', () => {
      const validData = {
        data: 'encrypted-data',
        iv: 'initialization-vector',
        salt: 'salt-value',
        algorithm: 'aes-256-cbc',
      };

      const invalidData = {
        data: 'encrypted-data',
        // missing required fields
      };

      expect(EncryptionUtils.validateEncryptionData(validData)).toBe(true);
      expect(EncryptionUtils.validateEncryptionData(invalidData as any)).toBe(false);
    });
  });

  describe('KeychainManager', () => {
    let keychain: KeychainManager;

    beforeEach(() => {
      keychain = KeychainManager.getInstance();
    });

    test('should store credentials successfully', async () => {
      const service = 'test.service';
      const account = 'test-account';
      const credential = 'test-credential-value';

      const result = await keychain.store(service, account, credential);

      expect(result.success).toBe(true);
      expect(LocalStorage.setItem).toHaveBeenCalled();
    });

    test('should retrieve stored credentials', async () => {
      const service = 'test.service';
      const account = 'test-account';
      const credential = 'test-credential-value';

      // Mock stored data
      const mockStoredData = {
        encrypted: {
          data: 'mock-encrypted-data',
          iv: 'mock-iv',
          salt: 'mock-salt',
          algorithm: 'aes-256-cbc',
        },
        type: 'Test Credential',
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        version: 1,
      };

      LocalStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockStoredData));

      // Mock successful decryption
      jest.spyOn(EncryptionUtils, 'decrypt').mockResolvedValueOnce({
        success: true,
        decrypted: credential,
      });

      const result = await keychain.retrieve(service, account);

      expect(result.success).toBe(true);
      expect(result.credential).toBe(credential);
    });

    test('should handle credential not found', async () => {
      const service = 'nonexistent.service';
      const account = 'nonexistent-account';

      LocalStorage.getItem.mockResolvedValueOnce(null);

      const result = await keychain.retrieve(service, account);

      expect(result.success).toBe(false);
      expect(result.error).toContain('not found');
    });

    test('should delete credentials', async () => {
      const service = 'test.service';
      const account = 'test-account';

      LocalStorage.getItem.mockResolvedValueOnce('mock-data');

      const result = await keychain.delete(service, account);

      expect(result.success).toBe(true);
      expect(LocalStorage.removeItem).toHaveBeenCalled();
    });

    test('should list stored credentials', async () => {
      const mockItems = {
        'pulse.credential.test.service.account1': JSON.stringify({
          type: 'API Token',
          lastAccessed: '2023-01-01T00:00:00.000Z',
        }),
        'pulse.credential.test.service.account2': JSON.stringify({
          type: 'Access Token',
          lastAccessed: '2023-01-02T00:00:00.000Z',
        }),
        'other.data': 'should-be-ignored',
      };

      LocalStorage.allItems.mockResolvedValueOnce(mockItems);

      const result = await keychain.list();

      expect(result).toHaveLength(2);
      expect(result[0].service).toBe('service');
      expect(result[0].account).toBe('account1');
      expect(result[0].type).toBe('API Token');
    });

    test('should validate input parameters', async () => {
      const result1 = await keychain.store('', 'account', 'credential');
      expect(result1.success).toBe(false);
      expect(result1.error).toContain('Validation failed');

      const result2 = await keychain.store('service', '', 'credential');
      expect(result2.success).toBe(false);
      expect(result2.error).toContain('Validation failed');

      const result3 = await keychain.store('service', 'account', '');
      expect(result3.success).toBe(false);
      expect(result3.error).toContain('Validation failed');
    });
  });

  describe('SecurityAudit', () => {
    let audit: SecurityAudit;

    beforeEach(() => {
      audit = SecurityAudit.getInstance();
    });

    test('should log security events', async () => {
      const eventType = SecurityEventType.CREDENTIAL_STORED;
      const result = 'SUCCESS';
      const data = { service: 'test.service', account: 'test-account' };

      await audit.log(eventType, result, data);

      expect(LocalStorage.setItem).toHaveBeenCalled();
    });

    test('should query audit logs', async () => {
      const mockLogEntries = [
        {
          id: 'entry-1',
          timestamp: '2023-01-01T00:00:00.000Z',
          eventType: SecurityEventType.CREDENTIAL_STORED,
          result: 'SUCCESS',
          data: { service: 'test' },
          sessionId: 'session-1',
          version: 1,
        },
        {
          id: 'entry-2',
          timestamp: '2023-01-02T00:00:00.000Z',
          eventType: SecurityEventType.CREDENTIAL_RETRIEVED,
          result: 'FAILED',
          data: { service: 'test' },
          sessionId: 'session-1',
          version: 1,
        },
      ];

      LocalStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockLogEntries));

      const allEntries = await audit.query();
      expect(allEntries).toHaveLength(2);

      const failedEntries = await audit.query({ result: 'FAILED' });
      expect(failedEntries).toHaveLength(1);
      expect(failedEntries[0].result).toBe('FAILED');

      const storeEntries = await audit.query({ eventType: SecurityEventType.CREDENTIAL_STORED });
      expect(storeEntries).toHaveLength(1);
      expect(storeEntries[0].eventType).toBe(SecurityEventType.CREDENTIAL_STORED);
    });

    test('should generate audit statistics', async () => {
      const mockLogEntries = [
        {
          id: 'entry-1',
          timestamp: '2023-01-01T00:00:00.000Z',
          eventType: SecurityEventType.CREDENTIAL_STORED,
          result: 'SUCCESS',
          data: {},
          sessionId: 'session-1',
          version: 1,
        },
        {
          id: 'entry-2',
          timestamp: '2023-01-02T00:00:00.000Z',
          eventType: SecurityEventType.CREDENTIAL_STORED,
          result: 'FAILED',
          data: {},
          sessionId: 'session-1',
          version: 1,
        },
        {
          id: 'entry-3',
          timestamp: '2023-01-03T00:00:00.000Z',
          eventType: SecurityEventType.CREDENTIAL_RETRIEVED,
          result: 'SUCCESS',
          data: {},
          sessionId: 'session-1',
          version: 1,
        },
      ];

      LocalStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockLogEntries));

      const stats = await audit.getStats();

      expect(stats.totalEvents).toBe(3);
      expect(stats.successfulEvents).toBe(2);
      expect(stats.failedEvents).toBe(1);
      expect(stats.warningEvents).toBe(0);
      expect(stats.eventsByType[SecurityEventType.CREDENTIAL_STORED]).toBe(2);
      expect(stats.eventsByType[SecurityEventType.CREDENTIAL_RETRIEVED]).toBe(1);
    });

    test('should detect suspicious activity', async () => {
      // Mock recent entries with many failed attempts
      const mockRecentEntries = Array.from({ length: 10 }, (_, i) => ({
        id: `entry-${i}`,
        timestamp: new Date(Date.now() - i * 1000).toISOString(),
        eventType: SecurityEventType.CREDENTIAL_RETRIEVED,
        result: 'FAILED' as const,
        data: {},
        sessionId: 'session-1',
        version: 1,
      }));

      LocalStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockRecentEntries));

      const suspiciousActivity = await audit.detectSuspiciousActivity();

      expect(suspiciousActivity.hasIssues).toBe(true);
      expect(suspiciousActivity.issues.length).toBeGreaterThan(0);
      expect(suspiciousActivity.recommendations.length).toBeGreaterThan(0);
    });

    test('should export audit log', async () => {
      const mockLogEntries = [
        {
          id: 'entry-1',
          timestamp: '2023-01-01T00:00:00.000Z',
          eventType: SecurityEventType.CREDENTIAL_STORED,
          result: 'SUCCESS',
          data: {},
          sessionId: 'session-1',
          version: 1,
        },
      ];

      LocalStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockLogEntries));

      const exportedLog = await audit.exportLog();
      const parsedLog = JSON.parse(exportedLog);

      expect(Array.isArray(parsedLog)).toBe(true);
      expect(parsedLog).toHaveLength(1);
      expect(parsedLog[0].id).toBe('entry-1');
    });

    test('should clear old entries', async () => {
      const now = Date.now();
      const oldEntry = {
        id: 'old-entry',
        timestamp: new Date(now - 100 * 24 * 60 * 60 * 1000).toISOString(), // 100 days ago
        eventType: SecurityEventType.CREDENTIAL_STORED,
        result: 'SUCCESS' as const,
        data: {},
        sessionId: 'session-1',
        version: 1,
      };
      const recentEntry = {
        id: 'recent-entry',
        timestamp: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
        eventType: SecurityEventType.CREDENTIAL_STORED,
        result: 'SUCCESS' as const,
        data: {},
        sessionId: 'session-1',
        version: 1,
      };

      LocalStorage.getItem.mockResolvedValueOnce(JSON.stringify([oldEntry, recentEntry]));

      const removedCount = await audit.clearOldEntries(90); // Remove entries older than 90 days

      expect(removedCount).toBe(1);
      expect(LocalStorage.setItem).toHaveBeenCalledWith(
        'pulse.security.audit_log',
        JSON.stringify([recentEntry])
      );
    });
  });

  describe('Integration Tests', () => {
    test('should work together for complete credential lifecycle', async () => {
      const keychain = KeychainManager.getInstance();
      const audit = SecurityAudit.getInstance();

      const service = 'integration.test';
      const account = 'test-account';
      const credential = 'test-credential-12345';

      // Mock successful storage
      LocalStorage.getItem.mockResolvedValueOnce(null); // First check for existing credential

      // Store credential
      const storeResult = await keychain.store(service, account, credential);
      expect(storeResult.success).toBe(true);

      // Verify audit log was called
      expect(LocalStorage.setItem).toHaveBeenCalled();

      // Mock successful retrieval
      const mockStoredData = {
        encrypted: {
          data: 'mock-encrypted',
          iv: 'mock-iv',
          salt: 'mock-salt',
          algorithm: 'aes-256-cbc',
        },
        type: 'Test Credential',
        createdAt: new Date().toISOString(),
        lastAccessed: new Date().toISOString(),
        version: 1,
      };

      LocalStorage.getItem.mockResolvedValueOnce(JSON.stringify(mockStoredData));
      jest.spyOn(EncryptionUtils, 'decrypt').mockResolvedValueOnce({
        success: true,
        decrypted: credential,
      });

      // Retrieve credential
      const retrieveResult = await keychain.retrieve(service, account);
      expect(retrieveResult.success).toBe(true);
      expect(retrieveResult.credential).toBe(credential);

      // Delete credential
      LocalStorage.getItem.mockResolvedValueOnce('mock-data');
      const deleteResult = await keychain.delete(service, account);
      expect(deleteResult.success).toBe(true);
    });
  });
});
