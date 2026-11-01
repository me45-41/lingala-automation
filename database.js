/**
 * Module de base de données pour LingalaAutomation
 * Supporte SQLite (basé sur better-sqlite3)
 */
import Database from 'better-sqlite3';
// Créer une nouvelle connexion SQLite
export function kokangisa(path) {
    const db = new Database(path);
    return { db, path };
}
// Fermer la connexion
export function tanga(connection) {
    connection.db.close();
}
// Exécuter une requête SQL (INSERT, UPDATE, DELETE)
export function salisa(connection, sql, params) {
    const stmt = connection.db.prepare(sql);
    stmt.run(params || []);
}
// Sélectionner des données (SELECT)
export function keta(connection, sql, params) {
    const stmt = connection.db.prepare(sql);
    return stmt.all(params || []);
}
// Sélectionner une seule ligne
export function ketaMoko(connection, sql, params) {
    const stmt = connection.db.prepare(sql);
    return stmt.get(params || []);
}
// Créer une table
export function kokotaLibanga(connection, tableName, columns) {
    const sql = `CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`;
    salisa(connection, sql);
}
// Insérer des données
export function kokotaData(connection, tableName, data) {
    const columns = Object.keys(data).join(', ');
    const values = Object.values(data);
    const placeholders = values.map(() => '?').join(', ');
    const sql = `INSERT INTO ${tableName} (${columns}) VALUES (${placeholders})`;
    salisa(connection, sql, values);
}
// Mettre à jour des données
export function kobongolaData(connection, tableName, data, where, whereParams) {
    const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
    const values = [...Object.values(data), ...(whereParams || [])];
    const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${where}`;
    salisa(connection, sql, values);
}
// Supprimer des données
export function longolaData(connection, tableName, where, whereParams) {
    const sql = `DELETE FROM ${tableName} WHERE ${where}`;
    salisa(connection, sql, whereParams || []);
}
// Obtenir le dernier ID inséré
export function zongaID(connection) {
    const result = ketaMoko(connection, 'SELECT last_insert_rowid() as id');
    return result ? result.id : 0;
}
