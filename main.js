import { exec } from 'child_process';
import { app, BrowserWindow, ipcMain } from 'electron';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    }
  });

  // win.loadFile(join(__dirname, 'dist/git-switcher/browser/index.html'));
  win.loadURL('http://localhost:4200');
}

app.whenReady().then(createWindow);

ipcMain.handle('set-git-config', async (event, { userName, userEmail, scope }) => {
  const flag = scope === 'global' ? '--global' : '';
  return new Promise((resolve, reject) => {
    exec(`git config ${flag} user.name "${userName}"`, (err) => {
      if (err) return reject(err.message);
      exec(`git config ${flag} user.email "${userEmail}"`, (err2) => {
        if (err2) return reject(err2.message);
        resolve('Git configurado com sucesso!');
      });
    });
  });
});
