import Database from "better-sqlite3";
import path from "path";
import { app } from "electron";

let db;

export function initializeDatabase() {
    const dbPath = path.join(app.getPath("userData"), "smartstickies.db");

    db = new Database(dbPath);

    db.pragma("foreign_keys = ON");

    db.exec(`
        CREATE TABLE IF NOT EXISTS folders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            content TEXT DEFAULT '',
            folder_id INTEGER NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,

            FOREIGN KEY (folder_id) 
                REFERENCES folders(id) 
                ON DELETE SET NULL
        );
    `);

    const noteColumns = db.prepare("PRAGMA table_info(notes)").all();

    const hasFolderId = noteColumns.some((column) => column.name === "folder_id");

    if(!hasFolderId) {
        db.exec(`
            ALTER TABLE notes 
            ADD COLUMN folder_id INTEGER NULL
            REFERENCES folders(id)
            ON DELETE SET NULL
        `);

        console.log(
            "Database migration: added folder_id to notes."
        );
    }

    console.log("Database initialized at:", dbPath);

    return db;
}

export function getDatabase() {
    if (!db) {
        throw new Error("Database has not been initialized.");
    }

    return db;
}