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
            <EditorContent editor={editor}/>
        </div>
    );
}

export default NoteEditor;