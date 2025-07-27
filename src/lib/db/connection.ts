import Database from 'better-sqlite3';
import { homedir } from 'os';
import { join, dirname } from 'path';
import { mkdirSync, existsSync } from 'fs';

export class DatabaseConnection {
  private static instance: Database.Database | null = null;
  private static readonly DB_FILENAME = 'pulse.db';

  private static getDatabasePath(): string {
    // Check if we're in a test environment
    if (process.env.NODE_ENV === 'test') {
      return join(process.cwd(), 'data', this.DB_FILENAME);
    }
    
    // Check if we're in Raycast development environment
    try {
      const { environment } = require('@raycast/api');
      if (environment.isDevelopment) {
        return join(process.cwd(), 'data', this.DB_FILENAME);
      }
    } catch (e) {
      // Not in Raycast environment
    }
    
    const appSupport = join(homedir(), 'Library', 'Application Support', 'com.raycast.pulse');
    return join(appSupport, this.DB_FILENAME);
  }

  public static getInstance(): Database.Database {
    if (!this.instance) {
      const dbPath = this.getDatabasePath();
      const dbDir = dirname(dbPath);

      if (!existsSync(dbDir)) {
        mkdirSync(dbDir, { recursive: true });
      }

      this.instance = new Database(dbPath);
      
      this.instance.pragma('journal_mode = WAL');
      this.instance.pragma('foreign_keys = ON');
      
      this.instance.exec('PRAGMA busy_timeout = 5000');
      
      process.on('exit', () => {
        if (this.instance) {
          this.instance.close();
        }
      });

      process.on('SIGINT', () => {
        if (this.instance) {
          this.instance.close();
        }
        process.exit(0);
      });

      process.on('SIGTERM', () => {
        if (this.instance) {
          this.instance.close();
        }
        process.exit(0);
      });
    }

    return this.instance;
  }

  public static close(): void {
    if (this.instance) {
      this.instance.close();
      this.instance = null;
    }
  }

  public static transaction<T>(fn: (db: Database.Database) => T): T {
    const db = this.getInstance();
    return db.transaction(fn)(db);
  }
}