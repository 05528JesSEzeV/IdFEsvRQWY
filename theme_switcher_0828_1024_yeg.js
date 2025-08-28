// 代码生成时间: 2025-08-28 10:24:41
const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');
const path = require('path');

// Define themes
const themes = {
  light: '#ffffff',
  dark: '#000000'
};

// Listen for theme change requests from renderer process
ipcMain.on('switch-theme', (event, theme) => {
  if (!themes.hasOwnProperty(theme)) {
    console.error(`Theme '${theme}' is not supported.`);
    event.reply('switch-theme-response', { success: false, error: 'Theme not supported' });
    return;
  }

  // Set the new theme and broadcast to all windows
  setTheme(theme);
  event.reply('switch-theme-response', { success: true });
});

// Set the theme for all windows
function setTheme(theme) {
  const color = themes[theme];
  app.emit('set-theme', color);
}

// Main function to create windows and initialize theme
function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load the index.html of the app
  win.loadFile('index.html');

  // Open the DevTools if in development
  if (app.isInDevelopment()) win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow).then(() => {
  // Set initial theme
  setTheme(app.isInDevelopment() ? 'light' : 'dark');
});

// Preload script to handle theme setting in renderer
const preloadScript = `
  // Preload script for theme management
  const { contextBridge, ipcRenderer } = require('electron');

  contextBridge.exposeInMainWorld('electronAPI', {
    switchTheme: (theme) => {
      ipcRenderer.send('switch-theme', theme);
    }
  });
`;

// Write the preload script to a file
fs.writeFileSync(path.join(__dirname, 'preload.js'), preloadScript);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
