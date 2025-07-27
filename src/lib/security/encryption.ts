import { randomBytes, createCipheriv, createDecipheriv, createHash, pbkdf2Sync } from 'crypto';

/**
 * Encryption algorithm configuration
 */
const ENCRYPTION_CONFIG = {
  algorithm: 'aes-256-cbc',
  keyLength: 32, // 256 bits
  ivLength: 16, // 128 bits
  saltLength: 32, // 256 bits
  iterations: 100000, // PBKDF2 iterations
} as const;

/**
 * Encrypted data structure
 */
export interface EncryptedData {
  data: string;
  iv: string;
  salt: string;
  algorithm: string;
}

/**
 * Encryption result
 */
export interface EncryptionResult {
  success: boolean;
  encrypted?: EncryptedData;
  error?: string;
}

/**
 * Decryption result
 */
export interface DecryptionResult {
  success: boolean;
  decrypted?: string;
  error?: string;
}

/**
 * Encryption utilities for sensitive data
 *
 * This class provides methods for encrypting and decrypting sensitive data
 * using industry-standard algorithms and best practices.
 *
 * Features:
 * - AES-256-CBC encryption
 * - PBKDF2 key derivation
 * - Random IV generation
 * - Salt-based key strengthening
 * - Secure memory handling
 */
