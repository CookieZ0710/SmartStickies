import { useEffect, useState } from "react";

function TagsPage() {
    const [tags, setTags] = useState([]);
    const [newTagName, setNewTagName] = useState("");
    const [editingTagId, setEditingTagId] = useState(null);
    const [editingName, setEditingName] = useState("");

    const loadTags = async () => {
        const savedTags = await window.smartStickies.tags.getAll();
        setTags(savedTags);
    };

    useEffect(() => {
        loadTags();
    }, []);

    const handleCreateTag = async () => {
        const trimmedName = newTagName.trim();

        if (!trimmedName) {
            return;
        }

        try {
            await window.smartStickies.tags.create(trimmedName);

            setNewTagName("");
            await loadTags();
        } catch (error) {
            console.error("Failed to create tag:", error);
        }
    };

    const startEditing = (tag) => {
        setEditingTagId(tag.id);
        setEditingName(tag.name);
    };

    const cancelEditing = () => {
        setEditingTagId(null);
        setEditingName("");
    };

    const handleUpdateTag = async (id) => {
        const trimmedName = editingName.trim();

        if (!trimmedName) {
            return;
        }

        try {
            await window.smartStickies.tags.update(
                id,
                trimmedName
            );

            cancelEditing();
            await loadTags();
        } catch (error) {
            console.error("Failed to update tag:", error);
        }
    };

    const handleDeleteTag = async (id) => {
        try {
            await window.smartStickies.tags.delete(id);
            await loadTags();
        } catch (error) {
            console.error("Failed to delete tag:", error);
        }
    };

    return (
        <div className="tags-page">
            <div className="tags-header">
                <h1>Tags</h1>
            </div>

            <div className="tag-create-section">
                <input
                    type="text"
                    value={newTagName}
                    onChange={(e) =>
                        setNewTagName(e.target.value)
                    }
                    placeholder="New tag..."
                />

                <button
                    type="button"
                    onClick={handleCreateTag}
                >
                    + Add Tag
                </button>
            </div>

            <div className="tags-list">
                {tags.map((tag) => (
                    <div
                        key={tag.id}
                        className="tag-item"
                    >
                        {editingTagId === tag.id ? (
                            <>
                                <input
                                    type="text"
                                    value={editingName}
                                    onChange={(e) =>
                                        setEditingName(
                                            e.target.value
                                        )
                                    }
                                />

                                <div className="tag-actions">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleUpdateTag(
                                                tag.id
                                            )
                                        }
                                    >
                                        Save
                                    </button>

                                    <button
                                        type="button"
                                        onClick={
                                            cancelEditing
                                        }
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="tag-name">
                                    {tag.name}
                                </span>

                                <div className="tag-actions">
                                    <button
                                        type="button"
                                        onClick={() =>
                                            startEditing(tag)
                                        }
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            handleDeleteTag(
                                                tag.id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default TagsPage;