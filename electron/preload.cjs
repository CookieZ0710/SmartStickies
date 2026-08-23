const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("smartStickies", {
    notes: {
        getAll: () => 
            ipcRenderer.invoke("notes:getAll"),

        create: (note) => 
            ipcRenderer.invoke("notes:create", note),

        update: (note) => 
            ipcRenderer.invoke("notes:update", note),

        delete: (id) => 
            ipcRenderer.invoke("notes:delete", id),
    },
});