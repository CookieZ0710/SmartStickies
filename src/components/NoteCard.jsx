import NotePreview from "./NotePreview";

function NoteCard({note, folder, onClick}) {
    return (
        <div 
            className="note-card" 
            style={{backgroundColor: note.color ?? "#FFE45C"}}
            onClick={() => onClick(note)}
        >
            <div className="note-card-content">
                <h2>{note.title || "Untitled"}</h2>
                <NotePreview content={note.content}/>
            </div>

            <div className="note-folder-footer">
                {folder?.name ?? ""}
            </div>
        </div>
    );
}

export default NoteCard;