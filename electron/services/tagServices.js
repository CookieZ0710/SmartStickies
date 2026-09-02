import { getDatabase } from "../db/database.js";

export function getAllTags() {
    const db = getDatabase();
    const statement = db.prepare(`
        SELECT * FROM tags
        ORDER BY name ASC
    `);

    return statement.all();
}

export function createTag(name) {
    const db = getDatabase();
    const trimmedName = name.trim();

    if(!trimmedName) {
        throw new Error("Tag name cannot be empty.");
    }

    const now = new Date().toISOString();
    const statement = db.prepare(`
        INSERT INTO tags (name, created_at, updated_at)
        VALUES (?, ?, ?)
    `);
    const result = statement.run(trimmedName, now, now);

    return {
        id: result.lastInsertRowid,
        name: trimmedName,
        created_at: now,
        updated_at: now
    };
}

export function updateTag(id, name) {
    const db = getDatabase();
    const trimmedName = name.trim();

    if(!trimmedName) {
        throw new Error("Tag name cannot be empty.");
    }

    const now = new Date().toISOString();
    const statement = db.prepare(`
        UPDATE tags
        SET name = ?, updated_at = ?
        WHERE id = ?
    `);
    const result = statement.run(trimmedName, now, id);

    return result.changes;
}

export function deleteTag(id) {
    const db = getDatabase();
    const statement = db.prepare(`
        DELETE FROM tags
        WHERE id = ?
    `);
    const result = statement.run(id);
    
    return result.changes;
}

export function getTagsForNote(noteId) {
    const db = getDatabase();
    const statement = db.prepare(`
        SELECT tags.*
        FROM tags
        JOIN note_tags ON tags.id = note_tags.tag_id
        WHERE note_tags.note_id = ?
        ORDER BY tags.name ASC
    `);

    return statement.all(noteId);
}

export function addTagToNote(noteId, tagId) {
    const db = getDatabase();
    const statement = db.prepare(`
        INSERT INTO note_tags (note_id, tag_id)
        VALUES (?, ?)
    `);
    const result = statement.run(noteId, tagId);

    return result.changes;
}

export function removeTagFromNote(noteId, tagId) {
    const db = getDatabase();
    const statement = db.prepare(`
        DELETE FROM note_tags
        WHERE note_id = ? AND tag_id = ?
    `);
    const result = statement.run(noteId, tagId);

    return result.changes;
}