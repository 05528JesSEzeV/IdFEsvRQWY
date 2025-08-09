// 代码生成时间: 2025-08-10 00:17:57
// interactive_chart_generator.js
// This is an Electron application that serves as an interactive chart generator.

// Import necessary modules
const { app, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

// Function to create a new BrowserWindow instance
function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  // Load the chart generator HTML file
  mainWindow.loadURL(isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, 'dist/index.html')}`);

  // Open the DevTools if in development mode
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
}

// Handle creating and quitting of the application
app.whenReady().then(createWindow)
  .catch(console.error);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Preload script that will be run before the rest of the application
const preload = `// preload.js
// This script is responsible for setting up the communication between the main and renderer processes.
window.addEventListener('DOMContentLoaded', () => {
  // Setup IPC communication here if required
});
`;

// Export the preload script as a string
module.exports = preload;