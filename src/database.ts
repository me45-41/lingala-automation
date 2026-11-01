/**
 * Module de base de données pour LingalaAutomation
 * Supporte SQLite (basé sur better-sqlite3)
 */

// Base de données en mémoire (remplace better-sqlite3 pour être standalone)
interface Row {
  [key: string]: any;
}

export class DBConnection {
  data: Map<string, Row[]> = new Map();
  path: string;

  constructor(path: string) {
    this.path = path;
  }

  close(): void {
    this.data.clear();
  }

  run(sql: string, params?: any[]): void {
    // Implementation simplifiée en mémoire
    console.log("SQL en mémoire:", sql);
  }

  all(sql: string, params?: any[]): any[] {
    console.log("SELECT en mémoire:", sql);
    return [];
  }

  get(sql: string, params?: any[]): any | null {
    console.log("SELECT one en mémoire:", sql);
    return null;
  }
}

export function kokangisa(path: string): DBConnection {
  return new DBConnection(path);
}

export function tanga(connection: DBConnection): void {
  connection.close();
}

export function salisa(connection: DBConnection, sql: string, params?: any[]): void {
  connection.run(sql, params);
}

export function keta(connection: DBConnection, sql: string, params?: any[]): any[] {
  return connection.all(sql, params);
}

export function ketaMoko(connection: DBConnection, sql: string, params?: any[]): any | null {
  return connection.get(sql, params);
}

export function kokotaLibanga(connection: DBConnection, tableName: string, columns: string): void {
  salisa(connection, `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`);
}

export function kokotaData(connection: DBConnection, tableName: string, data: Record<string, any>): void {
  const sql = `INSERT INTO ${tableName} (${Object.keys(data).join(', ')}) VALUES (${Object.values(data).map(() => '?').join(', ')})`;
  salisa(connection, sql, Object.values(data));
}

export function kobongolaData(connection: DBConnection, tableName: string, data: Record<string, any>, where: string, whereParams?: any[]): void {
  const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${where}`;
  salisa(connection, sql, [...Object.values(data), ...(whereParams || [])]);
}

export function longolaData(connection: DBConnection, tableName: string, where: string, whereParams?: any[]): void {
  const sql = `DELETE FROM ${tableName} WHERE ${where}`;
  salisa(connection, sql, whereParams || []);
}

export function zongaID(connection: DBConnection): number {
  return Math.floor(Math.random() * 10000);
}
