import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";

let db;

export function initializeDatabase() {
    const dbPath = path.join(app.getPath("userData"), "smartstickies.db");

    db = new Database(dbPath);

    db.exec(`
        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT DEFAULT '',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    `);

    console.log("Database initialized at:", dbPath);

    return db;
}

export function getDatabase() {
    if (!db) {
        throw new Error("Database has not been initialized.");
    }

    return db;
}