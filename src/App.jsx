import { useEffect, useState } from 'react'
import NoteCard from "./components/NoteCard";
import NoteModal from "./components/NoteModal";
import './App.css'

function App() {
    const [notes, setNotes] = useState([]);

    const [modalMode, setModalMode] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);

    const loadNotes = async () => {
        const savedNotes = await window.smartStickies.notes.getAll();
        setNotes(savedNotes)
    };

    useEffect(() => {
        loadNotes();
    }, []);

    const openCreateModal = () => {
        setSelectedNote(null);
        setModalMode("create");
    };

    const openEditModal = () => {
        setSelectedNote(null);
        setModalMode("edit");
    };

    const closeModal = () => {
        setSelectedNote(null);
        setModalMode(null);
    };

    const createNote = async (note) => {
        await window.smartStickies.notes.create(note);
        await loadNotes();
        closeModal();
    };

    const saveNote = async (note) => {
        await window.smartStickies.notes.update(note);
        await loadNotes();
        closeModal();
    };

    const deleteNote = async (id) => {
        await window.smartStickies.notes.delete(id);
        await loadNotes();
        closeModal();
    };

    return (
        <main className="app">
        <header className="header">
            <h1>SmartStickies</h1>

            <button onClick={openCreateModal}>
            + New Note
            </button>
        </header>

        <section className="note-grid">
            {notes.map((note) => (
            <NoteCard
                key={note.id}
                note={note}
                onClick={openEditModal}
            />
            ))}
        </section>

        {modalMode && (
            <NoteModal
            mode={modalMode}
            note={selectedNote}
            onClose={closeModal}
            onCreate={createNote}
            onSave={saveNote}
            onDelete={deleteNote}
            />
        )}
        </main>
    );
}

export default App
