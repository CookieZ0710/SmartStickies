const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("smartStickies", {
    notes: {
        create: (title, content) => 
            ipcRenderer.invoke("notes:create", title, content),

        getAll: () => 
            ipcRenderer.invoke("notes:getAll")
    }
});