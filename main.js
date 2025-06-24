import { exec } from 'child_process';
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import fs from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const iconPath = join(__dirname, 'assets', 'github-logo.png');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    icon: iconPath,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // win.loadFile(join(__dirname, 'dist', 'git-switcher', 'browser', 'index.html'));
  win.loadURL('http://localhost:4200');
}

app.whenReady()
  .then(createWindow)
  .catch(err => console.error('Erro ao iniciar o app:', err));

ipcMain.handle('set-git-config', async (_, { userName, userEmail, scope, repoPath }) => {
  const flag = scope === 'global' ? '--global' : '';
  const repoOpt = scope === 'local' && repoPath ? `-C "${repoPath}"` : '';
  return new Promise((resolve, reject) => {
    exec(`git ${repoOpt} config ${flag} user.name "${userName}"`, (err) => {
      if (err) return reject(err.message);
      exec(`git ${repoOpt} config ${flag} user.email "${userEmail}"`, (err2) => {
        if (err2) return reject(err2.message);
        resolve('Git configurado com sucesso!');
      });
    });
  });
});

ipcMain.handle('select-repo', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  if (result.canceled) return null;
  return result.filePaths[0];
});

ipcMain.handle('get-git-config', async (event, scope) => {
  const flag = scope === 'global' ? '--global' : '';
  return new Promise((resolve, reject) => {
    exec(`git config ${flag} --list`, (err, stdout) => {
      if (err) return reject(err.message);
      resolve(stdout);
    });
  });
});

ipcMain.handle('reset-git-config', async (event, scope) => {
  const flag = scope === 'global' ? '--global' : '';
  return new Promise((resolve, reject) => {
    exec(`git config ${flag} --unset-all user.name && git config ${flag} --unset-all user.email`, (err) => {
      if (err) return reject(err.message);
      resolve(`Configurações ${scope} resetadas.`);
    });
  });
});

ipcMain.handle('export-accounts', async (event, accounts) => {
  const { filePath } = await dialog.showSaveDialog({
    title: 'Exportar contas',
    defaultPath: 'contas.json',
    filters: [{ name: 'JSON', extensions: ['json'] }],
  });
  if (filePath) {
    fs.writeFileSync(filePath, JSON.stringify(accounts, null, 2), 'utf-8');
    return 'Exportado com sucesso!';
  }
  throw new Error('Exportação cancelada');
});

ipcMain.handle('import-accounts', async () => {
  const { filePaths } = await dialog.showOpenDialog({
    title: 'Importar contas',
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile'],
  });
  if (filePaths && filePaths[0]) {
    const content = fs.readFileSync(filePaths[0], 'utf-8');
    return JSON.parse(content);
  }
  throw new Error('Importação cancelada');
});
