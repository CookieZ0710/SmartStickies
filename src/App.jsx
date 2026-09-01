import { useEffect, useState } from 'react'

import Sidebar from "./components/Sidebar";
import NotesPage from './pages/NotesPage';
import FoldersPage from './pages/FoldersPage';
import PinnedPage from './pages/PinnedPage';
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

    const handleNavigate = (page) => {
        setCurrentPage(page);
        setSidebarOpen(false);
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
                <NotesPage />
            )}

            {currentPage === "folders" && (
                <FoldersPage />
            )}

            {currentPage === "pinned" && (
                <PinnedPage />
            )}
        </div>
    );
}

export default App
