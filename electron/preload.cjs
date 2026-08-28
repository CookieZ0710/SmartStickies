const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("smartStickies", {
    images: {
        import: () => 
            ipcRenderer.invoke("images:import"),

        saveClipboard: (buffer, extension) =>
            ipcRenderer.invoke("images:saveClipboard",buffer, extension)
    },

    notes: {
        getAll: () => 
            ipcRenderer.invoke("notes:getAll"),

        create: (title, content, color) => 
            ipcRenderer.invoke("notes:create", title, content, color),

        update: (id, title, content, color) => 
            ipcRenderer.invoke("notes:update", id, title, content, color),

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