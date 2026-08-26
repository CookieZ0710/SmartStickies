import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "url";
import path from "path";
import { initializeDatabase } from "./db/database.js";
import { getAllNotes, createNote, updateNote, deleteNote, moveNote } from "./services/noteService.js";
import { getAllFolders, createFolder, updateFolder, deleteFolder } from "./services/folderService.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,

        webPreferences: {
            preload: path.join(__dirname, "preload.cjs"),
            contextIsolation: true,
            nodeIntegration: false,
        }
    });

    mainWindow.loadURL("http://localhost:5173");
}

// IPC FOR NOTES
ipcMain.handle("notes:getAll", () => {
    return getAllNotes();
});

ipcMain.handle("notes:create", (event, title, content, color) => {
    return createNote(title, content, color);
});

ipcMain.handle("notes:update", (event, id, title, content, color) => {
    return updateNote(id, title, content, color);
});

ipcMain.handle("notes:delete", (event, id) => {
    return deleteNote(id);
});

ipcMain.handle("notes:move", (event, noteId, folderId) => {
    return moveNote(noteId, folderId);
});


// IPC FOR FOLDERS
ipcMain.handle("folders:getAll", () => {
    return getAllFolders();
});

ipcMain.handle("folders:create", (event, name) => {
    return createFolder(name);
});

ipcMain.handle("folders:update", (event, id, name) => {
    return updateFolder(id, name);
});

ipcMain.handle("folders:delete", (event, id) => {
    return deleteFolder(id);
});

app.whenReady().then(() => {
    initializeDatabase();
    createWindow();
});