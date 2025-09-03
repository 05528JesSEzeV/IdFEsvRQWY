// 代码生成时间: 2025-09-04 01:49:25
 * Usage:
 * - Open your terminal/command prompt.
 * - Navigate to the directory containing this script.
 * - Run `electron .` to start the application.
 */

const { app, BrowserWindow } = require('electron');
const isUrl = require('is-url');
const fs = require('fs');
const path = require('path');

// Function to check if a URL is valid
function isValidUrl(url) {
  return isUrl(url);
}

// Create window function
function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    }
  });

  // and load the index.html of the app.
  win.loadFile('index.html');

  // Open the DevTools.
  win.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow)
  .catch(err => {
    console.error('Failed to create window:', err);
  });

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});