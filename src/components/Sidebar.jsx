function Sidebar({
    isOpen,
    currentPage,
    onNavigate,
    onClose,
}) {
    if (!isOpen) {
        return null;
    }

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>SmartStickies</h2>

                <button
                    className="sidebar-close-button"
                    onClick={onClose}
                >
                    X
                </button>
            </div>

            <nav className="sidebar-nav">
                <button
                    className={
                        currentPage === "notes"
                        ? "sidebar-link active"
                        : "sidebar-link"
                    }
                    onClick={() => onNavigate("notes")}
                >
                    Notes
                </button>

                <button
                    className={
                        currentPage === "folders"
                        ? "sidebar-link active"
                        : "sidebar-link"
                    }
                    onClick={() => onNavigate("folders")}
                >
                    Folders
                </button>

                <button
                    className={
                        currentPage === "pinned"
                        ? "sidebar-link active"
                        : "sidebar-link"
                    }
                    onClick={() => onNavigate("pinned")}
                >
                    Pinned
                </button>
            </nav>
        </aside>
    );
}

export default Sidebar;