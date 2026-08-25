import { useEffect, useState } from "react";

import FolderSection from "../components/FolderSection";
import FolderModal from "../components/FolderModal";
import NoteModal from "../components/NoteModal";

function FoldersPage(){
    const [folders, setFolders] = useState([]);
    const [notes, setNotes] = useState([]);

    const [folderModalMode, setFolderModalMode] = useState(null);

    const [selectedFolder, setSelectedFolder] = useState(null);
    const [selectedNote, setSelectedNote] = useState(null);

    const loadFolders = async () => {
        const savedFolders = await window.smartStickies.folders.getAll();
        setFolders(savedFolders);
    };

    const loadNotes = async () => {
        const savedNotes = await window.smartStickies.notes.getAll();
        setNotes(savedNotes);
    }

    const loadData = async () => {
        await Promise.all([
            loadFolders(),
            loadNotes()
        ]);
    };

    useEffect(() => {
        loadData();
    }, []);

    const openCreateFolderModal = () => {
        setSelectedFolder(null);
        setFolderModalMode("create");
    };

    const openEditFolderModal = () => {
        setSelectedFolder(null);
        setFolderModalMode("edit");
    };

    const closeFolderModal = () => {
        setSelectedFolder(null);
        setFolderModalMode(null);
    };

    const createFolder = async (name) => {
        await window.smartStickies.folders.create(name);
        await loadFolders();
        closeFolderModal();
    };

    const updateFolder = async (id, name) => {
        await window.smartStickies.folders.update(id, name);
        await loadFolders();
        closeFolderModal();
    };

    const deleteFolder = async (id) => {
        await window.smartStickies.folders.delete(id);
        await loadData();
    };

    const openNoteModal = (note) => {
        setSelectedNote(note);
    };

    const closeNoteModal = () => {
        setSelectedNote(null);
    };

    const saveNote = async (id, title, content) => {
        await window.smartStickies.notes.update(id, title, content);
        await loadNotes();
        closeNoteModal();
    };

    const deleteNote = async (id) => {
        await window.smartStickies.notes.delete(id);
        await loadNotes();
        closeNoteModal();
    };

    const uncategorizedNotes = notes.filter(
        (note) => note.folder_id === null
    );

    return (
        <main className="folders-page">
            <header className="page-header">
                <h1>Folders</h1>

                <button onClick={openCreateFolderModal}>
                    + New Folder
                </button>
            </header>

            {folders.map((folder) => {
                const folderNotes = notes.filter(
                    (note) => note.folder_id === folder.id
                );

                return (
                    <FolderSection
                        key={folder.id}
                        folder={folder}
                        notes={folderNotes}
                        onEditFolder={openEditFolderModal}
                        onDeleteFolder={deleteFolder}
                        onNoteClick={openNoteModal}
                    />
                );
            })}

            <FolderSection
                folder={{
                id: null,
                name: "Uncategorized"
                }}
                notes={uncategorizedNotes}
                onEditFolder={() => {}}
                onDeleteFolder={() => {}}
                onNoteClick={openNoteModal}
            />

            {folderModalMode && (
                <FolderModal
                mode={folderModalMode}
                folder={selectedFolder}
                onClose={closeFolderModal}
                onCreate={createFolder}
                onSave={updateFolder}
                />
            )}

            {selectedNote && (
                <NoteModal
                mode="edit"
                note={selectedNote}
                onClose={closeNoteModal}
                onSave={saveNote}
                onDelete={deleteNote}
                />
            )}
        </main>
    );
}

export default FoldersPage;