import { getDatabase } from "../db/database.js";

export function getAllNotes() {
    const db = getDatabase();

    const statement = db.prepare(`
        SELECT * FROM notes
        ORDER BY created_at DESC
    `);

    return statement.all();
}

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

export function updateNote(id, title, content = "") {
    const db = getDatabase();

    const now = new Date().toISOString();

    const statement = db.prepare(`
        UPDATE notes
        SET title = ?, content = ?, updated_at = ?
        WHERE id = ?
    `);

    const result = statement.run(
        title, 
        content, 
        now, 
        id
    );

    return result.changes;
}

export function deleteNote(id) {
    const db = getDatabase();   

    const statement = db.prepare(`
        DELETE FROM notes
        WHERE id = ?
    `);

    const result = statement.run(id);

    return result.changes;
}