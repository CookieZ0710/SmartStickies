import { app, BrowserWindow, ipcMain, protocol } from "electron";
import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import { initializeDatabase } from "./db/database.js";
import { importImage, saveClipboardImage } from "./services/imageService.js";
import { createPinnedWindow, closePinnedWindow, refreshPinnedWindow } from "./services/pinnedWindowManager.js";
import { getAllNotes, createNote, updateNote, deleteNote, moveNote, getNotesById, pinNote, unpinNote, getPinnedNotes } from "./services/noteService.js";
import { getAllFolders, createFolder, updateFolder, deleteFolder } from "./services/folderService.js"

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
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


// IPC FOR PICS
ipcMain.handle("images:import", async () => {
    return await importImage();
});

ipcMain.handle("images:saveClipboard", async (event, buffer, extension) => {
    return saveClipboardImage(buffer, extension);
});


// IPC FOR NOTES
ipcMain.handle("notes:getAll", () => {
    return getAllNotes();
});

ipcMain.handle("notes:getById", (event, id) => {
    return getNotesById(id);
});

ipcMain.handle("notes:getPinned", () => {
    return getPinnedNotes();
});

ipcMain.handle("notes:create", (event, title, content, color) => {
    return createNote(title, content, color);
});

ipcMain.handle("notes:update", (event, id, title, content, color) => {
    const result = updateNote(id, title, content, color);
    refreshPinnedWindow(id);
    return result;
});

ipcMain.handle("notes:delete", (event, id) => {
    const result = deleteNote(id);
    closePinnedWindow(id);
    return result;
});

ipcMain.handle("notes:move", (event, noteId, folderId) => {
    return moveNote(noteId, folderId);
});

ipcMain.handle("notes:pin", (event, id) => {
    const changes = pinNote(id);

    if(changes > 0) {
        createPinnedWindow(id);

        BrowserWindow.getAllWindows().forEach((window) => {
            window.webContents.send("notes:pinStatusChanged", id);
        });
    }

    return changes;
});

ipcMain.handle("notes:unpin", (event, id) => {
    const changes = unpinNote(id);

    if(changes > 0) {
        closePinnedWindow(id);

        BrowserWindow.getAllWindows().forEach((window) => {
            window.webContents.send("notes:pinStatusChanged", id);
        });
    }

    return changes;
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

protocol.registerSchemesAsPrivileged([
    {
        scheme: "smartstickies",
        privileges: {
            standard: true,
            secure: true,
            supportFetchAPI: true,
            corsEnabled: true
        }
    }
]);

app.whenReady().then(() => {
    initializeDatabase();
    protocol.handle(
        "smartstickies",
        async (request) => {
            const url = new URL(request.url);

            if(url.hostname !== "images") {
                return new Response("Not Found", { status: 404 });
            }

            const fileName = decodeURIComponent(url.pathname.slice(1));
            const imagePath = path.join(app.getPath("userData"), "images", fileName);

            try {
                const file = await fs.promises.readFile(imagePath);
                return new Response(file);
            } catch {
                return new Response("Not Found", { status: 404 });
            }
        }
    );
    createWindow();

    const pinnedNotes = getPinnedNotes();

    for (const note of pinnedNotes) {
        createPinnedWindow(note.id);
    }
});