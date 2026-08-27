import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";


function NoteEditor({
    initialContent,
    onChange
}) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TaskList,
            TaskItem.configure({nested: true,}),
        ],
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

                <button
                    type="button"
                    className={
                        editor.isActive("taskList")
                            ? "editor-button active"
                            : "editor-button"
                    }
                    onClick={() =>
                        editor.chain().focus().toggleTaskList().run()
                    }
                >
                    ☑
                </button>
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}

export default NoteEditor;