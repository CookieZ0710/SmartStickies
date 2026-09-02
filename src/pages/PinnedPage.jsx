import { useEffect, useState } from "react";

import NoteCard from "../components/NoteCard";
import NoteModal from "../components/NoteModal";

function PinnedPage() {
    const [notes, setNotes] = useState([]);
    const [folders, setFolders] = useState([]);

    const [selectedNote, setSelectedNote] = useState(null);

    const loadPinnedNotes = async () => {
        const pinnedNotes = await window.smartStickies.notes.getPinned();
        setNotes(pinnedNotes);
    };

    const loadFolders = async () => {
        const savedFolders = await window.smartStickies.folders.getAll();
        setFolders(savedFolders);
    };

    useEffect(() => {
        loadPinnedNotes();
        loadFolders();
    }, []);

    useEffect(() => {
        const cleanup =
            window.smartStickies.notes.onPinStatusChanged(
                async () => {
                    await loadPinnedNotes();
                }
            );

        return cleanup;
    }, []);

    const openEditModal = (note) => {
        setSelectedNote(note);
    }

    const saveNote = async (
        id,
        title,
        content,
        color,
        folderId
    ) => {
        await window.smartStickies.notes.update(id, title, content, color);
        await window.smartStickies.notes.move(id, folderId);
        await loadPinnedNotes();

        closeModal();
    };

    const deleteNote = async (id) => {
        await window.smartStickies.notes.delete(id);
        await loadPinnedNotes();
        closeModal();
    };

    const togglePin = async (note) => {
        if (note.is_pinned) {
            await window.smartStickies.notes.unpin(note.id);
        } else {
            await window.smartStickies.notes.pin(note.id);
        }

        await loadPinnedNotes();

        closeModal();
    };

    return (
        <main className="notes-page">
            <header className="page-header">
                <h1>Pinned</h1>
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

            {selectedNote && (
                <NoteModal
                    mode="edit"
                    note={selectedNote}
                    folders={folders}
                    onClose={closeModal}
                    onSave={saveNote}
                    onDelete={deleteNote}
                    onTogglePin={togglePin}
                />
            )}
        </main>
    );
}

export default PinnedPage;