import { getDatabase } from "../db/database.js";

export function createNote(title, content = "") {
    const db = getDatabase();

    const now = new Date().toISOString();

    const statement = db.prepare(`
        INSERT INTO notes (
            title,
            content,
            created_at,
            updated_at
        )
        VALUES (?, ?, ?, ?)
    `);

    const result = statement.run(
        title, 
        content, 
        now, 
        now
    );

    return {
        id: result.lastInsertRowid,
        title,
        content,
        created_at: now,
        updated_at: now
    };
}

export function getAllNotes() {
    const db = getDatabase();

    const statement = db.prepare(`
        SELECT * FROM notes
        ORDER BY created_at DESC
    `);

    return statement.all();
}