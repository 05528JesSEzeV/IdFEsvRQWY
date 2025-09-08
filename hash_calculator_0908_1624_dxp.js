// 代码生成时间: 2025-09-08 16:24:52
// Import required modules
const { app, BrowserWindow } = require('electron');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

// Function to create hash
function calculateHash(file) {
  return new Promise((resolve, reject) => {
    // Create a readable stream of the file
    const readStream = fs.createReadStream(file);

    // Create a hash of the file
    const hash = crypto.createHash('sha256');

    // Pipe the file stream to the hash algorithm
    readStream.pipe(hash)
      .on('error', (err) => {
        // Handle any errors that occur during hashing
        reject(err);
      })
      .on('finish', () => {
        // Resolve with the final hash when the hashing is complete
        resolve(hash.digest('hex'));
      });
  });
}

// Function to create and show the main window
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
    },
  });

  // Load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(createWindow)
  .catch(console.error);

// All other lifecycle events you need can be added here

// Handle creating/removing shortcuts on Windows when app is installed.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Event when app is quitting
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Event when app is activated (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Include additional functionality in your 'preload.js' file to handle
// IPC communication between the main process and the renderer process.
// For example:

/*
preload.js
---
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld(
  'api',
  {
    calculateHash: (file) => ipcRenderer.invoke('calculate-hash', file),
  }
);
*/

// And in your renderer process (e.g., index.js), you would handle the IPC events:
/*
index.js
---
const { ipcRenderer } = require('electron');

document.getElementById('calculate-btn').addEventListener('click', () => {
  const filePath = document.getElementById('file-input').files[0].path;
  ipcRenderer.send('calculate-hash', filePath);
});

ipcRenderer.on('calculate-hash-reply', (event, hash) => {
  document.getElementById('hash-result').textContent = hash;
});
*/
