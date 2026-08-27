import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

function NoteEditor({
    initialContent,
    onChange
}) {
    const editor = useEditor({
        extensions: [StarterKit.configure({
                trailingNode: false,
            }),
        ],
        content: initialContent,
        enableContentCheck: true,
        onUpdate: ({ editor}) => {onChange(editor.getJSON());},
        onContentError: ({error}) => {
            console.error("Invalid TipTap content:", error);
        },
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