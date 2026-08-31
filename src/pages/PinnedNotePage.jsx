import { useEffect, useState } from "react";
import NotePreview from "../components/NotePreview";

function PinnedNotePage() {
    const [note, setNote] = useState(null);

    useEffect(() => {
        const loadNote = async () => {
            const noteId = new URLSearchParams(window.location.search).get("pinnedNote");
            const loadedNote = await window.smartStickies.notes.getById(Number(noteId));
            setNote(loadedNote);
        };

        loadNote();
    }, []);

    if (!note) {
        return <div>Loading...</div>
    }

    return (
        <div
            className="pinned-note"
            style={{ backgroundColor: note.color }}
        >
            <div className="pinned-note-drag-region" />
            
            <div className="pinned-note-controls">
                <button
                    type="button"
                    className="pinned-control-button"
                    title="Edit note"
                >
                    ✎
                </button>

                <button
                    type="button"
                    className="pinned-control-button"
                    title="Unpin note"
                    onClick={async () => {
                        await window.smartStickies.notes.unpin(note.id);
                    }}
                >
                    📌
                </button>
            </div>

            <h2>{note.title || "Untitled"}</h2>

            <div className="pinned-note-content">
                <NotePreview content={note.content} />
            </div>
        </div>
    );
}

export default PinnedNotePage;