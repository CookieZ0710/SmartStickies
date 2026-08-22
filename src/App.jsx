import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'

function App() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [notes, setNotes] = useState([]);

  async function loadNotes() {
    const savedNotes = await window.smartStickies.notes.getAll();
    setNotes(savedNotes)
  }

  async function handleCreateNote(event) {
    event.preventDefault();

    if(!title.trim()){
      return;
    }

    await window.smartStickies.notes.create(title, content);

    setTitle();
    setContent();

    await loadNotes();
  }

  useEffect(() => {
    loadNotes();
  }, []);

return (
        <div>
            <h1>SmartStickies</h1>

            <form onSubmit={handleCreateNote}>
                <div>
                    <label>Title</label>
                    <br />

                    <input
                        type="text"
                        value={title}
                        onChange={(event) => setTitle(event.target.value)}
                    />
                </div>

                <br />

                <div>
                    <label>Content</label>
                    <br />

                    <textarea
                        value={content}
                        onChange={(event) => setContent(event.target.value)}
                    />
                </div>

                <br />

                <button type="submit">
                    Create Note
                </button>
            </form>

            <hr />

            <h2>Saved Notes</h2>

            {notes.length === 0 ? (
                <p>No notes yet.</p>
            ) : (
                notes.map((note) => (
                    <div key={note.id}>
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>

                        <small>
                            ID: {note.id}
                        </small>

                        <hr />
                    </div>
                ))
            )}
        </div>
    );
}

export default App
