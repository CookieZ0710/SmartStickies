import { useEffect, useState } from "react";

import NoteCard from "../components/NoteCard";
import NoteModal from "../components/NoteModal";

function NotesPage() {
    const [notes, setNotes] = useState([]);
    const [folders, setFolders] = useState([]);

    const [modalMode, setModalMode] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);

    const loadFolders = async () => {
        const savedFolders = await window.smartStickies.folders.getAll();
        setFolders(savedFolders);
    };

    const loadNotes = async () => {
        const savedNotes = await window.smartStickies.notes.getAll();
        setNotes(savedNotes)
    };

    useEffect(() => {
        loadFolders();
        loadNotes();
    }, []);

    useEffect(() => {
        const handleOpenEditor = async (noteId) => {
            const note = await window.smartStickies.notes.getById(noteId);

            if(note) {
                openEditModal(note);
            }
        };

        const cleanup = window.smartStickies.notes.onOpenEditor(handleOpenEditor);
        
        return cleanup;
    }, []);

    const openCreateModal = () => {
        setSelectedNote(null);
        setModalMode("create");
    };

    const openEditModal = (note) => {
        setSelectedNote(note);
        setModalMode("edit");
    };

    const closeModal = () => {
        setSelectedNote(null);
        setModalMode(null);
    };

    const createNote = async (title, content, color, folderId) => {
        const newNote = await window.smartStickies.notes.create(title, content, color);
        if (folderId !== null) {
            await window.smartStickies.notes.move(newNote.id, folderId);
        }
        await loadNotes();
        closeModal();
    };

    const saveNote = async (id, title, content, color, folderId) => {
        await window.smartStickies.notes.update(id, title, content, color);
        await window.smartStickies.notes.move(id, folderId);
        await loadNotes();
        closeModal();
    };

    const deleteNote = async (id) => {
        await window.smartStickies.notes.delete(id);
        await loadNotes();
        closeModal();
    };

    return (
        <main className="notes-page">
        <header className="page-header">
            <h1>Notes</h1>

            <button onClick={openCreateModal}>
                + New Note
            </button>
        </header>

        <section className="note-grid">
            {notes.map((note) => {
                const folder = folders.find(
                (folder) =>
                    folder.id === note.folder_id
                );

                return (
                <NoteCard
                    key={note.id}
                    note={note}
                    folder={folder}
                    onClick={openEditModal}
                />
                );
            })}
        </section>

        {modalMode && (
            <NoteModal
            mode={modalMode}
            note={selectedNote}
            folders={folders}
            onClose={closeModal}
            onCreate={createNote}
            onSave={saveNote}
            onDelete={deleteNote}
            />
        )}
        </main>
    );
}

export default NotesPage;