import path from "path";
import { BrowserWindow } from "electron";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pinnedWindows = new Map();

export function createPinnedWindow(noteId) {
    if(pinnedWindows.has(noteId)) {
        const existingWindow = pinnedWindows.get(noteId);

        if(!existingWindow.isDestroyed()) {
            existingWindow.show();
            existingWindow.focus();
            return existingWindow;
        }

        pinnedWindows.delete(noteId);
    }

    const pinnedWindow = new BrowserWindow({
        width: 350,
        height: 350,
        minWidth: 220,
        minHeight: 220,
        alwaysOnTop: true,

        frame: false,
        resizable: true,
        webPreferences: {
            preload: path.join(__dirname, "../preload.cjs"),
            contextIsolation: true,
            nodeIntegration: false,
        },

    });

    pinnedWindows.set(noteId, pinnedWindow);
    const devUrl = `http://localhost:5173/?pinnedNote=${noteId}`;

    pinnedWindow.loadURL(devUrl);
    pinnedWindow.on("closed", () => {
        pinnedWindows.delete(noteId);
    });

    return pinnedWindow;
}

export function closePinnedWindow(noteId) {
    const pinnedWindow = pinnedWindows.get(noteId);

    if(!pinnedWindow) {
        return;
    }

    if(!pinnedWindow.isDestroyed()) {
        pinnedWindow.close();
    }

    pinnedWindows.delete(noteId);
}

export function hasPinnedWindow(noteId) {
    const pinnedWindow = pinnedWindows.get(noteId);

    return Boolean(pinnedWindow && !pinnedWindow.isDestroyed());
}

export function refreshPinnedWindow(noteId) {
    const pinnedWindow = pinnedWindows.get(noteId);

    if(!pinnedWindow || pinnedWindow.isDestroyed()) {
        return;
    }

    pinnedWindow.webContents.send("notes:refreshPinned");
}