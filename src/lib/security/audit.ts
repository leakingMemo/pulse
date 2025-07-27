/**
 * Security Audit Logger for Pulse Extension
 *
 * Provides comprehensive security event logging and monitoring
 * for compliance and security analysis.
 */

import { LocalStorage } from '@raycast/api';
import { SecurityEventType, SECURITY_POLICY } from './constants';

/**
 * Security audit log entry
 */
export interface AuditLogEntry {
  /** Unique identifier for this log entry */
  id: string;
  /** Timestamp when the event occurred */
  timestamp: string;
  /** Type of security event */
  eventType: SecurityEventType;
  /** Result of the operation (SUCCESS, FAILED, WARNING) */
  result: 'SUCCESS' | 'FAILED' | 'WARNING';
  /** Additional event data */
  data: Record<string, any>;
  /** Session identifier */
  sessionId: string;
  /** Version of the audit log format */
  version: number;
}

/**
 * Audit query parameters
 */
export interface AuditQuery {
  /** Filter by event type */
  eventType?: SecurityEventType;
  /** Filter by result status */
  result?: 'SUCCESS' | 'FAILED' | 'WARNING';
  /** Filter events after this timestamp */
  after?: Date;
  /** Filter events before this timestamp */
  before?: Date;
  /** Maximum number of entries to return */
  limit?: number;
}

/**
 * Audit statistics
 */
export interface AuditStats {
  totalEvents: number;
  successfulEvents: number;
  failedEvents: number;
  warningEvents: number;
  eventsByType: Record<string, number>;
  oldestEvent?: Date;
  newestEvent?: Date;
}

/**
 * SecurityAudit provides comprehensive logging and monitoring of security events
 */
export class SecurityAudit {
  private static instance: SecurityAudit;
  private readonly sessionId: string;
  private readonly storageKey = 'pulse.security.audit_log';
  private readonly maxEntries = 1000; // Maximum audit log entries to keep

  /**
   * Private constructor for singleton pattern
   */
  private constructor() {
    this.sessionId = this.generateSessionId();
  }

  /**
   * Get singleton instance
   */
  static getInstance(): SecurityAudit {
    if (!SecurityAudit.instance) {
      SecurityAudit.instance = new SecurityAudit();
    }
    return SecurityAudit.instance;
  }

