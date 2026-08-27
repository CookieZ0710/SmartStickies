import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function NoteEditor({
    initialContent,
    onChange
}) {
    const editor = useEditor({
        extensions: [StarterKit],
        content: initialContent,
        onUpdate: ({ editor }) => {onChange(editor.getJSON());},
    });

    if (!editor){
        return null;
    }

    return (
        <div className="note-editor">
            <div className="editor-toolbar">
                <button
                    type="button"
                    className={
                        editor.isActive("bold")
                            ? "editor-button active"
                            : "editor-button"
                    }
                    onClick={() =>
                        editor.chain().focus().toggleBold().run()
                    }
                >
                    B
                </button>

                <button
                    type="button"
                    className={
                        editor.isActive("italic")
                            ? "editor-button active"
                            : "editor-button"
                    }
                    onClick={() =>
                        editor.chain().focus().toggleItalic().run()
                    }
                >
                    I
                </button>

                <button
                    type="button"
                    className={
                        editor.isActive("strike")
                            ? "editor-button active"
                            : "editor-button"
                    }
                    onClick={() =>
                        editor.chain().focus().toggleStrike().run()
                    }
                >
                    S
                </button>
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}

export default NoteEditor;