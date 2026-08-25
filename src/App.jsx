import { useEffect, useState } from 'react'

import Sidebar from "./components/Sidebar";
import NotesPage from './pages/NotesPage';
import FoldersPage from './pages/FoldersPage';

import './App.css'

function App() {
    const [currentPage, setCurrentPage] = useState("notes");
    const [sidebarOpen, setSidebarOpen] = useState("false");

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
        </div>
    );
}

export default App
