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
    },
});