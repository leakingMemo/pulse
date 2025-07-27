import { EncryptionUtils, encryption, type EncryptedData } from '../encryption';

describe('EncryptionUtils', () => {
  const testPassword = 'test-password-123';
  const testPlaintext = 'This is sensitive data that needs encryption';

  describe('encrypt', () => {
    it('should successfully encrypt plaintext', async () => {
      const result = await EncryptionUtils.encrypt(testPlaintext, testPassword);

      expect(result.success).toBe(true);
      expect(result.encrypted).toBeDefined();
      expect(result.encrypted?.data).toBeDefined();
      expect(result.encrypted?.iv).toBeDefined();
      expect(result.encrypted?.salt).toBeDefined();
      expect(result.encrypted?.algorithm).toBe('aes-256-cbc');
    });

    it('should fail with empty plaintext', async () => {
      const result = await EncryptionUtils.encrypt('', testPassword);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Plaintext and password are required');
    });

    it('should fail with empty password', async () => {
      const result = await EncryptionUtils.encrypt(testPlaintext, '');

      expect(result.success).toBe(false);
      expect(result.error).toContain('Plaintext and password are required');
    });

    it('should produce different results for same input', async () => {
      const result1 = await EncryptionUtils.encrypt(testPlaintext, testPassword);
      const result2 = await EncryptionUtils.encrypt(testPlaintext, testPassword);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);

      // Should be different due to random IV and salt
      expect(result1.encrypted?.data).not.toBe(result2.encrypted?.data);
      expect(result1.encrypted?.iv).not.toBe(result2.encrypted?.iv);
      expect(result1.encrypted?.salt).not.toBe(result2.encrypted?.salt);
    });
  });

  describe('decrypt', () => {
    it('should successfully decrypt encrypted data', async () => {
      // First encrypt some data
      const encryptResult = await EncryptionUtils.encrypt(testPlaintext, testPassword);
      expect(encryptResult.success).toBe(true);

      // Then decrypt it
      const decryptResult = await EncryptionUtils.decrypt(encryptResult.encrypted!, testPassword);

      expect(decryptResult.success).toBe(true);
      expect(decryptResult.decrypted).toBe(testPlaintext);
    });

    it('should fail with wrong password', async () => {
      const encryptResult = await EncryptionUtils.encrypt(testPlaintext, testPassword);
      expect(encryptResult.success).toBe(true);

      const decryptResult = await EncryptionUtils.decrypt(
        encryptResult.encrypted!,
        'wrong-password'
      );

      expect(decryptResult.success).toBe(false);
      expect(decryptResult.error).toContain('Decryption failed');
    });

    it('should fail with invalid encrypted data', async () => {
      const invalidData: EncryptedData = {
        data: 'invalid-base64-data',
        iv: 'invalid-iv',
        salt: 'invalid-salt',
        algorithm: 'aes-256-cbc',
      };

      const result = await EncryptionUtils.decrypt(invalidData, testPassword);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Decryption failed');
    });

    it('should fail with unsupported algorithm', async () => {
      const encryptResult = await EncryptionUtils.encrypt(testPlaintext, testPassword);
      expect(encryptResult.success).toBe(true);

      const modifiedData = {
        ...encryptResult.encrypted!,
        algorithm: 'unsupported-algorithm',
      };

      const result = await EncryptionUtils.decrypt(modifiedData, testPassword);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Unsupported encryption algorithm');
    });

    it('should fail with empty data', async () => {
      const result = await EncryptionUtils.decrypt(null as any, testPassword);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Encrypted data and password are required');
    });
  });

  describe('generateSecurePassword', () => {
    it('should generate password with default length', () => {
      const password = EncryptionUtils.generateSecurePassword();

      expect(password).toBeDefined();
      expect(password.length).toBeGreaterThan(40); // Base64 encoded 32 bytes
      expect(/^[A-Za-z0-9+/]+=*$/.test(password)).toBe(true);
    });

    it('should generate password with custom length', () => {
      const password = EncryptionUtils.generateSecurePassword(16);

      expect(password).toBeDefined();
      expect(password.length).toBeGreaterThan(20); // Base64 encoded 16 bytes
    });

    it('should generate different passwords each time', () => {
      const password1 = EncryptionUtils.generateSecurePassword();
      const password2 = EncryptionUtils.generateSecurePassword();

      expect(password1).not.toBe(password2);
    });
  });

  describe('hash', () => {
    it('should generate consistent hash for same input', () => {
      const hash1 = EncryptionUtils.hash('test-data');
      const hash2 = EncryptionUtils.hash('test-data');

      expect(hash1).toBe(hash2);
      expect(hash1).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hex string
    });

    it('should generate different hash for different input', () => {
      const hash1 = EncryptionUtils.hash('test-data-1');
      const hash2 = EncryptionUtils.hash('test-data-2');

      expect(hash1).not.toBe(hash2);
    });

    it('should use salt when provided', () => {
      const hash1 = EncryptionUtils.hash('test-data', 'salt1');
      const hash2 = EncryptionUtils.hash('test-data', 'salt2');
      const hash3 = EncryptionUtils.hash('test-data');

      expect(hash1).not.toBe(hash2);
      expect(hash1).not.toBe(hash3);
      expect(hash2).not.toBe(hash3);
    });
  });

  describe('verifyHash', () => {
    it('should verify correct hash', () => {
      const data = 'test-data';
      const hash = EncryptionUtils.hash(data);

      expect(EncryptionUtils.verifyHash(data, hash)).toBe(true);
    });

    it('should reject incorrect hash', () => {
      const data = 'test-data';
      const wrongHash = EncryptionUtils.hash('different-data');

      expect(EncryptionUtils.verifyHash(data, wrongHash)).toBe(false);
    });

    it('should verify hash with salt', () => {
      const data = 'test-data';
      const salt = 'test-salt';
      const hash = EncryptionUtils.hash(data, salt);

      expect(EncryptionUtils.verifyHash(data, hash, salt)).toBe(true);
      expect(EncryptionUtils.verifyHash(data, hash)).toBe(false); // Without salt
    });
  });

  describe('generateToken', () => {
    it('should generate token with default length', () => {
      const token = EncryptionUtils.generateToken();

      expect(token).toBeDefined();
      expect(token.length).toBe(64); // 32 bytes as hex
      expect(/^[a-f0-9]+$/.test(token)).toBe(true);
    });

    it('should generate token with custom length', () => {
      const token = EncryptionUtils.generateToken(16);

      expect(token).toBeDefined();
      expect(token.length).toBe(32); // 16 bytes as hex
    });

    it('should generate different tokens each time', () => {
      const token1 = EncryptionUtils.generateToken();
      const token2 = EncryptionUtils.generateToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe('secureCompare', () => {
    it('should return true for equal strings', () => {
      const str = 'test-string';
      expect(EncryptionUtils.secureCompare(str, str)).toBe(true);
    });

    it('should return false for different strings', () => {
      expect(EncryptionUtils.secureCompare('string1', 'string2')).toBe(false);
    });

    it('should return false for different length strings', () => {
      expect(EncryptionUtils.secureCompare('short', 'much-longer-string')).toBe(false);
    });

    it('should be constant time for same length strings', () => {
      // This is hard to test directly, but we can at least verify behavior
      const str1 = 'a'.repeat(100);
      const str2 = 'b'.repeat(100);

      expect(EncryptionUtils.secureCompare(str1, str2)).toBe(false);
    });
  });

  describe('deriveKey', () => {
    it('should derive consistent key for same inputs', () => {
      const password = 'test-password';
      const salt = Buffer.from('test-salt');

      const key1 = EncryptionUtils.deriveKey(password, salt);
      const key2 = EncryptionUtils.deriveKey(password, salt);

      expect(key1.equals(key2)).toBe(true);
    });

    it('should derive different keys for different passwords', () => {
      const salt = Buffer.from('test-salt');

      const key1 = EncryptionUtils.deriveKey('password1', salt);
      const key2 = EncryptionUtils.deriveKey('password2', salt);

      expect(key1.equals(key2)).toBe(false);
    });

    it('should derive different keys for different salts', () => {
      const password = 'test-password';

      const key1 = EncryptionUtils.deriveKey(password, Buffer.from('salt1'));
      const key2 = EncryptionUtils.deriveKey(password, Buffer.from('salt2'));

      expect(key1.equals(key2)).toBe(false);
    });
  });

  describe('validateEncryptionData', () => {
    it('should validate complete encryption data', () => {
      const validData: EncryptedData = {
        data: 'encrypted-data',
        iv: 'initialization-vector',
        salt: 'salt-value',
        algorithm: 'aes-256-cbc',
      };

      expect(EncryptionUtils.validateEncryptionData(validData)).toBe(true);
    });

    it('should reject incomplete encryption data', () => {
      const incompleteData = {
        data: 'encrypted-data',
        iv: 'initialization-vector',
        // Missing salt and algorithm
      } as EncryptedData;

      expect(EncryptionUtils.validateEncryptionData(incompleteData)).toBe(false);
    });

    it('should reject wrong algorithm', () => {
      const wrongAlgorithm: EncryptedData = {
        data: 'encrypted-data',
        iv: 'initialization-vector',
        salt: 'salt-value',
        algorithm: 'wrong-algorithm',
      };

      expect(EncryptionUtils.validateEncryptionData(wrongAlgorithm)).toBe(false);
    });
  });

  describe('convenience exports', () => {
    it('should provide encryption convenience methods', async () => {
      expect(encryption.encrypt).toBe(EncryptionUtils.encrypt);
      expect(encryption.decrypt).toBe(EncryptionUtils.decrypt);
      expect(encryption.generatePassword).toBe(EncryptionUtils.generateSecurePassword);
      expect(encryption.hash).toBe(EncryptionUtils.hash);
      expect(encryption.verifyHash).toBe(EncryptionUtils.verifyHash);
      expect(encryption.generateToken).toBe(EncryptionUtils.generateToken);
      expect(encryption.secureCompare).toBe(EncryptionUtils.secureCompare);
    });
  });
});
