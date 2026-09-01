import { useState } from "react";
import NoteEditor from "./NoteEditor";
import { parseNoteContent } from "../utils/noteContent";

function NoteModal({
    mode,
    note,
    folders = [],
    onClose,
    onCreate,
    onSave,
    onDelete,
    onTogglePin,
}) {
    const [title, setTitle] = useState(
        mode === "edit" ? note?.title ?? "" : ""
    );

    const [content, setContent] = useState(
        mode === "edit" 
        ? parseNoteContent(note?.content) 
        : parseNoteContent("")
    );

    const [color, setColor] = useState(
        mode ==="edit" ? note?.color ?? "#FFE45C" : "#FFE45C"
    );

    const [folderId, setFolderId] = useState(
        mode === "edit" ? note?.folder_id ?? null : null
    );

    const handleSubmit = () => {
        const serializedContent = JSON.stringify(content);

        if(mode === "create") {
            onCreate(title, serializedContent, color, folderId);
        } else {
            onSave(note.id, title, serializedContent, color, folderId);
        }
    };


    return (
        <div
            className="modal-overlay"
            onClick={onClose}
        >
            <div
                className="note-modal"
                style={{ backgroundColor: color }}
                onClick={(event) => event.stopPropagation()}
            >
                <input
                    className="note-title-input"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="Title"
                />

                <NoteEditor
                    initialContent={content}
                    onChange={setContent}
                />

                <div className="modal-actions">
                    <select
                        value={folderId ?? ""}
                        onChange={(event) =>
                            setFolderId(
                            event.target.value === ""
                                ? null
                                : Number(event.target.value)
                            )
                        }
                        >
                        <option value="">
                            Uncategorized
                        </option>

                        {folders.map((folder) => (
                            <option
                            key={folder.id}
                            value={folder.id}
                            >
                            {folder.name}
                            </option>
                        ))}
                    </select>

                    <div className="color-picker">
                        {[
                            "#FFE45C",
                            "#FF5A5A",
                            "#4DA3FF",
                            "#66D17A",
                            "#B388FF",
                            "#FF9F43"
                        ].map((option) => (
                            <button
                            key={option}
                            className="color-option"
                            style={{ backgroundColor: option }}
                            onClick={() => setColor(option)}
                            />
                        ))}
                    </div>

                    {mode === "edit" && (
                        <button
                            className="pin-button"
                            onClick={() => onTogglePin(note)}
                            title={note?.isPinned ? "Unpin note" : "Pin note"}
                        >
                            📌
                        </button>
                    )}

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