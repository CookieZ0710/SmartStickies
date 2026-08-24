import { getDatabase } from "../db/database.js";

export function getAllFolders() {
    const db = getDatabase();

    const statement = db.prepare(`
        SELECT * FROM folders
        ORDER BY created_at ASC
    `);

    return statement.all();
}

export function createFolder(name) {
    if (!name || !name.trim()) {
        throw new Error("Folder name cannot be empty.");
    }
    
    const db = getDatabase();

    const now = new Date().toISOString();

    const statement = db.prepare(`
        INSERT INTO notes (
            name,
            created_at,
            updated_at
        )
        VALUES (?, ?, ?)
    `);

    const result = statement.run(
        name,
        now, 
        now
    );

    return {
        id: result.lastInsertRowid,
        name,
        created_at: now,
        updated_at: now
    };
}

export function updateFolder(id, name) {
    const db = getDatabase();

    const now = new Date().toISOString();

    const statement = db.prepare(`
        UPDATE folders
        SET name = ?, updated_at = ?
        WHERE id = ?
    `);

    const result = statement.run(
        name,
        now, 
        id
    );

    return result.changes;
}

export function deleteFolder(id) {
    const db = getDatabase();   

    const statement = db.prepare(`
        DELETE FROM folders
        WHERE id = ?
    `);

    const result = statement.run(id);

    return result.changes;
}