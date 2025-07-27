import {
  initializeSecurity,
  isSecurityReady,
  generateSecurityReport,
  keychainManager,
  encryption,
  environmentValidator,
  KEYCHAIN_SERVICES,
  KEYCHAIN_ACCOUNTS,
  CREDENTIAL_TYPES,
  SecurityLevel,
  DATA_CLASSIFICATION,
} from '../index';

describe('Security Infrastructure Integration', () => {
  beforeEach(() => {
    // Reset environment for clean tests
    process.env.NODE_ENV = 'test';
    process.env.RAYCAST_OWNER_EMAIL = 'test@example.com';

    // Clear any forbidden environment variables
    delete process.env.NOTION_API_TOKEN;
    delete process.env.API_KEY;
    delete process.env.SECRET_KEY;

    // Mock platform as macOS
    Object.defineProperty(process, 'platform', { value: 'darwin' });
  });

  describe('Security initialization', () => {
    it('should successfully initialize security infrastructure', async () => {
      const result = await initializeSecurity();

      expect(result.success).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should fail initialization with security violations', async () => {
      // Add forbidden environment variable
      process.env.API_KEY = 'secret123';

      const result = await initializeSecurity();

      expect(result.success).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('POLICY_VIOLATION');
    });

    it('should report warnings during initialization', async () => {
      // Add a variable that looks like a secret
      process.env.CUSTOM_API_TOKEN = 'abcdefghijklmnopqrstuvwxyz123456789';

      const result = await initializeSecurity();

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toContain('CUSTOM_API_TOKEN');
    });
  });

  describe('Security readiness check', () => {
    it('should return true when security is ready', () => {
      expect(isSecurityReady()).toBe(true);
    });

    it('should return false when security has violations', () => {
      process.env.NOTION_API_TOKEN = 'secret_abc123';

      expect(isSecurityReady()).toBe(false);
    });
  });

  describe('Security report generation', () => {
    it('should generate comprehensive security report', () => {
      const report = generateSecurityReport();

      expect(report).toContain('# Pulse Security Validation Report');
      expect(report).toContain('Security Requirements');
      expect(report).toContain('macOS Platform');
      expect(report).toContain('Required Environment Variables');
    });
  });

  describe('End-to-end credential management', () => {
    const testService = KEYCHAIN_SERVICES.NOTION_API;
    const testAccount = KEYCHAIN_ACCOUNTS.API_KEY;
    const testCredential = 'secret_test123456789abcdefghijklmnopqrstuvwxyz';

    afterEach(async () => {
      // Clean up test credentials
      await keychainManager.delete(testService, testAccount);
    });

    it('should store, retrieve, and delete credentials', async () => {
      // Store credential
      const storeResult = await keychainManager.store(testService, testAccount, testCredential);
      expect(storeResult.success).toBe(true);

      // Retrieve credential
      const retrieveResult = await keychainManager.retrieve(testService, testAccount);
      expect(retrieveResult.success).toBe(true);
      expect(retrieveResult.value).toBe(testCredential);

      // Check existence
      const exists = await keychainManager.exists(testService, testAccount);
      expect(exists).toBe(true);

      // Delete credential
      const deleteResult = await keychainManager.delete(testService, testAccount);
      expect(deleteResult.success).toBe(true);

      // Verify deletion
      const existsAfterDelete = await keychainManager.exists(testService, testAccount);
      expect(existsAfterDelete).toBe(false);
    });

    it('should update existing credentials', async () => {
      const originalCredential = 'original_secret';
      const updatedCredential = 'updated_secret';

      // Store original
      await keychainManager.store(testService, testAccount, originalCredential);

      // Update credential
      const updateResult = await keychainManager.update(
        testService,
        testAccount,
        updatedCredential
      );
      expect(updateResult.success).toBe(true);

      // Verify update
      const retrieveResult = await keychainManager.retrieve(testService, testAccount);
      expect(retrieveResult.success).toBe(true);
      expect(retrieveResult.value).toBe(updatedCredential);
    });
  });

  describe('End-to-end encryption workflow', () => {
    const testData = 'This is sensitive financial data that needs encryption';
    const testPassword = 'secure-password-123';

    it('should encrypt and decrypt data successfully', async () => {
      // Encrypt data
      const encryptResult = await encryption.encrypt(testData, testPassword);
      expect(encryptResult.success).toBe(true);
      expect(encryptResult.encrypted).toBeDefined();

      // Decrypt data
      const decryptResult = await encryption.decrypt(encryptResult.encrypted!, testPassword);
      expect(decryptResult.success).toBe(true);
      expect(decryptResult.decrypted).toBe(testData);
    });

    it('should fail decryption with wrong password', async () => {
      const encryptResult = await encryption.encrypt(testData, testPassword);
      expect(encryptResult.success).toBe(true);

      const decryptResult = await encryption.decrypt(encryptResult.encrypted!, 'wrong-password');
      expect(decryptResult.success).toBe(false);
    });
  });

  describe('Credential type validation', () => {
    it('should validate Notion API token format', () => {
      const validToken = 'secret_1234567890abcdefghijklmnopqrstuvwxyz123456';
      const invalidToken = 'invalid-token';

      const credentialType = CREDENTIAL_TYPES.NOTION_API_TOKEN;

      expect(credentialType.validationPattern.test(validToken)).toBe(true);
      expect(credentialType.validationPattern.test(invalidToken)).toBe(false);
    });

    it('should validate Plaid client ID format', () => {
      const validClientId = 'a1b2c3d4e5f6789012345678';
      const invalidClientId = 'invalid-client-id';

      const credentialType = CREDENTIAL_TYPES.PLAID_CLIENT_ID;

      expect(credentialType.validationPattern.test(validClientId)).toBe(true);
      expect(credentialType.validationPattern.test(invalidClientId)).toBe(false);
    });

    it('should have proper security classifications', () => {
      expect(CREDENTIAL_TYPES.NOTION_API_TOKEN.classification).toBe(DATA_CLASSIFICATION.RESTRICTED);
      expect(CREDENTIAL_TYPES.PLAID_CLIENT_ID.classification).toBe(
        DATA_CLASSIFICATION.CONFIDENTIAL
      );
      expect(CREDENTIAL_TYPES.ENCRYPTION_MASTER_KEY.classification).toBe(
        DATA_CLASSIFICATION.RESTRICTED
      );
    });
  });

  describe('Security utilities integration', () => {
    it('should generate secure passwords and tokens', () => {
      const password = encryption.generatePassword();
      const token = encryption.generateToken();

      expect(password).toBeDefined();
      expect(password.length).toBeGreaterThan(40);

      expect(token).toBeDefined();
      expect(token.length).toBe(64); // 32 bytes as hex
      expect(/^[a-f0-9]+$/.test(token)).toBe(true);
    });

    it('should perform secure hash operations', () => {
      const data = 'sensitive-data';
      const salt = 'random-salt';

      const hash = encryption.hash(data, salt);
      expect(hash).toMatch(/^[a-f0-9]{64}$/);

      const isValid = encryption.verifyHash(data, hash, salt);
      expect(isValid).toBe(true);

      const isInvalid = encryption.verifyHash('wrong-data', hash, salt);
      expect(isInvalid).toBe(false);
    });

    it('should perform secure string comparison', () => {
      const secret1 = 'super-secret-token';
      const secret2 = 'super-secret-token';
      const secret3 = 'different-secret';

      expect(encryption.secureCompare(secret1, secret2)).toBe(true);
      expect(encryption.secureCompare(secret1, secret3)).toBe(false);
    });
  });

  describe('Data classification workflow', () => {
    it('should handle different security levels appropriately', () => {
      const publicData = {
        level: SecurityLevel.PUBLIC,
        value: 'Public information',
      };

      const restrictedData = {
        level: SecurityLevel.RESTRICTED,
        value: 'Highly sensitive credential',
      };

      // Public data doesn't require encryption
      const publicClassification = DATA_CLASSIFICATION.PUBLIC;
      expect(publicClassification.requiresEncryption).toBe(false);
      expect(publicClassification.requiresKeychain).toBe(false);

      // Restricted data requires both encryption and keychain
      const restrictedClassification = DATA_CLASSIFICATION.RESTRICTED;
      expect(restrictedClassification.requiresEncryption).toBe(true);
      expect(restrictedClassification.requiresKeychain).toBe(true);
    });
  });

  describe('Error handling integration', () => {
    it('should handle keychain errors gracefully', async () => {
      // Try to retrieve non-existent credential
      const result = await keychainManager.retrieve('nonexistent-service', 'nonexistent-account');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Credential not found');
    });

    it('should handle encryption errors gracefully', async () => {
      // Try to decrypt with invalid data
      const invalidEncryptedData = {
        data: 'invalid-data',
        iv: 'invalid-iv',
        salt: 'invalid-salt',
        algorithm: 'aes-256-cbc',
      };

      const result = await encryption.decrypt(invalidEncryptedData, 'password');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Decryption failed');
    });
  });

  describe('Security module exports', () => {
    it('should export all required components', () => {
      expect(keychainManager).toBeDefined();
      expect(encryption).toBeDefined();
      expect(environmentValidator).toBeDefined();
      expect(KEYCHAIN_SERVICES).toBeDefined();
      expect(CREDENTIAL_TYPES).toBeDefined();
      expect(DATA_CLASSIFICATION).toBeDefined();
      expect(initializeSecurity).toBeDefined();
      expect(isSecurityReady).toBeDefined();
      expect(generateSecurityReport).toBeDefined();
    });

    it('should have consistent service and account constants', () => {
      expect(KEYCHAIN_SERVICES.NOTION_API).toBe('com.pulse.raycast.notion-api');
      expect(KEYCHAIN_ACCOUNTS.API_KEY).toBe('api-key');

      expect(CREDENTIAL_TYPES.NOTION_API_TOKEN.service).toBe(KEYCHAIN_SERVICES.NOTION_API);
      expect(CREDENTIAL_TYPES.NOTION_API_TOKEN.account).toBe('api-token');
    });
  });
});
