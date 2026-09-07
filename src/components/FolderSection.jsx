import NoteCard from "./NoteCard";
import { useState } from "react";

function FolderSection({
    folder,
    notes,
    onEditFolder,
    onDeleteFolder,
    onNoteClick,
    onMoveNote,
}) {
    const [isDropTarget, setIsDropTarget] = useState(false);

    const handleDragStart = (event, note) => {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("application/x-smartstickies-note-id", String(note.id));
        event.dataTransfer.setData("text/plain", String(note.id));
    };

    const handleDragOver = (event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        setIsDropTarget(true);
    };

    const handleDragLeave = (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            setIsDropTarget(false);
        }
    };

    const handleDrop = async (event) => {
        event.preventDefault();
        setIsDropTarget(false);

        const noteId = Number(
            event.dataTransfer.getData("application/x-smartstickies-note-id")
        );

        if (Number.isInteger(noteId)) {
            await onMoveNote(noteId, folder.id);
        }
    };

    return (
        <section
            className={
                isDropTarget
                    ? "folder-section drop-target"
                    : "folder-section"
            }
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="folder-section-header">
                <h2>{folder.name}</h2>

                {folder.id !== null && (
                    <div className="folder-actions">
                        <button onClick={() => onEditFolder(folder)}>
                            Edit
                        </button>

                        <button onClick={() => onDeleteFolder(folder.id)}>
                            Delete
                        </button>
                    </div>
                )}
            </div>

            <div className="folder-note-grid">
                {notes.length > 0 ? (
                    notes.map((note) => (
                        <NoteCard
                            key={note.id}
                            note={note}
                            onClick={onNoteClick}
                            onDragStart={handleDragStart}
                            onDragEnd={() => setIsDropTarget(false)}
                        />
                    ))
                ) : (
                    <p className="empty-folder">
                        No notes in this folder.
                    </p>
                )}
            </div>
        </section>
    );
}

export default FolderSection;
