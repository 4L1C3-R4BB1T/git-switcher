const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setGitConfig: (config) => ipcRenderer.invoke('set-git-config', config),
  selectRepoDialog: () => ipcRenderer.invoke('select-repo'),
  getGitConfig: (scope) => ipcRenderer.invoke('get-git-config', scope),
  resetGitConfig: (scope) => ipcRenderer.invoke('reset-git-config', scope),
});
