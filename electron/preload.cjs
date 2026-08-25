const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("smartStickies", {
    notes: {
        getAll: () => 
            ipcRenderer.invoke("notes:getAll"),

        create: (title, content) => 
            ipcRenderer.invoke("notes:create", title, content),

        update: (id, title, content) => 
            ipcRenderer.invoke("notes:update", id, title, content),

        delete: (id) => 
            ipcRenderer.invoke("notes:delete", id),

        move: (noteId, folderId) => 
            ipcRenderer.invoke("notes:move", noteId, folderId)
    },

    folders: {
        getAll: () => 
            ipcRenderer.invoke("folders:getAll"),

        create: (name) => 
            ipcRenderer.invoke("folders:create", name),

        update: (id, name) => 
            ipcRenderer.invoke("folders:update", id, name),

        delete: (id) => 
            ipcRenderer.invoke("folders:delete", id)
    }
});