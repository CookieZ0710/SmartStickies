import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
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
            TaskItem.configure({nested: true}),
            Image
        ],
        content: initialContent,
        onUpdate: ({ editor }) => {onChange(editor.getJSON());},

        editorProps: {
            handlePaste: (view, event) => {
                const items = event.clipboardData?.items;

                if (!items) {
                    return false;
                }

                const imageItem = 
                    Array.from(items).find(
                        (item) => 
                            item.type.startsWith("image/")
                    );

                if (!imageItem){
                    return false;
                }

                event.preventDefault();

                const file = imageItem.getAsFile();

                if(!file) {
                    return true;
                }

                file.arrayBuffer().then(
                    async (arrayBuffer) => {
                        const extension = 
                        file.type === "image/jpeg"
                            ? ".jpg"
                            : file.type === "image/webp"
                                ? ".webp"
                                : ".png";

                        const savedImage = await window.smartStickies.images.saveClipboard(arrayBuffer, extension);
                        editor.chain().focus().setImage({src: savedImage.url}).run();
                    }
                );

                return true;
            },
        },
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

                <button
                    type="button"
                    className="editor-button"
                    onClick={async () => {
                        const image =
                        await window.smartStickies.images.import();

                        if (!image) {
                        return;
                        }

                        editor
                        .chain()
                        .focus()
                        .setImage({
                            src: image.url
                        })
                        .run();
                    }}
                >
                    🖼
                </button>
            </div>

            <EditorContent editor={editor} />
        </div>
    );
}

export default NoteEditor;