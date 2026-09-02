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
            color TEXT NOT NULL DEFAULT '#FFE45C',
            folder_id INTEGER NULL,
            is_pinned INTEGER NOT NULL DEFAULT 0,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,

            FOREIGN KEY (folder_id) 
                REFERENCES folders(id) 
                ON DELETE SET NULL
        );

        CREATE TABLE IF NOT EXISTS tags (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL UNIQUE,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        );

        CREATE TABLE IF NOT EXISTS note_tags (
            note_id INTEGER NOT NULL,
            tag_id INTEGER NOT NULL,

            PRIMARY KEY (note_id, tag_id),
            
            FOREIGN KEY (note_id)
                REFERENCES notes(id)
                ON DELETE CASCADE,
            FOREIGN KEY (tag_id)
                REFERENCES tags(id)
                ON DELETE CASCADE
        );
    `);

    let noteColumns = db.prepare("PRAGMA table_info(notes)").all();

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

    // Refresh after possible migration
    noteColumns = db.prepare("PRAGMA table_info(notes)").all();

    const hasColor = noteColumns.some((column) => column.name === "color");

    if(!hasColor) {
        db.exec(`
            ALTER TABLE notes 
            ADD COLUMN color TEXT NOT NULL DEFAULT '#FFE45C'
        `);

        console.log(
            "Database migration: added color to notes."
        );
    }

    // Refresh after possible migration
    noteColumns = db.prepare("PRAGMA table_info(notes)").all();

    const hasIsPinned = noteColumns.some((column) => column.name === "is_pinned");

    if(!hasIsPinned) {
        db.exec(`
            ALTER TABLE notes 
            ADD COLUMN is_pinned INTEGER NOT NULL DEFAULT 0
        `);

        console.log(
            "Database migration: added is_pinned to notes."
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