import { useEffect, useState } from "react";

import NoteCard from "../components/NoteCard";
import NoteModal from "../components/NoteModal";

function NotesPage() {
    const [notes, setNotes] = useState([]);
    const [folders, setFolders] = useState([]);
    const [tags, setTags] = useState([]);

    const [modalMode, setModalMode] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);

    const loadFolders = async () => {
        const savedFolders = await window.smartStickies.folders.getAll();
        setFolders(savedFolders);
    };

    const loadNotes = async () => {
        const savedNotes = await window.smartStickies.notes.getAll();
        const notesWithTags = await Promise.all(
            savedNotes.map(async (note) => {
                const noteTags = await window.smartStickies.tags.getForNote(note.id);
                return{
                    ...note,
                    tags: noteTags
                };
            })
        );
        setNotes(notesWithTags)
    };

    const loadTags = async () => {
        const savedTags = await window.smartStickies.tags.getAll();
        setTags(savedTags);
    }

    useEffect(() => {
        loadFolders();
        loadNotes();
        loadTags();
    }, []);

    useEffect(() => {
    const cleanup =
        window.smartStickies.notes.onPinStatusChanged(
            async (id) => {
                await loadNotes();

                if (selectedNote?.id === id) {
                    const updatedNote =
                        await window.smartStickies.notes.getById(id);

                    setSelectedNote(updatedNote);
                }
            }
        );
        
        return cleanup;
    }, []);

    const openCreateModal = () => {
        setSelectedNote(null);
        setModalMode("create");
    };

    const openEditModal = async (note) => {
        const noteTags = await window.smartStickies.tags.getForNote(note.id);
        setSelectedNote({
            ...note,
            tags: noteTags
        });
        setModalMode("edit");
    };

    const closeModal = () => {
        setSelectedNote(null);
        setModalMode(null);
    };

    const createNote = async (title, content, color, folderId, selectedTags) => {
        const newNote = await window.smartStickies.notes.create(title, content, color);
        if (folderId !== null) {
            await window.smartStickies.notes.move(newNote.id, folderId);
        }
        for(const tagId of selectedTags) {
            await window.smartStickies.tags.addToNote(newNote.id, tagId);
        }
        await loadNotes();
        closeModal();
    };

    const saveNote = async (id, title, content, color, folderId, selectedTags) => {
        await window.smartStickies.notes.update(id, title, content, color);
        await window.smartStickies.notes.move(id, folderId);

        const existingTags = await window.smartStickies.tags.getForNote(id);
        const existingTagIds = existingTags.map((tag) => tag.id);
        const tagsToAdd = selectedTags.filter((id) => !existingTagIds.includes(id));
        const tagsToRemove = existingTagIds.filter((id) => !selectedTags.includes(id));

        for(const tagId of tagsToAdd) {
            await window.smartStickies.tags.addToNote(id,tagId);
        }
        for(const tagId of tagsToRemove) {
            await window.smartStickies.tags.removeFromNote(id,tagId);
        }

        await loadNotes();
        closeModal();
    };

    const deleteNote = async (id) => {
        await window.smartStickies.notes.delete(id);
        await loadNotes();
        closeModal();
    };

    const togglePin = async (note) => {
        if(note.is_pinned) {
            await window.smartStickies.notes.unpin(note.id);
        }else {
            await window.smartStickies.notes.pin(note.id);
        }

        const updatedNote = await window.smartStickies.notes.getById(note.id);
        setSelectedNote(updatedNote);

        await loadNotes();
    }

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
            tags={tags}
            onClose={closeModal}
            onCreate={createNote}
            onSave={saveNote}
            onDelete={deleteNote}
            onTogglePin={togglePin}
            />
        )}
        </main>
    );
}

export default NotesPage;