export class EncryptionUtils {
  /**
   * Encrypt sensitive data using AES-256-CBC
   *
   * @param plaintext - The data to encrypt
   * @param password - The password/key for encryption
   * @returns Promise resolving to encrypted data or error
   */
  static async encrypt(plaintext: string, password: string): Promise<EncryptionResult> {
    try {
      // Validate inputs
      if (!plaintext || !password) {
        return {
          success: false,
          error: 'Plaintext and password are required',
        };
      }

      // Generate random salt and IV
      const salt = randomBytes(ENCRYPTION_CONFIG.saltLength);
      const iv = randomBytes(ENCRYPTION_CONFIG.ivLength);

      // Derive encryption key using PBKDF2
      const key = pbkdf2Sync(
        password,
        salt,
        ENCRYPTION_CONFIG.iterations,
        ENCRYPTION_CONFIG.keyLength,
        'sha256'
      );

      // Create cipher and encrypt
      const cipher = createCipheriv(ENCRYPTION_CONFIG.algorithm, key, iv);

      let encrypted = cipher.update(plaintext, 'utf8', 'base64');
      encrypted += cipher.final('base64');

      // Clear sensitive data from memory
      key.fill(0);

      return {
        success: true,
        encrypted: {
          data: encrypted,
          iv: iv.toString('base64'),
          salt: salt.toString('base64'),
          algorithm: ENCRYPTION_CONFIG.algorithm,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Encryption failed: ${errorMessage}`,
      };
    }
  }

  /**
   * Decrypt data using AES-256-CBC
   *
   * @param encryptedData - The encrypted data structure
   * @param password - The password/key for decryption
   * @returns Promise resolving to decrypted data or error
   */
  static async decrypt(encryptedData: EncryptedData, password: string): Promise<DecryptionResult> {
    try {
      // Validate inputs
      if (!encryptedData || !password) {
        return {
          success: false,
          error: 'Encrypted data and password are required',
        };
      }

      // Validate algorithm
      if (encryptedData.algorithm !== ENCRYPTION_CONFIG.algorithm) {
        return {
          success: false,
          error: `Unsupported encryption algorithm: ${encryptedData.algorithm}`,
        };
      }

      // Parse salt and IV
      const salt = Buffer.from(encryptedData.salt, 'base64');
      const iv = Buffer.from(encryptedData.iv, 'base64');

      // Derive decryption key using same parameters
      const key = pbkdf2Sync(
        password,
        salt,
        ENCRYPTION_CONFIG.iterations,
        ENCRYPTION_CONFIG.keyLength,
        'sha256'
      );

      // Create decipher and decrypt
      const decipher = createDecipheriv(ENCRYPTION_CONFIG.algorithm, key, iv);

      let decrypted = decipher.update(encryptedData.data, 'base64', 'utf8');
      decrypted += decipher.final('utf8');

      // Clear sensitive data from memory
      key.fill(0);

      return {
        success: true,
        decrypted,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return {
        success: false,
        error: `Decryption failed: ${errorMessage}`,
      };
    }
  }

  /**
   * Generate a secure random password/key
   *
   * @param length - The length of the password to generate (default: 32)
   * @returns Base64-encoded random password
   */
  static generateSecurePassword(length: number = 32): string {
    return randomBytes(length).toString('base64');
  }

  /**
   * Hash data using SHA-256
   *
   * @param data - The data to hash
   * @param salt - Optional salt for the hash
   * @returns SHA-256 hash as hex string
   */
  static hash(data: string, salt?: string): string {
    const hash = createHash('sha256');
    hash.update(data);
    if (salt) {
      hash.update(salt);
    }
    return hash.digest('hex');
  }

  /**
   * Verify a hash against original data
   *
   * @param data - The original data
   * @param hash - The hash to verify against
   * @param salt - Optional salt used in original hash
   * @returns True if hash matches, false otherwise
   */
  static verifyHash(data: string, hash: string, salt?: string): boolean {
    const computedHash = this.hash(data, salt);
    return computedHash === hash;
  }

  /**
   * Generate a cryptographically secure random token
   *
   * @param length - The length in bytes (default: 32)
   * @returns Hex-encoded random token
   */
  static generateToken(length: number = 32): string {
    return randomBytes(length).toString('hex');
  }

  /**
   * Derive a key from a password using PBKDF2
   *
   * @param password - The source password
   * @param salt - The salt for key derivation
   * @param iterations - Number of PBKDF2 iterations (default: 100000)
   * @param keyLength - Length of derived key in bytes (default: 32)
   * @returns Derived key as buffer
   */
  static deriveKey(
    password: string,
    salt: Buffer,
    iterations: number = ENCRYPTION_CONFIG.iterations,
    keyLength: number = ENCRYPTION_CONFIG.keyLength
  ): Buffer {
    return pbkdf2Sync(password, salt, iterations, keyLength, 'sha256');
  }

  /**
   * Securely compare two strings in constant time
   *
   * This prevents timing attacks when comparing sensitive values
   * like tokens or hashes.
   *
   * @param a - First string to compare
   * @param b - Second string to compare
   * @returns True if strings are equal, false otherwise
   */
  static secureCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
      return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
      result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
  }

  /**
   * Clear sensitive string from memory (best effort)
   *
   * Note: JavaScript doesn't provide true memory clearing,
   * but this helps with garbage collection.
   *
   * @param sensitiveString - String to clear
   */
  static clearSensitiveString(sensitiveString: string): void {
    // In JavaScript, we can't truly clear memory, but we can
    // help ensure the string gets garbage collected
    if (sensitiveString) {
      // Overwrite with random data (best effort)
      const chars = sensitiveString.split('');
      for (let i = 0; i < chars.length; i++) {
        chars[i] = String.fromCharCode(Math.floor(Math.random() * 256));
      }
    }
  }

  /**
   * Validate encryption parameters
   *
   * @param data - Data to validate
   * @returns True if parameters are valid
   */
  static validateEncryptionData(data: EncryptedData): boolean {
    return !!(
      data &&
      data.data &&
      data.iv &&
      data.salt &&
      data.algorithm === ENCRYPTION_CONFIG.algorithm
    );
  }
}

/**
 * Default encryption instance with convenience methods
 */
export const encryption = {
  encrypt: EncryptionUtils.encrypt,
  decrypt: EncryptionUtils.decrypt,
  generatePassword: EncryptionUtils.generateSecurePassword,
  hash: EncryptionUtils.hash,
  verifyHash: EncryptionUtils.verifyHash,
  generateToken: EncryptionUtils.generateToken,
  secureCompare: EncryptionUtils.secureCompare,
};
