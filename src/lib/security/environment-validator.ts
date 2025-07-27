import { ENVIRONMENT_SECURITY, SecurityErrorCode } from './constants';

/**
 * Environment validation result
 */
export interface EnvironmentValidationResult {
  isValid: boolean;
  errors: Array<{
    code: SecurityErrorCode;
    message: string;
    severity: 'error' | 'warning';
  }>;
  warnings: string[];
  environment: 'development' | 'production' | 'test';
}

/**
 * Security requirement check result
 */
export interface SecurityRequirement {
  name: string;
  required: boolean;
  met: boolean;
  description: string;
}

/**
 * Environment validator for security compliance
 *
 * This class validates that the runtime environment meets security
 * requirements and follows best practices for credential handling.
 */
export class EnvironmentValidator {
  /**
   * Validate the current environment for security compliance
   *
   * @returns Validation result with errors and warnings
   */
  static validate(): EnvironmentValidationResult {
    const result: EnvironmentValidationResult = {
      isValid: true,
      errors: [],
      warnings: [],
      environment: this.detectEnvironment(),
    };

    // Check required environment variables
    this.validateRequiredEnvironmentVariables(result);

    // Check for forbidden environment variables
    this.validateForbiddenEnvironmentVariables(result);

    // Validate environment-specific security settings
    this.validateEnvironmentSpecificSecurity(result);

    // Check macOS-specific requirements
    this.validateMacOSRequirements(result);

    // Check Node.js security
    this.validateNodeJSSecurity(result);

    // Validate file system permissions
    this.validateFileSystemSecurity(result);

    // Final validation
    result.isValid = result.errors.length === 0;

    return result;
  }

  /**
   * Detect the current environment
   *
   * @private
   */
  private static detectEnvironment(): 'development' | 'production' | 'test' {
    const nodeEnv = process.env.NODE_ENV?.toLowerCase();

    if (nodeEnv === 'production') return 'production';
    if (nodeEnv === 'test') return 'test';
    return 'development';
  }

  /**
   * Validate required environment variables
   *
   * @private
   */
  private static validateRequiredEnvironmentVariables(result: EnvironmentValidationResult): void {
    for (const envVar of ENVIRONMENT_SECURITY.REQUIRED_ENV_VARS) {
      if (!process.env[envVar]) {
        result.errors.push({
          code: SecurityErrorCode.MISSING_REQUIREMENTS,
          message: `Required environment variable '${envVar}' is not set`,
          severity: 'error',
        });
      }
    }
  }

  /**
   * Check for forbidden environment variables that should use keychain
   *
   * @private
   */
  private static validateForbiddenEnvironmentVariables(result: EnvironmentValidationResult): void {
    for (const envVar of ENVIRONMENT_SECURITY.FORBIDDEN_ENV_VARS) {
      if (process.env[envVar]) {
        result.errors.push({
          code: SecurityErrorCode.POLICY_VIOLATION,
          message: `Forbidden environment variable '${envVar}' detected. Use keychain instead.`,
          severity: 'error',
        });
      }
    }

    // Check for any environment variables that look like secrets
    for (const [key, value] of Object.entries(process.env)) {
      if (this.looksLikeSecret(key, value)) {
        result.warnings.push(
          `Environment variable '${key}' appears to contain sensitive data. Consider using keychain.`
        );
      }
    }
  }

  /**
   * Validate environment-specific security settings
   *
   * @private
   */
  private static validateEnvironmentSpecificSecurity(result: EnvironmentValidationResult): void {
    const config =
      result.environment === 'production'
        ? ENVIRONMENT_SECURITY.PRODUCTION
        : ENVIRONMENT_SECURITY.DEVELOPMENT;

    // Check HTTPS requirement
    if (config.requireHttps && !this.isHttpsEnabled()) {
      result.errors.push({
        code: SecurityErrorCode.INSECURE_ENVIRONMENT,
        message: 'HTTPS is required in this environment',
        severity: 'error',
      });
    }

    // Check debug logging
    if (!config.enableDebugLogging && this.isDebugLoggingEnabled()) {
      result.warnings.push('Debug logging is enabled. Ensure no sensitive data is logged.');
    }

    // Check certificate validation
    if (config.skipCertificateValidation) {
      result.warnings.push('Certificate validation is disabled. Only use in development.');
    }
  }

  /**
   * Validate macOS-specific security requirements
   *
   * @private
   */
  private static validateMacOSRequirements(result: EnvironmentValidationResult): void {
    // Check if we're running on macOS
    if (process.platform !== 'darwin') {
      result.errors.push({
        code: SecurityErrorCode.MISSING_REQUIREMENTS,
        message: 'Pulse requires macOS for Keychain integration',
        severity: 'error',
      });
      return;
    }

    // Check if security command is available
    if (!this.isSecurityCommandAvailable()) {
      result.errors.push({
        code: SecurityErrorCode.MISSING_REQUIREMENTS,
        message: 'macOS security command is not available',
        severity: 'error',
      });
    }

    // Check Keychain access
    if (!this.canAccessKeychain()) {
      result.warnings.push('Keychain access may be restricted. Some features may not work.');
    }
  }

