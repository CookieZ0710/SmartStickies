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

        getById: (id) =>
            ipcRenderer.invoke("notes:getById", id),

        create: (title, content, color) => 
            ipcRenderer.invoke("notes:create", title, content, color),

        update: (id, title, content, color) => 
            ipcRenderer.invoke("notes:update", id, title, content, color),

        delete: (id) => 
            ipcRenderer.invoke("notes:delete", id),

        move: (noteId, folderId) => 
            ipcRenderer.invoke("notes:move", noteId, folderId),

        pin: (id) =>
            ipcRenderer.invoke("notes:pin", id),

        unpin: (id) =>
            ipcRenderer.invoke("notes:unpin", id),

        getPinned: () =>
            ipcRenderer.invoke("notes:getPinned"),

        openEditor: (id) =>
            ipcRenderer.invoke("notes:openEditor", id),

        onRefreshPinned: (callback) => {
            const handler = () => callback();

            ipcRenderer.on("notes:refreshPinned", handler);

            return () => {
                ipcRenderer.removeListener("notes:refreshPinned", handler);
            }
        },

        onOpenEditor: (callback) => {
            const handler = (event, noteId) => {
                callback(noteId);
            }

            ipcRenderer.on("notes:openEditor", handler);

            return () => {
                ipcRenderer.removeListener("notes:openEditor", handler);
            };
        }
        
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