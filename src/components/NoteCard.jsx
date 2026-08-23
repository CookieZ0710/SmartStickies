function NoteCard({note, onClick}) {
    return (
        <div
            className="note-card"
            onClick={() => onClick(note)}
        >
            <h2>{note.title || "Untitled"}</h2>
            <p>
                {note.content || "Empty Note"}
            </p>
        </div>
    );
}

export default NoteCard;