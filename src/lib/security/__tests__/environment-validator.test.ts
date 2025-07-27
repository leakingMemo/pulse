import { EnvironmentValidator } from '../environment-validator';
import { SecurityErrorCode } from '../constants';

// Mock process.env and process properties
const originalEnv = process.env;
const originalPlatform = process.platform;
const originalVersion = process.version;
const originalExecArgv = process.execArgv;

describe('EnvironmentValidator', () => {
  beforeEach(() => {
    // Reset environment before each test
    process.env = { ...originalEnv };

    // Mock required environment variables
    process.env.NODE_ENV = 'test';
    process.env.RAYCAST_OWNER_EMAIL = 'test@example.com';

    // Clear forbidden environment variables
    delete process.env.NOTION_API_TOKEN;
    delete process.env.PLAID_CLIENT_SECRET;
    delete process.env.API_KEY;

    // Mock platform as macOS
    Object.defineProperty(process, 'platform', { value: 'darwin' });
    Object.defineProperty(process, 'version', { value: 'v18.17.0' });
    Object.defineProperty(process, 'execArgv', { value: [] });
  });

  afterEach(() => {
    // Restore original values
    process.env = originalEnv;
    Object.defineProperty(process, 'platform', { value: originalPlatform });
    Object.defineProperty(process, 'version', { value: originalVersion });
    Object.defineProperty(process, 'execArgv', { value: originalExecArgv });
  });

  describe('validate', () => {
    it('should pass validation in clean environment', () => {
      const result = EnvironmentValidator.validate();

      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.environment).toBe('test');
    });

    it('should fail when required environment variables are missing', () => {
      delete process.env.NODE_ENV;
      delete process.env.RAYCAST_OWNER_EMAIL;

      const result = EnvironmentValidator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors).toHaveLength(2);
      expect(result.errors[0].code).toBe(SecurityErrorCode.MISSING_REQUIREMENTS);
      expect(result.errors[0].message).toContain('NODE_ENV');
      expect(result.errors[1].message).toContain('RAYCAST_OWNER_EMAIL');
    });

    it('should fail when forbidden environment variables are present', () => {
      process.env.NOTION_API_TOKEN = 'secret_abc123';
      process.env.PLAID_CLIENT_SECRET = 'secret123';

      const result = EnvironmentValidator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThanOrEqual(2);
      expect(result.errors.some((e) => e.message.includes('NOTION_API_TOKEN'))).toBe(true);
      expect(result.errors.some((e) => e.message.includes('PLAID_CLIENT_SECRET'))).toBe(true);
    });

    it('should warn about variables that look like secrets', () => {
      process.env.CUSTOM_API_KEY = 'abcdefghijklmnopqrstuvwxyz123456789';

      const result = EnvironmentValidator.validate();

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some((w) => w.includes('CUSTOM_API_KEY'))).toBe(true);
    });

    it('should fail on non-macOS platforms', () => {
      Object.defineProperty(process, 'platform', { value: 'linux' });

      const result = EnvironmentValidator.validate();

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(
          (e) => e.code === SecurityErrorCode.MISSING_REQUIREMENTS && e.message.includes('macOS')
        )
      ).toBe(true);
    });

    it('should warn about old Node.js versions', () => {
      Object.defineProperty(process, 'version', { value: 'v14.20.0' });

      const result = EnvironmentValidator.validate();

      expect(result.warnings.some((w) => w.includes('outdated'))).toBe(true);
    });

    it('should warn about insecure Node.js flags', () => {
      Object.defineProperty(process, 'execArgv', {
        value: ['--disable-proto', '--insecure-http-parser'],
      });

      const result = EnvironmentValidator.validate();

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings.some((w) => w.includes('--disable-proto'))).toBe(true);
      expect(result.warnings.some((w) => w.includes('--insecure-http-parser'))).toBe(true);
    });

    it('should fail when TLS validation is disabled', () => {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

      const result = EnvironmentValidator.validate();

      expect(result.isValid).toBe(false);
      expect(
        result.errors.some(
          (e) => e.code === SecurityErrorCode.INSECURE_ENVIRONMENT && e.message.includes('TLS')
        )
      ).toBe(true);
    });
  });

  describe('environment detection', () => {
    it('should detect production environment', () => {
      process.env.NODE_ENV = 'production';

      const result = EnvironmentValidator.validate();

      expect(result.environment).toBe('production');
    });

    it('should detect development environment', () => {
      process.env.NODE_ENV = 'development';

      const result = EnvironmentValidator.validate();

      expect(result.environment).toBe('development');
    });

    it('should default to development environment', () => {
      delete process.env.NODE_ENV;

      const result = EnvironmentValidator.validate();

      expect(result.environment).toBe('development');
    });
  });

  describe('production environment validation', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it('should require HTTPS in production', () => {
      // Don't set any HTTPS indicators

      const result = EnvironmentValidator.validate();

      expect(
        result.errors.some(
          (e) => e.code === SecurityErrorCode.INSECURE_ENVIRONMENT && e.message.includes('HTTPS')
        )
      ).toBe(true);
    });

    it('should pass when HTTPS is enabled', () => {
      process.env.HTTPS = 'true';

      const result = EnvironmentValidator.validate();

      expect(result.errors.some((e) => e.message.includes('HTTPS'))).toBe(false);
    });
  });

  describe('getSecurityRequirements', () => {
    it('should return security requirements checklist', () => {
      const requirements = EnvironmentValidator.getSecurityRequirements();

      expect(requirements).toBeInstanceOf(Array);
      expect(requirements.length).toBeGreaterThan(0);

      // Check structure of requirements
      requirements.forEach((req) => {
        expect(req).toHaveProperty('name');
        expect(req).toHaveProperty('required');
        expect(req).toHaveProperty('met');
        expect(req).toHaveProperty('description');
      });

      // Check specific requirements exist
      expect(requirements.some((r) => r.name === 'macOS Platform')).toBe(true);
      expect(requirements.some((r) => r.name === 'Required Environment Variables')).toBe(true);
      expect(requirements.some((r) => r.name === 'No Forbidden Environment Variables')).toBe(true);
    });

    it('should reflect actual environment state', () => {
      // Add a forbidden environment variable
      process.env.API_KEY = 'secret123';

      const requirements = EnvironmentValidator.getSecurityRequirements();
      const forbiddenVarsReq = requirements.find(
        (r) => r.name === 'No Forbidden Environment Variables'
      );

      expect(forbiddenVarsReq?.met).toBe(false);
    });
  });

  describe('generateSecurityReport', () => {
    it('should generate a formatted security report', () => {
      const report = EnvironmentValidator.generateSecurityReport();

      expect(report).toContain('# Pulse Security Validation Report');
      expect(report).toContain('Environment:');
      expect(report).toContain('Overall Status:');
      expect(report).toContain('Security Requirements');
    });

    it('should include errors in report when validation fails', () => {
      process.env.NOTION_API_TOKEN = 'secret_abc123';

      const report = EnvironmentValidator.generateSecurityReport();

      expect(report).toContain('❌ Errors');
      expect(report).toContain('POLICY_VIOLATION');
    });

    it('should include warnings in report', () => {
      process.env.CUSTOM_API_KEY = 'abcdefghijklmnopqrstuvwxyz123456789';

      const report = EnvironmentValidator.generateSecurityReport();

      expect(report).toContain('⚠️ Warnings');
      expect(report).toContain('CUSTOM_API_KEY');
    });

    it('should show PASS status for clean environment', () => {
      const report = EnvironmentValidator.generateSecurityReport();

      expect(report).toContain('✅ PASS');
    });

    it('should show FAIL status for invalid environment', () => {
      process.env.NOTION_API_TOKEN = 'secret_abc123';

      const report = EnvironmentValidator.generateSecurityReport();

      expect(report).toContain('❌ FAIL');
    });
  });

  describe('edge cases', () => {
    it('should handle missing process.env gracefully', () => {
      const originalEnv = process.env;
      delete (process as any).env;

      const result = EnvironmentValidator.validate();

      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);

      // Restore process.env
      (process as any).env = originalEnv;
    });

    it('should handle undefined environment variables', () => {
      process.env.SOME_VAR = undefined as any;

      const result = EnvironmentValidator.validate();

      // Should not crash, validation may pass or fail but shouldn't throw
      expect(typeof result.isValid).toBe('boolean');
    });
  });
});
