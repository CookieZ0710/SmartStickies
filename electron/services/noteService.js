import { getDatabase } from "../db/database.js";

export function getAllNotes() {
    const db = getDatabase();

    const statement = db.prepare(`
        SELECT * FROM notes
        ORDER BY created_at DESC
    `);

    return statement.all();
}

export function createNote(
    title, 
    content = "",
    color = "#FFE45C"
) {
    const db = getDatabase();

    const now = new Date().toISOString();

    const statement = db.prepare(`
        INSERT INTO notes (
            title,
            content,
            color,
            created_at,
            updated_at
        )
        VALUES (?, ?, ?, ?, ?)
    `);

    const result = statement.run(
        title, 
        content, 
        color,
        now, 
        now
    );

    return {
        id: result.lastInsertRowid,
        title,
        content,
        color,
        folder_id: null,
        created_at: now,
        updated_at: now
    };
}

export function updateNote(
    id, 
    title, 
    content = "",
    color = "#FFE45C"
) {
    const db = getDatabase();

    const now = new Date().toISOString();

    const statement = db.prepare(`
        UPDATE notes
        SET title = ?, content = ?, color = ?, updated_at = ?
        WHERE id = ?
    `);

    const result = statement.run(
        title, 
        content, 
        color,
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

export function moveNote(noteId, folderId) {
    const db = getDatabase();

    const now = new Date().toISOString();

    const statement = db.prepare(`
        UPDATE notes
        SET folder_id = ?, updated_at = ?
        WHERE id = ?
    `);

    const result = statement.run(
        folderId, 
        now, 
        noteId
    );  

    return result.changes;
}

export function getNotesById(id) {
    const db = getDatabase();
    const now = new Date().toISOString();
    const statement = db.prepare(`
        SELECT * FROM notes
        WHERE id = ?
    `);

    const result = statement.run(id);
    return result.changes;
}

export function pinNote(id) {
    const db = getDatabase();
    const now = new Date().toISOString();
    const statement = db.prepare(`
        UPDATE notes
        SET
            is_pinned = 1, 
            updated_at = ?
        WHERE id = ?
    `);

    const result = statement.run(now, id);
    return result.changes;
}

export function unpinNote(id) {
    const db = getDatabase();
    const now = new Date().toISOString();
    const statement = db.prepare(`
        UPDATE notes
        SET
            is_pinned = 0, 
            updated_at = ?
        WHERE id = ?
    `);

    const result = statement.run(now, id);
    return result.changes;
}

export function getPinnedNotes() {
    const db = getDatabase();
    const now = new Date().toISOString();
    const statement = db.prepare(`
        SELECT * FROM notes
        WHERE is_pinned = 1
        ORDER BY updated_at DESC
    `);

    return statement.all();
}