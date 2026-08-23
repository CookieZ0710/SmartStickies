import { app, BrowserWindow, ipcMain } from "electron";
import { fileURLToPath } from "url";
import path from "path";
import { initializeDatabase } from "./db/database.js";
import { getAllNotes, createNote, updateNote, deleteNote } from "./services/noteService.js";

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

ipcMain.handle("notes:getAll", () => {
    return getAllNotes();
});

ipcMain.handle("notes:create", (event, title, content) => {
    return createNote(title, content);
});

ipcMain.handle("notes:update", (event, id, title, content) => {
    return updateNote(id, title, content);
});

ipcMain.handle("notes:delete", (event, id) => {
    return deleteNote(id);
});

app.whenReady().then(() => {
    initializeDatabase();
    createWindow();
});