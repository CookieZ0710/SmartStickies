import { app, BrowserWindow } from "electron";

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
    });

    mainWindow.loadURL("http://localhost:5173");
}

app.whenReady().then(() => {
    createWindow();
});