  /**
   * Log a security event
   */
  async log(
    eventType: SecurityEventType,
    result: 'SUCCESS' | 'FAILED' | 'WARNING',
    data: Record<string, any> = {}
  ): Promise<void> {
    try {
      const entry: AuditLogEntry = {
        id: this.generateEntryId(),
        timestamp: new Date().toISOString(),
        eventType,
        result,
        data: this.sanitizeLogData(data),
        sessionId: this.sessionId,
        version: 1,
      };

      // Get existing log entries
      const existingLog = await this.getAuditLog();

      // Add new entry
      existingLog.push(entry);

      // Enforce retention policy
      const trimmedLog = this.enforceRetentionPolicy(existingLog);

      // Store updated log
      await LocalStorage.setItem(this.storageKey, JSON.stringify(trimmedLog));

      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`[AUDIT] ${eventType}: ${result}`, data);
      }
    } catch (error) {
      // Audit logging should not fail the main operation
      console.error('Failed to write audit log:', error);
    }
  }

  /**
   * Query audit log entries
   */
  async query(params: AuditQuery = {}): Promise<AuditLogEntry[]> {
    try {
      const allEntries = await this.getAuditLog();

      return allEntries
        .filter((entry) => {
          // Filter by event type
          if (params.eventType && entry.eventType !== params.eventType) {
            return false;
          }

          // Filter by result
          if (params.result && entry.result !== params.result) {
            return false;
          }

          // Filter by date range
          const entryDate = new Date(entry.timestamp);
          if (params.after && entryDate <= params.after) {
            return false;
          }
          if (params.before && entryDate >= params.before) {
            return false;
          }

          return true;
        })
        .slice(0, params.limit || 100)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    } catch (error) {
      console.error('Failed to query audit log:', error);
      return [];
    }
  }

  /**
   * Get audit statistics
   */
  async getStats(): Promise<AuditStats> {
    try {
      const allEntries = await this.getAuditLog();

      const stats: AuditStats = {
        totalEvents: allEntries.length,
        successfulEvents: allEntries.filter((e) => e.result === 'SUCCESS').length,
        failedEvents: allEntries.filter((e) => e.result === 'FAILED').length,
        warningEvents: allEntries.filter((e) => e.result === 'WARNING').length,
        eventsByType: {},
      };

      // Count events by type
      for (const entry of allEntries) {
        stats.eventsByType[entry.eventType] = (stats.eventsByType[entry.eventType] || 0) + 1;
      }

      // Find oldest and newest events
      if (allEntries.length > 0) {
        const sortedEntries = allEntries.sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
        stats.oldestEvent = new Date(sortedEntries[0].timestamp);
        stats.newestEvent = new Date(sortedEntries[sortedEntries.length - 1].timestamp);
      }

      return stats;
    } catch (error) {
      console.error('Failed to get audit stats:', error);
      return {
        totalEvents: 0,
        successfulEvents: 0,
        failedEvents: 0,
        warningEvents: 0,
        eventsByType: {},
      };
    }
  }

  /**
   * Get recent security alerts (failed and warning events)
   */
  async getRecentAlerts(hours: number = 24): Promise<AuditLogEntry[]> {
    const since = new Date(Date.now() - hours * 60 * 60 * 1000);

    return this.query({
      after: since,
      result: 'FAILED',
    });
  }

  /**
   * Check for suspicious activity patterns
   */
  async detectSuspiciousActivity(): Promise<{
    hasIssues: boolean;
    issues: string[];
    recommendations: string[];
  }> {
    try {
      const recentEntries = await this.query({
        after: new Date(Date.now() - 60 * 60 * 1000), // Last hour
      });

      const issues: string[] = [];
      const recommendations: string[] = [];

      // Check for multiple failed attempts
      const failedAttempts = recentEntries.filter((e) => e.result === 'FAILED');
      if (failedAttempts.length > SECURITY_POLICY.AUDIT.sensitiveOperations.length) {
        issues.push(`High number of failed operations: ${failedAttempts.length}`);
        recommendations.push('Review failed operations and consider implementing rate limiting');
      }

      // Check for unusual access patterns
      const accessAttempts = recentEntries.filter(
        (e) => e.eventType === SecurityEventType.CREDENTIAL_RETRIEVED
      );
      if (accessAttempts.length > 50) {
        issues.push('Unusually high credential access frequency');
        recommendations.push('Monitor for potential credential harvesting attempts');
      }

      // Check for unauthorized access attempts
      const unauthorizedAttempts = recentEntries.filter(
        (e) => e.eventType === SecurityEventType.UNAUTHORIZED_ACCESS
      );
      if (unauthorizedAttempts.length > 0) {
        issues.push(`${unauthorizedAttempts.length} unauthorized access attempts detected`);
        recommendations.push('Investigate unauthorized access attempts immediately');
      }

      return {
        hasIssues: issues.length > 0,
        issues,
        recommendations,
      };
    } catch (error) {
      console.error('Failed to detect suspicious activity:', error);
      return {
        hasIssues: false,
        issues: [],
        recommendations: [],
      };
    }
  }

  /**
   * Export audit log for external analysis
   */
  async exportLog(): Promise<string> {
    try {
      const allEntries = await this.getAuditLog();
      return JSON.stringify(allEntries, null, 2);
    } catch (error) {
      console.error('Failed to export audit log:', error);
      return '[]';
    }
  }

  /**
   * Clear old audit log entries
   */
  async clearOldEntries(olderThanDays: number = 90): Promise<number> {
    try {
      const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
      const allEntries = await this.getAuditLog();

      const filteredEntries = allEntries.filter((entry) => new Date(entry.timestamp) > cutoffDate);

      const removedCount = allEntries.length - filteredEntries.length;

      if (removedCount > 0) {
        await LocalStorage.setItem(this.storageKey, JSON.stringify(filteredEntries));

        await this.log(SecurityEventType.SECURITY_CONFIG_CHANGED, 'SUCCESS', {
          action: 'audit_log_cleanup',
          entriesRemoved: removedCount,
          retentionDays: olderThanDays,
        });
      }

      return removedCount;
    } catch (error) {
      console.error('Failed to clear old audit entries:', error);
      return 0;
    }
  }

  /**
   * Get the full audit log
   */
  private async getAuditLog(): Promise<AuditLogEntry[]> {
    try {
      const logData = await LocalStorage.getItem<string>(this.storageKey);
      if (!logData) {
        return [];
      }

      const parsed = JSON.parse(logData);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Failed to parse audit log:', error);
      return [];
    }
  }

  /**
   * Enforce retention policy on audit log
   */
  private enforceRetentionPolicy(entries: AuditLogEntry[]): AuditLogEntry[] {
    // Sort by timestamp (newest first)
    const sorted = entries.sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    // Keep only the most recent entries
    const trimmed = sorted.slice(0, this.maxEntries);

    // Also remove entries older than retention period
    const retentionCutoff = new Date(
      Date.now() - SECURITY_POLICY.AUDIT.retentionDays * 24 * 60 * 60 * 1000
    );

    return trimmed.filter((entry) => new Date(entry.timestamp) > retentionCutoff);
  }

  /**
   * Sanitize log data to remove sensitive information
   */
  private sanitizeLogData(data: Record<string, any>): Record<string, any> {
    const sanitized = { ...data };

    // Remove or mask sensitive fields
    const sensitiveFields = ['password', 'token', 'key', 'secret', 'credential'];

    for (const [key, value] of Object.entries(sanitized)) {
      const lowerKey = key.toLowerCase();
      if (sensitiveFields.some((field) => lowerKey.includes(field))) {
        if (typeof value === 'string' && value.length > 0) {
          sanitized[key] = `***${value.slice(-4)}`; // Show only last 4 characters
        } else {
          sanitized[key] = '***';
        }
      }
    }

    return sanitized;
  }

  /**
   * Generate a unique session identifier
   */
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Generate a unique entry identifier
   */
  private generateEntryId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