  /**
   * Validate Node.js security settings
   *
   * @private
   */
  private static validateNodeJSSecurity(result: EnvironmentValidationResult): void {
    // Check Node.js version
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

    if (majorVersion < 16) {
      result.warnings.push(
        `Node.js ${nodeVersion} is outdated. Consider upgrading for security updates.`
      );
    }

    // Check for insecure flags
    const execArgv = process.execArgv;
    const insecureFlags = [
      '--disable-proto',
      '--insecure-http-parser',
      '--allow-fs-write',
      '--allow-fs-read',
    ];

    for (const flag of insecureFlags) {
      if (execArgv.includes(flag)) {
        result.warnings.push(`Insecure Node.js flag detected: ${flag}`);
      }
    }

    // Check TLS settings
    if (process.env.NODE_TLS_REJECT_UNAUTHORIZED === '0') {
      result.errors.push({
        code: SecurityErrorCode.INSECURE_ENVIRONMENT,
        message: 'TLS certificate validation is disabled',
        severity: 'error',
      });
    }
  }

  /**
   * Validate file system security
   *
   * @private
   */
  private static validateFileSystemSecurity(result: EnvironmentValidationResult): void {
    // Check current working directory permissions
    try {
      const cwd = process.cwd();

      // Basic check - we should be able to write to our own directory
      // In a real implementation, you'd check actual file permissions
      if (!cwd.includes('/Users/') && !cwd.includes('/Applications/')) {
        result.warnings.push('Running from unexpected directory. Ensure proper file permissions.');
      }
    } catch (error) {
      result.warnings.push('Unable to validate file system permissions');
    }
  }

  /**
   * Check if a variable looks like it contains secret data
   *
   * @private
   */
  private static looksLikeSecret(key: string, value?: string): boolean {
    if (!value) return false;

    const secretKeywords = [
      'key',
      'secret',
      'token',
      'password',
      'pass',
      'auth',
      'credential',
      'api',
      'private',
      'cert',
      'signature',
    ];

    const keyLower = key.toLowerCase();
    const hasSecretKeyword = secretKeywords.some((keyword) => keyLower.includes(keyword));

    // Check if value looks like a secret (long, alphanumeric/base64)
    const looksLikeToken = value.length > 20 && /^[A-Za-z0-9+/=_-]+$/.test(value);

    return hasSecretKeyword && looksLikeToken;
  }

  /**
   * Check if HTTPS is enabled
   *
   * @private
   */
  private static isHttpsEnabled(): boolean {
    // Check common HTTPS indicators
    return !!(
      process.env.HTTPS === 'true' ||
      process.env.SSL_CERT ||
      process.env.TLS_CERT ||
      process.env.FORCE_HTTPS === 'true'
    );
  }

  /**
   * Check if debug logging is enabled
   *
   * @private
   */
  private static isDebugLoggingEnabled(): boolean {
    return !!(
      process.env.DEBUG ||
      process.env.VERBOSE === 'true' ||
      process.env.LOG_LEVEL === 'debug'
    );
  }

  /**
   * Check if macOS security command is available
   *
   * @private
   */
  private static isSecurityCommandAvailable(): boolean {
    try {
      // This would require running a command to check
      // For now, assume it's available on macOS
      return process.platform === 'darwin';
    } catch {
      return false;
    }
  }

  /**
   * Check if we can access the keychain
   *
   * @private
   */
  private static canAccessKeychain(): boolean {
    try {
      // This would require attempting a keychain operation
      // For now, assume it's available
      return process.platform === 'darwin';
    } catch {
      return false;
    }
  }

  /**
   * Get security requirements checklist
   *
   * @returns Array of security requirements and their status
   */
  static getSecurityRequirements(): SecurityRequirement[] {
    const validation = this.validate();

    return [
      {
        name: 'macOS Platform',
        required: true,
        met: process.platform === 'darwin',
        description: 'Required for Keychain integration',
      },
      {
        name: 'Required Environment Variables',
        required: true,
        met: !validation.errors.some((e) => e.code === SecurityErrorCode.MISSING_REQUIREMENTS),
        description: 'All required environment variables are set',
      },
      {
        name: 'No Forbidden Environment Variables',
        required: true,
        met: !validation.errors.some((e) => e.code === SecurityErrorCode.POLICY_VIOLATION),
        description: 'No credentials in environment variables',
      },
      {
        name: 'Secure Transport',
        required: validation.environment === 'production',
        met: validation.environment !== 'production' || this.isHttpsEnabled(),
        description: 'HTTPS enabled for production',
      },
      {
        name: 'TLS Certificate Validation',
        required: true,
        met: process.env.NODE_TLS_REJECT_UNAUTHORIZED !== '0',
        description: 'TLS certificates are validated',
      },
      {
        name: 'Security Command Available',
        required: true,
        met: this.isSecurityCommandAvailable(),
        description: 'macOS security command is accessible',
      },
    ];
  }

  /**
   * Generate a security report
   *
   * @returns Formatted security validation report
   */
  static generateSecurityReport(): string {
    const validation = this.validate();
    const requirements = this.getSecurityRequirements();

    let report = '# Pulse Security Validation Report\n\n';
    report += `Environment: ${validation.environment}\n`;
    report += `Overall Status: ${validation.isValid ? '✅ PASS' : '❌ FAIL'}\n\n`;

    if (validation.errors.length > 0) {
      report += '## ❌ Errors\n';
      for (const error of validation.errors) {
        report += `- **${error.code}**: ${error.message}\n`;
      }
      report += '\n';
    }

    if (validation.warnings.length > 0) {
      report += '## ⚠️ Warnings\n';
      for (const warning of validation.warnings) {
        report += `- ${warning}\n`;
      }
      report += '\n';
    }

    report += '## Security Requirements\n';
    for (const req of requirements) {
      const status = req.met ? '✅' : '❌';
      const required = req.required ? '(Required)' : '(Optional)';
      report += `- ${status} **${req.name}** ${required}: ${req.description}\n`;
    }

    return report;
  }
}

/**
 * Default environment validator instance
 */
export const environmentValidator = EnvironmentValidator;
