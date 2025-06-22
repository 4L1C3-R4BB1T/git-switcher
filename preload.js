const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setGitConfig: (config) => ipcRenderer.invoke('set-git-config', config),
});
