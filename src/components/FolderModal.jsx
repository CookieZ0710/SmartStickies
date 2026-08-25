import { useState } from "react";

function FolderModal({
    mode,
    folder,
    onClose,
    onCreate,
    onSave,
}) {
    const [name, setName] = useState(
        mode === "edit"
        ? folder?.name ?? ""
        : ""
    );

    const handleSubmit = () => {
        if (!name.trim()) {
            return;
        }

        if(mode === "create") {
            onCreate(name);
        } else {
            onSave(folder.id, name);
        }
    };

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
        >
            <div
                className="folder-modal"
                onClick={(event) =>
                event.stopPropagation()
                }
            >
                <h2>
                    {mode === "create"
                        ? "New Folder"
                        : "Rename Folder"}
                </h2>

                <input
                    type="text"
                    value={name}
                    onChange={(event) =>
                        setName(event.target.value)
                    }
                    placeholder="Folder name"
                    autoFocus
                />

                <button onClick={handleSubmit}>
                {mode === "create"
                    ? "Create"
                    : "Save"}
                </button>
            </div>
        </div>
    );
}

export default FolderModal;