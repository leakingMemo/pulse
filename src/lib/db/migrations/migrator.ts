import Database from 'better-sqlite3';
import { readFileSync } from 'fs';
import { join } from 'path';

export interface Migration {
  id: number;
  name: string;
  sql: string;
}

export class Migrator {
  private db: Database.Database;

  constructor(db: Database.Database) {
    this.db = db;
    this.ensureMigrationTable();
  }

  private ensureMigrationTable(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS migrations (
        id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        applied_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }

  private getMigrations(): Migration[] {
    return [
      {
        id: 1,
        name: 'initial_schema',
        sql: readFileSync(join(__dirname, '..', 'schema.sql'), 'utf-8')
      }
    ];
  }

  private hasAppliedMigration(id: number): boolean {
    const result = this.db.prepare('SELECT COUNT(*) as count FROM migrations WHERE id = ?').get(id) as { count: number };
    return result.count > 0;
  }

  private applyMigration(migration: Migration): void {
    this.db.transaction(() => {
      this.db.exec(migration.sql);
      this.db.prepare('INSERT INTO migrations (id, name) VALUES (?, ?)').run(migration.id, migration.name);
    })();
  }

  public migrate(): void {
    const migrations = this.getMigrations();
    
    for (const migration of migrations) {
      if (!this.hasAppliedMigration(migration.id)) {
        console.log(`Applying migration ${migration.id}: ${migration.name}`);
        this.applyMigration(migration);
      }
    }
  }

  public rollback(steps: number = 1): void {
    const appliedMigrations = this.db
      .prepare('SELECT id, name FROM migrations ORDER BY id DESC LIMIT ?')
      .all(steps) as Array<{ id: number; name: string }>;

    for (const migration of appliedMigrations) {
      console.log(`Rolling back migration ${migration.id}: ${migration.name}`);
      // Note: In a real implementation, you'd have down migrations
      // For now, we'll just remove the migration record
      this.db.prepare('DELETE FROM migrations WHERE id = ?').run(migration.id);
    }
  }

  public getAppliedMigrations(): Array<{ id: number; name: string; applied_at: string }> {
    return this.db
      .prepare('SELECT id, name, applied_at FROM migrations ORDER BY id')
      .all() as Array<{ id: number; name: string; applied_at: string }>;
  }
}