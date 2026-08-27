import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import { parseNoteContent } from "../utils/noteContent";

function NotePreview({ content }) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TaskList,
            TaskItem.configure({nested: true,}),
        ],
        content: parseNoteContent(content),
        editable: false,
    });

    if (!editor) {
        return null;
    }

    return (
        <div className="note-preview">
            <EditorContent editor={editor}/>
        </div>
    );
}

export default NotePreview;