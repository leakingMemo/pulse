import { DatabaseConnection } from './connection';
import { Migrator } from './migrations';

export function initializeDatabase(): void {
  const db = DatabaseConnection.getInstance();
  const migrator = new Migrator(db);
  
  try {
    migrator.migrate();
    console.log('Database initialized successfully');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    throw error;
  }
}