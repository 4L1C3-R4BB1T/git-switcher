const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  setGitConfig: (config) => ipcRenderer.invoke('set-git-config', config),
  selectRepoDialog: () => ipcRenderer.invoke('select-repo'),
  getGitConfig: (config) => ipcRenderer.invoke('get-git-config', config),
  resetGitConfig: (scope) => ipcRenderer.invoke('reset-git-config', scope),
  exportAccounts: (data) => ipcRenderer.invoke('export-accounts', data),
  importAccounts: () => ipcRenderer.invoke('import-accounts')
});
