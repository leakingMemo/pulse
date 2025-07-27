import Database from 'better-sqlite3';
import { DatabaseConnection } from '../connection';

export abstract class BaseRepository<T> {
  protected db: Database.Database;
  protected abstract tableName: string;

  constructor() {
    this.db = DatabaseConnection.getInstance();
  }

  protected prepare(sql: string): Database.Statement {
    return this.db.prepare(sql);
  }

  protected transaction<R>(fn: () => R): R {
    return this.db.transaction(fn)();
  }

  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  protected run(statement: Database.Statement, params: any = {}): Database.RunResult {
    return statement.run(params);
  }

  protected get<R>(statement: Database.Statement, params: any = {}): R | undefined {
    return statement.get(params) as R | undefined;
  }

  protected all<R>(statement: Database.Statement, params: any = {}): R[] {
    return statement.all(params) as R[];
  }

  public async findById(id: string): Promise<T | null> {
    const stmt = this.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`);
    const result = this.get<T>(stmt, id);
    return result || null;
  }

  public async findAll(limit?: number, offset?: number): Promise<T[]> {
    let sql = `SELECT * FROM ${this.tableName}`;
    const params: any[] = [];

    if (limit !== undefined) {
      sql += ' LIMIT ?';
      params.push(limit);
      
      if (offset !== undefined) {
        sql += ' OFFSET ?';
        params.push(offset);
      }
    }

    const stmt = this.prepare(sql);
    return this.all<T>(stmt, ...params);
  }

  public async deleteById(id: string): Promise<boolean> {
    const stmt = this.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`);
    const result = this.run(stmt, id);
    return result.changes > 0;
  }

  public async count(): Promise<number> {
    const stmt = this.prepare(`SELECT COUNT(*) as count FROM ${this.tableName}`);
    const result = this.get<{ count: number }>(stmt);
    return result?.count || 0;
  }

  protected toDate(value: string | Date | null | undefined): Date | null {
    if (!value) return null;
    if (value instanceof Date) return value;
    return new Date(value);
  }

  protected toDateString(value: Date | null | undefined): string | null {
    if (!value) return null;
    return value.toISOString();
  }

  protected toBoolean(value: number | boolean | null | undefined): boolean {
    return Boolean(value);
  }

  protected toNumber(value: boolean): number {
    return value ? 1 : 0;
  }
}