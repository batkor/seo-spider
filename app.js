const { app, BrowserWindow } = require('electron');
const path = require('node:path');

if (process.env.NODE_ENV === 'development') {
  process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true';
  require('electron-reload')(path.join(__dirname, './public'), {
    electron: path.join(__dirname, 'node_modules', '.bin', 'electron'),
    hardResetMethod: 'exit'
  });
}

const createWindow = () => {
  const win = new BrowserWindow();
  win.webContents.openDevTools();
  win.maximize();
  win.loadFile(path.join(__dirname, './public/index.html'));
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  })
})

app.on('window-all-closed', () => {
  app.quit();
})
