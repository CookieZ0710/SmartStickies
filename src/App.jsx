import { useEffect, useState } from 'react'

import Sidebar from "./components/Sidebar";
import NotesPage from './pages/NotesPage';
import FoldersPage from './pages/FoldersPage';
import PinnedPage from './pages/PinnedPage';
import TagsPage from './pages/TagsPage';
import PinnedNotePage from './pages/PinnedNotePage';

import './App.css'

function App() {
    const params =
        new URLSearchParams(window.location.search);

    const pinnedNoteId =
        params.get("pinnedNote");

    if (pinnedNoteId) {
        return (
            <PinnedNotePage
                noteId={Number(pinnedNoteId)}
            />
        );
    }

    
    const [currentPage, setCurrentPage] = useState("notes");
    const [sidebarOpen, setSidebarOpen] = useState(false);
    // kinda weird to put this here for now
    const [selectedTagId, setSelectedTagId] = useState("");

    const handleNavigate = (page) => {
        setCurrentPage(page);
        setSidebarOpen(false);
    };

    const handleTagLink = (tagId) => {
        setSelectedTagId(String(tagId));
        setCurrentPage("notes");
    };

    

    return(
        <div className="app">
            <button
                className="menu-button"
                onClick={() => setSidebarOpen(true)}
            >
                ☰
            </button>

            <Sidebar
                isOpen={sidebarOpen}
                currentPage={currentPage}
                onNavigate={handleNavigate}
                onClose={() => setSidebarOpen(false)}
            />

            {currentPage === "notes" && (
                <NotesPage initialTagFilter={selectedTagId}/>
            )}

            {currentPage === "folders" && (
                <FoldersPage />
            )}

            {currentPage === "pinned" && (
                <PinnedPage />
            )}

            {currentPage === "tags" && (
                <TagsPage onTagClick={handleTagLink}/>
            )}
        </div>
    );
}

export default App
