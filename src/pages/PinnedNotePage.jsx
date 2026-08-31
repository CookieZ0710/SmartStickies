import { useEffect, useState } from "react";

function PinnedNotePage({ noteId}) {
    const [note, setNote] = useState(null);

    useEffect(() => {
        async function loadNote() {
            const loadedNote = await window.smartStickies.note.getById(noteId);
            setNote(loadedNote);
        }

        loadNote();
    }, [noteId]);

    if (!note) {
        return <div>Loading...</div>
    }

    return (
        <div
            className="pinned-note"
            style={{backgroundColor: note.color}}
        >
            <h2>{note.title || "Untitled"}</h2>

            <pre>
                {JSON.stringify(note.content, null, 2)}
            </pre>
        </div>
    )
}

export default PinnedNotePage;