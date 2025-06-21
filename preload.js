const { contextBridge, ipcRenderer } = require('electron');

console.log('[preload] preload.js carregado ✅');

contextBridge.exposeInMainWorld('electronAPI', {
  setGitConfig: (config) => ipcRenderer.invoke('set-git-config', config),
});
