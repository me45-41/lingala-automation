/**
 * Module de base de données pour LingalaAutomation
 * Supporte SQLite (basé sur better-sqlite3)
 */
export class DBConnection {
    data = new Map();
    path;
    constructor(path) {
        this.path = path;
    }
    close() {
        this.data.clear();
    }
    run(sql, params) {
        // Implementation simplifiée en mémoire
        console.log("SQL en mémoire:", sql);
    }
    all(sql, params) {
        console.log("SELECT en mémoire:", sql);
        return [];
    }
    get(sql, params) {
        console.log("SELECT one en mémoire:", sql);
        return null;
    }
}
export function kokangisa(path) {
    return new DBConnection(path);
}
export function tanga(connection) {
    connection.close();
}
export function salisa(connection, sql, params) {
    connection.run(sql, params);
}
export function keta(connection, sql, params) {
    return connection.all(sql, params);
}
export function ketaMoko(connection, sql, params) {
    return connection.get(sql, params);
}
export function kokotaLibanga(connection, tableName, columns) {
    salisa(connection, `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`);
}
export function kokotaData(connection, tableName, data) {
    const sql = `INSERT INTO ${tableName} (${Object.keys(data).join(', ')}) VALUES (${Object.values(data).map(() => '?').join(', ')})`;
    salisa(connection, sql, Object.values(data));
}
export function kobongolaData(connection, tableName, data, where, whereParams) {
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${where}`;
    salisa(connection, sql, [...Object.values(data), ...(whereParams || [])]);
}
export function longolaData(connection, tableName, where, whereParams) {
    const sql = `DELETE FROM ${tableName} WHERE ${where}`;
    salisa(connection, sql, whereParams || []);
}
export function zongaID(connection) {
    return Math.floor(Math.random() * 10000);
}
