import NoteCard from "./NoteCard";

function FolderSection({
    folder,
    notes,
    onEditFolder,
    onDeleteFolder,
    onNoteClick,
}) {
    return (
        <section className="folder-section">
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