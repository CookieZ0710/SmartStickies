import { useState } from "react";

function NoteModal({
    mode,
    note,
    onClose,
    onCreate,
    onSave,
    onDelete,
}) {
    const [title, setTitle] = useState(
        mode === "edit" ? note?.title ?? "" : ""
    );

    const [content, setContent] = useState(
        mode === "edit" ? note?.content ?? "" : ""
    );

    const handleSubmit = () => {
        if(mode === "create") {
            onCreate({title, content});
        } else {
            onSave({...note, title, content,});
        }
    };

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
        >
            <div
                className="note-modal"
                onClick={(event) => event.stopPropagation()}
            >
                <input
                    className="note-title-input"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Title"
                />

                <textarea
                    className="note-content-input"
                    value={content}
                    onChange={(event) => setContent(EventTarget.target.value)}
                    placeholder="Write something here..."
                />

                <div className="modal-actions">
                    {mode === "edit" && (
                        <button
                            className="delete-button"
                            onClick={() => onDelete(note.id)}
                        >
                            🗑
                        </button>
                    )}

                    <button onClick={handleSubmit}>
                        {mode === "create" ? "Create" : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default NoteModal;